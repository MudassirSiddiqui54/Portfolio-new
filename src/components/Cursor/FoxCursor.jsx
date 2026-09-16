"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Import shared constants from LightModeCursor
import {
	CURSOR_POSITION_DURATION,
	CURSOR_POSITION_EASE,
	CURSOR_FADE_DURATION,
	CURSOR_FADE_EASE,
} from "./LightModeCursor";

const COLOR_PRESETS = {
	cyan: "#00f3ff",
	pink: "#ff00ff",
	green: "#39ff14",
};

const GLOW_PX = {
	none: 0,
	low: 3,
	medium: 6,
	high: 14,
};

export function FoxCursorSVG({
	color = "cyan",
	size = 64,
	strokeWidth = 2,
	glowIntensity = "medium",
	fillOpacity = 0,
}) {
	const resolvedColor = COLOR_PRESETS[color] ?? color;
	const glowPx = GLOW_PX[glowIntensity] ?? 6;

	const svgStyle =
		glowPx > 0
			? { filter: `drop-shadow(0 0 ${glowPx}px ${resolvedColor})` }
			: {};

	const stroke = resolvedColor;
	const sw = strokeWidth;
	const fill = fillOpacity > 0 ? resolvedColor : "none";
	const fo = fillOpacity;

	return (
		<svg
			width={size}
			height={size}
			viewBox="394.00 168.00 83.00 82.80"
			preserveAspectRatio="xMidYMid meet"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={svgStyle}
			aria-hidden="true"
		>
			{fillOpacity > 0 && (
				<polygon
					points="416.40,188.80 454.40,188.80 473.40,208.80 436.40,246.80 435.40,246.80 397.40,207.80"
					fill={fill}
					fillOpacity={fo * 0.25}
					stroke="none"
				/>
			)}
			<line
				x1="416.40"
				y1="188.80"
				x2="454.40"
				y2="188.80"
				stroke={stroke}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
			<line
				x1="416.40"
				y1="188.80"
				x2="398.40"
				y2="207.80"
				stroke={stroke}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
			<line
				x1="454.40"
				y1="188.80"
				x2="473.40"
				y2="208.80"
				stroke={stroke}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
			<line
				x1="397.40"
				y1="207.80"
				x2="435.40"
				y2="247.80"
				stroke={stroke}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
			<line
				x1="473.40"
				y1="208.80"
				x2="436.40"
				y2="246.80"
				stroke={stroke}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
			<line
				x1="435.40"
				y1="246.80"
				x2="435.40"
				y2="188.80"
				stroke={stroke}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
			<line
				x1="474.00"
				y1="208.00"
				x2="462.00"
				y2="171.00"
				stroke={stroke}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
			<line
				x1="455.00"
				y1="188.00"
				x2="462.00"
				y2="171.00"
				stroke={stroke}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
			<line
				x1="397.00"
				y1="207.00"
				x2="410.00"
				y2="172.00"
				stroke={stroke}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
			<line
				x1="416.00"
				y1="188.00"
				x2="410.00"
				y2="172.00"
				stroke={stroke}
				strokeWidth={sw}
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function FoxCursor({
	color = "cyan",
	size = 64,
	strokeWidth = 2,
	glowIntensity = "medium",
	fillOpacity = 0,
	hideNativeCursor = true,
	disabled = false,
	containerRef,
	isActive = true,
	zIndex = 999999,
}) {
	const wrapperRef = useRef(null);
	const xTo = useRef(null);
	const yTo = useRef(null);
	const firstMove = useRef(true);
	const contained = !!containerRef;

	// ---- Position tracking (mirrors LightModeCursor exactly) ----
	useEffect(() => {
		if (disabled) return;
		const wrapper = wrapperRef.current;
		if (!wrapper) return;

		xTo.current = gsap.quickTo(wrapper, "x", {
			duration: CURSOR_POSITION_DURATION,
			ease: CURSOR_POSITION_EASE,
		});
		yTo.current = gsap.quickTo(wrapper, "y", {
			duration: CURSOR_POSITION_DURATION,
			ease: CURSOR_POSITION_EASE,
		});

		if (contained && containerRef.current) {
			const el = containerRef.current;

			const onMove = (e) => {
				const rect = el.getBoundingClientRect();
				const targetX = e.clientX - rect.left;
				const targetY = e.clientY - rect.top;

				if (firstMove.current) {
					gsap.set(wrapper, { x: targetX, y: targetY });
					firstMove.current = false;
					return;
				}
				xTo.current(targetX);
				yTo.current(targetY);
			};

			el.addEventListener("mousemove", onMove, { passive: true });
			return () => el.removeEventListener("mousemove", onMove);
		}

		const onMove = (e) => {
			if (firstMove.current) {
				gsap.set(wrapper, { x: e.clientX, y: e.clientY });
				firstMove.current = false;
				return;
			}
			xTo.current(e.clientX);
			yTo.current(e.clientY);
		};

		window.addEventListener("mousemove", onMove, { passive: true });
		return () => window.removeEventListener("mousemove", onMove);
	}, [disabled, contained, containerRef]);

	// ---- Crossfade ----
	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;

		gsap.to(wrapper, {
			opacity: isActive ? 1 : 0,
			scale: isActive ? 1 : 0.6,
			duration: CURSOR_FADE_DURATION,
			ease: CURSOR_FADE_EASE,
			overwrite: "auto",
		});
	}, [isActive]);

	// ---- Hide native cursor ----
	useEffect(() => {
		if (!hideNativeCursor || disabled) return;

		if (contained && containerRef?.current) {
			const attr = "data-fox-cursor-scope";
			const container = containerRef.current;
			container.setAttribute(attr, "");

			const style = document.createElement("style");
			style.textContent = `[${attr}], [${attr}] * { cursor: none !important; }`;
			document.head.appendChild(style);

			return () => {
				document.head.removeChild(style);
				container.removeAttribute(attr);
			};
		}

		const style = document.createElement("style");
		style.textContent = `*, *::before, *::after { cursor: none !important; }`;
		document.head.appendChild(style);
		return () => document.head.removeChild(style);
	}, [hideNativeCursor, disabled, contained, containerRef]);

	if (disabled) return null;

	const half = size / 2;

	return (
		<div
			ref={wrapperRef}
			aria-hidden="true"
			style={{
				position: contained ? "absolute" : "fixed",
				top: 0,
				left: 0,
				// Centering via margins so GSAP's `scale` can't clobber it
				marginLeft: -half,
				marginTop: -half,
				width: size,
				height: size,
				pointerEvents: "none",
				zIndex: zIndex,
				opacity: 0,
				willChange: "transform, opacity",
			}}
		>
			<FoxCursorSVG
				color={color}
				size={size}
				strokeWidth={strokeWidth}
				glowIntensity={glowIntensity}
				fillOpacity={fillOpacity}
			/>
		</div>
	);
}

export default FoxCursor;
