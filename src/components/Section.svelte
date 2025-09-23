<script>
    export let title = '';
</script>

<div class="space-y-4">
    <div class="relative flex w-full">
        {#if title}
            <h2 class="flex-shrink leading-none text-center font-bold text-xl dark:text-gray-400 tracking-widest text-gray-800 uppercase">{@html title}</h2>
        {:else}
            <slot name="title" />
        {/if}
    </div>
    <slot />
</div>