<script>
	import Logo from '../components/Logo.svelte';
	import Link from '../components/Link.svelte';
	export let data;
</script>

<svelte:head>
	<title>Evans Stepanov</title>
</svelte:head>

<div
	class="flex justify-center items-center p-5 flex-col space-y-10 max-w-screen-md mx-auto"
>
	<div class="w-60 p-1"><Logo /></div>
	<ul class="flex flex-row flex-wrap uppercase tracking-wide justify-center items-center">
		{#each data.links as link}
			<li class="uppercase my-1 sm:my-2 mx-1 sm:mx-2 md:mx-3 leading-8 text-center text-xs sm:text-sm">
				<Link href={link.url}>{link.title}</Link>
			</li>
		{/each}
	</ul>
	<main class="w-full space-y-10">
		<div class="space-y-2">
			<div class="relative flex py-5 items-center">
				<div class="flex-grow border-t dark:border-gray-800 border-gray-300"></div>
				<h2 class="flex-shrink mx-4 font-bold text-lg dark:text-gray-400 tracking-widest text-gray-800 uppercase">About</h2>
				<div class="flex-grow border-t dark:border-gray-800 border-gray-300"></div>
			</div>
			<p>
				Professioinally I enjoy building seamless and delightful user experiences via full stack
				TypeScript web applications. With experience working on code bases of every size from small
				startups to one of the largest. Improving reliability and stability, while delivering
				incremental value.
			</p>
		</div>
		<div class="space-y-2">
			<div class="relative flex py-5 items-center">
				<div class="flex-grow border-t dark:border-gray-800 border-gray-300"></div>
				<h2 class="flex-shrink mx-4 font-bold text-lg dark:text-gray-400 tracking-widest text-gray-800 uppercase">Work</h2>
				<div class="flex-grow border-t dark:border-gray-800 border-gray-300"></div>
			</div>
			<ul class=" space-y-4">
				{#each data.work as work}
					<li>
						<div>
							<h3 class="font-bold mb-2">
								<span class="text-gray-700 dark:text-gray-200">
									{work.title}
								</span>
								<span class="px-1 text-gray-700 dark:text-gray-400 font-thin">@</span>
								{#if work.url}
								<a target="_blank" rel="noopener" referrerpolicy="no-referrer" href={work.url} class="font-normal text-gray-700 dark:text-gray-300 underline-offset-2 underline hover:text-emerald-500 transition-all duration-200 ease-in"
										>{work.companyName}</a
									>
									{:else}
									<span class="font-normal text-gray-700 dark:text-gray-300 "
									>{work.companyName}</span
								>
									{/if}
							</h3>
							<p class="leading-tight dark:text-gray-200 text-gray-600">{work.description}</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
		<div class="space-y-2">
			<div class="relative flex py-5 items-center">
				<div class="flex-grow border-t dark:border-gray-800 border-gray-300"></div>
				<h2 class="flex-shrink mx-4 font-bold text-lg dark:text-gray-400 tracking-widest text-gray-800 uppercase">Tech</h2>
				<div class="flex-grow border-t dark:border-gray-800 border-gray-300"></div>
			</div>
			<ul class="flex flex-row flex-wrap">
				{#each data.tech as tech}
					<li class="mr-5 mb-2">
						<span>{tech.name}</span>
					</li>
				{/each}
			</ul>
		</div>
	</main>
	<footer class="mt-10">
		<div class="my-5 text-xs text-gray-500 dark:text-gray-400 text-center">
			<span class="italic">“I have not failed. I've just found 10,000 ways that won't work.”</span> ― Thomas
			A. Edison
		</div>
	</footer>
</div>
