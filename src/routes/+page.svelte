<script lang="ts">
	import Logo from '../components/Logo.svelte';
	import Link from '../components/Link.svelte';
	import Section from '../components/Section.svelte';
	import { idHash } from '../util/id-hash-link-format';
	import { getTechIcon } from '../util/tech-icons';
	import { MousePointer, ShoppingCart } from '@lucide/svelte';
	import {
		SiReact,
		SiTypescript,
	} from '@icons-pack/svelte-simple-icons';
	import SpecialButton from '../components/SpecialButton.svelte';
	import SocialLink from '../components/SocialLink.svelte';
	import GridItem from '../components/GridItem.svelte';

	export let data;

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
				{#each data.links as link}
					<li class="inline-flex">
						<SocialLink {link} />
					</li>
				{/each}
			</ul>
		</Section>
		<Section title="Work">
			<ul class="grid grid-cols-1 md:grid-cols-2 gap-10">
				{#each data.work as work}
					<GridItem item={work} type="work" />
				{/each}
			</ul>
		</Section>
		<Section title="Projects">
			<ul class="grid grid-cols-1 md:grid-cols-2 gap-10">
				{#each data.projects as project}
					<GridItem item={project} type="project" {idHash} />
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
	.profile-image {
		shape-outside: circle();
		shape-margin: 0.5rem;
	}
</style>
