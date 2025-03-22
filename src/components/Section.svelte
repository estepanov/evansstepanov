<script>
    export let title = '';
</script>

<div class="space-y-3">
    <div class="relative flex pb-8">
        <!-- <div class="flex-grow border-t dark:border-gray-800 border-gray-300"></div> -->
        <h2 class="flex-shrink text-center font-bold text-xl dark:text-gray-400 tracking-widest text-gray-800 uppercase">{title}</h2>
        <!-- <div class="ml-8 flex-grow border-t dark:border-gray-700 border-gray-300"></div> -->
    </div>
    <slot />
</div>