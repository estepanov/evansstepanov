<script lang="ts">
	import Logo from '../components/Logo.svelte';
	import Link from '../components/Link.svelte';
	import * as Fathom from 'fathom-client';
	import Section from '../components/Section.svelte';
	import SpecialBadge from '../components/SpecialBadge.svelte';
	import { getFormattedDate } from '../util/dates';
	import MiniImageGallery from '../components/MiniImageGallery.svelte';
	import { idHash } from '../util/id-hash-link-format';
	import { getTechIcon } from '../util/tech-icons';
	import { GithubIcon, MousePointer, ShoppingCart } from '@lucide/svelte';
	import {
		SiReact,
		SiTypescript,
	} from '@icons-pack/svelte-simple-icons';
	import SpecialButton from '../components/SpecialButton.svelte';
	import SocialLink from '../components/SocialLink.svelte';

	export let data;

	let selectedProjectImage: string | null = null;
	const handleClick = (event: string | null) => {
		selectedProjectImage = event;
	};
</script>

<svelte:head>
	<title>Evans Stepanov</title>
</svelte:head>

<div class="flex justify-center items-center p-5 flex-col space-y-20 max-w-screen-md mx-auto mt-20">
	<div class="w-60 p-1"><Logo /></div>
	<main class="w-full space-y-12">
		<Section title="About me">
			<p class="leading-relaxed">
				<img
					src="/small.png"
					alt="me"
					class="profile-image opacity-80 grayscale ml-2 mb-2 w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 border-gray-300 dark:border-gray-700 float-right"
				/>
				I'm a
				<span class="font-bold text-purple-700 dark:text-purple-400"
					>product focused <span class="inline-block"><ShoppingCart size={16} /></span></span
				>
				software engineer with a passion for building scalable, high-performance
				<span class="font-bold text-purple-700 dark:text-purple-400"
					>web applications <span class="inline-block"><MousePointer size={16} /></span></span
				>. With experience at CLEAR, Amazon Web Services, and beyond, I've led major frontend and
				full-stack initiatives, from architecting frontend applications and optimizing legacy
				systems to enhancing accessibility and streamlining cloud infrastructure.
			</p>
			<p class="leading-relaxed">
				I primarily work in <span class="font-bold text-purple-700 dark:text-purple-400">
					TypeScript <span class="inline-block"><SiTypescript size={16} /></span>
				</span>
				and specialize in
				<span class="font-bold text-purple-700 dark:text-purple-400">
					React <span class="inline-block"><SiReact size={16} /></span>
				</span> with modern JavaScript tooling. I thrive on solving complex technical challenges with
				elegant, user-focused solutions.
			</p>
			<p class="leading-relaxed">
				When I'm not <code>coding</code>, you can find me
				<span class="font-bold text-emerald-700 dark:text-emerald-400">reading</span>
				📚,
				<span class="font-bold text-emerald-700 dark:text-emerald-400">skiing</span>
				⛷️, playing <span class="font-bold text-emerald-700 dark:text-emerald-400">Halo</span> 🎮,
				or
				<span class="font-bold text-emerald-700 dark:text-emerald-400">sleeping</span> 🛌.
			</p>
		</Section>
		<Section title="Links">
			<ul class="flex flex-row flex-wrap uppercase tracking-wide items-center space-x-6">
				{#each data.links as link, i}
					<li class="inline-flex">
						<SocialLink {link} />
					</li>
				{/each}
			</ul>
		</Section>
		<Section title="Work">
			<ul class="grid grid-cols-1 md:grid-cols-2 gap-10">
				{#each data.work as work}
					<li
						class={`transition-all ease-in p-6 rounded-xl flex flex-col ${
							work.isCurrent
								? `project-active-border`
								: `border border-slate-500/20 dark:border-slate-300/10`
						}`}
					>
						<h3 class="relative mb-4">
							<span class="w-full block font-bold">
								{work.title}
							</span>
							{#if work.url}
								<a
									target="_blank"
									rel="noopener"
									referrerpolicy="no-referrer"
									on:click={() => Fathom.trackEvent(`click_work_link-${work.title}`)}
									href={work.url}
									class="font-normal text-gray-700 dark:text-gray-300 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in opacity-70"
									>{work.companyName}</a
								>
							{:else}
								<span class="font-normal text-gray-700 dark:text-gray-300 opacity-70"
									>{work.companyName}</span
								>
							{/if}
						</h3>
						<p class="leading-tight dark:text-gray-200 text-gray-600">{work.description}</p>
						<div class="flex flex-grow"></div>
						<ul
							class="text-xs mt-4 flex flex-row space-x-4 dark:text-gray-300 text-gray-500 items-center"
						>
							{#if work.startDate}
								<li class="opacity-80">
									{getFormattedDate(work.startDate)}
									{#if work.endDate}
										<span class="mx-1">-</span>
										{getFormattedDate(work.endDate)}
									{/if}
								</li>
							{/if}
						</ul>
						{#if work.isCurrent}
							<span class="absolute -bottom-3 dark:bg-black bg-white rounded-full">
								<SpecialBadge className="-ml-2">Current</SpecialBadge>
							</span>
						{/if}
					</li>
				{/each}
			</ul>
		</Section>
		<Section title="Projects">
			<ul class="grid grid-cols-1 md:grid-cols-2 gap-10">
				{#each data.projects as project}
					<li
						id={idHash(project.name)}
						class={`transition-all ease-in-out p-6 rounded-xl flex flex-col ${
							project.isActive
								? `project-active-border`
								: `border border-slate-500/20 dark:border-slate-300/10`
						}`}
					>
						<div class="flex flex-row items-center mb-4 relative">
							<h3 class="font-bold flex justify-center items-center">
								{#if project.url}
									<a
										target="_blank"
										rel="noopener"
										referrerpolicy="no-referrer"
										on:click={() => Fathom.trackEvent(`click_project_link-${project.name}`)}
										href={project.url}
										class="text-gray-700 dark:text-gray-200 line-clamp-1 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
										>{project.name}</a
									>
								{:else}
									<span class="text-gray-700 dark:text-gray-200 line-clamp-1">{project.name}</span>
								{/if}
							</h3>
						</div>
						<p class="leading-tight dark:text-gray-200 text-gray-600 line-clamp-4">
							{project.description}
						</p>
						<div class="flex flex-grow"></div>
						<ul
							class="text-xs mt-4 flex flex-row space-x-4 dark:text-gray-300 text-gray-700 items-center"
						>
							{#if project.startDate}
								<li class="special opacity-80">
									{getFormattedDate(project.startDate)}
								</li>
							{/if}
							{#if project.source}
								<li class="special">
									<a
										target="_blank"
										rel="noopener"
										referrerpolicy="no-referrer"
										on:click={() => Fathom.trackEvent(`click_project_source-${project.name}`)}
										href={project.source}
										class="hover:underline-offset-4 capitalize flex flex-row justify-center items-center opacity-80 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
									>
										{#if project.source?.includes('github.com')}
											<GithubIcon class="h-3 w-3 mr-1" />
										{/if}
										{new URL(project.source).hostname.split('.')[0]}
									</a>
								</li>
							{/if}
							<!-- {#if project.media?.length > 0}
								<li class="special">
									<button
										on:click={() =>
											handleClick(project.name === selectedProjectImage ? null : project.name)}
										class="underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
									>
										{#if project.name === selectedProjectImage}
											close media
										{:else}
											media
										{/if}
									</button>
								</li>
							{/if} -->
						</ul>

						{#if project.isActive}
							<span class="absolute -bottom-3 dark:bg-black bg-white rounded-full">
								<SpecialBadge className="-ml-2">Active</SpecialBadge>
							</span>
						{/if}
						<!-- <MiniImageGallery
							isOpen={project.name === selectedProjectImage}
							images={project.media.map((img) => {
								return {
									url: img,
									alt: `Image of ${project.name}`
								};
							})}
						/> -->
					</li>
				{/each}
			</ul>
		</Section>
		<Section title="Tech">
			<p>
				Here are the technologies and tools I work with, organized by category. Choose any item to
				learn more about my experience with it.
			</p>
			{#each ['Runtime', 'Language', 'Framework', 'Library', 'Database', 'DevOps'] as techType}
				{@const techItems = data.tech.filter((tech) => tech.type === techType)}
				{#if techItems.length > 0}
					<div class="space-y-2">
						<h3 class="font-bold text-lg opacity-80">{techType}s</h3>
						<ul class="flex flex-row flex-wrap gap-2">
							{#each techItems as tech}
								{@const TechIcon = getTechIcon(tech.name)}
								<li>
									<a href="/tech/{tech.name}" class="block">
										<SpecialButton className="hover:scale-105 transition-transform duration-200">
											{#if TechIcon}
												<span class="mr-4">
													<svelte:component this={TechIcon} size={20} />
												</span>
											{/if}
											{tech.name}
										</SpecialButton>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			{/each}
		</Section>
	</main>
	<footer class="mt-10">
		<div class="my-5 text-xs text-gray-500 dark:text-gray-400 text-center">
			<span class="italic">“I have not failed. I've just found 10,000 ways that won't work.”</span> ―
			Thomas A. Edison
		</div>
	</footer>
</div>

<style>
	@property --bg-angle {
		inherits: false;
		initial-value: 0deg;
		syntax: '<angle>';
	}

	@keyframes spinnner {
		to {
			--bg-angle: 360deg;
		}
	}

	.project-active-border {
		position: relative;
		background: transparent;
		z-index: 0;
		border-radius: 0.75rem;
		padding: 1.5rem;
	}

	.project-active-border::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: -1;
		border-radius: inherit;
		border: 1px solid transparent;
		background:
			linear-gradient(
					to bottom,
					theme('colors.emerald.500 / 0.1'),
					theme('colors.emerald.500 / 0.9'),
					theme('colors.emerald.500 / 0.1')
				)
				padding-box,
			conic-gradient(
					from var(--bg-angle),
					theme('colors.emerald.500 / 0.1'),
					theme('colors.emerald.500 / 0.9')
				)
				border-box;
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		animation: spinnner 20s linear infinite;
	}

	@media (prefers-color-scheme: dark) {
		.project-active-border::before {
			background:
				linear-gradient(
						to bottom,
						theme('colors.emerald.500 / 0.1'),
						theme('colors.emerald.500 / 0.9'),
						theme('colors.emerald.500 / 0.1')
					)
					padding-box,
				conic-gradient(
						from var(--bg-angle),
						theme('colors.emerald.500 / 0.1'),
						theme('colors.emerald.500 / 0.9')
					)
					border-box;
			animation: spinnner 20s linear infinite;
		}
	}
	/* 
	.project-active-border:hover::before {
		transition: background 500ms ease;
		background: conic-gradient(from var(--bg-angle) theme('colors.emerald.500 / 0.9'), theme('colors.emerald.500 / 0.9')) 
		border-box;
	} */

	/* .project-active-border:nth-child(1)::before { animation-delay: 1s }
	.project-active-border:nth-child(2)::before { animation-delay: 2s }
	.project-active-border:nth-child(3)::before { animation-delay: 3s }
	.project-active-border:nth-child(4)::before { animation-delay: 4s }
	.project-active-border:nth-child(5)::before { animation-delay: 5s } */

	.profile-image {
		shape-outside: circle();
		shape-margin: 0.5rem;
	}

	.tag-highlighter {
		position: relative;
		background: transparent;
		z-index: 0;
	}

	.tag-highlighter:hover {
		border-color: transparent;
		transition: border-color ease-in-out 200ms;
	}

	.tag-highlighter::before {
		content: '';
		position: absolute;
		top: -1px;
		right: -1px;
		bottom: -1px;
		left: -1px;
		z-index: -1;
		border-radius: inherit;
		border: 1px solid transparent;
		background:
			linear-gradient(
					to bottom,
					theme('colors.emerald.500 / 0.1'),
					theme('colors.emerald.500 / 0.9'),
					theme('colors.emerald.500 / 0.1')
				)
				padding-box,
			conic-gradient(
					from var(--bg-angle),
					theme('colors.emerald.500 / 0.1'),
					theme('colors.emerald.500 / 0.9')
				)
				border-box;
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		animation: paused;
		/* animation: spinnner 3s linear infinite; */
	}

	.tag-highlighter:hover:before {
		animation: spinnner 3s linear infinite;
	}

	@media (prefers-color-scheme: dark) {
		.tag-highlighter:hover:before {
			animation: spinnner 3s linear infinite;
			background:
				linear-gradient(
						to bottom,
						theme('colors.emerald.500 / 0.1'),
						theme('colors.emerald.500 / 0.9'),
						theme('colors.emerald.500 / 0.1')
					)
					padding-box,
				conic-gradient(
						from var(--bg-angle),
						theme('colors.emerald.500 / 0.1'),
						theme('colors.emerald.500 / 0.9')
					)
					border-box;
			opacity: 1;
			transition: opacity 300ms ease-in-out;
		}
		.tag-highlighter::before {
			opacity: 0;
			background:
				linear-gradient(to bottom, transparent, transparent) padding-box,
				conic-gradient(from var(--bg-angle), transparent, transparent) border-box;
			animation: paused;
		}
	}
</style>
