import { useColorScheme } from "@mui/material";


type modeTypes = "dark" | "light" | "system";

export default function useThemeMode(mode: modeTypes) {
	const { setMode } = useColorScheme();
	setMode(mode);
}