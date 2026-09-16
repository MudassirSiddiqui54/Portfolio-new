import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollArrowText({
	text = "MALAYALAM",
	staggerAmount = 0.1,
	duration = 1,
	ease = "power3.out",
	triggerStart = "top 80%",
	triggerEnd = "bottom 40%",
	color = "#111827",
	triggerRef,
	/* NEW: bypass ScrollTrigger and use raw scroll-driven progress.
	   Use this for sections that sit below a pinned section. */
	useRawScroll = false,
	/* Progress window: how much of the viewport bottom → top the
	   animation spans. 0.85 = starts when heading top is at 85% of
	   viewport height, ends when heading top reaches 15%. */
	rawStart = 0.85,
	rawEnd = 0.15,
}) {
	const containerRef = useRef(null);
	const charsRef = useRef([]);
	const chars = text.split("");

	useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			const charElements = charsRef.current.filter(Boolean);
			if (!charElements.length) return;

			const tween = gsap.fromTo(
				charElements,
				{ y: -250, opacity: 0, rotateX: -60 },
				{
					y: 0,
					opacity: 1,
					rotateX: 0,
					duration,
					ease,
					stagger: { each: staggerAmount, from: "center" },
					paused: true,
				},
			);

			if (useRawScroll) {
				// ---- RAW SCROLL MODE ----
				// Drives tween.progress() from the container's real
				// position in the viewport. Completely immune to
				// pinned-section offsets.
				const container = containerRef.current;
				let raf = 0;
				let active = false;

				const computeProgress = () => {
					if (!container) return 0;
					const rect = container.getBoundingClientRect();
					const vh = window.innerHeight;
					const topFrac = rect.top / vh; // 1 = bottom, 0 = top
					// Map [rawStart → rawEnd] → [0 → 1]
					const p = (rawStart - topFrac) / (rawStart - rawEnd);
					return Math.max(0, Math.min(1, p));
				};

				const update = () => {
					raf = 0;
					if (!active) return;
					tween.progress(computeProgress());
				};

				const onScroll = () => {
					if (raf) return;
					raf = requestAnimationFrame(update);
				};

				const observer = new IntersectionObserver(
					([entry]) => {
						active = entry.isIntersecting;
						if (active) {
							// Immediately sync to current position
							tween.progress(computeProgress());
							onScroll();
						}
					},
					{ threshold: 0, rootMargin: "20% 0px 20% 0px" },
				);
				observer.observe(container);

				window.addEventListener("scroll", onScroll, { passive: true });
				window.addEventListener("resize", onScroll, { passive: true });
				// Initial paint
				onScroll();

				return () => {
					observer.disconnect();
					window.removeEventListener("scroll", onScroll);
					window.removeEventListener("resize", onScroll);
					if (raf) cancelAnimationFrame(raf);
				};
			}

			// ---- ORIGINAL SCROLLTRIGGER MODE ----
			tween.play();
			gsap.set(tween, { paused: false });

			gsap.to(charElements, {
				keyframes: undefined,
			}); // no-op; keep API symmetric

			ScrollTrigger.create({
				trigger: triggerRef?.current ?? containerRef.current,
				start: triggerStart,
				end: triggerEnd,
				scrub: 1,
				animation: tween,
			});
		}, containerRef);

		return () => ctx.revert();
	}, [
		text,
		staggerAmount,
		duration,
		ease,
		triggerStart,
		triggerEnd,
		triggerRef,
		useRawScroll,
		rawStart,
		rawEnd,
	]);

	return (
		<div
			ref={containerRef}
			className="scroll-arrow-text-wrapper"
			aria-label={text}
		>
			{chars.map((char, index) => (
				<span
					key={index}
					ref={(el) => (charsRef.current[index] = el)}
					className="scroll-arrow-char"
					style={{ color }}
					aria-hidden="true"
				>
					{char === " " ? "\u00A0" : char}
				</span>
			))}
		</div>
	);
}
