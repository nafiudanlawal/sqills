import { useMemo, useState, type ReactNode } from "react"
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline, FormControlLabel, Switch } from "@mui/material";
import palettes from "./palettes";
import spacing from "./spacing";

type mode = "light" | "dark";

export default function ThemeProvider({ children }: { children: ReactNode }) {
	const [mode, setMode] = useState<mode>("light");
	const memoizedValue = useMemo(() => ({
		palette: {
			mode,
			...palettes,
		},
		spacing
	}), [mode]);


	const theme = createTheme(memoizedValue);

	return (
		<MUIThemeProvider theme={theme}>
			<CssBaseline />
			<FormControlLabel label="Theme Mode" control={<Switch value={mode == "light"} onChange={evt => setMode(evt.target.checked ? "dark": "light")} />} />
			{children}
		</MUIThemeProvider>
	)
}

