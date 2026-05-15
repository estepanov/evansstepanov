<script lang="ts">
	import {
		X,
		ExternalLink,
		Calendar,
		Cpu,
		Code2,
		Boxes,
		Library,
		Database,
		Wrench,
		Tag
	} from '@lucide/svelte';
	import { GithubIcon } from '@lucide/svelte';
	import { onDestroy } from 'svelte';
	import { getFormattedDate } from '../util/dates';

	export let open = false;
	export let item: any;
	export let type: 'work' | 'project' = 'work';
	export let tech: Array<{ name: string; type?: string }> = [];
	export let onClose: () => void = () => {};

	const CATEGORY_ORDER = ['Runtime', 'Language', 'Framework', 'Library', 'Database', 'DevOps'];
	const CATEGORY_META: Record<string, { icon: any; label: string }> = {
		Runtime: { icon: Cpu, label: 'Runtime' },
		Language: { icon: Code2, label: 'Language' },
		Framework: { icon: Boxes, label: 'Framework' },
		Library: { icon: Library, label: 'Library' },
		Database: { icon: Database, label: 'Database' },
		DevOps: { icon: Wrench, label: 'DevOps' },
		Other: { icon: Tag, label: 'Other' }
	};

	let dialog: HTMLDialogElement | null = null;
	let closing = false;
	const EXIT_MS = 200;

	$: title = type === 'work' ? item?.title : item?.name;
	$: subtitle = type === 'work' ? item?.companyName : undefined;
	$: techTags = (item?.techTags as string[] | undefined) ?? [];
	$: techTypeByName = new Map(tech.map((t) => [t.name, t.type ?? 'Other']));
	$: groupedTech = (() => {
		const groups = new Map<string, string[]>();
		for (const tag of techTags) {
			const cat = techTypeByName.get(tag) ?? 'Other';
			const list = groups.get(cat) ?? [];
			list.push(tag);
			groups.set(cat, list);
		}
		const ordered: Array<{ category: string; tags: string[] }> = [];
		for (const cat of CATEGORY_ORDER) {
			const tags = groups.get(cat);
			if (tags && tags.length) ordered.push({ category: cat, tags: tags.slice().sort() });
		}
		const other = groups.get('Other');
		if (other && other.length) ordered.push({ category: 'Other', tags: other.slice().sort() });
		return ordered;
	})();
	$: media = (type === 'project' ? (item?.media as string[] | undefined) : undefined) ?? [];
	$: heroImage = type === 'work' ? item?.image : undefined;
	$: primaryUrl = item?.url as string | undefined;
	$: sourceUrl = type === 'project' ? (item?.source as string | undefined) : undefined;

	$: if (dialog) {
		if (open && !dialog.open) {
			closing = false;
			dialog.showModal();
		}
	}

	function handleClose() {
		if (!dialog || !dialog.open || closing) {
			open = false;
			onClose();
			return;
		}
		closing = true;
		window.setTimeout(() => {
			if (dialog && dialog.open) dialog.close();
			closing = false;
			open = false;
			onClose();
		}, EXIT_MS);
	}

	$: if (typeof document !== 'undefined') {
		const body = document.body;
		if (open) {
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			body.dataset.prevOverflow = body.style.overflow;
			body.dataset.prevPaddingRight = body.style.paddingRight;
			body.style.overflow = 'hidden';
			if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
		} else if (body.dataset.prevOverflow !== undefined) {
			body.style.overflow = body.dataset.prevOverflow;
			body.style.paddingRight = body.dataset.prevPaddingRight ?? '';
			delete body.dataset.prevOverflow;
			delete body.dataset.prevPaddingRight;
		}
	}

	onDestroy(() => {
		if (typeof document === 'undefined') return;
		const body = document.body;
		if (body.dataset.prevOverflow !== undefined) {
			body.style.overflow = body.dataset.prevOverflow;
			body.style.paddingRight = body.dataset.prevPaddingRight ?? '';
			delete body.dataset.prevOverflow;
			delete body.dataset.prevPaddingRight;
		}
	});

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialog) handleClose();
	}

	function mediaAlt(index: number) {
		return `${title ?? 'item'} media ${index + 1}`;
	}

	function hostFromUrl(url: string): string {
		try {
			return new URL(url).hostname.replace(/^www\./, '');
		} catch {
			return url;
		}
	}
</script>

<dialog
	bind:this={dialog}
	on:cancel={(e) => {
		e.preventDefault();
		handleClose();
	}}
	on:click={handleBackdropClick}
	aria-labelledby="details-modal-title"
	class="details-dialog"
	class:is-closing={closing}
