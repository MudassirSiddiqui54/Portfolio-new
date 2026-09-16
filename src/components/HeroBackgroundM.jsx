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

			elements.forEach((el, index) => {
				const length = el.getTotalLength();

				gsap.set(el, {
					strokeDasharray: length,
					strokeDashoffset: length,
				});

				gsap.to(el, {
					strokeDashoffset: 0,
					duration: 2,
					delay: index * 0.1,
					ease: "power2.inOut",
					repeat: -1,
					repeatDelay: 1.5,
					yoyo: true,
				});
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	// Visibility tied to triggerRef (only when provided)
	useEffect(() => {
		if (!triggerRef?.current || !containerRef.current) return;

		// Start hidden
		gsap.set(containerRef.current, { opacity: 0 });

		const observer = new IntersectionObserver(
			([entry]) => {
				gsap.to(containerRef.current, {
					opacity: entry.isIntersecting ? opacity : 0,
					duration: 0.8,
					ease: "power2.out",
				});
			},
			{ threshold: 0, rootMargin: "0px 0px -10% 0px" },
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
					{paths.map((d, index) => (
						<g key={index}>
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
								d={d}
								fill="none"
								stroke={color}
								strokeWidth={glowStrokeWidth}
								strokeLinecap="round"
								strokeLinejoin="round"
								opacity="0.18"
								filter={`url(#${filterId})`}
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
						x="-100%"
						y="-100%"
						width="300%"
						height="300%"
					>
						<feGaussianBlur stdDeviation="7" />
					</filter>
				</defs>
			</svg>
		</div>
	);
}
