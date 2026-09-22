import { forwardRef } from "react";
import AsciiRain from "../../components/AsciiRain";
import "./InsideSection.css";

const InsideSection = forwardRef((_, ref) => {
	return (
		<section ref={ref} className="inside-section">
			<AsciiRain
				textColor="#BBAAF5"
				bgColor="rgba(3, 4, 7, 0.08)"
				speed={60}
				opacity={80}
				fontSize={20}
			/>
		</section>
	);
});

InsideSection.displayName = "InsideSection";
export default InsideSection;
