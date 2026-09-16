import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import SpotlightCard from "../../components/ui/SpotlightCard";
import ScrollArrowText from "../../components/ScrollArrowText";
import "./Projects.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({
	ignoreMobileResize: true,
	autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
});

const PROJECTS = [
	{
		number: "01",
		title: "Animated Frontend Website",
		description:
			"A visually stunning frontend inspired by Zentry's Awwwards-winning website. Built with React and GSAP for buttery smooth animations and immersive transitions.",
		tags: ["React", "GSAP"],
		live: "https://mudassirsiddiqui54.github.io/Animated_Frontend_Website/",
		github: "https://github.com/MudassirSiddiqui54/Animated_Frontend_Website",
		color: "#00f5ff",
		bg: "linear-gradient(135deg, #0a1628 0%, #060010 100%)",
	},
	{
		number: "02",
		title: "SSK Enterprises",
		description:
			"Professional website for a Data Center & Cooling Infrastructure company. Clean, corporate React frontend deployed and live.",
		tags: ["React"],
		live: "https://mudassirsiddiqui54.github.io/SSK-Enterprises/",
		github: "https://github.com/MudassirSiddiqui54/SSK-Enterprises",
		color: "#bf00ff",
		bg: "linear-gradient(135deg, #120a28 0%, #060010 100%)",
	},
	{
		number: "03",
		title: "Car Dealership Management",
		description:
			"Full Stack application built for small car dealers to take their businesses online. Customers can book cars or test drives online.",
		tags: ["FastAPI", "React", "MongoDB"],
		live: "https://motoverse-six.vercel.app/",
		github: "https://github.com/MudassirSiddiqui54/motoverse-frontend",
		color: "#00ff88",
		bg: "linear-gradient(135deg, #0a1a10 0%, #060010 100%)",
	},
	{
		number: "04",
		title: "CyberShield",
		description:
			"Desktop application that scans websites for security vulnerabilities and uses GenAI to explain fixes in simple steps. Built with Python and Electron.",
		tags: ["Python", "Electron", "GenAI", "React"],
		live: null,
		github: "https://github.com/hardiksedani/CYBERSHEILD",
		color: "#ff4444",
		bg: "linear-gradient(135deg, #1a0a0a 0%, #060010 100%)",
	},
	{
		number: "05",
		title: "ProjectCamp",
		description:
			"Full stack project management system for managing projects and tasks. Built with the MERN stack MongoDB, Express, React, and Node.js.",
		tags: ["MongoDB", "Express", "React", "Node.js"],
		live: "https://projectcamp-phi.vercel.app/",
		github: "https://github.com/MudassirSiddiqui54/Project-camp.git",
		color: "#f5a623",
		bg: "linear-gradient(135deg, #1a1200 0%, #060010 100%)",
	},
	{
		number: "06",
		title: "Social-Post",
		description:
			"A mini social media website that allows user to Post, Like and Comment.",
		tags: ["NodeJS", "MongoDB", "React", "ExpressJS"],
		live: "https://social-post-app-mu.vercel.app/",
		github: "https://github.com/MudassirSiddiqui54/social-post-app.git",
		color: "#3b82f6",
		bg: "linear-gradient(135deg, #0a1220 0%, #060010 100%)",
	},
];

