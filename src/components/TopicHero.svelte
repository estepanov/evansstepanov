<script lang="ts">
	import TechBackdrop from './TechBackdrop.svelte';

	export let tags: string[] = [];
</script>

<section
	class="topic-hero tech-hero relative w-full rounded-2xl border border-slate-500/20 dark:border-slate-800/80 overflow-hidden mb-20"
>
	<TechBackdrop {tags} rows={6} cols={8} size={48} />
	<div class="relative z-10 px-6 md:px-10 py-10 md:py-14 flex flex-col gap-8">
		<slot />
	</div>
</section>

<style>
	.topic-hero {
		isolation: isolate;
		background:
			radial-gradient(120% 80% at 100% 0%, rgba(168, 85, 247, 0.06) 0%, transparent 55%),
			radial-gradient(90% 70% at 0% 100%, rgba(16, 185, 129, 0.05) 0%, transparent 60%);
		opacity: 0;
		transform: translateY(8px);
		animation: hero-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
		transition:
			transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 700ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	:global(html.dark) .topic-hero {
		background:
			radial-gradient(120% 80% at 100% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 55%),
			radial-gradient(90% 70% at 0% 100%, rgba(16, 185, 129, 0.08) 0%, transparent 60%);
	}

	.topic-hero:hover {
		transform: translateY(-2px);
		box-shadow:
			0 1px 0 rgba(15, 23, 42, 0.02),
			0 24px 48px -28px rgba(15, 23, 42, 0.25);
	}

	:global(html.dark) .topic-hero:hover {
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.02),
			0 24px 48px -28px rgba(0, 0, 0, 0.7);
	}

	.topic-hero :global(.hero-icon) {
		transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.topic-hero:hover :global(.hero-icon) {
		transform: translateY(-2px) rotate(-3deg);
	}

	@keyframes hero-in {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.topic-hero,
		.topic-hero :global(.hero-icon) {
			transition: none;
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
</style>
