import { createContext } from "react";
import type { contextProps } from "./types";



export const ThemeContext = createContext<contextProps>({
	mode: "dark",
	changeMode: () => {}
});