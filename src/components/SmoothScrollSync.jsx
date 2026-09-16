// components/SmoothScrollSync.jsx
import { useEffect } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScrollSync() {
	const lenis = useLenis();

	useEffect(() => {
		if (!lenis) return;

		// 1. Sync Lenis scroll with ScrollTrigger
		lenis.on("scroll", ScrollTrigger.update);

		// 2. Add Lenis's rAF to GSAP's ticker
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000); // GSAP's ticker gives time in seconds, Lenis needs ms
		});

		gsap.ticker.lagSmoothing(0);

		return () => {
			gsap.ticker.remove(lenis.raf);
		};
	}, [lenis]);

	return null;
}
