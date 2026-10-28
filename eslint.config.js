import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';

export default [
	{
		ignores: [
			'.DS_Store',
			'node_modules/**',
			'build/**',
			'dist/**',
			'.astro/**',
			'.svelte-kit/**',
			'package/**',
			'.env',
			'.env.*',
			'!.env.example',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock',
			'storybook-static/**',
			'*storybook.log',
			'.agents/**',
			'.claude/**',
			'.codex/**',
			'.cursor/**',
			'.impeccable/**',
			'.opencode/**',
			'.pi/**',
			'.worktrees/**'
		]
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		files: ['**/*.ts', '**/*.svelte'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2017
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.*'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			}
		}
	}
];
