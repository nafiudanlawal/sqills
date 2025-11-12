import { createTheme, ThemeProvider } from '@mui/material';
import type { Preview } from '@storybook/react-vite'

import palettes from "../src/themes/palettes"
import spacing from "../src/themes/spacing"

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
    }
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
        icon: "mirror",
        items: ["light", "dark"],
        dynamic: true,
      }
    }
  }
};

export default preview;