import AboutCard from "./AboutCard";
import RevealText from "../../components/RevealText.jsx";
import ScrollArrowText from "../../components/ScrollArrowText.jsx";

export default function About() {
	return (
		<section id="about" className="relative w-full py-32 px-6 md:px-16">
			<div className="max-w-7xl mx-auto flex flex-col gap-20 md:gap-28">
				{/* --- Centered Heading --- */}
				<div className="w-full flex justify-center">
					<ScrollArrowText
						text="ABOUT ME"
						staggerAmount={0.08}
						duration={1.1}
						triggerStart="top 85%"
						triggerEnd="bottom 25%"
					/>
				</div>

				{/* --- Content Grid: Card left, Paragraph right --- */}
				<div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
					{/* Left: 3D Card */}
					<div className="md:col-span-5 flex justify-center md:justify-start">
						<AboutCard />
					</div>

					{/* Right: Revealed Paragraph */}
					<div className="md:col-span-7">
						<RevealText className="text-2xl md:text-3xl leading-relaxed text-gray-800 font-mono">
							I'm a third-year Engineering student at KJ Somaiya
							Institute of Technology, specializing in Artificial
							Intelligence and Data Science. I have a strong
							passion for coding, full-stack web development, and
							solving challenging problems on LeetCode. I enjoy
							building applications that are not only functional
							but also thoughtfully designed. When I'm not writing
							code, I'm exploring new technologies in the ML and
							AI, always looking for the next problem worth
							solving.
						</RevealText>
					</div>
				</div>
			</div>
		</section>
	);
}
