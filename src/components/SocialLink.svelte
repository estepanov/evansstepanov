<script lang="ts">
	import { SiGithub } from '@icons-pack/svelte-simple-icons';
	import { LinkedinIcon } from '@lucide/svelte';
	import * as Fathom from 'fathom-client';

	export let link: { title: string; url: string };

	const isGithub = link.url?.includes('github.com');
	const isLinkedin = link.url?.includes('linkedin.com');

	const handleClick = () => {
		Fathom.trackEvent(`click_main_link-${link.title}`);
	};
</script>

<a
	target="_blank"
	rel="noopener noreferrer"
	on:click={handleClick}
	class="group relative inline-flex items-center justify-center rounded-lg px-6 py-3 text-xs sm:text-sm font-medium uppercase tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 bg-slate-200/50 dark:bg-slate-800/40 border border-slate-300/70 dark:border-slate-700/50 hover:bg-slate-300/40 dark:hover:bg-slate-700/30 hover:border-slate-400/50 dark:hover:border-slate-600/70 focus:ring-emerald-500/50 dark:focus:ring-emerald-400/50 hover:shadow-sm hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 overflow-hidden scale-100 hover:scale-105 drop-shadow-none hover:drop-shadow-md"
	href={link.url}
>
	<div
		class="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-slate-300/10 opacity-0 transition-opacity duration-300 group-hover:opacity-90 animate-scroll-gradient"
	></div>

	{#if isGithub}
		<span class="relative z-10 mr-2 flex h-4 w-4 items-center justify-center text-slate-600 dark:text-slate-400 transition-colors duration-200 group-hover:text-slate-700 dark:group-hover:text-slate-300">
			<SiGithub size={16} />
		</span>
	{/if}

	{#if isLinkedin}
		<span class="relative z-10 mr-2 flex h-4 w-4 items-center justify-center text-slate-600 dark:text-slate-400 transition-colors duration-200 group-hover:text-slate-700 dark:group-hover:text-slate-300">
			<LinkedinIcon class="h-4 w-4" />
		</span>
	{/if}

	<span class="relative z-10 text-slate-700 dark:text-slate-300 transition-colors duration-200 group-hover:text-slate-800 dark:group-hover:text-slate-200">
		{link.title}
	</span>
</a>

<style>
	a:focus-visible {
		outline: 2px solid theme('colors.emerald.500');
		outline-offset: 2px;
	}

	a {
		will-change: box-shadow, background-color, border-color, drop-shadow;
	}

	@keyframes scroll-gradient {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.animate-scroll-gradient {
		animation: scroll-gradient 2s ease-in-out infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		a {
			transition: none;
		}
		
		.animate-scroll-gradient {
			animation: none;
		}
	}
</style>
