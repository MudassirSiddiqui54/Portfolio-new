"use client";

import { forwardRef, useId } from "react";

// ─── Color presets ────────────────────────────────────────────────────────────

const COLOR_PRESETS = {
	cyan: "#00f3ff",
	pink: "#ff00ff",
	green: "#39ff14",
	orange: "#ff9900",
	purple: "#bf00ff",
	red: "#ff3333",
};

function resolveColor(c, fallback) {
	if (!c) return fallback;
	return COLOR_PRESETS[c] ?? c;
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const CLIP_CLASSES = {
	"bottom-right": "ni-clip-br",
	"bottom-left": "ni-clip-bl",
	"top-right": "ni-clip-tr",
	"top-left": "ni-clip-tl",
	"tl-br": "ni-clip-tl-br",
	"bl-tr": "ni-clip-bl-tr",
	all: "ni-clip-all",
};

const SIZE_CLASSES = {
	sm: {
		pad: "px-3 py-1.5",
		inputH: "h-8",
		text: "text-xs",
		label: "text-[10px]",
		hint: "text-[9px]",
	},
	md: {
		pad: "px-4 py-2",
		inputH: "h-10",
		text: "text-sm",
		label: "text-xs",
		hint: "text-[10px]",
	},
	lg: {
		pad: "px-5 py-3",
		inputH: "h-12",
		text: "text-base",
		label: "text-sm",
		hint: "text-xs",
	},
};

const GLOW_SIZE = {
	none: "0px",
	subtle: "4px",
	normal: "10px",
	strong: "20px",
};

// ─── Component ────────────────────────────────────────────────────────────────

const NeonInput = forwardRef(function NeonInput(
	{
		// Shape
		shape = "corner-cut",
		corner = "bottom-right",
		cornerSize = 12,
		borderStyle = "full",

		// Colors
		color = "cyan",
		borderColor,
		hoverColor,
		focusColor,
		bgColor = "#0a0f14",
		bgOpacity = 100,
		textColor,
		placeholderColor,

		// Label & hint
		label,
		labelColor,
		hint,
		hintColor,
		error,

		// Visual
		variant = "outline",
		size = "md",
		glowIntensity = "normal",

		// Slots
		prefix,
		suffix,

		// Class names
		className = "",
		inputClassName = "",

		// Native
		disabled,
		id: idProp,
		...inputProps
	},
	ref,
) {
	const generatedId = useId();
	const inputId = idProp ?? generatedId;

	// ── Resolve colors ────────────────────────────────────────────────────────

	const accent = resolveColor(color, "#00f3ff");
	const resolvedBorder = resolveColor(borderColor, accent);
	const resolvedHover = resolveColor(hoverColor, accent);
	const resolvedFocus = resolveColor(focusColor, accent);
	const resolvedText = resolveColor(textColor, "#e0f8ff");
	const resolvedPh = resolveColor(placeholderColor, `${accent}59`);
	const resolvedLabel = resolveColor(labelColor, `${accent}a6`);
	const resolvedHint = resolveColor(hintColor, "rgba(255,255,255,0.35)");

	// ── Error state overrides ────────────────────────────────────────────────

	const hasError = Boolean(error);
	const activeBorder = hasError ? "#ff4444" : resolvedBorder;
	const activeFocus = hasError ? "#ff4444" : resolvedFocus;

	// ── Background with opacity ──────────────────────────────────────────────

	let innerBg = bgColor ?? "#0a0f14";

	if (variant === "filled") {
		innerBg = `color-mix(in srgb, ${accent} 10%, ${innerBg})`;
	}

	if (bgOpacity < 100) {
		innerBg = `color-mix(in srgb, ${innerBg} ${bgOpacity}%, #020208)`;
	}

	// ── Shape helpers ─────────────────────────────────────────────────────────

	const clipClass = shape === "corner-cut" ? CLIP_CLASSES[corner] : "";

	const radiusClass = shape === "rounded" ? "rounded-md" : "";

	// ── Glow / size ───────────────────────────────────────────────────────────

	const glow = GLOW_SIZE[glowIntensity];
	const sc = SIZE_CLASSES[size];

	// ── Content row ───────────────────────────────────────────────────────────

	const contentRow = (
		<>
			{prefix && (
				<span className="ni-prefix" style={{ color: accent }}>
					{prefix}
				</span>
			)}

			<input
				ref={ref}
				id={inputId}
				className={`ni-input font-mono ${sc.inputH} ${sc.text} ${inputClassName}`}
				style={{
					color: resolvedText,
					"--ni-ph-color": resolvedPh,
				}}
				disabled={disabled}
				{...inputProps}
			/>

			{suffix && (
				<span className="ni-suffix" style={{ color: accent }}>
					{suffix}
				</span>
			)}
		</>
	);

	// ── Shell — border + shape ────────────────────────────────────────────────

	let shell;

	if (borderStyle === "full") {
		shell = (
			<div className={`ni-outer relative p-px ${radiusClass}`}>
				{/* Border frame */}
				<div
					className={`ni-border-frame absolute inset-0 ${clipClass} ${radiusClass} pointer-events-none`}
					aria-hidden="true"
				/>

				{/* Inner */}
				<div
					className={`ni-inner relative z-10 flex items-center gap-2 ${clipClass} ${radiusClass} ${sc.pad}`}
					style={{ background: innerBg }}
				>
					{contentRow}
				</div>
			</div>
		);
	} else if (borderStyle === "bottom") {
		// Underline only
		shell = (
			<div
				className={`ni-bottom-shell flex items-center gap-2 ${sc.pad}`}
				style={{ background: innerBg }}
			>
				{contentRow}
			</div>
		);
	} else {
		// Borderless
		shell = (
			<div
				className={`ni-borderless-shell flex items-center gap-2 ${clipClass} ${radiusClass} ${sc.pad}`}
				style={{ background: innerBg }}
			>
				{contentRow}
			</div>
		);
	}

	return (
		<div
			className={`ni-field-root${
				disabled ? " ni-disabled" : ""
			}${className ? ` ${className}` : ""}`}
			style={{
				"--ni-accent": accent,
				"--ni-border": activeBorder,
				"--ni-hover": resolvedHover,
				"--ni-focus": activeFocus,
				"--ni-glow": glow,
				"--ni-corner": `${cornerSize}px`,
			}}
		>
			{/* Label */}
			{label && (
				<label
					htmlFor={inputId}
					className={`ni-label font-orbitron tracking-widest uppercase ${sc.label}`}
					style={{ color: resolvedLabel }}
				>
					{label}
				</label>
			)}

			{/* Glow wrapper */}
			<div className="ni-glow-wrapper">{shell}</div>

			{/* Hint / Error */}
			{(hint || error) && (
				<span
					className={`ni-hint font-mono ${sc.hint}`}
					style={{
						color: hasError ? "#ff4444" : resolvedHint,
					}}
				>
					{error ?? hint}
				</span>
			)}
		</div>
	);
});

NeonInput.displayName = "NeonInput";

export default NeonInput;