>
	{#if (open || closing) && item}
		<div
			class="modal-panel relative flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-2xl ring-1 ring-slate-200/80 dark:ring-slate-800/80"
			role="document"
		>
			<header
				class="flex items-start gap-4 px-6 pt-6 pb-4 border-b border-slate-200/70 dark:border-slate-800/70"
			>
				<div class="flex-1 min-w-0">
					<h2 id="details-modal-title" class="text-xl font-bold tracking-tight truncate">
						{title}
					</h2>
					{#if subtitle}
						<p class="mt-1 text-sm text-slate-500 dark:text-slate-400 truncate">
							at <span class="font-medium text-slate-700 dark:text-slate-200">{subtitle}</span>
						</p>
					{/if}
					{#if item.startDate}
						<p
							class="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
						>
							<Calendar size={12} strokeWidth={2} aria-hidden="true" />
							<span class="tabular-nums">
								{getFormattedDate(item.startDate)}
								{#if item.endDate}
									<span class="mx-1">–</span>{getFormattedDate(item.endDate)}
								{:else if type === 'work'}
									<span class="mx-1">–</span>Present
								{/if}
							</span>
						</p>
					{/if}
				</div>
				<button
					type="button"
					class="close-btn shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 transition-colors"
					on:click={handleClose}
					aria-label="Close details"
				>
					<X size={18} strokeWidth={2} aria-hidden="true" />
				</button>
			</header>

			<div class="modal-body overflow-y-auto px-6 py-5 space-y-6">
				{#if heroImage}
					<div class="rounded-lg overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
						<img
							src={heroImage}
							alt={mediaAlt(0)}
							loading="lazy"
							class="w-full h-auto object-cover"
						/>
					</div>
				{/if}

				{#if media.length > 0}
					<ul class="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Media gallery">
						{#each media as src, i (src)}
							<li class="rounded-lg overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
								<img
									src="/{src}"
									alt={mediaAlt(i)}
									loading="lazy"
									class="w-full h-auto object-cover"
								/>
							</li>
						{/each}
					</ul>
				{/if}

				{#if item.description}
					<section aria-label="Description">
						<p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
							{item.description}
						</p>
					</section>
				{/if}

				{#if techTags.length > 0}
					<section aria-labelledby="modal-tech-heading">
						<div class="flex items-baseline justify-between mb-3">
							<h3
								id="modal-tech-heading"
								class="text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-500 dark:text-slate-400"
							>
								Tech stack
							</h3>
							<span class="text-[11px] font-medium tabular-nums text-slate-400 dark:text-slate-500">
								{techTags.length}
							</span>
						</div>
						<div class="space-y-4">
							{#each groupedTech as group (group.category)}
								{@const meta = CATEGORY_META[group.category] ?? CATEGORY_META.Other}
								<div>
									<div
										class="inline-flex items-center gap-1.5 mb-2 text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-500 dark:text-slate-400"
									>
										<svelte:component
											this={meta.icon}
											size={12}
											strokeWidth={2}
											aria-hidden="true"
										/>
										<span>{meta.label}</span>
										<span class="text-slate-300 dark:text-slate-600 tabular-nums">
											{group.tags.length}
										</span>
									</div>
									<ul class="flex flex-wrap gap-1.5" aria-label="{meta.label} technologies">
										{#each group.tags as tag (tag)}
											<li>
												<a
													href="/tech/{tag}"
													class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
												>
													{tag}
												</a>
											</li>
										{/each}
									</ul>
								</div>
							{/each}
						</div>
					</section>
				{/if}
			</div>

			{#if primaryUrl || sourceUrl}
				<footer
					class="flex flex-wrap gap-2 justify-end px-6 py-4 border-t border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/40"
				>
					{#if sourceUrl}
						<a
							href={sourceUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
						>
							{#if sourceUrl.includes('github.com')}
								<GithubIcon class="w-4 h-4" aria-hidden="true" />
							{/if}
							Source
						</a>
					{/if}
					{#if primaryUrl}
						<a
							href={primaryUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
						>
							Visit {hostFromUrl(primaryUrl)}
							<ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
						</a>
					{/if}
				</footer>
			{/if}
		</div>
	{/if}
</dialog>

<style>
	.details-dialog {
		padding: 0;
		border: 0;
		background: transparent;
		max-width: 100vw;
		max-height: 100vh;
		width: 100%;
		height: 100%;
		margin: 0;
		inset: 0;
		overflow: hidden;
		display: grid;
		place-items: center;
		color: inherit;
	}

	.details-dialog:not([open]) {
		display: none;
	}

	.details-dialog::backdrop {
		background: rgba(15, 23, 42, 0.55);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		opacity: 0;
		animation: backdrop-in 220ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.details-dialog.is-closing::backdrop {
		animation: backdrop-out 200ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.modal-panel {
		opacity: 0;
		transform: translateY(12px) scale(0.98);
		animation: panel-in 260ms cubic-bezier(0.22, 1, 0.36, 1) 30ms forwards;
		margin: 1rem;
	}

	.details-dialog.is-closing .modal-panel {
		animation: panel-out 200ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	@keyframes backdrop-in {
		to {
			opacity: 1;
		}
	}

	@keyframes panel-in {
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes backdrop-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	@keyframes panel-out {
		from {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
		to {
			opacity: 0;
			transform: translateY(8px) scale(0.98);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.details-dialog::backdrop,
		.modal-panel {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}
</style>
