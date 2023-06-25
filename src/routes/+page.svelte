<script>
	import Logo from '../components/Logo.svelte'
	import Link from '../components/Link.svelte'
	export let data
</script>

<svelte:head>
	<title>Evans Stepanov</title>
</svelte:head>

<div class="flex justify-center items-center p-5 flex-col h-screen space-y-20">
	<div class="w-60 text-gray-900 dark:text-gray-100 p-1"><Logo /></div>
	<ul class="flex flex-col md:flex-row uppercase tracking-wide">
		{#each data.links as link}	
		<li class="uppercase my-2 mx-2 text-center">
			<Link href={link.url}>{link.title}</Link>
		</li>
		{/each}
	</ul>
	<div class="text-xs text-gray-500 dark:text-gray-400 text-center">
		<span class="italic">“I have not failed. I've just found 10,000 ways that won't work.”</span> ― Thomas A. Edison
	</div>
</div>
