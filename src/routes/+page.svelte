<script lang="ts">
	import Logo from '../components/Logo.svelte';
	import Link from '../components/Link.svelte';
	import * as Fathom from 'fathom-client';
	import Section from '../components/Section.svelte';
	import SpecialBadge from '../components/SpecialBadge.svelte';
	import { getFormattedDate } from '../util/dates';
	import { getColorFromWeight } from '../util/statusColors';
	import MiniImageGallery from '../components/MiniImageGallery.svelte';
	import { idHash } from '../util/id-hash-link-format';
	import { GithubIcon, LinkedinIcon } from '@lucide/svelte';
	import {
		SiGithub,
		SiReact,
		SiTypescript,
		SiNextdotjs,
		SiReactquery,
		SiTrpc,
		SiHono,
		SiDrizzle,
		SiNodedotjs,
		SiBun,
		SiStyledcomponents,
		SiTailwindcss,
		SiChakraui,
		SiExpress,
		SiPostgresql,
		SiSvelte,
		SiSqlite,
		SiAmazondynamodb,
		SiMongodb,
		SiPrisma,
		SiMongoose,
		SiDocker,
		SiGithubactions,
		SiCypress,
		SiJest,
		SiVitest,
		SiMockserviceworker,
		SiBuddy
	} from '@icons-pack/svelte-simple-icons';

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
				I'm a software engineer with a passion for building scalable, high-performance <span
					class="font-bold text-indigo-800 dark:text-indigo-200">web applications</span
				>. With experience at CLEAR, Amazon Web Services, and beyond, I've led major frontend and
				full-stack initiatives, from architecting monorepos and optimizing legacy systems to
				enhancing accessibility and streamlining cloud infrastructure.
			</p>
			<p class="leading-relaxed">
				I primarily work in <span class="font-bold text-indigo-800 dark:text-indigo-200">
					TypeScript <span class="inline-block"><SiTypescript size={16} /></span>
				</span>
				and specialize in
				<span class="font-bold text-indigo-800 dark:text-indigo-200">
					React <span class="inline-block"><SiReact size={16} /></span>
				</span> with modern JavaScript tooling. I thrive on solving complex technical challenges with
				elegant, user-focused solutions.
			</p>
			<p class="leading-relaxed">
				When I'm not coding, you can find me <span
					class="font-bold text-emerald-800 dark:text-emerald-200">reading</span
				>
				📚,
				<span class="font-bold text-emerald-800 dark:text-emerald-200">skiing</span>
				⛷️, playing <span class="font-bold text-emerald-800 dark:text-emerald-200">Halo</span> 🎮,
				or
				<span class="font-bold text-emerald-800 dark:text-emerald-200">sleeping</span> 🛌.
			</p>
		</Section>
		<Section title="Links">
			<ul class="flex flex-row flex-wrap uppercase tracking-wide items-center space-x-6">
				{#each data.links as link, i}
					<li class="inline-flex">
						<a
							target="_blank"
							on:click={() => Fathom.trackEvent(`click_main_link-${link.title}`)}
							class={`${
								link.url?.includes('github.com') || link.url?.includes('linkedin.com')
									? 'px-4'
									: 'px-8'
							} flex flex-row justify-center items-center transition-all box-border ease-linear rounded-md text-center text-xs sm:text-sm py-3 bg-gradient-to-b from-slate-500/10 to-slate-500/20 hover:bg-gradient-to-b hover:from-emerald-400/30 hover:to-emerald-400/40 dark:hover:bg-gradient-to-b dark:hover:from-emerald-900/50 dark:hover:to-emerald-900/60`}
							href={link.url}
						>
							{#if link.url?.includes('github.com')}
								<span class="inline-block w-4 h-4 mr-2">
									<SiGithub size={16} />
								</span>
							{/if}
							{#if link.url?.includes('linkedin.com')}
								<LinkedinIcon class="inline-block h-4 mr-2" />
							{/if}
							<span class="uppercase">
								{link.title}
							</span>
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
		<!-- <Section title="Tech">
			<ul class="flex flex-row flex-wrap gap-2">
				{#each data.tech as tech, i}
					<li
						class="px-3 py-1.5 rounded-full text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						{tech.name}
					</li>
				{/each}
			</ul>
		</Section> -->
		<Section title="Tech">
			<div class="space-y-2">
				<h3 class="font-bold text-lg opacity-80">Runtimes</h3>
				<ul class="flex flex-row flex-wrap gap-2">
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiNodedotjs size={20} />
						</span>
						NodeJS
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiBun size={20} />
						</span>
						Bun
					</li>
				</ul>
			</div>
			<div class="space-y-2">
				<h3 class="font-bold text-lg opacity-80">Testing</h3>
				<ul class="flex flex-row flex-wrap gap-2">
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						Playwright
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiVitest size={20} />
						</span>
						Vitest
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiMockserviceworker size={20} />
						</span>
						Mock Service Worker
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiJest size={20} />
						</span>
						Jest
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiCypress size={20} />
						</span>
						Cypress
					</li>
				</ul>
			</div>
			<div class="space-y-2">
				<h3 class="font-bold text-lg opacity-80">Frontend</h3>
				<ul class="flex flex-row flex-wrap gap-2">
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiNextdotjs size={20} />
						</span>
						NextJS
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiSvelte size={20} />
						</span>
						Svelte
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiReactquery size={20} />
						</span>
						React Query
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiStyledcomponents size={20} />
						</span>
						Styled Components
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiTailwindcss size={20} />
						</span>
						Tailwind CSS
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiChakraui size={20} />
						</span>
						Chakra UI
					</li>
				</ul>
			</div>
			<div class="space-y-2">
				<h3 class="font-bold text-lg opacity-80">Backend</h3>
				<ul class="flex flex-row flex-wrap gap-2">
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiTrpc size={20} />
						</span>
						tRPC
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiHono size={20} />
						</span>
						Hono
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiExpress size={20} />
						</span>
						Express
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiDrizzle size={20} />
						</span>
						Drizzle ORM
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiPrisma size={20} />
						</span>
						Prisma ORM
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiMongoose size={20} />
						</span>
						Mongoose ORM
					</li>
				</ul>
			</div>
			<div class="space-y-2">
				<h3 class="font-bold text-lg opacity-80">Data stores</h3>
				<ul class="flex flex-row flex-wrap gap-2">
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiPostgresql size={20} />
						</span>
						PostgreSQL
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiSqlite size={20} />
						</span>
						SQLite
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiAmazondynamodb size={20} />
						</span>
						DynamoDB
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiMongodb size={20} />
						</span>
						MongoDB
					</li>
				</ul>
			</div>
			<div class="space-y-2">
				<h3 class="font-bold text-lg opacity-80">DevOps</h3>
				<ul class="flex flex-row flex-wrap gap-2">
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiDocker size={20} />
						</span>
						Docker
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiGithubactions size={20} />
						</span>
						GitHub Actions
					</li>
					<li
						class="tag-highlighter px-4 flex flex-row justify-center items-center py-2 rounded-md text-sm font-medium tracking-wide bg-slate-100/50 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors duration-200 ease-in-out"
					>
						<span class="mr-4">
							<SiBuddy size={20} />
						</span>
						Buddy
					</li>
				</ul>
			</div>
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
				linear-gradient(
						to bottom,
						transparent,
						transparent,
					)
					padding-box,
				conic-gradient(
						from var(--bg-angle),
						transparent,
						transparent
					)
					border-box;
			animation: paused;
			
		}
	}
</style>
