import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ScrollArrowText from "../../components/ScrollArrowText";
import EducationItem from "./EducationItem";
import "./Education.css";

gsap.registerPlugin(ScrollTrigger);

const educationData = [
	{
		date: "2022–2023",
		title: "Secondary Education (SSC)",
		school: "Nutan English School",
		description: "Built a strong foundation in science and mathematics.",
	},
	{
		date: "2023–2025",
		title: "Higher Secondary Education (HSC)",
		school: "Central Public Jr. College",
		description:
			"Developed an early interest in programming and technology.",
	},
	{
		date: "2025–2028",
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

			/*
			 * Simple scaleY animation.
			 *
			 * We use this instead of DrawSVG because
			 * the timeline is just a straight vertical line.
			 */
			gsap.set(line, {
				scaleY: 0,
				transformOrigin: "top center",
			});

			gsap.to(line, {
				scaleY: 1,
				ease: "none",

				scrollTrigger: {
					trigger: timeline,
					start: "top 75%",
					end: "bottom 70%",
					scrub: 1,
				},
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section id="education" ref={sectionRef} className="education-section">
			{/* Background transition */}
			<div className="education-gradient" />

			{/* Heading */}
			<div className="education-heading-wrap">
				<ScrollArrowText
					text="EDUCATION"
					staggerAmount={0.06}
					duration={1.1}
					triggerStart="top 85%"
					triggerEnd="bottom 55%"
				/>
			</div>

			{/* Timeline */}
			<div ref={timelineRef} className="timeline">
				{/* Timeline line */}
				<div className="timeline-line">
					{/* Permanent subtle track */}
					<div className="timeline-line-track" />

					{/* Animated gradient line */}
					<div ref={lineRef} className="timeline-line-progress" />
				</div>

				{/* Education cards */}
				{educationData.map((item, index) => (
					<EducationItem key={index} data={item} index={index} />
				))}
			</div>
		</section>
	);
}
