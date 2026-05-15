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
	aria-modal="true"
	class="details-dialog"
	class:is-closing={closing}
>
	{#if (open || closing) && item}
		<div class="glass-card flex flex-col w-full max-w-2xl max-h-[90vh]">
			<header class="modal-header">
				<div class="flex-1 min-w-0 stagger" style="--d: 0ms">
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
					<figure class="hero-frame stagger" style="--d: 60ms">
						<img src={heroImage} alt={mediaAlt(0)} loading="lazy" />
					</figure>
				{/if}

				{#if media.length > 0}
					<section aria-label="Media gallery" class="stagger" style="--d: 60ms">
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
					<section aria-label="Description" class="stagger" style="--d: 100ms">
						<p class="description-text">{item.description}</p>
					</section>
				{/if}

				{#if techTags.length > 0}
					<section aria-labelledby="modal-tech-heading" class="stagger" style="--d: 140ms">
						<h3 id="modal-tech-heading" class="section-label">Stack</h3>
						<div class="stack-groups">
							{#each groupedTech as group (group.category)}
								<div class="stack-row">
									<div class="stack-cat">{group.category}</div>
									<ul class="stack-chips" aria-label="{group.category} technologies">
										{#each group.tags as tag (tag)}
											<li>
												<a href="/tech/{tag}" class="chip"><span class="chip-text">{tag}</span></a>
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
				<footer class="modal-footer stagger" style="--d: 180ms">
					{#if sourceUrl}
						<a
							href={sourceUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="link-out"
						>
							{#if sourceUrl.includes('github.com')}
								<GithubIcon class="w-3.5 h-3.5" aria-hidden="true" />
							{/if}
							<span>Source</span>
							<span class="arrow-wrap" aria-hidden="true">
								<ArrowUpRight size={13} strokeWidth={2} />
							</span>
						</a>
					{/if}
					{#if primaryUrl}
						<a
							href={primaryUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="link-out link-out-primary"
						>
							<span>{hostFromUrl(primaryUrl)}</span>
							<span class="arrow-wrap" aria-hidden="true">
								<ArrowUpRight size={13} strokeWidth={2} />
							</span>
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
		animation: backdrop-in 320ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.details-dialog.is-closing::backdrop {
		animation: backdrop-out 220ms cubic-bezier(0.4, 0, 0.6, 1) forwards;
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
		transform: translateY(14px) scale(0.97);
		filter: blur(6px);
		animation: panel-in 420ms cubic-bezier(0.16, 1, 0.3, 1) 40ms forwards;
		will-change: transform, opacity, filter;
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
		animation: panel-out 220ms cubic-bezier(0.4, 0, 0.6, 1) forwards;
	}

	/* Staggered content entrance */
	.stagger {
		opacity: 0;
		transform: translateY(8px);
		animation: stagger-in 480ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: calc(var(--d, 0ms) + 120ms);
	}
	.details-dialog.is-closing .stagger {
		animation: none;
		opacity: 1;
		transform: none;
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
			background 220ms cubic-bezier(0.22, 1, 0.36, 1),
			color 220ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 220ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 220ms;
	}
	.close-btn :global(svg) {
		transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	.close-btn:hover {
		background: rgba(15, 23, 42, 0.06);
		color: rgb(15 23 42);
		border-color: rgba(15, 23, 42, 0.2);
		transform: scale(1.06);
	}
	.close-btn:hover :global(svg) {
		transform: rotate(90deg);
	}
	.close-btn:active {
		transform: scale(0.94);
	}
	.close-btn:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.18);
	}
	:global(.dark) .close-btn {
		color: rgb(148 163 184);
		border-color: rgba(255, 255, 255, 0.12);
	}
	:global(.dark) .close-btn:hover {
		background: rgba(255, 255, 255, 0.06);
		color: rgb(241 245 249);
		border-color: rgba(255, 255, 255, 0.22);
	}
	:global(.dark) .close-btn:focus-visible {
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.22);
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
		justify-content: center;
		gap: 0.3rem;
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 500;
		color: rgb(51 65 85);
		background: rgba(15, 23, 42, 0.04);
		border: 1px solid rgba(15, 23, 42, 0.08);
		transition:
			background 220ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 220ms cubic-bezier(0.22, 1, 0.36, 1),
			color 220ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 200ms;
	}
	.chip-text {
		display: inline-block;
		transform: translateX(0.55em);
		transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.chip:hover .chip-text {
		transform: translateX(0);
	}
	.chip::after {
		content: '→';
		display: inline-block;
		width: 0.7em;
		font-size: 0.7rem;
		line-height: 1;
		opacity: 0;
		transform: translateX(-3px);
		transition:
			opacity 200ms ease,
			transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.chip:hover {
		background: rgba(15, 23, 42, 0.07);
		border-color: rgba(15, 23, 42, 0.18);
		color: rgb(15 23 42);
	}
	.chip:hover::after {
		opacity: 1;
		transform: translateX(0);
	}
	.chip:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.18);
		border-color: rgba(15, 23, 42, 0.25);
	}
	:global(.dark) .chip:focus-visible {
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.22);
		border-color: rgba(255, 255, 255, 0.25);
	}
	:global(.dark) .chip {
		color: rgb(203 213 225);
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.08);
	}
	:global(.dark) .chip:hover {
		background: rgba(255, 255, 255, 0.09);
		border-color: rgba(255, 255, 255, 0.2);
		color: rgb(241 245 249);
	}

	/* Footer */
	.modal-footer {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.5rem;
		padding: 1rem 1.75rem;
		border-top: 1px solid rgba(15, 23, 42, 0.06);
	}
	@media (min-width: 640px) {
		.modal-footer {
			flex-direction: row;
			align-items: center;
			justify-content: flex-end;
			gap: 1.5rem;
			padding: 1rem 2.25rem;
		}
	}
	:global(.dark) .modal-footer {
		border-top-color: rgba(255, 255, 255, 0.06);
	}

	.link-out {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.1rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: rgb(71 85 105);
		border-radius: 4px;
		transition: color 200ms ease;
	}
	.link-out:hover {
		color: rgb(15 23 42);
	}
	.link-out-primary {
		color: rgb(15 23 42);
	}
	.link-out-primary::after {
		content: '';
		position: absolute;
		left: 0.1rem;
		right: 1.4rem;
		bottom: 0.2rem;
		height: 1px;
		background: currentColor;
		transform-origin: left center;
		transform: scaleX(0);
		transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.link-out-primary:hover::after {
		transform: scaleX(1);
	}
	.link-out:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.18);
	}

	.arrow-wrap {
		display: inline-flex;
		overflow: hidden;
		width: 13px;
		height: 13px;
		position: relative;
	}
	.arrow-wrap :global(svg) {
		transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.link-out:hover .arrow-wrap :global(svg) {
		transform: translate(2px, -2px);
	}

	:global(.dark) .link-out {
		color: rgb(148 163 184);
	}
	:global(.dark) .link-out:hover {
		color: rgb(241 245 249);
	}
	:global(.dark) .link-out-primary {
		color: rgb(241 245 249);
	}
	:global(.dark) .link-out:focus-visible {
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.22);
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
			filter: blur(0);
		}
	}
	@keyframes panel-out {
		from {
			opacity: 1;
			transform: translateY(0) scale(1);
			filter: blur(0);
		}
		to {
			opacity: 0;
			transform: translateY(6px) scale(0.985);
			filter: blur(4px);
		}
	}
	@keyframes stagger-in {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.details-dialog::backdrop,
		.glass-card,
		.close-btn,
		.close-btn :global(svg),
		.stagger,
		.link-out,
		.link-out-primary::after,
		.arrow-wrap :global(svg),
		.chip,
		.chip::after,
		.chip-text {
			animation: none !important;
			transition: none !important;
			opacity: 1;
			transform: none;
			filter: none;
		}
	}
</style>
