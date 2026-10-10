<script lang="ts">
	export let label: string = 'Now';
	export let variant: 'jade' | 'subtle' = 'jade';
	export let animation: 'ping' | 'orbit' = 'ping';
	export let className: string = '';

	$: classes = ['status', `status--${variant}`, `status--${animation}`, className]
		.filter(Boolean)
		.join(' ');
</script>

<span class={classes} role="status" aria-label={label}>
	<span class="status__dot" aria-hidden="true">
		{#if animation === 'ping'}
			<span class="status__ping"></span>
		{:else}
			<span class="status__ring"></span>
			<span class="status__sat"></span>
		{/if}
	</span>
	<span class="status__label">{label}</span>
</span>

<style lang="postcss">
	@reference "../../app.css";

	.status {
		@apply inline-flex items-center gap-1.5 select-none;
		font-feature-settings: 'ss01', 'cv11';
	}

	.status--orbit {
		gap: 0.75rem;
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

	.status__ring {
		position: absolute;
		inset: -5px;
		border-radius: 9999px;
		border: 1px solid var(--status-ring);
	}

	.status__sat {
		position: absolute;
		inset: -5px;
		border-radius: 9999px;
		animation: status-orbit-sweep 7s linear infinite;
		will-change: transform;
	}

	.status__sat::before {
		content: '';
		position: absolute;
		top: -1px;
		left: 50%;
		width: 3px;
		height: 3px;
		margin-left: -1.5px;
		border-radius: 9999px;
		background: var(--status-sat);
	}

	.status__label {
		@apply text-[10px] font-medium uppercase;
		letter-spacing: 0.18em;
		color: var(--status-label);
		line-height: 1;
		padding-top: 1px;
	}

	.status--jade {
		--status-color: var(--color-jade-500);
		--status-halo: color-mix(in oklab, var(--color-jade-500) 18%, transparent);
		--status-ring: color-mix(in oklab, var(--color-jade-500) 24%, transparent);
		--status-sat: var(--color-jade-400);
		--status-label: var(--color-jade-700);
	}

	:global(html.dark) .status--jade {
		--status-color: var(--color-jade-400);
		--status-halo: color-mix(in oklab, var(--color-jade-400) 22%, transparent);
		--status-ring: color-mix(in oklab, var(--color-jade-400) 26%, transparent);
		--status-sat: var(--color-jade-300);
		--status-label: var(--color-jade-300);
	}

	.status--subtle {
		--status-color: var(--color-mist-500);
		--status-halo: color-mix(in oklab, var(--color-mist-500) 18%, transparent);
		--status-ring: color-mix(in oklab, var(--color-mist-500) 24%, transparent);
		--status-sat: var(--color-mist-400);
		--status-label: var(--color-slate-600);
	}

	:global(html.dark) .status--subtle {
		--status-color: var(--color-slate-300);
		--status-halo: color-mix(in oklab, var(--color-slate-300) 22%, transparent);
		--status-ring: color-mix(in oklab, var(--color-slate-300) 26%, transparent);
		--status-sat: var(--color-slate-200);
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

	@keyframes status-orbit-sweep {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.status__ping {
			animation: none;
			opacity: 0;
		}

		.status__sat {
			animation: none;
			transform: rotate(-45deg);
		}
	}
</style>
