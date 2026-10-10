<script>
	export let title = '';
</script>

<div class="space-y-4">
	<div class="relative flex w-full">
		{#if title}
			<h2
				class="shrink leading-none text-center font-bold text-xl dark:text-gray-400 tracking-widest text-gray-800 uppercase"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- title is repo-authored markup (e.g. <em>), never user input -->
				{@html title}
			</h2>
		{:else}
			<slot name="title" />
		{/if}
	</div>
	<slot />
</div>
