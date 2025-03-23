<script>
    export let title = '';
</script>

<div class="space-y-4">
    <div class="relative flex">
        <h2 class="flex-shrink text-center font-bold text-xl dark:text-gray-400 tracking-widest text-gray-800 uppercase">{title}</h2>
    </div>
    <slot />
</div>