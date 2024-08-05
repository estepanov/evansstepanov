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
	<ul class="flex flex-row flex-wrap uppercase tracking-wide justify-center items-center">
		{#each data.links as link, i}
			<li
				class="uppercase my-1 sm:my-2 mx-1 sm:mx-2 md:mx-3 leading-8 text-center text-xs sm:text-sm"
			>
				<Link
					target="_blank"
					onClick={() => Fathom.trackEvent(`click_main_link-${link.title}`)}
					href={link.url}>{link.title}</Link
				>
			</li>
			{#if i !== data.links.length - 1}
				<li class="uppercase leading-8 text-center text-xs sm:text-sm">&#x205E;</li>
			{/if}
		{/each}
	</ul>
	<main class="w-full space-y-20">
		<Section title="About">
			<p>
				Professioinally I enjoy building seamless and delightful user experiences via full stack
				TypeScript web applications. With experience working on code bases of every size from small
				startups to one of the largest. Improving reliability and stability, while delivering
				incremental value.
			</p>
		</Section>
		<Section title="Work">
			<ul class=" space-y-10">
				{#each data.work as work}
					<li>
						<div>
							<h3 class="mb-4 relative">
								{#if work.isCurrent}
									<span class="absolute -left-4">
										<SpecialStatus />
									</span>
								{/if}
								{work.title}
								<span class="text-gray-700 dark:text-gray-200 font-bold" />
								<span class="text-gray-700 dark:text-gray-400 font-thin">@</span>
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
									<span class="font-normal text-gray-700 dark:text-gray-300"
										>{work.companyName}</span
									>
								{/if}
								{#if work.isCurrent}
									<SpecialBadge>Current</SpecialBadge>
								{/if}
							</h3>
							<p class="leading-tight dark:text-gray-200 text-gray-600">{work.description}</p>
							<ul class="text-xs mt-4 flex flex-row space-x-4 dark:text-gray-300 text-gray-500">
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
						</div>
					</li>
				{/each}
			</ul>
		</Section>
		<Section title="Projects">
			<ul class="space-y-10">
				{#each data.projects as project}
					<li id={idHash(project.name)}>
						<div>
							<div class="flex flex-row items-center mb-4 relative">
								{#if project.isActive}
									<span class="absolute -left-4">
										<SpecialStatus />
									</span>
								{/if}
								<h3 class="font-bold flex justify-center items-center">
									{#if project.url}
										<a
											target="_blank"
											rel="noopener"
											referrerpolicy="no-referrer"
											on:click={() => Fathom.trackEvent(`click_project_link-${project.name}`)}
											href={project.url}
											class="text-gray-700 dark:text-gray-200 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
											>{project.name}</a
										>
									{:else}
										<span class="text-gray-700 dark:text-gray-200">{project.name}</span>
									{/if}
								</h3>
								{#if project.isActive}
									<SpecialBadge>Active</SpecialBadge>
								{/if}
							</div>
							<p class="leading-tight dark:text-gray-200 text-gray-600">{project.description}</p>
							<ul class="text-xs mt-4 flex flex-row space-x-4 dark:text-gray-300 text-gray-500">
								{#if project.startDate}
									<li class="special">
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
								{#if project.media?.length > 0}
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
								{/if}
							</ul>
						</div>
						<MiniImageGallery
							isOpen={project.name === selectedProjectImage}
							parentRouter={`#${idHash(project.name)}`}
							images={project.media.map((img) => {
								return {
									url: img,
									alt: `Image of ${project.name}`
								};
							})}
						/>
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
	}
</style>
