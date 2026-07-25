<script lang="ts">
	import { ChevronDown, Check } from '@lucide/svelte';
	import { tick, createEventDispatcher, onMount } from 'svelte';

	export let options: Array<{ value: any; label: string; meta?: string }> = [];
	export let value: any = null;
	/** Visible label for the trigger when no value is selected. */
	export let placeholder: string = 'Select';
	/** Accessible name for the control (screen readers). */
	export let ariaLabel: string = 'Select option';
	/** Optional class applied to the outer wrapper, for layout overrides. */
	let className: string = '';
	export { className as class };

	let isOpen = false;
	let activeIndex = 0;
	let triggerEl: HTMLButtonElement;
	let listboxEl: HTMLUListElement;
	let optionRefs: HTMLElement[] = [];

	const dispatch = createEventDispatcher<{ change: any }>();

	$: selectedIndex = options.findIndex((o) => o.value === value);
	$: currentLabel = selectedIndex >= 0 ? options[selectedIndex].label : placeholder;

	async function open() {
		isOpen = true;
		activeIndex = Math.max(0, selectedIndex);
		await tick();
		optionRefs[activeIndex]?.focus();
	}

	function close({ focusTrigger = true } = {}) {
		if (!isOpen) return;
		isOpen = false;
		if (focusTrigger) triggerEl?.focus();
	}

	function selectIndex(i: number) {
		if (i < 0 || i >= options.length) return;
		value = options[i].value;
		dispatch('change', value);
		close();
	}

	function onTriggerKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			open();
		}
	}

	function onListKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'Escape':
				e.preventDefault();
				close();
				return;
			case 'Tab':
				close({ focusTrigger: false });
				return;
			case 'ArrowDown':
				e.preventDefault();
				activeIndex = (activeIndex + 1) % options.length;
				optionRefs[activeIndex]?.focus();
				return;
			case 'ArrowUp':
				e.preventDefault();
				activeIndex = (activeIndex - 1 + options.length) % options.length;
				optionRefs[activeIndex]?.focus();
				return;
			case 'Home':
				e.preventDefault();
				activeIndex = 0;
				optionRefs[activeIndex]?.focus();
				return;
			case 'End':
				e.preventDefault();
				activeIndex = options.length - 1;
				optionRefs[activeIndex]?.focus();
				return;
			case 'Enter':
			case ' ':
				e.preventDefault();
				selectIndex(activeIndex);
				return;
		}
	}

	function onDocumentPointerDown(e: PointerEvent) {
		if (!isOpen) return;
		const target = e.target as Node;
		if (triggerEl?.contains(target) || listboxEl?.contains(target)) return;
		close({ focusTrigger: false });
	}

	onMount(() => {
		document.addEventListener('pointerdown', onDocumentPointerDown);
		return () => document.removeEventListener('pointerdown', onDocumentPointerDown);
	});
</script>

