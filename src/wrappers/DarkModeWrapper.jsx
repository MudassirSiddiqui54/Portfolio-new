import { useRef } from "react";
import HeroBackgroundM from "../components/HeroBackgroundM";
import Skills from "../sections/Skills/Skills";
import Projects from "../sections/Projects/Projects";
import Contact from "../sections/Contact/Contact";
import Footer from "../sections/Footer/Footer";

const DarkModeWrapper = () => {
	const wrapperRef = useRef(null);

	return (
		<div ref={wrapperRef} className="relative bg-[#030407]">
			{/* triggerRef → only visible when this wrapper is in view */}
			<HeroBackgroundM
				opacity={0.75}
				color="#00f5ff"
				trackColor="#3b4a55"
				glowStrokeWidth={18}
				triggerRef={wrapperRef}
			/>
			<div className="relative z-10">
				<Skills />
				<Projects />
				<Contact />
				<Footer />
			</div>
		</div>
	);
};

export default DarkModeWrapper;
