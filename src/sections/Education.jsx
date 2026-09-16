import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollArrowText from "../../components/ScrollArrowText";
import EducationItem from "./EducationItem";
import "./Education.css";

gsap.registerPlugin(ScrollTrigger);

const educationData = [
	{
		date: "2021–2022",
		title: "Secondary Education (SSC)",
		school: "Nutan English School",
		description: "Built a strong foundation in science and mathematics.",
	},
	{
		date: "2023–2024",
		title: "Higher Secondary Education (HSC)",
		school: "Central Public Jr. College",
		description:
			"Developed an early interest in programming and technology.",
	},
	{
		date: "2024–2028",
		current: true,
		title: "B.Tech in AI & Data Science",
		school: "KJ Somaiya Institute of Technology",
		description:
			"Specializing in artificial intelligence, machine learning, and data-driven engineering.",
	},
];

export default function Education() {
	const sectionRef = useRef(null);
	const timelineRef = useRef(null);
	const lineRef = useRef(null);

	useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			const line = lineRef.current;
			const timeline = timelineRef.current;

			if (!line || !timeline) return;

			// getTotalLength is more reliable than pathLength normalization
			const length = line.getTotalLength();

			gsap.set(line, {
				strokeDasharray: length,
				strokeDashoffset: length,
			});

			gsap.to(line, {
				strokeDashoffset: 0,
				ease: "none",
				scrollTrigger: {
					trigger: timeline,
					start: "top 75%",
					end: "bottom 65%",
					scrub: true,
					// markers: true,
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section ref={sectionRef} className="education-section">
			<div className="education-gradient" />
			<div className="education-stars" />

			<div className="education-heading-wrap">
				<ScrollArrowText
					text="EDUCATION"
					staggerAmount={0.06}
					duration={1.1}
					triggerStart="top 85%"
					triggerEnd="bottom 55%"
				/>
			</div>

			<div ref={timelineRef} className="timeline">
				<svg
					className="timeline-line-svg"
					viewBox="0 0 4 1000"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<defs>
						<linearGradient
							id="educationLineGradient"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop offset="0%" stopColor="#ffffff" />
							<stop offset="25%" stopColor="#a78bfa" />
							<stop offset="60%" stopColor="#60a5fa" />
							<stop offset="100%" stopColor="#22d3ee" />
						</linearGradient>

						<filter
							id="educationLineGlow"
							x="-300%"
							y="-20%"
							width="600%"
							height="140%"
						>
							<feGaussianBlur stdDeviation="3" result="blur" />
							<feMerge>
								<feMergeNode in="blur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>

					<path className="timeline-line-track" d="M 2 0 L 2 1000" />

					{/* NO pathLength="1" anymore */}
					<path
						ref={lineRef}
						className="timeline-line-path"
						d="M 2 0 L 2 1000"
					/>
				</svg>

				{educationData.map((item, index) => (
					<EducationItem Skey={index} data={item} index={index} />
				))}
			</div>
		</section>
	);
}
