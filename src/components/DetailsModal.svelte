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
		Tag,
		ArrowUpRight
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
	const EXIT_MS = 220;

	$: title = type === 'work' ? item?.title : item?.name;
	$: subtitle = type === 'work' ? item?.companyName : undefined;
	$: kicker = type === 'work' ? 'Case · Work' : 'Case · Project';
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
	$: yearRange = (() => {
		if (!item?.startDate) return null;
		const startYear = new Date(item.startDate).getFullYear();
		if (item.endDate) {
			const endYear = new Date(item.endDate).getFullYear();
			return startYear === endYear ? `${startYear}` : `${startYear}–${endYear}`;
		}
		return type === 'work' ? `${startYear}–Now` : `${startYear}`;
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
	class:is-project={type === 'project'}
	class:is-work={type === 'work'}
>
	{#if (open || closing) && item}
		<div class="modal-panel relative flex w-full max-w-3xl max-h-[90vh]" role="document">
			<!-- decorative tinted gradient blobs (behind frosted glass) -->
			<div class="glass-tint" aria-hidden="true">
				<span class="tint tint-a"></span>
				<span class="tint tint-b"></span>
				<span class="tint tint-c"></span>
			</div>

			<div class="glass-card relative flex flex-1 overflow-hidden rounded-2xl">
				<!-- left accent rail -->
				<aside class="accent-rail shrink-0" aria-hidden="true">
					<div class="rail-mark">
						<span class="rail-kicker">{type === 'work' ? 'W' : 'P'}</span>
					</div>
					<div class="rail-line"></div>
					{#if yearRange}
						<div class="rail-year">{yearRange}</div>
					{/if}
				</aside>

				<div class="flex flex-col flex-1 min-w-0">
					<header class="relative flex items-start gap-4 px-6 sm:px-8 pt-6 pb-5">
						<div class="flex-1 min-w-0">
							<div class="kicker">
								<span class="kicker-dot"></span>
								{kicker}
							</div>
							<h2 id="details-modal-title" class="modal-title">
								{title}
							</h2>
							{#if subtitle}
								<p class="modal-subtitle">
									at <span class="subtitle-strong">{subtitle}</span>
								</p>
							{/if}
							{#if item.startDate}
								<p class="modal-date">
									<Calendar size={12} strokeWidth={2} aria-hidden="true" />
									<span class="tabular-nums">
										{getFormattedDate(item.startDate)}
										{#if item.endDate}
											<span class="mx-1.5 opacity-60">→</span>{getFormattedDate(item.endDate)}
										{:else if type === 'work'}
											<span class="mx-1.5 opacity-60">→</span>Present
										{/if}
									</span>
								</p>
							{/if}
						</div>
						<button
							type="button"
							class="close-btn"
							on:click={handleClose}
							aria-label="Close details"
						>
							<X size={16} strokeWidth={2.2} aria-hidden="true" />
						</button>
					</header>

					<div class="modal-body overflow-y-auto px-6 sm:px-8 pb-6 space-y-7">
						{#if heroImage}
							<figure class="hero-frame">
								<img src={heroImage} alt={mediaAlt(0)} loading="lazy" />
								<figcaption class="hero-badge">01 · Cover</figcaption>
							</figure>
						{/if}

						{#if media.length > 0}
							<section aria-label="Media gallery">
								<div class="section-label">
									<span class="section-index">01</span>
									<span class="section-name">Gallery</span>
									<span class="section-rule"></span>
									<span class="section-count tabular-nums">{media.length}</span>
								</div>
								<ul class="media-grid">
									{#each media as src, i (src)}
										<li class="media-tile" style="--i: {i}">
											<img src="/{src}" alt={mediaAlt(i)} loading="lazy" />
										</li>
									{/each}
								</ul>
							</section>
						{/if}

						{#if item.description}
							<section aria-label="Description">
								<div class="section-label">
									<span class="section-index">{media.length > 0 || heroImage ? '02' : '01'}</span>
									<span class="section-name">Overview</span>
									<span class="section-rule"></span>
								</div>
								<p class="description-text">
									{item.description}
								</p>
							</section>
						{/if}

						{#if techTags.length > 0}
							<section aria-labelledby="modal-tech-heading">
								<div class="section-label">
									<span class="section-index"
										>{((heroImage || media.length > 0 ? 1 : 0) + (item.description ? 1 : 0) + 1)
											.toString()
											.padStart(2, '0')}</span
									>
									<span id="modal-tech-heading" class="section-name">Stack</span>
									<span class="section-rule"></span>
									<span class="section-count tabular-nums">{techTags.length}</span>
								</div>
								<div class="stack-groups">
									{#each groupedTech as group (group.category)}
										{@const meta = CATEGORY_META[group.category] ?? CATEGORY_META.Other}
										<div class="stack-row">
											<div class="stack-cat">
												<svelte:component
													this={meta.icon}
													size={12}
													strokeWidth={2}
													aria-hidden="true"
												/>
												<span>{meta.label}</span>
											</div>
											<ul class="stack-chips" aria-label="{meta.label} technologies">
												{#each group.tags as tag (tag)}
													<li>
														<a href="/tech/{tag}" class="chip">
															<span class="chip-dot"></span>
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
						<footer class="modal-footer">
							{#if sourceUrl}
								<a
									href={sourceUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="btn btn-ghost"
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
									class="btn btn-primary"
								>
									<span>Visit {hostFromUrl(primaryUrl)}</span>
									<ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" />
								</a>
							{/if}
						</footer>
					{/if}
				</div>
			</div>
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
		background:
			radial-gradient(60% 50% at 50% 40%, rgba(16, 185, 129, 0.08), transparent 70%),
			rgba(8, 12, 22, 0.55);
		backdrop-filter: blur(10px) saturate(140%);
		-webkit-backdrop-filter: blur(10px) saturate(140%);
		opacity: 0;
		animation: backdrop-in 260ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.details-dialog.is-closing::backdrop {
		animation: backdrop-out 220ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	/* Outer panel holds the tint blobs + the glass card */
	.modal-panel {
		opacity: 0;
		transform: translateY(14px) scale(0.985);
		animation: panel-in 320ms cubic-bezier(0.22, 1, 0.36, 1) 40ms forwards;
		margin: 1rem;
		filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.35));
	}
	@media (max-width: 640px) {
		.modal-panel {
			margin: 1.25rem 1rem;
			max-height: calc(100dvh - 2.5rem);
		}
	}

	.details-dialog.is-closing .modal-panel {
		animation: panel-out 220ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	/* Tinted gradient blobs that sit behind the frosted glass */
	.glass-tint {
		position: absolute;
		inset: -10%;
		pointer-events: none;
		border-radius: 2rem;
		overflow: hidden;
		z-index: 0;
	}
	.tint {
		position: absolute;
		display: block;
		border-radius: 50%;
		filter: blur(60px);
		opacity: 0.55;
	}
	.tint-a {
		width: 55%;
		height: 55%;
		left: -10%;
		top: -10%;
		background: radial-gradient(circle, #34d399, transparent 65%);
	}
	.tint-b {
		width: 50%;
		height: 50%;
		right: -8%;
		top: 20%;
		background: radial-gradient(circle, #60a5fa, transparent 65%);
	}
	.tint-c {
		width: 45%;
		height: 45%;
		left: 20%;
		bottom: -15%;
		background: radial-gradient(circle, #f472b6, transparent 65%);
		opacity: 0.4;
	}
	.is-work .tint-a {
		background: radial-gradient(circle, #f59e0b, transparent 65%);
	}
	.is-work .tint-b {
		background: radial-gradient(circle, #34d399, transparent 65%);
	}
	.is-work .tint-c {
		background: radial-gradient(circle, #818cf8, transparent 65%);
	}

	/* The actual frosted glass surface */
	.glass-card {
		position: relative;
		z-index: 1;
		background: rgba(255, 255, 255, 0.62);
		backdrop-filter: blur(28px) saturate(180%);
		-webkit-backdrop-filter: blur(28px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.55);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.65),
			inset 0 -1px 0 rgba(15, 23, 42, 0.04),
			0 1px 0 rgba(15, 23, 42, 0.04);
		color: rgb(15 23 42);
	}
	:global(.dark) .glass-card {
		background: rgba(10, 14, 24, 0.55);
		border: 1px solid rgba(148, 163, 184, 0.18);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.06),
			inset 0 -1px 0 rgba(0, 0, 0, 0.4);
		color: rgb(241 245 249);
	}

	/* Left accent rail */
	.accent-rail {
		width: 56px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.25rem 0 1rem;
		border-right: 1px solid rgba(15, 23, 42, 0.08);
		background: linear-gradient(
			180deg,
			rgba(16, 185, 129, 0.12),
			rgba(16, 185, 129, 0.02) 60%,
			transparent
		);
	}
	.is-work .accent-rail {
		background: linear-gradient(
			180deg,
			rgba(245, 158, 11, 0.14),
			rgba(245, 158, 11, 0.02) 60%,
			transparent
		);
	}
	:global(.dark) .accent-rail {
		border-right-color: rgba(148, 163, 184, 0.15);
	}
	.rail-mark {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		display: grid;
		place-items: center;
		background: rgba(16, 185, 129, 0.18);
		color: rgb(4 120 87);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.05em;
	}
	.is-work .rail-mark {
		background: rgba(245, 158, 11, 0.2);
		color: rgb(146 64 14);
	}
	:global(.dark) .rail-mark {
		background: rgba(52, 211, 153, 0.18);
		color: rgb(110 231 183);
	}
	:global(.dark) .is-work .rail-mark {
		background: rgba(251, 191, 36, 0.2);
		color: rgb(253 224 71);
	}
	.rail-line {
		flex: 1;
		width: 1px;
		margin: 0.75rem 0;
		background: linear-gradient(180deg, rgba(15, 23, 42, 0.15), transparent);
	}
	:global(.dark) .rail-line {
		background: linear-gradient(180deg, rgba(148, 163, 184, 0.35), transparent);
	}
	.rail-year {
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		letter-spacing: 0.2em;
		color: rgb(100 116 139);
		text-transform: uppercase;
	}
	:global(.dark) .rail-year {
		color: rgb(148 163 184);
	}

	.kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgb(71 85 105);
	}
	:global(.dark) .kicker {
		color: rgb(148 163 184);
	}
	.kicker-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: rgb(16 185 129);
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
	}
	.is-work .kicker-dot {
		background: rgb(245 158 11);
		box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18);
	}

	.modal-title {
		margin-top: 0.5rem;
		font-size: 1.5rem;
		line-height: 1.15;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: rgb(15 23 42);
	}
	:global(.dark) .modal-title {
		color: rgb(248 250 252);
	}
	@media (min-width: 640px) {
		.modal-title {
			font-size: 1.875rem;
		}
	}

	.modal-subtitle {
		margin-top: 0.375rem;
		font-size: 0.875rem;
		color: rgb(71 85 105);
	}
	:global(.dark) .modal-subtitle {
		color: rgb(148 163 184);
	}
	.subtitle-strong {
		font-weight: 600;
		color: rgb(30 41 59);
	}
	:global(.dark) .subtitle-strong {
		color: rgb(226 232 240);
	}

	.modal-date {
		margin-top: 0.75rem;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 11px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		color: rgb(71 85 105);
		background: rgba(15, 23, 42, 0.05);
		padding: 0.3rem 0.55rem;
		border-radius: 999px;
	}
	:global(.dark) .modal-date {
		color: rgb(148 163 184);
		background: rgba(148, 163, 184, 0.08);
	}

	.close-btn {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 999px;
		color: rgb(71 85 105);
		background: rgba(255, 255, 255, 0.5);
		border: 1px solid rgba(15, 23, 42, 0.08);
		backdrop-filter: blur(6px);
		transition:
			background 160ms,
			color 160ms,
			transform 160ms;
	}
	.close-btn:hover {
		background: rgba(15, 23, 42, 0.08);
		color: rgb(15 23 42);
		transform: rotate(90deg);
	}
	:global(.dark) .close-btn {
		color: rgb(148 163 184);
		background: rgba(15, 23, 42, 0.4);
		border-color: rgba(148, 163, 184, 0.2);
	}
	:global(.dark) .close-btn:hover {
		background: rgba(148, 163, 184, 0.15);
		color: rgb(241 245 249);
	}

	/* Hero image */
	.hero-frame {
		position: relative;
		border-radius: 14px;
		overflow: hidden;
		border: 1px solid rgba(15, 23, 42, 0.08);
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.5) inset,
			0 20px 40px -20px rgba(15, 23, 42, 0.25);
	}
	:global(.dark) .hero-frame {
		border-color: rgba(148, 163, 184, 0.18);
	}
	.hero-frame img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;
	}
	.hero-badge {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		padding: 0.3rem 0.55rem;
		border-radius: 6px;
		color: rgb(255 255 255);
		background: rgba(15, 23, 42, 0.55);
		backdrop-filter: blur(6px);
	}

	/* Section labels */
	.section-label {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.9rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgb(100 116 139);
	}
	:global(.dark) .section-label {
		color: rgb(148 163 184);
	}
	.section-index {
		color: rgb(16 185 129);
		font-weight: 700;
	}
	.is-work .section-index {
		color: rgb(217 119 6);
	}
	:global(.dark) .is-work .section-index {
		color: rgb(251 191 36);
	}
	.section-name {
		color: rgb(30 41 59);
		font-weight: 700;
	}
	:global(.dark) .section-name {
		color: rgb(226 232 240);
	}
	.section-rule {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, rgba(15, 23, 42, 0.12), transparent);
	}
	:global(.dark) .section-rule {
		background: linear-gradient(90deg, rgba(148, 163, 184, 0.25), transparent);
	}
	.section-count {
		color: rgb(100 116 139);
	}

	/* Media grid */
	.media-grid {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 0.65rem;
	}
	@media (min-width: 640px) {
		.media-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	.media-tile {
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid rgba(15, 23, 42, 0.08);
		transition:
			transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 240ms;
	}
	.media-tile:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 28px -14px rgba(15, 23, 42, 0.4);
	}
	:global(.dark) .media-tile {
		border-color: rgba(148, 163, 184, 0.18);
	}
	.media-tile img {
		display: block;
		width: 100%;
		height: auto;
		object-fit: cover;
	}

	/* Description */
	.description-text {
		font-size: 0.95rem;
		line-height: 1.65;
		color: rgb(51 65 85);
		white-space: pre-line;
		max-width: 60ch;
	}
	:global(.dark) .description-text {
		color: rgb(203 213 225);
	}

	/* Stack */
	.stack-groups {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}
	.stack-row {
		display: grid;
		grid-template-columns: 110px 1fr;
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
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding-top: 0.3rem;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgb(100 116 139);
	}
	:global(.dark) .stack-cat {
		color: rgb(148 163 184);
	}
	.stack-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}
	.chip {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.65rem 0.3rem 0.55rem;
		border-radius: 999px;
		font-size: 11.5px;
		font-weight: 500;
		color: rgb(30 41 59);
		background: rgba(255, 255, 255, 0.6);
		border: 1px solid rgba(15, 23, 42, 0.1);
		transition:
			color 160ms,
			border-color 160ms,
			background 160ms,
			transform 160ms;
	}
	.chip:hover {
		color: rgb(4 120 87);
		border-color: rgba(16, 185, 129, 0.5);
		background: rgba(16, 185, 129, 0.08);
		transform: translateY(-1px);
	}
	:global(.dark) .chip {
		color: rgb(226 232 240);
		background: rgba(15, 23, 42, 0.5);
		border-color: rgba(148, 163, 184, 0.2);
	}
	:global(.dark) .chip:hover {
		color: rgb(110 231 183);
		border-color: rgba(52, 211, 153, 0.55);
		background: rgba(16, 185, 129, 0.14);
	}
	.chip-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: rgba(15, 23, 42, 0.3);
	}
	.chip:hover .chip-dot {
		background: rgb(16 185 129);
	}
	:global(.dark) .chip-dot {
		background: rgba(148, 163, 184, 0.5);
	}

	/* Footer */
	.modal-footer {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: flex-end;
		padding: 0.95rem 1.5rem;
		border-top: 1px solid rgba(15, 23, 42, 0.08);
		background: rgba(255, 255, 255, 0.35);
		backdrop-filter: blur(10px);
	}
	@media (min-width: 640px) {
		.modal-footer {
			padding: 0.95rem 2rem;
		}
	}
	:global(.dark) .modal-footer {
		border-top-color: rgba(148, 163, 184, 0.15);
		background: rgba(10, 14, 24, 0.45);
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 0.9rem;
		border-radius: 10px;
		font-size: 0.875rem;
		font-weight: 500;
		transition:
			transform 160ms,
			background 160ms,
			color 160ms,
			border-color 160ms;
	}
	.btn:hover {
		transform: translateY(-1px);
	}
	.btn-ghost {
		color: rgb(30 41 59);
		background: rgba(255, 255, 255, 0.65);
		border: 1px solid rgba(15, 23, 42, 0.1);
	}
	.btn-ghost:hover {
		background: rgba(255, 255, 255, 0.9);
		border-color: rgba(15, 23, 42, 0.18);
	}
	:global(.dark) .btn-ghost {
		color: rgb(226 232 240);
		background: rgba(15, 23, 42, 0.55);
		border-color: rgba(148, 163, 184, 0.22);
	}
	:global(.dark) .btn-ghost:hover {
		background: rgba(30, 41, 59, 0.7);
	}
	.btn-primary {
		color: white;
		background: linear-gradient(135deg, rgb(16 185 129), rgb(5 150 105));
		border: 1px solid rgba(5, 150, 105, 0.5);
		box-shadow: 0 8px 20px -8px rgba(16, 185, 129, 0.6);
	}
	.btn-primary:hover {
		background: linear-gradient(135deg, rgb(5 150 105), rgb(4 120 87));
	}
	:global(.dark) .btn-primary {
		color: rgb(2 44 34);
		background: linear-gradient(135deg, rgb(52 211 153), rgb(16 185 129));
		border-color: rgba(52, 211, 153, 0.5);
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
			transform: translateY(8px) scale(0.985);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.details-dialog::backdrop,
		.modal-panel,
		.close-btn,
		.media-tile,
		.btn,
		.chip {
			animation: none;
			transition: none;
			opacity: 1;
			transform: none;
		}
	}
</style>
