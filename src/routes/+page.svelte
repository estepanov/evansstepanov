<script>
	import Logo from '../components/Logo.svelte';
	import Link from '../components/Link.svelte';
	import * as Fathom from 'fathom-client';
	import Section from '../components/Section.svelte';
	import SpecialBadge from '../components/SpecialBadge.svelte';
	import SpecialStatus from '../components/SpecialStatus.svelte';

	export let data;

</script>

<svelte:head>
	<title>Evans Stepanov</title>
</svelte:head>

<div
	class="flex justify-center items-center p-5 flex-col space-y-10 max-w-screen-md mx-auto"
>
	<div class="w-60 p-1"><Logo /></div>
	<ul class="flex flex-row flex-wrap uppercase tracking-wide justify-center items-center">
		{#each data.links as link}
			<li class="uppercase my-1 sm:my-2 mx-1 sm:mx-2 md:mx-3 leading-8 text-center text-xs sm:text-sm">
				<Link target='_blank' onClick={() => Fathom.trackEvent(`click_main_link-${link.title}`)} href={link.url}>{link.title}</Link>
			</li>
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
			<ul class=" space-y-8">
				{#each data.work as work}
					<li>
						<div>
							<h3 class={`mb-2 relative`}>
								{#if work.isCurrent}
								<span class="absolute -left-4">
									<SpecialStatus />
								</span>
								{/if}
								{work.title}
								<span class="text-gray-700 dark:text-gray-200 font-bold">
								</span>
								<span class="px-2 text-gray-700 dark:text-gray-400 font-thin">@</span>
								{#if work.url}
								<a target="_blank" rel="noopener" referrerpolicy="no-referrer" on:click={() => Fathom.trackEvent(`click_work_link-${work.title}`)} href={work.url} class="font-normal text-gray-700 dark:text-gray-300 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
										>{work.companyName}</a
									>
									{:else}
									<span class="font-normal text-gray-700 dark:text-gray-300 "
									>{work.companyName}</span
								>
									{/if}
									{#if work.isCurrent}
									<SpecialBadge>
										Current
									</SpecialBadge>
									{/if}
							</h3>
							<p class="leading-tight dark:text-gray-200 text-gray-600">{work.description}</p>
						</div>
					</li>
				{/each}
			</ul>
		</Section>
		<Section title="Projects">
			<ul class="space-y-8">
				{#each data.projects as project}
					<li>
						<div>
							<div class="flex flex-row items-center mb-2 relative">
								{#if project.isActive}
								<span class="absolute -left-4">
									<SpecialStatus />
								</span>
								{/if}
								<h3 class="font-bold flex justify-center items-center">

									{#if project.url}
									<a target="_blank" rel="noopener" referrerpolicy="no-referrer" on:click={() => Fathom.trackEvent(`click_project_link-${project.name}`)} href={project.url} class="text-gray-700 dark:text-gray-200 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
										>{project.name}</a
									>
									{:else}
									<span class="text-gray-700 dark:text-gray-200">{project.name}</span>
									{/if}
								</h3>
								{#if project.isActive} 
									<SpecialBadge>
										Active
									</SpecialBadge>
								{/if}
							</div>
							<p class="leading-tight dark:text-gray-200 text-gray-600">{project.description}</p>
							<div class="text-xs mt-2">
								{#if project.source}
								<a target="_blank" rel="noopener" referrerpolicy="no-referrer" on:click={() => Fathom.trackEvent(`click_project_source-${project.name}`)} href={project.source} class="font-normal text-gray-700 dark:text-gray-300 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
									>View source code</a
								>
								{/if}
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</Section>
		<Section title="Tech">
			<ul class="flex flex-row flex-wrap">
				{#each data.tech as tech}
					<li class="mr-5 mb-2">
						<span>{tech.name}</span>
					</li>
				{/each}
			</ul>
		</Section>
		
	</main>
	<footer class="mt-10">
		<div class="my-5 text-xs text-gray-500 dark:text-gray-400 text-center">
			<span class="italic">“I have not failed. I've just found 10,000 ways that won't work.”</span> ― Thomas
			A. Edison
		</div>
	</footer>
</div>
