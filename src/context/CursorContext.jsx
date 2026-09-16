import { createContext, useContext, useState, useLayoutEffect } from "react";

const CursorContext = createContext({
	mode: "light",
	setMode: () => {},
});

export function CursorProvider({ children }) {
	const [mode, setMode] = useState("light");

	// Sync theme to the body so CSS can react
	useLayoutEffect(() => {
		document.body.setAttribute("data-theme", mode);
		document.documentElement.setAttribute("data-theme", mode);
	}, [mode]);

	return (
		<CursorContext.Provider value={{ mode, setMode }}>
			{children}
		</CursorContext.Provider>
	);
}

export function useCursor() {
	return useContext(CursorContext);
}
