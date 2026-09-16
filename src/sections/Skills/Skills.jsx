import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParticleCard, GlobalSpotlight } from "../../components/ui/MagicBento";
import ScrollArrowText from "../../components/ScrollArrowText";
import {
	FaReact,
	FaHtml5,
	FaCss3Alt,
	FaNodeJs,
	FaGitAlt,
	FaGithub,
	FaJava,
} from "react-icons/fa";
import {
	SiTailwindcss,
	SiExpress,
	SiDjango,
	SiNumpy,
	SiPandas,
	SiJavascript,
	SiPython,
	SiMysql,
	SiMongodb,
	SiSqlite,
	SiC,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import "./Skills.css";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
	{ label: "Frontend", items: ["React", "HTML5", "CSS3", "Tailwind"] },
	{ label: "Backend", items: ["Node.js", "Express", "Django"] },
	{ label: "AI / ML", items: ["NumPy", "Pandas"] },
	{ label: "Languages", items: ["JavaScript", "Python", "Java", "C"] },
	{ label: "Database", items: ["MySQL", "MongoDB", "SQLite"] },
	{ label: "Tools", items: ["Git", "GitHub", "VS Code"] },
];

const ALL_ICONS = [
	<FaReact />,
	<FaHtml5 />,
	<FaCss3Alt />,
	<SiTailwindcss />,
	<FaNodeJs />,
	<SiExpress />,
	<SiDjango />,
	<SiNumpy />,
	<SiPandas />,
	<SiJavascript />,
	<SiPython />,
	<FaJava />,
	<SiC />,
	<SiMysql />,
	<SiMongodb />,
	<SiSqlite />,
	<FaGitAlt />,
	<FaGithub />,
	<VscVscode />,
];

const Divider = () => (
	<span className="text-cyan-400 mx-3 text-lg select-none">⚛</span>
);

const MarqueeRow = ({ reverse = false }) => (
	<div className="flex overflow-hidden whitespace-nowrap w-full">
		<div
			style={{
				display: "flex",
				alignItems: "center",
				animation: `${reverse ? "marqueeReverse" : "marquee"} 30s linear infinite`,
				willChange: "transform",
			}}
		>
			{[...ALL_ICONS, ...ALL_ICONS, ...ALL_ICONS].map((item, i) => (
				<span
					key={i}
					className="inline-flex items-center text-4xl text-white/30 grayscale mx-2"
				>
					{item}
					<Divider />
				</span>
			))}
		</div>
	</div>
);

export default function Skills() {
	const sectionRef = useRef(null);
	const gridRef = useRef(null);
	const topMarqueeRef = useRef(null);
	const bottomMarqueeRef = useRef(null);

	useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			// Top marquee entrance — slides from left, settles into 20deg tilt
			gsap.fromTo(
				topMarqueeRef.current,
				{ xPercent: -25, opacity: 0, rotation: 30 },
				{
					xPercent: 0,
					opacity: 1,
					rotation: 20,
					duration: 1.2,
					ease: "power3.out",
					scrollTrigger: {
						trigger: topMarqueeRef.current,
						start: "top 92%",
						toggleActions: "play none none reverse",
					},
				},
			);

			// Bottom marquee entrance
			gsap.fromTo(
				bottomMarqueeRef.current,
				{ xPercent: 25, opacity: 0, rotation: -30 },
				{
					xPercent: 0,
					opacity: 1,
					rotation: -20,
					duration: 1.2,
					ease: "power3.out",
					scrollTrigger: {
						trigger: bottomMarqueeRef.current,
						start: "top 95%",
						toggleActions: "play none none reverse",
					},
				},
			);

			// Cards stagger entrance
			const cards = gridRef.current?.querySelectorAll(".card");
			if (cards?.length) {
				gsap.fromTo(
					cards,
					{ y: 60, opacity: 0, scale: 0.95 },
					{
						y: 0,
						opacity: 1,
						scale: 1,
						duration: 0.9,
						ease: "power3.out",
						stagger: 0.08,
						scrollTrigger: {
							trigger: gridRef.current,
							start: "top 88%",
							toggleActions: "play none none reverse",
						},
					},
				);
			}
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<section
			id="skills"
			ref={sectionRef}
			className="relative w-full py-20 overflow-hidden]"
		>
			{/* Global spotlight */}
			<GlobalSpotlight
				gridRef={gridRef}
				glowColor="187, 170, 245"
				spotlightRadius={300}
			/>

			<div className="relative z-20 flex flex-col gap-10">
				{/* Heading */}
				<div className="flex justify-center pt-4">
					<ScrollArrowText
						text="SKILLS"
						staggerAmount={0.08}
						duration={1.1}
						color="#ffffff"
						triggerStart="top 90%"
						triggerEnd="bottom 60%"
					/>
				</div>

				{/* Top marquee */}
				<div
					ref={topMarqueeRef}
					className="relative z-10"
					style={{
						transformOrigin: "left",
					}}
				>
					<MarqueeRow />
				</div>

				{/* Cards grid */}
				<div
					ref={gridRef}
					className="bento-section grid gap-4 px-6 max-w-5xl mx-auto w-full relative z-20"
					style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
				>
					{SKILLS.map((skill, i) => {
						const spans = [
							"col-span-6 sm:col-span-3 lg:col-span-2",
							"col-span-6 sm:col-span-3 lg:col-span-2",
							"col-span-6 sm:col-span-6 lg:col-span-2",
							"col-span-6 sm:col-span-3 lg:col-span-3",
							"col-span-6 sm:col-span-3 lg:col-span-2",
							"col-span-6 sm:col-span-6 lg:col-span-1",
						];

						return (
							<ParticleCard
								key={i}
								className={`card card--border-glow p-6 rounded-2xl border border-white/10 bg-[#060010]/80 backdrop-blur-sm ${spans[i]}`}
								style={{
									"--glow-x": "50%",
									"--glow-y": "50%",
									"--glow-intensity": "0",
									"--glow-radius": "200px",
									minHeight: "160px",
								}}
								glowColor="0, 245, 255"
								enableTilt={true}
								enableMagnetism={true}
								clickEffect={true}
								particleCount={8}
							>
								<p className="text-cyan-400 text-xs tracking-[0.2em] uppercase font-mono mb-4">
									{skill.label}
								</p>

								<div className="flex flex-wrap gap-2">
									{skill.items.map((item, j) => (
										<span
											key={j}
											className="px-3 py-1 rounded-full text-sm text-white/70 border border-white/10 font-mono hover:border-cyan-400/40 hover:text-cyan-400 transition-colors duration-200"
										>
											{item}
										</span>
									))}
								</div>
							</ParticleCard>
						);
					})}
				</div>

				{/* Bottom marquee */}
				<div
					ref={bottomMarqueeRef}
					className="relative z-10"
					style={{
						transformOrigin: "left",
					}}
				>
					<MarqueeRow reverse />
				</div>
			</div>
		</section>
	);
}
