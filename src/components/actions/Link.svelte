<script>
	export let href = '';
	export let target = '_self';
	export let rel = 'noopener noreferrer';

	export let onClick = () => {};
</script>

<a
	{target}
	{rel}
	on:click={onClick}
	class="text-slate-800 dark:text-slate-200 hover:text-jade-700 hover:border-jade-500 dark:border-slate-800 py-1.5 px-2.5 sm:py-2 sm:px-4 transition-all duration-700 ease-out"
	{href}><slot /></a
>
