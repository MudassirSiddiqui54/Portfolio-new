import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function AboutCard() {
	const cardRef = useRef(null);
	const bg1Ref = useRef(null);
	const bg2Ref = useRef(null);
	const personRef = useRef(null);
	const glintRef = useRef(null);
	const overlayRef = useRef(null);

	useEffect(() => {
		const card = cardRef.current;
		const bg1 = bg1Ref.current;
		const bg2 = bg2Ref.current;
		const person = personRef.current;
		const glint = glintRef.current;
		const overlay = overlayRef.current;

		if (!card || !bg1 || !bg2 || !person || !glint) return;

		const ctx = gsap.context(() => {
			// Smooth mouse-following values
			const rotX = gsap.quickTo(card, "rotationX", {
				duration: 0.7,
				ease: "power3.out",
			});

			const rotY = gsap.quickTo(card, "rotationY", {
				duration: 0.7,
				ease: "power3.out",
			});

			const bg1X = gsap.quickTo(bg1, "xPercent", {
				duration: 0.8,
				ease: "power3.out",
			});

			const bg1Y = gsap.quickTo(bg1, "yPercent", {
				duration: 0.8,
				ease: "power3.out",
			});

			const bg2X = gsap.quickTo(bg2, "xPercent", {
				duration: 0.65,
				ease: "power3.out",
			});

			const bg2Y = gsap.quickTo(bg2, "yPercent", {
				duration: 0.65,
				ease: "power3.out",
			});

			const personX = gsap.quickTo(person, "xPercent", {
				duration: 0.55,
				ease: "power3.out",
			});

			const personY = gsap.quickTo(person, "yPercent", {
				duration: 0.55,
				ease: "power3.out",
			});

			const glintX = gsap.quickTo(glint, "xPercent", {
				duration: 0.5,
				ease: "power3.out",
			});

			const glintY = gsap.quickTo(glint, "yPercent", {
				duration: 0.5,
				ease: "power3.out",
			});

			const onMove = (e) => {
				const rect = card.getBoundingClientRect();

				const x = (e.clientX - rect.left) / rect.width;
				const y = (e.clientY - rect.top) / rect.height;

				const mouseX = x - 0.5;
				const mouseY = y - 0.5;

				// Card 3D rotation
				rotY(mouseX * 14);
				rotX(-mouseY * 14);

				// Background — deepest layer
				bg1X(mouseX * 4);
				bg1Y(mouseY * 4);

				// Second background — stronger parallax
				bg2X(mouseX * 8);
				bg2Y(mouseY * 8);

				// Portrait — strongest depth
				personX(mouseX * 5);
				personY(mouseY * 5);

				// Light follows cursor
				glintX(mouseX * 120);
				glintY(mouseY * 120);
			};

			const onEnter = () => {
				gsap.to(card, {
					scale: 1.035,
					duration: 0.6,
					ease: "power3.out",
				});

				gsap.to(bg1, {
					scale: 1.08,
					duration: 1,
					ease: "power3.out",
				});

				gsap.to(bg2, {
					scale: 1.12,
					duration: 1,
					ease: "power3.out",
				});

				gsap.to(person, {
					scale: 1.045,
					z: 45,
					duration: 0.7,
					ease: "power3.out",
				});

				gsap.to(glint, {
					opacity: 1,
					duration: 0.4,
				});

				gsap.to(overlay, {
					opacity: 0.35,
					duration: 0.5,
				});
			};

			const onLeave = () => {
				rotX(0);
				rotY(0);

				bg1X(0);
				bg1Y(0);

				bg2X(0);
				bg2Y(0);

				personX(0);
				personY(0);

				glintX(0);
				glintY(0);

				gsap.to(card, {
					scale: 1,
					duration: 0.9,
					ease: "elastic.out(1, 0.5)",
				});

				gsap.to(bg1, {
					scale: 1.02,
					xPercent: 0,
					yPercent: 0,
					duration: 0.8,
					ease: "power2.out",
				});

				gsap.to(bg2, {
					scale: 1.04,
					xPercent: 0,
					yPercent: 0,
					duration: 0.8,
					ease: "power3.out",
				});

				gsap.to(person, {
					scale: 1,
					z: 0,
					xPercent: 0,
					yPercent: 0,
					duration: 0.8,
					ease: "power3.out",
				});

				gsap.to(glint, {
					opacity: 0,
					duration: 0.5,
				});

				gsap.to(overlay, {
					opacity: 0,
					duration: 0.5,
				});
			};

			card.addEventListener("mousemove", onMove);
			card.addEventListener("mouseenter", onEnter);
			card.addEventListener("mouseleave", onLeave);

			return () => {
				card.removeEventListener("mousemove", onMove);
				card.removeEventListener("mouseenter", onEnter);
				card.removeEventListener("mouseleave", onLeave);
			};
		}, cardRef);

		return () => ctx.revert();
	}, []);

	return (
		<div className="relative [perspective:1400px] w-full max-w-[420px]">
			<div
				ref={cardRef}
				className="relative w-full aspect-[4/5] rounded-0 overflow-hidden will-change-transform shadow-[0_25px_80px_-25px_rgba(0,0,0,0.35)]"
				style={{
					transformStyle: "preserve-3d",
				}}
			>
				{/* BACKGROUND 1 — deepest layer */}
				<div
					ref={bg1Ref}
					className="absolute -inset-[5%] bg-cover bg-center will-change-transform"
					style={{
						backgroundImage: "url(/images/card-bg.png)",
					}}
				/>

				{/* BACKGROUND 2 — atmospheric/parallax layer */}
				<div
					ref={bg2Ref}
					className="absolute -inset-[7%] bg-cover bg-center opacity-50 mix-blend-soft-light will-change-transform"
					style={{
						backgroundImage: "url(/images/card-bg-2.png)",
					}}
				/>

				{/* DARK VIGNETTE */}
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						background: `
							linear-gradient(
								180deg,
								rgba(0,0,0,0.02) 0%,
								rgba(0,0,0,0.05) 45%,
								rgba(0,0,0,0.35) 100%
							)
						`,
					}}
				/>

				{/* PERSON — completely unclipped */}
				<img
					ref={personRef}
					src="/images/me.png"
					alt="Mudassir"
					className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
					style={{
						transformStyle: "preserve-3d",
					}}
				/>

				{/* SOFT COLOR OVERLAY */}
				<div
					ref={overlayRef}
					className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay"
					style={{
						background:
							"radial-gradient(circle at 50% 35%, rgba(255,255,255,0.2), transparent 95%)",
					}}
				/>

				{/* MOVING GLINT */}
				<div
					ref={glintRef}
					className="absolute -inset-[30%] pointer-events-none opacity-0 will-change-transform"
					style={{
						background: `
							radial-gradient(
								circle at 50% 50%,
								rgba(255,255,255,0.35) 0%,
								rgba(255,255,255,0.12) 15%,
								transparent 45%
							)
						`,
						mixBlendMode: "screen",
					}}
				/>

				{/* INNER EDGE */}
				<div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 pointer-events-none" />

				{/* SUBTLE SHADOW */}
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						boxShadow: "inset 0 0 80px rgba(0,0,0,0.18)",
					}}
				/>
			</div>
		</div>
	);
}
