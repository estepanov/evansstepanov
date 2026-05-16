<script>
	import PageContainer from "../../components/PageContainer.svelte";
	import SiteHeader from "../../components/SiteHeader.svelte";
	import { ArrowUpRight } from '@lucide/svelte';

	export let data;
</script>

<svelte:head>
	<title>Bookmarks</title>
	<meta name="robots" content="noindex, nofollow, noarchive">
</svelte:head>

<PageContainer class="space-y-20 mt-12">
	<SiteHeader />
	<main class="w-full space-y-16">
		<header class="space-y-3 max-w-2xl">
			<p class="text-xs font-medium tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
				Bookmarks
			</p>
			<h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
				A loose collection of links worth keeping
			</h1>
			<p class="text-slate-600 dark:text-slate-400 leading-relaxed">
				Tools, articles, and references I return to. Grouped by topic.
			</p>
		</header>

		{#if data && data.tags}
			<section>
				<div class="flex items-baseline justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
					<h2 class="text-sm font-semibold tracking-[0.15em] uppercase text-slate-700 dark:text-slate-300">
						Categories
					</h2>
					<span class="text-xs font-medium text-slate-400 dark:text-slate-500 tabular-nums">
						{data.tags.length}
					</span>
				</div>

				<div class="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
					{#each data.tags as tag}
						<div
							class="card card--interactive break-inside-avoid group p-5"
						>
							<div class="flex items-baseline justify-between gap-2 mb-3 pb-3 border-b border-slate-200/70 dark:border-slate-800/70">
								<h3 class="text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
									{tag.name}
								</h3>
								<span class="text-[10px] font-medium text-slate-400 dark:text-slate-500 tabular-nums">
									{tag.Links.length}
								</span>
							</div>
							<ul class="space-y-1.5">
								{#each tag.Links as bookmark}
									<li>
										<a
											href={bookmark.URL}
											target="_blank"
											rel="noopener noreferrer"
											class="group/link inline-flex items-start gap-1.5 text-sm text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 dark:focus-visible:ring-emerald-400/60"
										>
											<span class="underline underline-offset-4 decoration-slate-300 dark:decoration-slate-700 group-hover/link:decoration-emerald-500/60">
												{bookmark.Name}
											</span>
											<ArrowUpRight class="w-3 h-3 mt-1 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</section>

			<p class="text-xs text-slate-400 dark:text-slate-500 italic text-center">
				Data as of {data.lastChecked}
			</p>
		{/if}
	</main>
</PageContainer>
