import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/svelte-vite';
import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mergeConfig } from 'vite';

const srcLib = fileURLToPath(new URL('../src/lib', import.meta.url));

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|ts|svelte)'],
	addons: ['@storybook/addon-svelte-csf', '@storybook/addon-a11y', '@storybook/addon-themes'],
	framework: { name: '@storybook/svelte-vite', options: {} },
	async viteFinal(config) {
		return mergeConfig(config, {
			plugins: [svelte(), tailwindcss()],
			resolve: {
				alias: {
					$lib: srcLib
				}
			}
		});
	}
};
export default config;
