import { useEffect, useRef } from "react";
import gsap from "gsap";

// Shared with FoxCursor for a perfectly synchronized crossfade
export const CURSOR_POSITION_DURATION = 0.35;
export const CURSOR_POSITION_EASE = "power3.out";
export const CURSOR_FADE_DURATION = 0.6;
export const CURSOR_FADE_EASE = "power2.inOut";

export default function LightModeCursor({ isActive }) {
	const cursorRef = useRef(null);
	const xTo = useRef(null);
	const yTo = useRef(null);
	const firstMove = useRef(true);

	useEffect(() => {
		const cursor = cursorRef.current;
		if (!cursor) return;

		xTo.current = gsap.quickTo(cursor, "x", {
			duration: CURSOR_POSITION_DURATION,
			ease: CURSOR_POSITION_EASE,
		});
		yTo.current = gsap.quickTo(cursor, "y", {
			duration: CURSOR_POSITION_DURATION,
			ease: CURSOR_POSITION_EASE,
		});

		const onMove = (e) => {
			// On the very first move, teleport instead of easing in from (0,0)
			if (firstMove.current) {
				gsap.set(cursor, { x: e.clientX, y: e.clientY });
				firstMove.current = false;
				return;
			}
			xTo.current(e.clientX);
			yTo.current(e.clientY);
		};

		window.addEventListener("mousemove", onMove);
		return () => window.removeEventListener("mousemove", onMove);
	}, []);

	useEffect(() => {
		const cursor = cursorRef.current;
		if (!cursor) return;
		gsap.to(cursor, {
			opacity: isActive ? 1 : 0,
			scale: isActive ? 1 : 0.6,
			duration: CURSOR_FADE_DURATION,
			ease: CURSOR_FADE_EASE,
			overwrite: "auto",
		});
	}, [isActive]);

	return (
		<div
			ref={cursorRef}
			className="cursor-light"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: 48,
				height: 48,
				marginLeft: -24,
				marginTop: -24,
				borderRadius: "50%",
				background: "#ffffff",
				mixBlendMode: "difference",
				pointerEvents: "none",
				zIndex: 999999,
				opacity: 0,
				willChange: "transform, opacity",
			}}
		/>
	);
}
