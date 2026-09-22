import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";

export default function HeroBackgroundM({
	opacity = 0.6,
	color = "#6fa8ff",
	trackColor = "#59616d",
	triggerRef,
	className = "",
	glowStrokeWidth = 5,
}) {
	const containerRef = useRef(null);
	const glowPathsRef = useRef([]);
	const tweensRef = useRef([]);
	const filterId = useRef(
		`blueGlow-${Math.random().toString(36).slice(2, 9)}`,
	).current;

	const paths = [
		"M 430 410 L 270 200",
		"M 270 200 L 200 200",
		"M 200 200 L 100 600",
		"M 100 600 L 170 600",
		"M 170 600 L 250 280",
		"M 250 280 L 390 450",
		"M 390 450 L 430 410",

		"M 580 550 L 650 550",
		"M 650 550 L 720 150",
		"M 720 150 L 650 150",
		"M 650 150 L 416 350",
		"M 416 350 L 450 390",
		"M 450 390 L 640 240",
		"M 640 240 L 580 550",
	];

	// Drawing animation (unchanged)
	useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			const elements = glowPathsRef.current.filter(Boolean);

			tweensRef.current = elements.map((el, index) => {
				const length = el.getTotalLength();

				gsap.set(el, {
					strokeDasharray: length,
					strokeDashoffset: length,
				});

				return gsap.to(el, {
					strokeDashoffset: 0,
					duration: 2,
					delay: index * 0.1,
					ease: "power2.inOut",
					repeat: -1,
					repeatDelay: 1.5,
					yoyo: true,
					paused: Boolean(triggerRef),
				});
			});
		}, containerRef);

		return () => {
			tweensRef.current.forEach((tween) => tween.kill());
			tweensRef.current = [];
			ctx.revert();
		};
	}, [triggerRef]);

	// Visibility tied to triggerRef (only when provided)
	useEffect(() => {
		if (!triggerRef?.current || !containerRef.current) return;

		const container = containerRef.current;

		gsap.set(container, {
			opacity: 0,
		});

		const observer = new IntersectionObserver(
			([entry]) => {
				const visible = entry.isIntersecting;

				gsap.to(container, {
					opacity: visible ? opacity : 0,
					duration: 0.5,
					ease: "power2.out",
				});

				// THIS is the important part.
				tweensRef.current.forEach((tween) => {
					if (visible) {
						tween.resume();
					} else {
						tween.pause();
					}
				});
			},
			{
				threshold: 0,
			},
		);

		observer.observe(triggerRef.current);

		return () => observer.disconnect();
	}, [triggerRef, opacity]);

	return (
		<div
			ref={containerRef}
			className={`fixed inset-0 flex justify-center items-center z-0 pointer-events-none ${className}`}
			style={{ opacity: triggerRef ? 0 : opacity }}
		>
			<svg
				viewBox="0 0 1000 800"
				className="w-full h-full max-w-[1100px] max-h-[1100px]"
				preserveAspectRatio="xMidYMid meet"
			>
				<g transform="translate(500 375) scale(1.5) translate(-410 -375)">
					{/* ONE blurred group instead of 14 independently filtered paths */}
					<g filter={`url(#${filterId})`} opacity="0.18">
						{paths.map((d, index) => (
							<path
								key={`glow-${index}`}
								d={d}
								fill="none"
								stroke={color}
								strokeWidth={glowStrokeWidth}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						))}
					</g>

					{/* Thin animated lines */}
					{paths.map((d, index) => (
						<g key={`line-${index}`}>
							<path
								d={d}
								fill="none"
								stroke={trackColor}
								strokeWidth="0.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								opacity="0.45"
							/>

							<path
								ref={(el) => {
									glowPathsRef.current[index] = el;
								}}
								d={d}
								fill="none"
								stroke={color}
								strokeWidth="1"
								strokeLinecap="round"
								strokeLinejoin="round"
								opacity="0.9"
							/>
						</g>
					))}
				</g>

				<defs>
					<filter
						id={filterId}
						x="-50%"
						y="-50%"
						width="200%"
						height="200%"
					>
						<feGaussianBlur stdDeviation="5" />
					</filter>
				</defs>
			</svg>
		</div>
	);
}
