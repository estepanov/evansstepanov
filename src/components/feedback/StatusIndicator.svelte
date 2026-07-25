<script lang="ts">
	export let label: string = 'Now';
	export let variant: 'emerald' | 'subtle' = 'emerald';
	export let className: string = '';
</script>

<span class="status status--{variant} {className}" role="status" aria-label={label}>
	<span class="status__dot" aria-hidden="true">
		<span class="status__ping"></span>
	</span>
	<span class="status__label">{label}</span>
</span>

<style lang="postcss">
	@reference "../../app.css";

	.status {
		@apply inline-flex items-center gap-1.5 select-none;
		font-feature-settings: 'ss01', 'cv11';
	}

	.status__dot {
		position: relative;
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 9999px;
		background: var(--status-color);
		box-shadow: 0 0 0 1px var(--status-halo);
	}

	.status__ping {
		position: absolute;
		inset: 0;
		border-radius: 9999px;
		background: var(--status-color);
		opacity: 0.55;
		animation: status-ping 2s cubic-bezier(0.22, 1, 0.36, 1) infinite;
	}

	.status__label {
		@apply text-[10px] font-medium uppercase;
		letter-spacing: 0.18em;
		color: var(--status-label);
		line-height: 1;
		padding-top: 1px;
	}

	.status--emerald {
		--status-color: var(--color-emerald-500);
		--status-halo: color-mix(in oklab, var(--color-emerald-500) 18%, transparent);
		--status-label: var(--color-emerald-700);
	}

	:global(html.dark) .status--emerald {
		--status-color: var(--color-emerald-400);
		--status-halo: color-mix(in oklab, var(--color-emerald-400) 22%, transparent);
		--status-label: var(--color-emerald-300);
	}

	.status--subtle {
		--status-color: var(--color-slate-500);
		--status-halo: color-mix(in oklab, var(--color-slate-500) 18%, transparent);
		--status-label: var(--color-slate-600);
	}

	:global(html.dark) .status--subtle {
		--status-color: var(--color-slate-300);
		--status-halo: color-mix(in oklab, var(--color-slate-300) 22%, transparent);
		--status-label: var(--color-slate-300);
	}

	@keyframes status-ping {
		0% {
			transform: scale(1);
			opacity: 0.55;
		}
		70% {
			transform: scale(2.6);
			opacity: 0;
		}
		100% {
			transform: scale(2.6);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.status__ping {
			animation: none;
			opacity: 0;
		}
	}
</style>
