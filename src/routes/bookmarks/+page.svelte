<script>
	import LogoIcon from "../../components/LogoIcon.svelte";

	export let data;
</script>

<svelte:head>
	<title>Bookmarks</title>
	<meta name="robots" content="noindex, nofollow, noarchive">
</svelte:head>

<div class="h-screen text-base">
	<div class="flex flex-row justify-center items-center">
		<a href="/" class="inline-flex text-gray-900 dark:text-gray-100 justify-center items-center h-12 w-12 mr-2">
			<LogoIcon />
		</a>
		<h1 class="text-center text-2xl font-bold text-gray-800 dark:text-gray-300 m-4">
			Random Links
		</h1>
	</div>
	{#if data && data.tags}
		<div class="columns-1 md:columns-2 lg:columns-4 max-w-6xl mx-auto p-4 space-y-4 text-black dark:text-white">
			{#each data.tags as tag}
				<div
					class="break-inside-avoid group py-4 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden hover:border-purple-400 shadow-none hover:shadow-md shadow-purple-500 dark:shadow-purple-100 transition-all ease-in"
				>
					<h2 class="text-lg tracking-wide font-medium text-center text-gray-500 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 uppercase ">
						{tag.name}
					</h2>
					<ul class="list-disc marker:text-purple-600 group/links mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-800 group-hover:border-purple-400 transition-all">
						{#each tag.Links as bookmark}
							<li class="ml-6">
								<a
									class="hover:group-hover/links:underline group-hover/links:hover:text-purple-700 dark:group-hover/links:hover:text-purple-400 transition-all ease-in-out p-1 group-hover/links:underline-offset-2 group-hover/links:hover:underline-offset-4"
									href={bookmark.URL}>{bookmark.Name}</a
								>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
		<div class="text-sm text-center italic p-4 text-gray-500 dark:text-gray-400">Data as of {data.lastChecked}</div>
	{/if}
</div>
