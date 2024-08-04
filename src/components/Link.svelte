<script>
	export let href = '';
	export let target = '_self';
	export let rel = 'noopener noreferrer';

	export let onClick = () => {};
</script>

<a
target={target} rel={rel}
	on:click={onClick}
	class="text-gray-800 dark:text-gray-200 hover:text-emerald-500 hover:border-emerald-500 dark:border-gray-800 py-1.5 px-2.5 sm:py-2 sm:px-4 transition-all duration-700 ease-out"
	{href}><slot /></a
>
