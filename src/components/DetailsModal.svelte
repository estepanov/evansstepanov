<script lang="ts">
	import { X, ArrowUpRight } from '@lucide/svelte';
	import { GithubIcon } from '@lucide/svelte';
	import { onDestroy } from 'svelte';
	import { getFormattedDate } from '../util/dates';

	export let open = false;
	export let item: any;
	export let type: 'work' | 'project' = 'work';
	export let tech: Array<{ name: string; type?: string }> = [];
	export let onClose: () => void = () => {};

	const CATEGORY_ORDER = ['Runtime', 'Language', 'Framework', 'Library', 'Database', 'DevOps'];

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
	$: dateRange = (() => {
		if (!item?.startDate) return null;
		const start = getFormattedDate(item.startDate);
		if (item.endDate) return `${start} — ${getFormattedDate(item.endDate)}`;
		if (type === 'work') return `${start} — Present`;
		return start;
	})();

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
		<div class="glass-card flex flex-col w-full max-w-2xl max-h-[90vh]" role="document">
			<header class="modal-header">
				<div class="flex-1 min-w-0">
					{#if subtitle}
						<p class="eyebrow">{subtitle}</p>
					{:else if dateRange && type === 'project'}
						<p class="eyebrow">Project</p>
					{/if}
					<h2 id="details-modal-title" class="modal-title">{title}</h2>
					{#if dateRange}
						<p class="modal-meta">{dateRange}</p>
					{/if}
				</div>
				<button
					type="button"
					class="close-btn"
					on:click={handleClose}
					aria-label="Close details"
				>
					<X size={16} strokeWidth={1.75} aria-hidden="true" />
				</button>
			</header>

			<div class="modal-body">
				{#if heroImage}
					<figure class="hero-frame">
						<img src={heroImage} alt={mediaAlt(0)} loading="lazy" />
					</figure>
				{/if}

				{#if media.length > 0}
					<section aria-label="Media gallery">
						<ul class="media-grid">
							{#each media as src, i (src)}
								<li class="media-tile">
									<img src="/{src}" alt={mediaAlt(i)} loading="lazy" />
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if item.description}
					<section aria-label="Description">
						<p class="description-text">{item.description}</p>
					</section>
				{/if}

				{#if techTags.length > 0}
					<section aria-labelledby="modal-tech-heading">
						<h3 id="modal-tech-heading" class="section-label">Stack</h3>
						<div class="stack-groups">
							{#each groupedTech as group (group.category)}
								<div class="stack-row">
									<div class="stack-cat">{group.category}</div>
									<ul class="stack-chips" aria-label="{group.category} technologies">
										{#each group.tags as tag (tag)}
											<li>
												<a href="/tech/{tag}" class="chip">{tag}</a>
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
				<footer class="modal-footer">
					{#if sourceUrl}
						<a href={sourceUrl} target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
							{#if sourceUrl.includes('github.com')}
								<GithubIcon class="w-4 h-4" aria-hidden="true" />
							{/if}
							Source
						</a>
					{/if}
					{#if primaryUrl}
						<a href={primaryUrl} target="_blank" rel="noopener noreferrer" class="btn btn-primary">
							<span>{hostFromUrl(primaryUrl)}</span>
							<ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
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
		background: rgba(15, 23, 42, 0.45);
		backdrop-filter: blur(8px) saturate(120%);
		-webkit-backdrop-filter: blur(8px) saturate(120%);
		opacity: 0;
		animation: backdrop-in 220ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.details-dialog.is-closing::backdrop {
		animation: backdrop-out 200ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.glass-card {
		position: relative;
		margin: 1rem;
		border-radius: 18px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.72);
		backdrop-filter: blur(24px) saturate(160%);
		-webkit-backdrop-filter: blur(24px) saturate(160%);
		border: 1px solid rgba(255, 255, 255, 0.6);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 20px 50px -20px rgba(15, 23, 42, 0.25);
		color: rgb(15 23 42);
		opacity: 0;
		transform: translateY(10px) scale(0.99);
		animation: panel-in 280ms cubic-bezier(0.22, 1, 0.36, 1) 40ms forwards;
	}
	@media (max-width: 640px) {
		.glass-card {
			margin: 1rem;
			max-height: calc(100dvh - 2rem);
		}
	}

	:global(.dark) .glass-card {
		background: rgba(15, 20, 30, 0.65);
		border-color: rgba(255, 255, 255, 0.08);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.06),
			0 20px 50px -20px rgba(0, 0, 0, 0.5);
		color: rgb(241 245 249);
	}

	.details-dialog.is-closing .glass-card {
		animation: panel-out 200ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	/* Header */
	.modal-header {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.75rem 1.75rem 1.25rem;
	}
	@media (min-width: 640px) {
		.modal-header {
			padding: 2rem 2.25rem 1.5rem;
		}
	}

	.eyebrow {
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		color: rgb(100 116 139);
		margin-bottom: 0.4rem;
	}
	:global(.dark) .eyebrow {
		color: rgb(148 163 184);
	}

	.modal-title {
		font-size: 1.5rem;
		line-height: 1.2;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: rgb(15 23 42);
	}
	:global(.dark) .modal-title {
		color: rgb(248 250 252);
	}
	@media (min-width: 640px) {
		.modal-title {
			font-size: 1.75rem;
		}
	}

	.modal-meta {
		margin-top: 0.5rem;
		font-size: 0.8125rem;
		color: rgb(100 116 139);
	}
	:global(.dark) .modal-meta {
		color: rgb(148 163 184);
	}

	.close-btn {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 999px;
		color: rgb(71 85 105);
		background: transparent;
		border: 1px solid rgba(15, 23, 42, 0.1);
		transition:
			background 160ms,
			color 160ms,
			border-color 160ms;
	}
	.close-btn:hover {
		background: rgba(15, 23, 42, 0.06);
		color: rgb(15 23 42);
		border-color: rgba(15, 23, 42, 0.18);
	}
	:global(.dark) .close-btn {
		color: rgb(148 163 184);
		border-color: rgba(255, 255, 255, 0.12);
	}
	:global(.dark) .close-btn:hover {
		background: rgba(255, 255, 255, 0.06);
		color: rgb(241 245 249);
		border-color: rgba(255, 255, 255, 0.2);
	}

	/* Body */
	.modal-body {
		overflow-y: auto;
		padding: 0 1.75rem 1.75rem;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}
	@media (min-width: 640px) {
		.modal-body {
			padding: 0 2.25rem 2rem;
		}
	}

	/* Hero image */
	.hero-frame {
		border-radius: 10px;
		overflow: hidden;
		border: 1px solid rgba(15, 23, 42, 0.08);
	}
	:global(.dark) .hero-frame {
		border-color: rgba(255, 255, 255, 0.08);
	}
	.hero-frame img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;
	}

	/* Media grid */
	.media-grid {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 0.5rem;
	}
	@media (min-width: 640px) {
		.media-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	.media-tile {
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid rgba(15, 23, 42, 0.08);
	}
	:global(.dark) .media-tile {
		border-color: rgba(255, 255, 255, 0.08);
	}
	.media-tile img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;
	}

	/* Section labels */
	.section-label {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgb(100 116 139);
		margin-bottom: 0.9rem;
	}
	:global(.dark) .section-label {
		color: rgb(148 163 184);
	}

	/* Description */
	.description-text {
		font-size: 0.9375rem;
		line-height: 1.65;
		color: rgb(51 65 85);
		white-space: pre-line;
	}
	:global(.dark) .description-text {
		color: rgb(203 213 225);
	}

	/* Stack */
	.stack-groups {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.stack-row {
		display: grid;
		grid-template-columns: 96px 1fr;
		gap: 0.75rem;
		align-items: start;
	}
	@media (max-width: 540px) {
		.stack-row {
			grid-template-columns: 1fr;
			gap: 0.4rem;
		}
	}
	.stack-cat {
		padding-top: 0.35rem;
		font-size: 0.75rem;
		color: rgb(100 116 139);
	}
	:global(.dark) .stack-cat {
		color: rgb(148 163 184);
	}
	.stack-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 500;
		color: rgb(51 65 85);
		background: rgba(15, 23, 42, 0.04);
		border: 1px solid rgba(15, 23, 42, 0.08);
		transition:
			background 160ms,
			border-color 160ms,
			color 160ms;
	}
	.chip:hover {
		background: rgba(15, 23, 42, 0.08);
		border-color: rgba(15, 23, 42, 0.15);
		color: rgb(15 23 42);
	}
	:global(.dark) .chip {
		color: rgb(203 213 225);
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.08);
	}
	:global(.dark) .chip:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.16);
		color: rgb(241 245 249);
	}

	/* Footer */
	.modal-footer {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: flex-end;
		padding: 1rem 1.75rem;
		border-top: 1px solid rgba(15, 23, 42, 0.06);
		background: rgba(255, 255, 255, 0.3);
	}
	@media (min-width: 640px) {
		.modal-footer {
			padding: 1rem 2.25rem;
		}
	}
	:global(.dark) .modal-footer {
		border-top-color: rgba(255, 255, 255, 0.06);
		background: rgba(255, 255, 255, 0.02);
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.45rem 0.85rem;
		border-radius: 8px;
		font-size: 0.8125rem;
		font-weight: 500;
		transition:
			background 160ms,
			color 160ms,
			border-color 160ms;
	}
	.btn-ghost {
		color: rgb(51 65 85);
		background: transparent;
		border: 1px solid rgba(15, 23, 42, 0.12);
	}
	.btn-ghost:hover {
		background: rgba(15, 23, 42, 0.05);
		color: rgb(15 23 42);
	}
	:global(.dark) .btn-ghost {
		color: rgb(203 213 225);
		border-color: rgba(255, 255, 255, 0.12);
	}
	:global(.dark) .btn-ghost:hover {
		background: rgba(255, 255, 255, 0.06);
		color: rgb(241 245 249);
	}
	.btn-primary {
		color: white;
		background: rgb(15 23 42);
		border: 1px solid rgb(15 23 42);
	}
	.btn-primary:hover {
		background: rgb(30 41 59);
	}
	:global(.dark) .btn-primary {
		color: rgb(15 23 42);
		background: rgb(241 245 249);
		border-color: rgb(241 245 249);
	}
	:global(.dark) .btn-primary:hover {
		background: rgb(226 232 240);
	}

	@keyframes backdrop-in {
		to {
			opacity: 1;
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
	@keyframes panel-in {
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	@keyframes panel-out {
		from {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
		to {
			opacity: 0;
			transform: translateY(6px) scale(0.99);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.details-dialog::backdrop,
		.glass-card,
		.close-btn,
		.btn,
		.chip {
			animation: none;
			transition: none;
			opacity: 1;
			transform: none;
		}
	}
</style>
