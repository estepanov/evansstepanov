<script lang="ts">
	import { ArrowUpRight, Globe2, LinkedinIcon, Mail } from '@lucide/svelte';
	import {
		SiBehance,
		SiBluesky,
		SiCalendly,
		SiCodepen,
		SiDevdotto,
		SiDiscord,
		SiDribbble,
		SiFigma,
		SiGithub,
		SiInstagram,
		SiMastodon,
		SiMedium,
		SiNotion,
		SiNpm,
		SiProducthunt,
		SiSlack,
		SiStackoverflow,
		SiSubstack,
		SiThreads,
		SiTwitch,
		SiX,
		SiYoutube
	} from '@icons-pack/svelte-simple-icons';
	import * as Fathom from 'fathom-client';
	import type { ExternalLink, ExternalLinkKind } from '../../util/links';

	export let link: ExternalLink;

	$: target = link.kind === 'email' ? undefined : '_blank';
	$: rel = target ? 'noopener noreferrer' : undefined;
	$: logoIcon = logoIcons[link.kind];
	$: normalizedLinkText = `${link.kind} ${link.url} ${link.title}`.toLowerCase();
	$: isGithub = normalizedLinkText.includes('github');
	$: isLinkedin = normalizedLinkText.includes('linkedin');

	const handleClick = () => {
		Fathom.trackEvent(`click_main_link-${link.title}`);
	};

	function handleGlowMove(event: PointerEvent) {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		target.style.setProperty('--link-glow-x', `${x}%`);
		target.style.setProperty('--link-glow-y', `${y}%`);
	}

	function handleGlowLeave(event: PointerEvent) {
		const target = event.currentTarget as HTMLElement;
		target.style.removeProperty('--link-glow-x');
		target.style.removeProperty('--link-glow-y');
	}

	const logoIcons: Partial<Record<ExternalLinkKind, any>> = {
		behance: SiBehance,
		bluesky: SiBluesky,
		calendly: SiCalendly,
		codepen: SiCodepen,
		devto: SiDevdotto,
		discord: SiDiscord,
		dribbble: SiDribbble,
		figma: SiFigma,
		github: SiGithub,
		instagram: SiInstagram,
		mastodon: SiMastodon,
		medium: SiMedium,
		notion: SiNotion,
		npm: SiNpm,
		producthunt: SiProducthunt,
		slack: SiSlack,
		stackoverflow: SiStackoverflow,
		substack: SiSubstack,
		threads: SiThreads,
		twitch: SiTwitch,
		x: SiX,
		youtube: SiYoutube
	};
</script>

<a
	href={link.url}
	{target}
	{rel}
	on:click={handleClick}
	on:pointerenter={handleGlowMove}
	on:pointermove={handleGlowMove}
	on:pointerleave={handleGlowLeave}
	class="card card--interactive link-card group grid min-h-14 grid-cols-[2rem_1fr_auto] items-center gap-3 px-4 py-3 text-left"
	aria-label="Open {link.title}"
>
	<span
		class="flex h-8 w-8 items-center justify-center rounded-md bg-slate-50 text-slate-500 transition-colors duration-200 group-hover:text-emerald-700 dark:bg-slate-950/40 dark:text-slate-400 dark:group-hover:text-emerald-300"
		aria-hidden="true"
	>
		{#if isGithub}
			<SiGithub size={18} />
		{:else if isLinkedin}
			<LinkedinIcon class="h-[18px] w-[18px]" />
		{:else if link.kind === 'email'}
			<Mail class="h-[18px] w-[18px]" />
		{:else if logoIcon}
			<svelte:component this={logoIcon} size={18} />
		{:else}
			<Globe2 class="h-[18px] w-[18px]" />
		{/if}
	</span>

	<span class="min-w-0">
		<span
			class="block truncate text-sm font-semibold text-slate-800 transition-colors duration-200 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-300"
		>
			{link.title}
		</span>
	</span>

	<ArrowUpRight
		class="link-card__arrow h-4 w-4 text-slate-400 transition-[color,transform] duration-200 group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-emerald-300"
		aria-hidden="true"
	/>
</a>

<style>
	.link-card {
		--link-glow-x: 88%;
		--link-glow-y: 14%;
		position: relative;
		overflow: hidden;
	}

	.link-card::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		border-radius: inherit;
		pointer-events: none;
			background:
				radial-gradient(
					15rem circle at var(--link-glow-x) var(--link-glow-y),
					rgba(168, 85, 247, 0.12) 0%,
					rgba(168, 85, 247, 0.08) 42%,
					rgba(168, 85, 247, 0.03) 68%,
					transparent 88%
				),
			radial-gradient(115% 90% at 100% 0%, rgba(168, 85, 247, 0.08) 0%, transparent 58%),
			radial-gradient(92% 78% at 0% 100%, rgba(16, 185, 129, 0.07) 0%, transparent 64%);
		opacity: 0;
		transition: opacity 360ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	:global(html.dark) .link-card::before {
			background:
				radial-gradient(
					15rem circle at var(--link-glow-x) var(--link-glow-y),
					rgba(168, 85, 247, 0.16) 0%,
					rgba(168, 85, 247, 0.1) 42%,
					rgba(168, 85, 247, 0.04) 68%,
					transparent 88%
				),
			radial-gradient(115% 90% at 100% 0%, rgba(168, 85, 247, 0.12) 0%, transparent 58%),
			radial-gradient(92% 78% at 0% 100%, rgba(16, 185, 129, 0.1) 0%, transparent 64%);
	}

	.link-card:hover::before,
	.link-card:focus-visible::before {
		opacity: 1;
	}

	:global(html.dark) .link-card:hover::before,
	:global(html.dark) .link-card:focus-visible::before {
		opacity: 0.9;
	}

	.link-card > :global(*) {
		position: relative;
		z-index: 1;
	}

	.link-card :global(.link-card__arrow) {
		transition:
			color 200ms ease,
			transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.link-card:hover :global(.link-card__arrow),
	.link-card:focus-visible :global(.link-card__arrow) {
		transform: translate(2px, -2px);
	}

	@media (prefers-reduced-motion: reduce) {
		.link-card::before {
			transition: none;
		}

		.link-card :global(.link-card__arrow) {
			transition: color 200ms ease;
		}
		.link-card:hover :global(.link-card__arrow),
		.link-card:focus-visible :global(.link-card__arrow) {
			transform: none;
		}
	}
</style>
