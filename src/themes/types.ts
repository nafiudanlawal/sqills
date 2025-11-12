export type mode = "light" | "dark";
export type contextProps = {
	mode: mode,
	changeMode: (mode: mode) => void
}