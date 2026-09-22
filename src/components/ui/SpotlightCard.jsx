import { useRef, useState } from "react";

const SpotlightCard = ({
	children,
	className = "",
	spotlightColor = "rgba(255, 255, 255, 0.25)",
}) => {
	const divRef = useRef(null);
	const [isFocused, setIsFocused] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [opacity, setOpacity] = useState(0);
	const isVisibleRef = useRef(false);
	const rafRef = useRef(0);
	const mouseRef = useRef({ x: 0, y: 0 });

	const update = () => {
		rafRef.current = 0;

		if (!isVisibleRef.current) return;

		const { x, y } = mouseRef.current;

		// expensive calculations here
	};

	const handleMouseMove = (e) => {
		mouseRef.current.x = e.clientX;
		mouseRef.current.y = e.clientY;

		if (!rafRef.current) {
			rafRef.current = requestAnimationFrame(update);
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
		setOpacity(0.6);
	};

	const handleBlur = () => {
		setIsFocused(false);
		setOpacity(0);
	};

	const handleMouseEnter = () => {
		setOpacity(0.6);
	};

	const handleMouseLeave = () => {
		setOpacity(0);
	};

	return (
		<div
			ref={divRef}
			onMouseMove={handleMouseMove}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={`relative rounded-3xl border border-neutral-800 bg-neutral-900 overflow-hidden p-8 ${className}`}
		>
			<div
				className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
				style={{
					opacity,
					background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
				}}
			/>
			{children}
		</div>
	);
};

export default SpotlightCard;
