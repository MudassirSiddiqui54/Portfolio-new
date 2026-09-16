import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TornadoPortal from "./TornadoPortal";
import InsideSection from "../sections/InsideSection/InsideSection";
import { useCursor } from "../context/CursorContext";
import "./ZoomPortal.css";

gsap.registerPlugin(ScrollTrigger);

export default function ZoomPortal() {
	const sectionRef = useRef(null);
	const canvasWrapperRef = useRef(null);
	const nextSectionRef = useRef(null);
	const zoomRef = useRef(0);
	const { setMode } = useCursor();

	useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top top",
					end: "+=2000",
					scrub: 1,
					pin: true,
					anticipatePin: 1,
					// 🔑 The four fixes:
					pinType: "transform", // Lenis uses transforms — match it
					invalidateOnRefresh: true, // Recalculate on resize
					onUpdate: (self) => {
						// Single condition, no dead zone.
						// Once the pin ends, progress stays at 1 → dark.
						// Scrolling back up re-triggers and flips to light below 0.55.
						setMode(self.progress > 0.55 ? "dark" : "light");
					},
				},
			});

			tl.to(zoomRef, { current: 1, ease: "none" }, 0);

			tl.fromTo(
				nextSectionRef.current,
				{ opacity: 0 },
				{ opacity: 1, ease: "power2.inOut" },
				0.55,
			);
		}, sectionRef);

		return () => ctx.revert();
	}, [setMode]);

	return (
		<main>
			<section ref={sectionRef} className="zoom-section">
				<div ref={canvasWrapperRef} className="canvas-wrapper">
					<TornadoPortal zoomRef={zoomRef} />
				</div>
				<InsideSection ref={nextSectionRef} />
			</section>
		</main>
	);
}
