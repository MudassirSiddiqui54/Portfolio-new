// src/components/CursorManager.jsx
import { useCursor } from "../../context/CursorContext";
import LightModeCursor from "./LightModeCursor";
import { FoxCursor } from "./FoxCursor"; // your file
export default function CursorManager() {
	const { mode } = useCursor();

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
