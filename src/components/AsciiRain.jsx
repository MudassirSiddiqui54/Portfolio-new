import { useEffect, useRef } from "react";

export default function AsciiRain({
	textColor = "#d43dd4",
	bgColor = "rgba(3, 4, 7, 0.08)",
	fontSize = 14,
	speed = 33,
	characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+~`|}{[]:;?><,./-=",
	opacity = 60,
}) {
	const canvasRef = useRef(null);
	const isVisibleRef = useRef(true);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let drops = [];
		const charArray = characters.split("");

		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			const columns = Math.ceil(canvas.width / fontSize);
			// RE-INITIALIZE — prevents ghost columns on shrink
			drops = [];
			for (let x = 0; x < columns; x++) {
				drops[x] = (Math.random() * canvas.height) / fontSize;
			}
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		const draw = () => {
			if (!isVisibleRef.current) return;

			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = textColor;
			ctx.font = `${fontSize}px monospace`;

			for (let i = 0; i < drops.length; i++) {
				const text =
					charArray[Math.floor(Math.random() * charArray.length)];
				ctx.fillText(text, i * fontSize, drops[i] * fontSize);

				if (
					drops[i] * fontSize > canvas.height &&
					Math.random() > 0.975
				) {
					drops[i] = 0;
				}
				drops[i]++;
			}
		};

		let animationFrame = null;
		let lastDrawTime = 0;

		const drawLoop = (time) => {
			if (!isVisibleRef.current) {
				animationFrame = null;
				return;
			}

			if (time - lastDrawTime >= speed) {
				lastDrawTime = time;
				draw();
			}

			animationFrame = requestAnimationFrame(drawLoop);
		};

		const startLoop = () => {
			if (animationFrame !== null) return;

			lastDrawTime = performance.now();
			animationFrame = requestAnimationFrame(drawLoop);
		};

		const stopLoop = () => {
			if (animationFrame !== null) {
				cancelAnimationFrame(animationFrame);
				animationFrame = null;
			}
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				isVisibleRef.current = entry.isIntersecting;

				if (entry.isIntersecting) {
					startLoop();
				} else {
					stopLoop();
				}
			},
			{ threshold: 0 },
		);

		observer.observe(canvas);

		return () => {
			stopLoop();
			observer.disconnect();
			window.removeEventListener("resize", resizeCanvas);
		};
	}, [textColor, bgColor, fontSize, speed, characters]);

	return (
		<div className="absolute inset-0 z-0 overflow-hidden">
			<canvas
				ref={canvasRef}
				className="w-full h-full block pointer-events-none"
				style={{ opacity: opacity / 100 }}
			/>
		</div>
	);
}
