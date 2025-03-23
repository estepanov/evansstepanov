<script lang="ts">
	import Logo from '../components/Logo.svelte';
	import Link from '../components/Link.svelte';
	import * as Fathom from 'fathom-client';
	import Section from '../components/Section.svelte';
	import SpecialBadge from '../components/SpecialBadge.svelte';
	import SpecialStatus from '../components/SpecialStatus.svelte';
	import { getFormattedDate } from '../util/dates';
	import { getColorFromWeight } from '../util/statusColors';
	import MiniImageGallery from '../components/MiniImageGallery.svelte';
	import { idHash } from '../util/id-hash-link-format';

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
	<main class="w-full space-y-20">
		<Section title="About me">
			<div class={'space-y-6'}>
				<p class="leading-relaxed">
					I'm a software engineer with a passion for building scalable, high-performance <span
						class="font-bold text-emerald-800 dark:text-emerald-200">web applications</span
					>. With experience at CLEAR, Amazon Web Services, and beyond, I've led major frontend and
					full-stack initiatives, from architecting monorepos and optimizing legacy systems to
					enhancing accessibility and streamlining cloud infrastructure.
				</p>
				<p class="leading-relaxed">
					I specialize in React, Next.js, and modern JavaScript tooling, and thrive on solving
					complex technical challenges with elegant, user-focused solutions.
				</p>
				<p class="leading-relaxed">
					When I'm not coding, you can find me <span class="font-bold text-emerald-800 dark:text-emerald-200">reading</span> 📚,
					<span class="font-bold text-emerald-800 dark:text-emerald-200">skiing</span>
					⛷️, playing <span class="font-bold text-emerald-800 dark:text-emerald-200">Halo</span> 🎮, or
					<span class="font-bold text-emerald-800 dark:text-emerald-200">sleeping</span> 🛌.
				</p>
			</div>
		</Section>
		<Section title="Links">
			<ul class="flex flex-row flex-wrap uppercase tracking-wide items-center space-x-6">
				{#each data.links as link, i}
					<li>
						<a
							target="_blank"
							on:click={() => Fathom.trackEvent(`click_main_link-${link.title}`)}
							class="transition-all px-8 ease-linear rounded-md uppercase leading-8 text-center text-xs sm:text-sm py-4 bg-slate-500/10 dark:border-slate-300/0 hover:bg-emerald-100/30 dark:hover:bg-emerald-900/50"
							href={link.url}>
							{link.title}
							</a>
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
							<!-- {#if work.isCurrent}
									<span class="absolute -left-3 md:-left-4">
										<SpecialStatus />
									</span>
								{/if} -->
							<span class="w-full block font-bold">
								{work.title}
							</span>
							<!-- <span class="text-gray-700 dark:text-gray-200 font-bold" />
								<span class="text-gray-700 dark:text-gray-400 font-thin">at</span> -->
							{#if work.url}
								<a
									target="_blank"
									rel="noopener"
									referrerpolicy="no-referrer"
									on:click={() => Fathom.trackEvent(`click_work_link-${work.title}`)}
									href={work.url}
									class="font-normal text-gray-700 dark:text-gray-300 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
									>{work.companyName}</a
								>
							{:else}
								<span class="font-normal text-gray-700 dark:text-gray-300">{work.companyName}</span>
							{/if}
						</h3>
						<p class="leading-tight dark:text-gray-200 text-gray-600">{work.description}</p>
						<div class="flex flex-grow" />
						<ul
							class="text-xs mt-4 flex flex-row space-x-4 dark:text-gray-300 text-gray-500 items-center"
						>
							{#if work.isCurrent}
								<SpecialBadge className="-ml-2">Current</SpecialBadge>
							{/if}
							{#if work.startDate}
								<li>
									{getFormattedDate(work.startDate)}
									{#if work.endDate}
										<span class="mx-1">-</span>
										{getFormattedDate(work.endDate)}
									{/if}
								</li>
							{/if}
						</ul>
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
						<div class="flex flex-grow" />
						<ul
							class="text-xs mt-4 flex flex-row space-x-4 dark:text-gray-300 text-gray-500 items-center"
						>
							{#if project.isActive}
								<SpecialBadge className="-ml-2">Active</SpecialBadge>
							{/if}
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
										class="underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
										>{new URL(project.source).hostname.split('.')[0]}</a
									>
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
			<ul class="flex flex-row flex-wrap">
				{#each data.tech as tech, i}
					<!-- {#if i === 0 || tech.proficiencyWeight !== data.tech[i - 1].proficiencyWeight}
						<div
							class="{getColorFromWeight(
								i === 0 ? tech.proficiencyWeight : data.tech[i - 1].proficiencyWeight
							)} inline-block"
						>
							<span class="mr-5 mb-2 rounded-full px-2 border py-1">{tech.proficiency}</span>
						</div>
					{/if} -->
					<li class="mr-5 mb-2">
						<span>{tech.name}</span>
					</li>
				{/each}
			</ul>
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
	.special + li::before {
		content: '⁞';
		margin-right: 1rem;
		opacity: 0.5;
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
		background: linear-gradient(
			45deg,
            theme('colors.emerald.500 / 0.1'),
            theme('colors.emerald.500 / 0.9'),
            theme('colors.emerald.500 / 0.1')
		) border-box;
		-webkit-mask: 
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask: 
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		background-size: 200% auto;
		animation: animatedBorder 6s ease-in-out infinite alternate;
	}

	@media (prefers-color-scheme: dark) {
		.project-active-border::before {
			background: linear-gradient(
				45deg,
				theme('colors.emerald.500 / 0.1'),
				theme('colors.emerald.500 / 0.9'),
				theme('colors.emerald.500 / 0.1')
			) border-box;
			background-size: 200% auto;
			animation: animatedBorder 6s ease-in-out infinite alternate;
		}
	}

	@keyframes animatedBorder {
		0% {
			background-position: 0% center;
		}
		50% {
			background-position: 100% center;
		}
		100% {
			background-position: 0% center;
		}
	}
</style>
