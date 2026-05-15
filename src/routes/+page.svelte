<script lang="ts">
	import Logo from '../components/Logo.svelte';
	import Link from '../components/Link.svelte';
	import Section from '../components/Section.svelte';
	import { idHash } from '../util/id-hash-link-format';
	import { getTechIcon } from '../util/tech-icons';
	import TechIcon from '../components/TechIcon.svelte';
	import { MousePointer, ShoppingCart, ArrowUpRight, Cpu, Code2, Boxes, Library, Database, Wrench } from '@lucide/svelte';

	const categoryMeta: Record<string, { icon: any; label: string }> = {
		Runtime: { icon: Cpu, label: 'Runtime' },
		Language: { icon: Code2, label: 'Language' },
		Framework: { icon: Boxes, label: 'Framework' },
		Library: { icon: Library, label: 'Library' },
		Database: { icon: Database, label: 'Database' },
		DevOps: { icon: Wrench, label: 'DevOps' }
	};

	const techOrder = ['Runtime', 'Language', 'Framework', 'Library', 'Database', 'DevOps'];

	const proficiencyLevel: Record<string, number> = {
		Beginner: 1,
		Intermediate: 2,
		Advanced: 3,
		Expert: 4
	};
	import {
		SiReact,
		SiTypescript,
	} from '@icons-pack/svelte-simple-icons';
	import SocialLink from '../components/SocialLink.svelte';
	import GridItem from '../components/GridItem.svelte';
	import ProfileDiamond from '../components/ProfileDiamond.svelte';
	import PageContainer from '../components/PageContainer.svelte';

	export let data;

</script>

<svelte:head>
	<title>Evans Stepanov</title>
</svelte:head>

<PageContainer class="space-y-20 mt-12">
	<header class="text-slate-900 dark:text-slate-100">
		<div class="w-56 md:w-64">
			<Logo />
		</div>
	</header>
	<main class="w-full space-y-12">
		<Section title="About me">
			<p class="leading-relaxed">
				<ProfileDiamond />
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
				<span class="font-bold text-emerald-700 dark:text-emerald-400">dading</span>
				🍼,
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
			<ul class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
				{#each data.work as work}
					<GridItem item={work} type="work" />
				{/each}
			</ul>
		</Section>
		<Section title="Projects">
			<ul class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
				{#each data.projects as project}
					<GridItem item={project} type="project" {idHash} />
				{/each}
			</ul>
		</Section>
		<Section title="Tech">
			<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-3">
				{#each techOrder as techType}
					{@const techItems = data.tech.filter((tech) => tech.type === techType)}
					{@const meta = categoryMeta[techType]}
					{#if techItems.length > 0}
						<a
							href="/tech/#{techType.toLowerCase()}"
							title="View all {meta.label} tech"
							class="group aspect-square overflow-hidden flex flex-col items-center justify-center text-center p-2 rounded-xl bg-slate-500/5 dark:bg-slate-400/5 text-slate-900 dark:text-slate-100 hover:bg-slate-500/10 dark:hover:bg-slate-400/10 transition-colors duration-200"
						>
							<svelte:component this={meta.icon} size={24} strokeWidth={1.75} />
							<span class="mt-2 text-[11px] font-semibold tracking-wider uppercase">
								{meta.label}
							</span>
						</a>
						{#each techItems as tech}
							{@const techIcon = getTechIcon(tech.name)}
							{@const level = proficiencyLevel[tech.proficiency] ?? 0}
							<a
								href="/tech/{tech.name}"
								title={tech.name}
								class="tech-tile group relative aspect-square overflow-hidden flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200/70 dark:border-slate-800/70 hover:border-slate-400 dark:hover:border-slate-600 hover:-translate-y-0.5 transition-all duration-200"
							>
								<span
									class="absolute top-2 right-2 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<ArrowUpRight size={14} strokeWidth={2} />
								</span>
								{#if techIcon}
									<div class="text-slate-800 dark:text-slate-100">
										<TechIcon icon={techIcon} size={38} />
									</div>
								{:else}
									<div
										class="w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-base font-semibold text-slate-500 dark:text-slate-400"
									>
										{tech.name.charAt(0)}
									</div>
								{/if}
								<span
									class="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300 text-center line-clamp-1 w-full"
								>
									{tech.name}
								</span>
								<span
									class="mt-1 flex gap-0.5"
									title="{tech.proficiency}"
									aria-label="Proficiency: {tech.proficiency}"
								>
									{#each [1, 2, 3, 4] as i}
										<span
											class="w-1 h-1 rounded-full {i <= level
												? 'bg-slate-700 dark:bg-slate-300'
												: 'bg-slate-300 dark:bg-slate-700'}"
										></span>
									{/each}
								</span>
							</a>
						{/each}
					{/if}
				{/each}
			</div>
		</Section>
	</main>
	<footer class="mt-10">
		<div class="my-5 text-xs text-gray-500 dark:text-gray-400 text-center">
			<span class="italic">“I have not failed. I've just found 10,000 ways that won't work.”</span> ―
			Thomas A. Edison
		</div>
	</footer>
</PageContainer>

<style>
	.tech-tile {
		isolation: isolate;
		will-change: transform;
	}

	.tech-tile::before {
		content: '';
		position: absolute;
		inset: 0;
		width: 200%;
		height: 100%;
		background: linear-gradient(
			115deg,
			transparent 40%,
			rgba(255, 255, 255, 0.55) 50%,
			transparent 60%
		);
		transform: translate3d(-75%, 0, 0);
		opacity: 0;
		transition:
			transform 1.4s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.25s ease-out;
		pointer-events: none;
		z-index: -1;
	}

	:global(.dark) .tech-tile::before {
		background: linear-gradient(
			115deg,
			transparent 40%,
			rgba(226, 232, 240, 0.14) 50%,
			transparent 60%
		);
	}

	.tech-tile:hover::before,
	.tech-tile:focus-visible::before {
		transform: translate3d(25%, 0, 0);
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.tech-tile::before {
			transition: opacity 0.25s ease-out;
			transform: translate3d(0, 0, 0);
		}
		.tech-tile:hover::before,
		.tech-tile:focus-visible::before {
			transform: translate3d(0, 0, 0);
		}
	}
</style>

