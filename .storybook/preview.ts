import type { Preview } from '@storybook/sveltekit';
import { withThemeByClassName } from '@storybook/addon-themes';

// Supplies Tailwind, the `dark` custom variant, --font-sans, the .card layer,
// and the body gradient. Components style off `html.dark`, so this import and
// the decorator below are both required for anything to look correct.
import '../src/app.css';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: { color: /(background|color)$/i, date: /Date$/i }
		},
		// app.css paints the body gradient; the backgrounds addon would cover it.
		backgrounds: { disable: true }
	},
	decorators: [
		withThemeByClassName({
			themes: { light: '', dark: 'dark' },
			defaultTheme: 'light'
		})
	]
};

export default preview;
