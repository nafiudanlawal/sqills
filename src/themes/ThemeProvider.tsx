import { useMemo, useState, type ReactNode } from "react"
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import palettes from "./palettes";
import spacing from "./spacing";
import { ThemeContext } from "./context";
import type { mode } from "./types";



export default function ThemeProvider({ children }: { children: ReactNode }) {
	const [mode, setMode] = useState<mode>("light");

	const changeMode = (mode: mode) => {
		setMode(mode);
	}
	const memoizedValue = useMemo(() => ({
		palette: {
			mode,
			...palettes,
		},
		spacing
	}), [mode]);

	const theme = createTheme(memoizedValue);

	return (
		<ThemeContext value={{ mode, changeMode }}>
			<MUIThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MUIThemeProvider>
		</ThemeContext>
		
	)
}

