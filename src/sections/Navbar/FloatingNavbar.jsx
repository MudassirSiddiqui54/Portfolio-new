import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import {
	FiHome,
	FiUser,
	FiBookOpen,
	FiZap,
	FiCode,
	FiMail,
} from "react-icons/fi";
import { useCursor } from "../../context/CursorContext";
import "./FloatingNavbar.css";

const SECTIONS = [
	{ id: "hero", label: "Home", icon: <FiHome size={16} />, theme: "light" },
	{ id: "about", label: "About", icon: <FiUser size={16} />, theme: "light" },
	{
		id: "education",
		label: "Education",
		icon: <FiBookOpen size={16} />,
		theme: "light",
	},
	{
		id: "skills",
		label: "Skills",
		icon: <FiZap size={16} />,
		theme: "dark",
	},
	{
		id: "projects",
		label: "Projects",
		icon: <FiCode size={16} />,
		theme: "dark",
	},
	{
		id: "contact",
		label: "Contact",
		icon: <FiMail size={16} />,
		theme: "dark",
	},
];

export default function FloatingNavbar() {
	const containerRef = useRef(null);
	const pillsRef = useRef([]);
	const circleRef = useRef(null);
	const lenis = useLenis();
	const { mode, setMode } = useCursor();

	const [open, setOpen] = useState(false);
	const [hidden, setHidden] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	// --- Hide on scroll down, show on scroll up ---
	useEffect(() => {
		if (!lenis) return;

		let lastY = window.scrollY;
		const onScroll = ({ scroll }) => {
			// Ignore micro scrolls
			if (Math.abs(scroll - lastY) < 4) return;

			if (scroll > lastY && scroll > 120) {
				setHidden(true);
				// Close the panel if we hide
				setOpen(false);
			} else if (scroll < lastY) {
				setHidden(false);
			}
			lastY = scroll;
		};

		lenis.on("scroll", onScroll);
		return () => lenis.off("scroll", onScroll);
	}, [lenis]);

	// --- Close on outside click / Escape ---
	useEffect(() => {
		if (!open) return;

		const onKey = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		const onClick = (e) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target)
			) {
				setOpen(false);
			}
		};

		window.addEventListener("keydown", onKey);
		window.addEventListener("mousedown", onClick);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("mousedown", onClick);
		};
	}, [open]);

	// --- Animate pills in/out when open toggles ---
	useLayoutEffect(() => {
		const pills = pillsRef.current.filter(Boolean);
		if (!pills.length) return;

		const ctx = gsap.context(() => {
			if (open) {
				gsap.fromTo(
					pills,
					{ opacity: 0, y: 24, scale: 0.8 },
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 0.45,
						ease: "back.out(1.6)",
						stagger: 0.055,
					},
				);
			} else {
				gsap.to(pills, {
					opacity: 0,
					y: 20,
					scale: 0.85,
					duration: 0.25,
					ease: "power2.in",
					stagger: { each: 0.03, from: "end" },
				});
			}
		});

		return () => ctx.revert();
	}, [open]);

	// --- Circle reveal transition ---
	const handleNavigate = (e, section) => {
		if (isAnimating) return;

		const clickX = e.clientX;
		const clickY = e.clientY;

		setIsAnimating(true);
		setOpen(false);

		// Circle's diameter must cover the farthest corner from click point
		const maxDist = Math.max(
			Math.hypot(clickX, clickY),
			Math.hypot(window.innerWidth - clickX, clickY),
			Math.hypot(clickX, window.innerHeight - clickY),
			Math.hypot(window.innerWidth - clickX, window.innerHeight - clickY),
		);
		const diameter = maxDist * 2;

		// Circle color = INVERSE of the mode we're in right now
		// (light mode → dark circle, dark mode → light circle)
		const circleColor = mode === "light" ? "#030407" : "#f2efbb";

		const circle = circleRef.current;
		if (!circle) {
			setIsAnimating(false);
			return;
		}

		// Position and size the circle at the click point
		gsap.set(circle, {
			left: clickX,
			top: clickY,
			width: diameter,
			height: diameter,
			xPercent: -50,
			yPercent: -50,
			scale: 0,
			opacity: 1,
			backgroundColor: circleColor,
			display: "block",
		});

		const tl = gsap.timeline({
			onComplete: () => {
				gsap.set(circle, { display: "none" });
				setIsAnimating(false);
			},
		});

		// 1. Expand
		tl.to(circle, {
			scale: 1,
			duration: 0.75,
			ease: "power2.inOut",
		});

		// 2. Once fully covering the screen, do the scroll
		tl.add(() => {
			// Jump instantly behind the circle
			const target = document.getElementById(section.id);
			if (target && lenis) {
				lenis.scrollTo(target, { immediate: true, force: true });
			} else if (target) {
				window.scrollTo({ top: target.offsetTop, behavior: "auto" });
			}

			// Sync the cursor mode with the destination theme
			setMode(section.theme);
		});

		// 3. Small hold so the destination paints
		tl.to({}, { duration: 0.15 });

		// 4. Fade out to reveal destination
		tl.to(circle, {
			opacity: 0,
			duration: 0.55,
			ease: "power2.out",
		});
	};

	return (
		<>
			{/* ---- Reveal circle (portal) ---- */}
			<div
				ref={circleRef}
				className="floating-nav-circle"
				aria-hidden="true"
				style={{ display: "none" }}
			/>

			{/* ---- Floating navbar ---- */}
			<div
				ref={containerRef}
				className={`floating-nav ${hidden ? "is-hidden" : ""} ${
					open ? "is-open" : ""
				}`}
			>
				{/* Pills column */}
				<div className="floating-nav-pills">
					{SECTIONS.map((s, i) => (
						<button
							key={s.id}
							ref={(el) => (pillsRef.current[i] = el)}
							onClick={(e) => handleNavigate(e, s)}
							className="floating-nav-pill"
							style={{ "--pill-delay": `${i * 0.05}s` }}
							aria-label={`Go to ${s.label}`}
						>
							<span className="pill-icon">{s.icon}</span>
							<span className="pill-label">{s.label}</span>
						</button>
					))}
				</div>

				{/* Trigger button */}
				<button
					onClick={() => setOpen((o) => !o)}
					className="floating-nav-trigger"
					aria-label="Toggle navigation"
					aria-expanded={open}
				>
					<span className="trigger-mark">
						<span className="trigger-bar" />
						<span className="trigger-bar" />
						<span className="trigger-bar" />
					</span>
				</button>
			</div>
		</>
	);
}
