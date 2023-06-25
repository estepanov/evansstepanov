<script>
	export let data;
</script>

<svelte:head>
	<title>Bookmarks</title>
</svelte:head>

<div class="h-screen text-base">
	{#if data && data.tags}
		<div class="columns-1 md:columns-2 lg:columns-4 max-w-6xl mx-auto p-4 space-y-4">
			{#each data.tags as tag}
				<div
					class="group py-2 px-4 rounded-lg border-2 border-slate-200 overflow-hidden hover:border-purple-200 scale-100 hover:scale-105 shadow-none hover:shadow-lg shadow-purple-500 transition-all ease-in-out"
				>
					<h2 class="text-lg text-slate-500 font-bold tracking-wider group-hover:text-purple-500">
						{tag.name}
					</h2>
					<ul class="list-disc py-2 group/links">
						{#each tag.Links as bookmark}
							<li class="ml-4">
								<a
									class="hover:group-hover/links:underline group-hover/links:hover:text-purple-700 transition-all ease-in-out p-1"
									href={bookmark.URL}>{bookmark.Name}</a
								>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
			<div class="text-sm text-center italic p-4 text-gray-500">Data as of {data.lastChecked}</div>
	{/if}
</div>
