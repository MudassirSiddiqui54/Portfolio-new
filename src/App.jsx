import "./App.css";
import { ReactLenis } from "lenis/react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LightModeWrapper from "./wrappers/LightModeWrapper";
import SmoothScrollSync from "./components/SmoothScrollSync";
import ZoomPortal from "./components/ZoomPortal";
import CursorManager from "./components/Cursor/CursorManager";
import { CursorProvider, useCursor } from "./context/CursorContext";
import DarkModeWrapper from "./wrappers/DarkModeWrapper";
import FloatingNavbar from "./sections/Navbar/FloatingNavbar";

gsap.registerPlugin(ScrollTrigger);

function DarkZoneSentinel() {
	const sentinelRef = useRef(null);
	const { setMode } = useCursor();

	useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			// Fires "dark" whenever the sentinel (start of dark content)
			// enters OR re-enters the viewport from any direction.
			// This guarantees the mode stays dark below the portal.
			ScrollTrigger.create({
				trigger: sentinelRef.current,
				start: "top bottom",
				onEnter: () => setMode("dark"),
				onEnterBack: () => setMode("dark"),
			});
		}, sentinelRef);
		return () => ctx.revert();
	}, [setMode]);

	return <div ref={sentinelRef} style={{ height: 0 }} />;
}

function App() {
	return (
		<div id="portfolio-app">
			<CursorProvider>
				<ReactLenis
					root
					options={{
						duration: 1.6,
						easing: (t) =>
							Math.min(1, 1.001 - Math.pow(2, -10 * t)),
						orientation: "vertical",
						gestureOrientation: "vertical",
						smoothWheel: true,
						wheelMultiplier: 0.5,
						touchMultiplier: 1.2,
						syncTouch: true,
						syncTouchLerp: 0.05,
						autoResize: true,
						infinite: false,
					}}
				>
					<SmoothScrollSync />
					<CursorManager />
					<FloatingNavbar />
					<LightModeWrapper />
					<ZoomPortal />
					<DarkModeWrapper />
					<DarkZoneSentinel />
				</ReactLenis>
			</CursorProvider>
		</div>
	);
}

export default App;
