import RotatingText from "../components/RotatingText"; // Ensure this path is correct

import { useState, useRef } from "react";

const NameLine = ({ text, isOutline, indentClass = "" }) => {
	const [activeLetters, setActiveLetters] = useState(new Set());

	const timersRef = useRef({});

	const handleMouseEnter = (index) => {
		setActiveLetters((prev) => {
			const next = new Set(prev);
			next.add(index);
			return next;
		});

		clearTimeout(timersRef.current[index]);

		timersRef.current[index] = setTimeout(() => {
			setActiveLetters((prev) => {
				const next = new Set(prev);
				next.delete(index);
				return next;
			});

			delete timersRef.current[index];
		}, 650);
	};

	return (
		<h1
			className={`special-font text-[15vw] md:text-[11vw] leading-[0.85] flex justify-center md:justify-start gap-x-1 md:gap-x-3 ${indentClass}`}
		>
			{text.split("").map((char, index) => (
				<span
					key={index}
					className={`letter ${
						activeLetters.has(index) ? "wobble" : ""
					}`}
					onMouseEnter={() => handleMouseEnter(index)}
					style={{
						color: isOutline ? "transparent" : "#111827",
						WebkitTextStroke: isOutline ? "2px #111827" : "none",
					}}
				>
					{char}
				</span>
			))}
		</h1>
	);
};

export default function Hero() {
	return (
		<section
			id="hero"
			className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-16"
		>
			<div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12 mt-16 md:mt-0">
				{/* LEFT SIDE: Name */}
				<div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center fade-in-left">
					{/* MUDASSIR (Dark) */}
					<div className="w-full flex justify-center md:justify-start">
						<NameLine text="MUDASSIR" isOutline={false} />
					</div>

					{/* SIDDIQUI (Outline, indented to start under the 'U' in MUDASSIR) */}
					<div className="w-full flex justify-center md:justify-start ml-[0.8em] md:ml-[1.2em] mt-2">
						<NameLine text="SIDDIQUI" isOutline={true} />
					</div>
				</div>

				{/* RIGHT SIDE: Rotating Text & Paragraph */}
				<div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center md:pl-12 mt-8 md:mt-0 fade-in-right">
					{/* Rotating Text Component */}
					<div className="mb-6">
						<RotatingText
							texts={[
								"Full stack developer",
								"Python developer",
								"ML engineer",
							]}
							mainClassName="px-6 py-2 bg-gray-900 text-white overflow-hidden justify-center  inline-flex text-lg md:text-2xl font-medium tracking-wide"
							staggerFrom="center"
							initial={{ y: "100%" }}
							animate={{ y: 0 }}
							exit={{ y: "-120%" }}
							staggerDuration={0.06}
							splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
							transition={{
								type: "spring",
								damping: 30,
								stiffness: 400,
							}}
							rotationInterval={3000}
							splitBy="characters"
							auto
							loop
						/>
					</div>

					{/* Paragraph */}
					<p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-lg text-center md:text-left">
						I craft beautiful functional digital experiences that
						bring ideas to life, specializing in modern web
						development and user-centric design.
					</p>
				</div>
			</div>
		</section>
	);
}
