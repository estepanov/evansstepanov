import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
	{
		ignores: [
			'.DS_Store',
			'node_modules/**',
			'build/**',
			'.svelte-kit/**',
			'package/**',
			'storybook-static/**',
			'*storybook.log',
			'.env',
			'.env.*',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock',
			// Agent harness & skill install artifacts
			'.agents/**',
			'.claude/**',
			'.codex/**',
			'.cursor/**',
			'.opencode/**',
			'.pi/**',
			// Scratch & worktree output
			'.playwright-mcp/**',
			'.worktrees/**'
		]
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2017
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser
			}
		}
	},
	{
		// runes modules (.svelte.ts/.svelte.js) are plain TS/JS, not components
		files: ['**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parser: tseslint.parser
		}
	}
);
