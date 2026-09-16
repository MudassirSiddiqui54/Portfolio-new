import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function RevealText({ children, className = "" }) {
	const ref = useRef(null);

	useGSAP(
		() => {
			const words = ref.current.querySelectorAll(".reveal-word");

			gsap.fromTo(
				words,
				{ yPercent: 120, opacity: 0 },
				{
					yPercent: 0,
					opacity: 1,
					duration: 1,
					ease: "power3.out",
					stagger: 0.025,
					scrollTrigger: {
						trigger: ref.current,
						start: "top 85%",
						end: "bottom 50%",
						scrub: 1,
					},
				},
			);
		},
		{ scope: ref },
	); // The scope option ensures the selectors only look inside the ref

	return (
		<p ref={ref} className={className}>
			{children.split(" ").map((word, i) => (
				<span
					key={i}
					className="inline-block overflow-hidden mr-[0.28em] pb-[0.15em] -mb-[0.15em]"
				>
					<span className="reveal-word inline-block will-change-transform">
						{word}
					</span>
				</span>
			))}
		</p>
	);
}
