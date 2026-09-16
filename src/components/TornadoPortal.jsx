import { useEffect, useRef, useState } from "react";
import * as THREE from "three/webgpu";
import {
	luminance,
	cos,
	min,
	time,
	atan,
	uniform,
	pass,
	PI,
	TWO_PI,
	color,
	positionLocal,
	sin,
	texture,
	Fn,
	uv,
	vec2,
	vec3,
	vec4,
} from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import "./TornadoPortal.css";

export default function TornadoPortal({ zoomRef }) {
	const containerRef = useRef(null);
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		let isMounted = true;
		let renderer, renderPipeline, scene, camera;

		const init = async () => {
			try {
				// 1. Check for WebGPU support
				if (!navigator.gpu) {
					throw new Error(
						"WebGPU is not supported in this browser. Please use Chrome, Edge, or Safari 18+.",
					);
				}

				const container = containerRef.current;
				if (!container) return;

				// 2. Setup Camera
				camera = new THREE.PerspectiveCamera(
					35,
					container.clientWidth / container.clientHeight,
					0.1,
					50,
				);
				camera.position.set(0, 2.5, 0);
				camera.lookAt(0, 0.5, 0);

				scene = new THREE.Scene();

				// 3. Load Texture (with timeout protection)
				const textureLoader = new THREE.TextureLoader();
				const perlinTexture = await textureLoader.loadAsync(
					"https://threejs.org/examples/textures/noises/perlin/rgb-256x256.png",
				);

				// If React Strict Mode unmounted the component while the texture was loading, abort.
				if (!isMounted) return;

				perlinTexture.wrapS = THREE.RepeatWrapping;
				perlinTexture.wrapT = THREE.RepeatWrapping;

				// --- TSL FUNCTIONS (Verbatim from original) ---
				const toRadialUv = Fn(([uv, multiplier, rotation, offset]) => {
					const centeredUv = uv.sub(0.5).toVar();
					const distanceToCenter = centeredUv.length();
					const angle = atan(centeredUv.y, centeredUv.x);
					const radialUv = vec2(
						angle.add(PI).div(TWO_PI),
						distanceToCenter,
					).toVar();
					radialUv.mulAssign(multiplier);
					radialUv.x.addAssign(rotation);
					radialUv.y.addAssign(offset);
					return radialUv;
				});

				const toSkewedUv = Fn(([uv, skew]) => {
					return vec2(
						uv.x.add(uv.y.mul(skew.x)),
						uv.y.add(uv.x.mul(skew.y)),
					);
				});

				const twistedCylinder = Fn(
					([
						position,
						parabolStrength,
						parabolOffset,
						parabolAmplitude,
						time,
					]) => {
						const angle = atan(position.z, position.x).toVar();
						const elevation = position.y;
						const radius = parabolStrength
							.mul(position.y.sub(parabolOffset))
							.pow(2)
							.add(parabolAmplitude)
							.toVar();
						radius.addAssign(
							sin(
								elevation.sub(time).mul(20).add(angle.mul(2)),
							).mul(0.05),
						);
						return vec3(
							cos(angle).mul(radius),
							elevation,
							sin(angle).mul(radius),
						);
					},
				);

				// --- UNIFORMS ---
				const emissiveColor = uniform(color("#4400ff"));
				const timeScale = uniform(0.2);
				const parabolStrength = uniform(0.75);
				const parabolOffset = uniform(0.4);
				const parabolAmplitude = uniform(0.2);

				const cylinderGeometry = new THREE.CylinderGeometry(
					1,
					1,
					1,
					20,
					20,
					true,
				);
				cylinderGeometry.translate(0, 0.5, 0);

				// --- EMISSIVE CYLINDER ---
				const emissiveMaterial = new THREE.MeshBasicNodeMaterial({
					transparent: true,
					side: THREE.DoubleSide,
					wireframe: false,
				});
				emissiveMaterial.positionNode = twistedCylinder(
					positionLocal,
					parabolStrength,
					parabolOffset,
					parabolAmplitude.sub(0.05),
					time.mul(timeScale),
				);
				emissiveMaterial.outputNode = Fn(() => {
					const scaledTime = time.mul(timeScale);
					const noise1Uv = uv()
						.add(vec2(scaledTime, scaledTime.negate()))
						.toVar();
					noise1Uv.assign(toSkewedUv(noise1Uv, vec2(-1, 0)));
					noise1Uv.mulAssign(vec2(2, 0.25));
					const noise1 = texture(perlinTexture, noise1Uv, 1).r.remap(
						0.45,
						0.7,
					);

					const noise2Uv = uv()
						.add(vec2(scaledTime.mul(0.5), scaledTime.negate()))
						.toVar();
					noise2Uv.assign(toSkewedUv(noise2Uv, vec2(-1, 0)));
					noise2Uv.mulAssign(vec2(5, 1));
					const noise2 = texture(perlinTexture, noise2Uv, 1).g.remap(
						0.45,
						0.7,
					);

					const outerFade = min(
						uv().y.smoothstep(0, 0.1),
						uv().y.oneMinus().smoothstep(0, 0.4),
					);
					const effect = noise1.mul(noise2).mul(outerFade);
					const emissiveColorLuminance = luminance(emissiveColor);

					return vec4(
						emissiveColor.mul(1.2).div(emissiveColorLuminance),
						effect.smoothstep(0, 0.1),
					);
				})();

				const emissive = new THREE.Mesh(
					cylinderGeometry,
					emissiveMaterial,
				);
				scene.add(emissive);

				// --- DARK CYLINDER ---
				const darkMaterial = new THREE.MeshBasicNodeMaterial({
					transparent: true,
					side: THREE.DoubleSide,
					wireframe: false,
				});
				darkMaterial.positionNode = twistedCylinder(
					positionLocal,
					parabolStrength,
					parabolOffset,
					parabolAmplitude,
					time.mul(timeScale),
				);
				darkMaterial.outputNode = Fn(() => {
					const scaledTime = time.mul(timeScale).add(123.4);
					const noise1Uv = uv()
						.add(vec2(scaledTime, scaledTime.negate()))
						.toVar();
					noise1Uv.assign(toSkewedUv(noise1Uv, vec2(-1, 0)));
					noise1Uv.mulAssign(vec2(2, 0.25));
					const noise1 = texture(perlinTexture, noise1Uv, 1).g.remap(
						0.45,
						0.7,
					);

					const noise2Uv = uv()
						.add(vec2(scaledTime.mul(0.5), scaledTime.negate()))
						.toVar();
					noise2Uv.assign(toSkewedUv(noise2Uv, vec2(-1, 0)));
					noise2Uv.mulAssign(vec2(5, 1));
					const noise2 = texture(perlinTexture, noise2Uv, 1).b.remap(
						0.45,
						0.7,
					);

					const outerFade = min(
						uv().y.smoothstep(0, 0.2),
						uv().y.oneMinus().smoothstep(0, 0.4),
					);
					const effect = noise1.mul(noise2).mul(outerFade);

					return vec4(vec3(0), effect.smoothstep(0, 0.01));
				})();

				const dark = new THREE.Mesh(cylinderGeometry, darkMaterial);
				scene.add(dark);

				// --- RENDERER ---
				renderer = new THREE.WebGPURenderer({ antialias: true });
				renderer.setClearColor(0x000000, 0);
				renderer.setPixelRatio(window.devicePixelRatio);
				renderer.setSize(container.clientWidth, container.clientHeight);
				renderer.toneMapping = THREE.ACESFilmicToneMapping;

				if (!isMounted) return; // Prevent appending if unmounted during setup
				container.appendChild(renderer.domElement);

				// CRITICAL: Await the WebGPU backend initialization
				await renderer.init();

				// If React Strict Mode unmounted the component during init(), abort.
				if (!isMounted) {
					renderer.dispose();
					if (container.contains(renderer.domElement)) {
						container.removeChild(renderer.domElement);
					}
					return;
				}

				// --- POST PROCESSING ---
				renderPipeline = new THREE.RenderPipeline(renderer);
				const scenePass = pass(scene, camera);
				const scenePassColor = scenePass.getTextureNode("output");
				const bloomPass = bloom(scenePassColor, 0.1, 0.2, 0.7);
				renderPipeline.outputNode = scenePassColor.add(bloomPass);

				// --- ANIMATION LOOP ---
				const animate = async () => {
					if (!isMounted) return;

					if (zoomRef && zoomRef.current !== undefined) {
						const progress = zoomRef.current;
						camera.position.y = THREE.MathUtils.lerp(
							2.5,
							0.1,
							progress,
						);
						camera.fov = THREE.MathUtils.lerp(35, 75, progress);
						camera.updateProjectionMatrix();
						camera.lookAt(
							0,
							THREE.MathUtils.lerp(0.5, 0, progress),
							0,
						);
					}

					await renderPipeline.render();
				};

				renderer.setAnimationLoop(animate);

				// Trigger the fade-in ONLY after everything is fully initialized and rendering
				setIsReady(true);
			} catch (err) {
				console.error("TornadoPortal Init Error:", err);
				if (isMounted) setError(err.message);
			}
		};

		init();

		// --- CLEANUP (Handles React Strict Mode double-mounting) ---
		return () => {
			isMounted = false;
			if (renderer) {
				renderer.setAnimationLoop(null);
				renderer.dispose();
				if (renderer.domElement && renderer.domElement.parentNode) {
					renderer.domElement.parentNode.removeChild(
						renderer.domElement,
					);
				}
			}
			if (scene) scene.clear();
		};
	}, [zoomRef]);

	return (
		<div
			ref={containerRef}
			className={`tornado-canvas-container ${isReady ? "ready" : ""}`}
		>
			{error && <div className="tornado-error">{error}</div>}
		</div>
	);
}
