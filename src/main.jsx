import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const BACKEND_URL = import.meta.env.VITE_SOCIAL_SOCKET_URL;

if (BACKEND_URL) {
	fetch(`${BACKEND_URL}/api/health`, {
		method: "GET",
		cache: "no-store",
		mode: "no-cors",
	}).catch(() => {});
}
const animateLoaderFill = (loaderName) => {
	return new Promise((resolve) => {
		// Force the browser to recognize the initial 0% state
		loaderName.style.backgroundSize = "100% 0%";

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				loaderName.style.backgroundSize = "100% 100%";

				setTimeout(resolve, 1400);
			});
		});
	});
};

const revealPortfolio = async () => {
	const loader = document.getElementById("initial-loader");
	const app = document.getElementById("portfolio-app");
	const loaderName = loader?.querySelector(".loader-name");

	if (!loader || !app || !loaderName) return;

	await animateLoaderFill(loaderName);

	app.style.transition = "opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1)";

	app.style.opacity = "1";
	app.style.visibility = "visible";

	loader.classList.add("is-hidden");

	document.body.style.overflow = "";

	setTimeout(() => {
		loader.remove();
	}, 900);
};

window.addEventListener("portfolio:heavy-ready", revealPortfolio, {
	once: true,
});

createRoot(document.getElementById("root")).render(<App />);
