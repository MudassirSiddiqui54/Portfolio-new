import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EducationItem({ data, index }) {
	const itemRef = useRef(null);
	const cardRef = useRef(null);
	const nodeRef = useRef(null);

	const side = index % 2 === 0 ? "left" : "right";

	useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			const card = cardRef.current;
			const node = nodeRef.current;

			if (!card || !node) return;

			const fromX = side === "left" ? -80 : 80;

			/* Card entrance */
			gsap.fromTo(
				card,
				{
					opacity: 0,
					x: fromX,
					y: 30,
					filter: "blur(8px)",
				},
				{
					opacity: 1,
					x: 0,
					y: 0,
					filter: "blur(0px)",
					duration: 1,
					ease: "power3.out",
					scrollTrigger: {
						trigger: itemRef.current,
						start: "top 82%",
						toggleActions: "play none none reverse",
					},
				},
			);

			/* Node entrance */
			gsap.fromTo(
				node,
				{
					opacity: 0,
					scale: 0,
				},
				{
					opacity: 1,
					scale: 1,
					duration: 0.7,
					ease: "back.out(2)",
					scrollTrigger: {
						trigger: itemRef.current,
						start: "top 82%",
						toggleActions: "play none none reverse",
					},
				},
			);

			/* Small pulse on the node */
			gsap.to(node, {
				boxShadow:
					"0 0 8px rgba(255,255,255,.7), 0 0 24px rgba(96,165,250,.6)",
				duration: 1.5,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});
		}, itemRef);

		return () => ctx.revert();
	}, [side]);

	return (
		<div ref={itemRef} className={`timeline-item ${side}`}>
			{/* Node */}
			<div ref={nodeRef} className="timeline-node">
				<div className="timeline-node-dot" />
			</div>

			{/* Glass card */}
			<div ref={cardRef} className="edu-card">
				{/* Glass reflection */}
				<div className="edu-card-shine" />

				<div className="edu-card-content">
					<div className="edu-date-row">
						<span className="edu-date">{data.date}</span>

						{data.current && (
							<span className="edu-current-pill">
								<span className="current-dot" />
								Current
							</span>
						)}
					</div>

					<h3 className="edu-title">{data.title}</h3>

					<p className="edu-school">{data.school}</p>

					<p className="edu-desc">{data.description}</p>
				</div>
			</div>
		</div>
	);
}
