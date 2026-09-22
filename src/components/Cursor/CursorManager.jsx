import { useEffect, useState } from "react";
import { useCursor } from "../../context/CursorContext";
import LightModeCursor from "./LightModeCursor";
import { FoxCursor } from "./FoxCursor";

export default function CursorManager() {
	const { mode } = useCursor();
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(pointer: coarse)");

		const update = () => {
			setIsMobile(mediaQuery.matches);
		};

		update();

		mediaQuery.addEventListener("change", update);

		return () => {
			mediaQuery.removeEventListener("change", update);
		};
	}, []);

	/*
	 * No custom cursor on touch devices.
	 * Desktop cursor remains completely unchanged.
	 */
	if (isMobile) {
		return null;
	}

	return (
		<>
			<LightModeCursor isActive={mode === "light"} />

			<FoxCursor
				isActive={mode === "dark"}
				color="cyan"
				size={32}
				strokeWidth={5}
				glowIntensity="medium"
				fillOpacity={0}
				hideNativeCursor={false}
			/>
		</>
	);
}
