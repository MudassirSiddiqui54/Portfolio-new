import { useRef, useEffect } from "react";
import gsap from "gsap";
import "./FooterWordmark.css";

export default function FooterWordmark({
	word = "MUDASSIR",

	fontFamily = "'Zentry', 'Inter', system-ui, sans-serif",
	fontWeight = 900,
	fontSize = "clamp(4rem, 16vw, 18rem)",
	letterSpacing = "-0.04em",
	lineHeight = 0.85,

	color = "#ffffff",
	strokeColor = "#555555",
	strokeWidth = "1.5px",
	glowColor = "rgb(187, 170, 245)",

	glowSize = 200,
	glowIntensity = 1,
	lagDuration = 0.8,

	margin = "0",
	padding = "0",
	width = "100%",
	horizontalScale = 1.15,

	className = "",
	textClassName = "",
}) {
	const textRef = useRef(null);
	const xToRef = useRef(null);
	const yToRef = useRef(null);

	useEffect(() => {
		if (!textRef.current) return;

		xToRef.current = gsap.quickTo(textRef.current, "--mouse-x", {
			duration: lagDuration,
			ease: "power2.out",
		});

		yToRef.current = gsap.quickTo(textRef.current, "--mouse-y", {
			duration: lagDuration,
			ease: "power2.out",
		});

		gsap.set(textRef.current, {
			"--mouse-x": "-999px",
			"--mouse-y": "-999px",
		});

		return () => {
			xToRef.current = null;
			yToRef.current = null;
		};
	}, [lagDuration]);

	const handleMouseMove = (e) => {
		if (!textRef.current || !xToRef.current || !yToRef.current) return;

		const rect = textRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		xToRef.current(x);
		yToRef.current(y);
	};

	const handleMouseLeave = () => {
		if (!xToRef.current || !yToRef.current) return;
		xToRef.current(-999);
		yToRef.current(-999);
	};

	return (
		<div
			className={`footer-wordmark-container ${className}`}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{
				"--wordmark-width": width,
				"--wordmark-margin": margin,
				"--wordmark-padding": padding,
				"--wordmark-color": color,
				"--wordmark-stroke": strokeColor,
				"--wordmark-stroke-width": strokeWidth,
				"--wordmark-glow": glowColor,
				"--wordmark-glow-size": `${glowSize}px`,
				"--wordmark-glow-opacity": glowIntensity,
				"--wordmark-scale-x": horizontalScale,
			}}
		>
			<h1
				ref={textRef}
				className={`footer-wordmark-text special-font ${textClassName}`}
				data-text={word}
				style={{
					"--wordmark-font": fontFamily,
					"--wordmark-weight": fontWeight,
					"--wordmark-size": fontSize,
					"--wordmark-spacing": letterSpacing,
					"--wordmark-line-height": lineHeight,
					fontFeatureSettings: '"ss01" on',
				}}
			>
				{word}
			</h1>
		</div>
	);
}