export default function Projects() {
	const sectionRef = useRef(null);
	const wrapperRef = useRef(null);
	const trackRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const track = trackRef.current;
			const wrapper = wrapperRef.current;
			if (!track || !wrapper) return;

			// Use the track's actual laid-out width.
			// w-max on the track guarantees this is the true content width.
			const getDistance = () => {
				return Math.max(0, track.scrollWidth - wrapper.clientWidth);
			};

			// Set the track's initial position BEFORE ScrollTrigger runs.
			// This kills the split-second layout flash.
			gsap.set(track, { x: 0, force3D: true });

			gsap.to(track, {
				x: () => -getDistance(),
				ease: "none",
				scrollTrigger: {
					trigger: wrapper,
					start: "top top",
					end: () => `+=${getDistance()}`,
					pin: true,
					scrub: 0.5,
					anticipatePin: 0,
					invalidateOnRefresh: true,
					// pinType: "transform",
					// fastScrollEnd: true, // ← new
					// preventOverlaps: true, // ← new
				},
			});
		}, sectionRef);

		// Recalculate once after fonts/layout settle
		const t = setTimeout(() => ScrollTrigger.refresh(), 200);

		return () => {
			clearTimeout(t);
			ctx.revert();
		};
	}, []);

	return (
		<section id="projects" ref={sectionRef} className="relative w-full">
			{/* Heading — normal flow, scrolls away before pin engages */}
			<div className="relative z-20 text-center pt-32 pb-20 px-6 flex flex-col items-center gap-5">
				<ScrollArrowText
					text="PROJECTS"
					staggerAmount={0.07}
					duration={1.1}
					color="#ffffff"
					triggerStart="top 90%"
					triggerEnd="top 40%"
				/>
			</div>

			{/* Cards wrapper — pinned */}
			<div
				ref={wrapperRef}
				className="relative w-full h-screen overflow-hidden"
			>
				{/* Vertical centering via absolute + inset-0, not flex */}
				<div className="absolute inset-0 flex items-center">
					<div
						ref={trackRef}
						className="projects-track flex gap-6 pl-12 pr-12 w-max"
					>
						{PROJECTS.map((project, i) => (
							<div
								key={i}
								className="project-card flex-shrink-0 rounded-[32px] overflow-hidden"
								style={{
									background: project.bg,
									width: "380px",
									height: "460px",
									border: `1px solid ${project.color}33`,
									boxShadow: `0 0 20px ${project.color}15`,
								}}
							>
								<SpotlightCard
									className="w-full h-full p-8 flex flex-col justify-between gap-6 select-none"
									spotlightColor={project.color + "33"}
								>
									<div
										className="absolute top-0 left-0 w-full h-[2px]"
										style={{
											background: `linear-gradient(to right, ${project.color}, transparent)`,
										}}
									/>

									<div className="flex flex-col gap-3">
										<span
											className="font-mono text-5xl font-bold opacity-10 leading-none"
											style={{
												color: project.color,
											}}
										>
											{project.number}
										</span>
										<h3 className="text-white text-xl font-bold leading-tight">
											{project.title}
										</h3>
										<p className="text-gray-400 text-sm leading-relaxed">
											{project.description}
										</p>
									</div>

									<div className="flex flex-col gap-4">
										<div className="flex flex-wrap gap-2">
											{project.tags.map((tag, j) => (
												<span
													key={j}
													className="px-3 py-1 rounded-full text-xs font-mono border"
													style={{
														color: project.color,
														borderColor:
															project.color +
															"33",
														background:
															project.color +
															"11",
													}}
												>
													{tag}
												</span>
											))}
										</div>

										<div className="flex gap-3">
											{project.live && (
												<a
													href={project.live}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200 hover:-translate-y-0.5"
													style={{
														background:
															project.color +
															"22",
														color: project.color,
														border: `1px solid ${project.color}44`,
													}}
												>
													<FaExternalLinkAlt
														size={10}
													/>
													Live Demo
												</a>
											)}
											<a
												href={project.github}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono text-gray-400 border border-white/10 hover:border-white/25 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
											>
												<FaGithub size={10} />
												GitHub
											</a>
										</div>
									</div>
								</SpotlightCard>
							</div>
						))}
					</div>
				</div>

				{/* Left fade */}
				<div
					className="absolute left-0 top-0 h-full w-24 z-30 pointer-events-none"
					style={{
						background:
							"linear-gradient(to right, #030407, transparent)",
					}}
				/>
				{/* Right fade */}
				<div
					className="absolute right-0 top-0 h-full w-24 z-30 pointer-events-none"
					style={{
						background:
							"linear-gradient(to left, #030407, transparent)",
					}}
				/>
			</div>

			{/* Bottom space after the pin releases */}
			<div className="h-[12vh]" />
		</section>
	);
}
