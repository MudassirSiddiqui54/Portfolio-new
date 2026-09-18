import { io } from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	FiMail,
	FiLinkedin,
	FiGithub,
	FiInstagram,
	FiMessageCircle,
	FiArrowRight,
	FiCheck,
} from "react-icons/fi";
import SignalWire from "../../components/ui/SignalWire";
import ScrollArrowText from "../../components/ScrollArrowText";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
	{
		icon: <FiMail size={18} />,
		label: "Email",
		sub: "mudassirsid54@gmail.com",
		href: "https://mail.google.com/mail/?view=cm&to=mudassirsid54@gmail.com&su=Hello%20Mudassir",
	},
	{
		icon: <FiLinkedin size={18} />,
		label: "LinkedIn",
		sub: "mudassir-siddiqui",
		href: "https://www.linkedin.com/in/mudassir-siddiqui-9a3b37256/",
	},
	{
		icon: <FiGithub size={18} />,
		label: "GitHub",
		sub: "MudassirSiddiqui54",
		href: "https://github.com/MudassirSiddiqui54",
	},
	{
		icon: <FiInstagram size={18} />,
		label: "Instagram",
		sub: "@mudassir_sid2006",
		href: "https://www.instagram.com/mudassir_sid2006/",
	},
	{
		icon: <FiMessageCircle size={18} />,
		label: "WhatsApp",
		sub: "+91 98672 10504",
		href: "https://wa.me/919867210504?text=Hii",
	},
];
const SOCKET_URL = import.meta.env.VITE_SOCIAL_SOCKET_URL;

export default function Contact() {
	const sectionRef = useRef(null);
	const formColRef = useRef(null);
	const linksColRef = useRef(null);
	const [sent, setSent] = useState(false);
	const [status, setStatus] = useState("idle");

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(
				formColRef.current,
				{ opacity: 0, x: -50 },
				{
					opacity: 1,
					x: 0,
					duration: 1,
					ease: "power3.out",
					scrollTrigger: {
						trigger: sectionRef.current,
						start: "top 70%",
						toggleActions: "play none none reverse",
					},
				},
			);

			gsap.fromTo(
				linksColRef.current,
				{ opacity: 0, x: 50 },
				{
					opacity: 1,
					x: 0,
					duration: 1,
					ease: "power3.out",
					scrollTrigger: {
						trigger: sectionRef.current,
						start: "top 70%",
						toggleActions: "play none none reverse",
					},
				},
			);
		}, sectionRef);

		// Recompute every ScrollTrigger position now that the Contact
		// section (and everything above it) is fully laid out.
		const t1 = setTimeout(() => ScrollTrigger.refresh(), 100);
		const t2 = setTimeout(() => ScrollTrigger.refresh(), 700);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			ctx.revert();
		};
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		const form = e.currentTarget;
		const formData = new FormData(form);

		setStatus("sending");

		const socket = io(SOCKET_URL, {
			transports: ["websocket", "polling"],
		});

		socket.on("connect", () => {
			socket.emit(
				"portfolio:message",
				{
					name: formData.get("name"),
					email: formData.get("email"),
					message: formData.get("message"),
				},
				(result) => {
					socket.disconnect();

					if (!result?.ok) {
						console.error(result?.message);
						setStatus("error");
						return;
					}

					form.reset();
					setStatus("sent");

					setTimeout(() => {
						setStatus("idle");
					}, 2400);
				},
			);
		});

		socket.on("connect_error", (error) => {
			console.error("Socket connection failed:", error);

			socket.disconnect();
			setStatus("error");
		});
	};

	return (
		<section id="contact" ref={sectionRef} className="contact-section">
			<div className="contact-inner">
				<div className="contact-heading">
					<ScrollArrowText
						text="CONTACT"
						staggerAmount={0.07}
						duration={1.1}
						color="#ffffff"
						useRawScroll
						rawStart={0.9} // starts when heading top is at 90% of viewport
						rawEnd={0.25} // fully animated when heading top reaches 25%
					/>
				</div>

				<div className="contact-grid">
					{/* LEFT — Form */}
					<div
						ref={formColRef}
						className="contact-col contact-form-col"
					>
						<p className="contact-eyebrow">Send a message</p>

						<form onSubmit={handleSubmit} className="contact-form">
							<div className="form-field">
								<label htmlFor="name">Name</label>
								<input
									id="name"
									type="text"
									name="name"
									placeholder="Your name"
									required
									autoComplete="name"
								/>
							</div>

							<div className="form-field">
								<label htmlFor="email">Email</label>
								<input
									id="email"
									type="email"
									name="email"
									placeholder="you@example.com"
									required
									autoComplete="email"
								/>
							</div>

							<div className="form-field">
								<label htmlFor="message">Message</label>
								<textarea
									id="message"
									name="message"
									placeholder="Tell me about your project..."
									rows={4}
									required
								/>
							</div>

							<button
								type="submit"
								className={`form-submit ${status === "sent" ? "sent" : ""}`}
								disabled={
									status === "sending" || status === "sent"
								}
							>
								{status === "sending" ? (
									<>
										<span>Sending...</span>
									</>
								) : status === "sent" ? (
									<>
										<FiCheck size={14} />
										<span>Message Sent</span>
									</>
								) : status === "error" ? (
									<>
										<span>Try Again</span>
										<FiArrowRight size={14} />
									</>
								) : (
									<>
										<span>Send Message</span>
										<FiArrowRight size={14} />
									</>
								)}
							</button>
						</form>
					</div>

					{/* CENTER — Vertical Signal Wire (desktop) */}
					<div className="contact-divider contact-divider--v">
						<SignalWire
							lineCount={3}
							color="#6b5cff"
							secondaryColor="#00f5ff"
						/>
					</div>

					{/* RIGHT — Links */}
					<div
						ref={linksColRef}
						className="contact-col contact-links-col"
					>
						<p className="contact-eyebrow">Or reach out directly</p>

						<div className="contact-links">
							{LINKS.map((link, i) => (
								<a
									key={i}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className="contact-link"
								>
									<span className="link-icon">
										{link.icon}
									</span>
									<div className="link-text">
										<span className="link-label">
											{link.label}
										</span>
										<span className="link-sub">
											{link.sub}
										</span>
									</div>
									<FiArrowRight
										size={14}
										className="link-arrow"
									/>
								</a>
							))}
						</div>
					</div>

					{/* Horizontal Signal Wire (mobile) */}
					<div className="contact-divider contact-divider--h">
						<SignalWire
							orientation="horizontal"
							lineCount={2}
							color="#6b5cff"
							secondaryColor="#00f5ff"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
