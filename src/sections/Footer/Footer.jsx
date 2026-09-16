import { FiGithub, FiLinkedin, FiInstagram } from "react-icons/fi";
import FooterWordmark from "../../components/FooterWordmark";
import "./Footer.css";

const SOCIALS = [
	{
		icon: <FiGithub size={18} />,
		href: "https://github.com/MudassirSiddiqui54",
		label: "GitHub",
	},
	{
		icon: <FiLinkedin size={18} />,
		href: "https://www.linkedin.com/in/mudassir-siddiqui-9a3b37256/",
		label: "LinkedIn",
	},
	{
		icon: <FiInstagram size={18} />,
		href: "https://www.instagram.com/mudassir_sid2006/",
		label: "Instagram",
	},
];

export default function Footer() {
	return (
		<footer className="site-footer">
			{/* Gradient scrim so the wordmark has a soft "floor" */}
			<div className="footer-scrim" aria-hidden="true" />

			{/* Bottom bar */}
			<div className="footer-bar">
				<span className="footer-name">Mudassir Siddiqui</span>

				<span className="footer-copy">
					© {new Date().getFullYear()} · Built with React &amp; GSAP
				</span>

				<div className="footer-socials">
					{SOCIALS.map((s, i) => (
						<a
							key={i}
							href={s.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={s.label}
							className="footer-social-link"
						>
							{s.icon}
						</a>
					))}
				</div>
			</div>

			{/* Wordmark — dominant finale */}
			<div className="footer-wordmark-wrap">
				<FooterWordmark
					word="M U D A S S I R"
					fontFamily="'Zentry', 'Inter', system-ui, sans-serif"
					fontSize="clamp(5rem, 18vw, 20rem)"
					letterSpacing="-0.03em"
					lineHeight={0.85}
					color="#ffffff"
					strokeColor="#333444"
					strokeWidth="1.5px"
					glowColor="rgba(187, 170, 245,0.5)"
					glowSize={150}
					glowIntensity={0.2}
					lagDuration={0.8}
					margin="0"
					padding="0"
				/>
			</div>
		</footer>
	);
}
