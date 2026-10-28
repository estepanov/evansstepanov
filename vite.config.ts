import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
} as Parameters<typeof defineConfig>[0] & { test: { include: string[] } });
