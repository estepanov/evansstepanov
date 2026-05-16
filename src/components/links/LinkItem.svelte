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
		.link-card :global(.link-card__arrow) {
			transition: color 200ms ease;
		}
		.link-card:hover :global(.link-card__arrow),
		.link-card:focus-visible :global(.link-card__arrow) {
			transform: none;
		}
	}
</style>
