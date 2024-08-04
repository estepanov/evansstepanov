<script>
    export let title = '';
</script>

<div class="space-y-3">
    <div class="relative flex py-7 items-center">
        <div class="flex-grow border-t dark:border-gray-800 border-gray-300"></div>
        <h2 class="flex-shrink mx-8 font-bold text-lg dark:text-gray-400 tracking-widest text-gray-800 uppercase">{title}</h2>
        <div class="flex-grow border-t dark:border-gray-800 border-gray-300"></div>
    </div>
    <slot />
</div>