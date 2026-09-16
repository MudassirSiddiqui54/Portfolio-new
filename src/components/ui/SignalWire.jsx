import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function SignalWire({
	lineCount = 3,
	color = "#6b5cff",
	secondaryColor = "#00f5ff",
	orientation = "vertical",
}) {
	const containerRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const pulses = containerRef.current.querySelectorAll(".wire-pulse");

			pulses.forEach((pulse, i) => {
				gsap.fromTo(
					pulse,
					{ yPercent: -120, opacity: 0 },
					{
						yPercent: 420,
						opacity: 1,
						duration: 3.6 + i * 0.6,
						ease: "none",
						repeat: -1,
						delay: i * 0.9,
						onRepeat: () => {
							gsap.set(pulse, { opacity: 0 });
						},
					},
				);
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	const isHorizontal = orientation === "horizontal";
	const offsetStep = 10;

	return (
		<div
			ref={containerRef}
			className={`signal-wire ${
				isHorizontal ? "signal-wire--h" : "signal-wire--v"
			}`}
			aria-hidden="true"
		>
			{Array.from({ length: lineCount }).map((_, i) => {
				const offset = (i - (lineCount - 1) / 2) * offsetStep;
				const c = i % 2 === 0 ? color : secondaryColor;
				return (
					<div
						key={`line-${i}`}
						className="wire-line"
						style={{
							"--wire-offset": `${offset}px`,
							"--wire-color": c,
							"--wire-opacity": 0.12 + (i % 2) * 0.08,
						}}
					/>
				);
			})}

			{Array.from({ length: lineCount }).map((_, i) => {
				const offset = (i - (lineCount - 1) / 2) * offsetStep;
				const c = i % 2 === 0 ? color : secondaryColor;
				return (
					<div
						key={`pulse-${i}`}
						className="wire-pulse"
						style={{
							"--wire-offset": `${offset}px`,
							"--wire-color": c,
						}}
					/>
				);
			})}
		</div>
	);
}
