<script lang="ts">
	import LogoIcon from './LogoIcon.svelte';

	export let title: string = '';
	export let eyebrow: string = '';
</script>

<header class="site-header flex items-center gap-4 mb-12">
	<a
		href="/"
		aria-label="Evans Stepanov — back to home"
		class="group inline-flex items-center justify-center h-10 w-10 flex-shrink-0 text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
	>
		<LogoIcon />
	</a>
	{#if title || eyebrow}
		<div class="min-w-0">
			{#if eyebrow}
				<p class="text-[10px] font-medium tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
					{eyebrow}
				</p>
			{/if}
			{#if title}
				<h1 class="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-tight truncate">
					{title}
				</h1>
			{/if}
		</div>
	{/if}
</header>
