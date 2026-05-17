<script lang="ts">
	import LogoIcon from './LogoIcon.svelte';

	export let slug: string | undefined = undefined;
</script>

<header class="tech-header w-full flex items-center gap-4">
	<a
		href="/"
		aria-label="Evans Stepanov — back to home"
		class="logo-link group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-900 transition-colors hover:text-emerald-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:text-slate-100 dark:hover:text-emerald-400"
	>
		<LogoIcon />
	</a>
	<nav
		aria-label="Breadcrumb"
		class="crumbs min-w-0 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
	>
		{#if slug}
			<a
				href="/tech"
				class="crumb-root transition-colors hover:text-slate-900 dark:hover:text-slate-100"
			>
				Tech
			</a>
			<span class="crumb-sep text-slate-300 dark:text-slate-700" aria-hidden="true">/</span>
			<span class="crumb-leaf truncate text-slate-700 dark:text-slate-300">{slug}</span>
		{:else}
			<span class="crumb-leaf text-slate-700 dark:text-slate-300">Tech</span>
		{/if}
	</nav>
</header>

<style>
	.tech-header {
		animation: header-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes header-in {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.crumb-sep,
	.crumb-leaf {
		display: inline-block;
		animation: crumb-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.crumb-sep {
		animation-delay: 0.08s;
	}

	.crumb-leaf {
		animation-delay: 0.14s;
	}

	@keyframes crumb-in {
		from {
			opacity: 0;
			transform: translateX(-6px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tech-header,
		.crumb-sep,
		.crumb-leaf {
			animation: none;
		}
	}
</style>