<div class="select {className}" class:select--open={isOpen}>
	<button
		bind:this={triggerEl}
		type="button"
		class="select__trigger"
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		aria-label={ariaLabel}
		on:click={() => (isOpen ? close() : open())}
		on:keydown={onTriggerKeydown}
	>
		<span class="select__value">{currentLabel}</span>
		<ChevronDown size={12} strokeWidth={2.25} class="select__chevron" aria-hidden="true" />
	</button>
	{#if isOpen}
		<ul
			bind:this={listboxEl}
			class="select__menu"
			role="listbox"
			tabindex="-1"
			aria-label={ariaLabel}
			on:keydown={onListKeydown}
		>
			{#each options as option, i (i)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- Keyboard interaction is delegated to the parent ul per the
				     ARIA listbox pattern: option <li>s receive focus
				     programmatically and the ul handles arrow/enter/escape. -->
				<li
					bind:this={optionRefs[i]}
					role="option"
					tabindex="-1"
					aria-selected={value === option.value}
					class="select__option"
					class:select__option--active={i === activeIndex}
					on:click={() => selectIndex(i)}
					on:mouseenter={() => (activeIndex = i)}
				>
					<span class="select__option-check" aria-hidden="true">
						{#if value === option.value}
							<Check size={12} strokeWidth={2.75} />
						{/if}
					</span>
					<span class="select__option-label">{option.label}</span>
					{#if option.meta}
						<span class="select__option-meta">{option.meta}</span>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.select {
		position: relative;
		display: inline-block;
	}

	.select__trigger {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: transparent;
		border: 1px solid color-mix(in oklab, var(--color-slate-400) 35%, transparent);
		border-radius: 999px;
		padding: 4px 8px 4px 12px;
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		font-variant-numeric: tabular-nums;
		color: var(--color-slate-600);
		cursor: pointer;
		line-height: 1;
		transition:
			color 200ms cubic-bezier(0.22, 1, 0.36, 1),
			border-color 200ms cubic-bezier(0.22, 1, 0.36, 1),
			background-color 200ms cubic-bezier(0.22, 1, 0.36, 1),
			box-shadow 200ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	:global(html.dark) .select__trigger {
		border-color: color-mix(in oklab, var(--color-slate-500) 35%, transparent);
		color: var(--color-slate-300);
	}

	.select__trigger:hover {
		border-color: color-mix(in oklab, var(--color-violet-500) 40%, transparent);
		background-color: color-mix(in oklab, var(--color-violet-500) 6%, transparent);
		color: var(--color-violet-600);
	}

	:global(html.dark) .select__trigger:hover {
		border-color: color-mix(in oklab, var(--color-violet-400) 40%, transparent);
		background-color: color-mix(in oklab, var(--color-violet-400) 10%, transparent);
		color: var(--color-violet-300);
	}

	.select__trigger:focus-visible {
		outline: none;
		border-color: color-mix(in oklab, var(--color-violet-500) 60%, transparent);
		box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-violet-500) 25%, transparent);
	}

	.select--open .select__trigger {
		color: var(--color-violet-600);
		border-color: color-mix(in oklab, var(--color-violet-500) 50%, transparent);
		background-color: color-mix(in oklab, var(--color-violet-500) 7%, transparent);
	}

	:global(html.dark) .select--open .select__trigger {
		color: var(--color-violet-300);
		border-color: color-mix(in oklab, var(--color-violet-400) 45%, transparent);
		background-color: color-mix(in oklab, var(--color-violet-400) 10%, transparent);
	}

	.select__trigger :global(.select__chevron) {
		transition: transform 240ms cubic-bezier(0.34, 1.4, 0.5, 1);
		opacity: 0.75;
	}

	.select--open .select__trigger :global(.select__chevron) {
		transform: rotate(180deg);
		opacity: 1;
	}

	.select__menu {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		min-width: max(160px, 100%);
		margin: 0;
		padding: 4px;
		list-style: none;
		background: rgba(255, 255, 255, 0.96);
		border: 1px solid rgba(15, 23, 42, 0.08);
		border-radius: 12px;
		box-shadow:
			0 1px 0 rgba(15, 23, 42, 0.02),
			0 12px 28px -12px rgba(15, 23, 42, 0.22),
			0 4px 10px -6px rgba(15, 23, 42, 0.12);
		-webkit-backdrop-filter: blur(10px) saturate(1.2);
		backdrop-filter: blur(10px) saturate(1.2);
		z-index: 50;
		animation: select-menu-in 180ms cubic-bezier(0.22, 1, 0.36, 1);
		transform-origin: top right;
	}

	:global(html.dark) .select__menu {
		background: rgba(15, 23, 42, 0.92);
		border-color: rgba(255, 255, 255, 0.08);
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.02),
			0 12px 28px -12px rgba(0, 0, 0, 0.6),
			0 4px 10px -6px rgba(0, 0, 0, 0.4);
	}

	@keyframes select-menu-in {
		from {
			opacity: 0;
			transform: translateY(-4px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.select__option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 7px 10px 7px 6px;
		border-radius: 8px;
		font-size: 13px;
		font-weight: 500;
		color: var(--color-slate-700);
		cursor: pointer;
		outline: none;
		font-variant-numeric: tabular-nums;
		transition:
			background-color 140ms cubic-bezier(0.22, 1, 0.36, 1),
			color 140ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	:global(html.dark) .select__option {
		color: var(--color-slate-200);
	}

	.select__option--active,
	.select__option:hover {
		background-color: color-mix(in oklab, var(--color-violet-500) 10%, transparent);
		color: var(--color-violet-700);
	}

	:global(html.dark) .select__option--active,
	:global(html.dark) .select__option:hover {
		background-color: color-mix(in oklab, var(--color-violet-400) 14%, transparent);
		color: var(--color-violet-200);
	}

	.select__option[aria-selected='true'] {
		color: var(--color-violet-700);
	}

	:global(html.dark) .select__option[aria-selected='true'] {
		color: var(--color-violet-300);
	}

	.select__option-check {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
		flex-shrink: 0;
		color: var(--color-violet-600);
	}

	:global(html.dark) .select__option-check {
		color: var(--color-violet-300);
	}

	.select__option-label {
		flex: 1;
		min-width: 0;
		white-space: nowrap;
	}

	.select__option-meta {
		font-size: 11px;
		color: var(--color-slate-400);
		font-variant-numeric: tabular-nums;
	}

	:global(html.dark) .select__option-meta {
		color: var(--color-slate-500);
	}

	.select__value {
		display: inline-block;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.select__trigger,
		.select__trigger :global(.select__chevron),
		.select__option {
			transition: none;
		}
		.select__menu {
			animation: none;
		}
	}
</style>
