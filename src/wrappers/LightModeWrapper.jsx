import { useRef } from "react";
import HeroBackgroundM from "../components/HeroBackgroundM";
import Hero from "../sections/Hero";
import About from "../sections/About/About";
import Education from "../sections/Education/Education";

const LightModeWrapper = () => {
	return (
		<div className="relative bg-[#f2efbb]">
			{/* No triggerRef → always visible (original behavior) */}
			<HeroBackgroundM opacity={0.6} color="red" trackColor="#BFC5CC" />
			<div className="relative z-10">
				<Hero />
				<About />
				<Education />
			</div>
		</div>
	);
};

export default LightModeWrapper;
