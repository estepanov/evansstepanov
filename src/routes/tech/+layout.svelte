<script lang="ts">
	import Logo from '../../components/Logo.svelte';
</script>

<svelte:head>
	<title>Tech Stack - Evans Stepanov</title>
	<meta name="description" content="Explore the technologies and tools I work with." />
</svelte:head>

<div class="min-h-screen bg-white dark:bg-black">
	<header class="w-full flex justify-center items-center p-5">
		<div class="w-40">
			<Logo />
		</div>
	</header>
	
	<main>
		<slot />
	</main>
</div>
