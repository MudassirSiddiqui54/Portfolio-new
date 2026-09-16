import { useEffect, useRef } from "react";
import LiquidBackground from "threejs-components/build/backgrounds/liquid1.min.js";

export default function LiquidEffect({
	src,
	className = "",
	metalness = 0.75,
	roughness = 0.25,
	displacementScale = 5,
	rain = false,
	style,
}) {
	const canvasRef = useRef(null);
	const appRef = useRef(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;

		// Create the liquid WebGL scene
		const app = LiquidBackground(canvas);

		appRef.current = app;

		// Material settings
		app.liquidPlane.material.metalness = metalness;
		app.liquidPlane.material.roughness = roughness;

		// Amount of liquid distortion
		app.liquidPlane.uniforms.displacementScale.value = displacementScale;

		// Optional automatic ripple/rain effect
		app.setRain(rain);

		// Load image
		if (src) {
			app.loadImage(src);
		}

		return () => {
			if (appRef.current?.dispose) {
				appRef.current.dispose();
			}

			appRef.current = null;
		};
	}, [src, metalness, roughness, displacementScale, rain]);

	return (
		<div
			className={`liquid-effect ${className}`}
			style={{
				position: "relative",
				width: "100%",
				height: "100%",
				overflow: "hidden",
				...style,
			}}
		>
			<canvas
				ref={canvasRef}
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					display: "block",
					touchAction: "none",
				}}
			/>
		</div>
	);
}
