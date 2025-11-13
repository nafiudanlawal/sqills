import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import type { Preview } from '@storybook/react-vite';

import { palettes, spacing } from "../src/themes";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },
  },
  decorators: [
    (Story, context) => {
      const { scheme } = context.globals;
      const theme = createTheme({
        palette: {
          mode: scheme,
          ...palettes,
        },
        spacing
      })

      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      )
    }
  ],
  globalTypes: {
    scheme: {
      name: "Scheme",
      description: "Select light mode or dark mode",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [{ value: "light", icon: "sun", title: "Light mode" }, { value: "dark", icon: "moon", title: "Dark Mode" }],
        dynamic: true,
      }
    }
  },
  initialGlobals: {
    scheme: 'light',
  },
};

export default preview;