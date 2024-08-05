<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let parentRouter: string | null = null;
	export let isOpen: boolean = false;
	const dispatch = createEventDispatcher();

	type Image = {
		url: string;
		alt: string;
	};
	export let images: Image[] = [];
	let selectedImage: Image | null = null;

	function openModal(image: Image) {
		selectedImage = image;
	}

	function closeModal() {
		selectedImage = null;
	}
</script>

<div
	class={`mt-4 w-full bg-gray-300 dark:bg-slate-900 bg-opacity-50 rounded-xl ${
		isOpen ? ' h-32' : 'h-0'
	} overflow-hidden transition-all ease-in-out duration-500`}
>
	<div class="flex overflow-x-auto space-x-4 p-4">
		{#each images as image}
			<a href={`${parentRouter}`} on:click={() => openModal(image)}>
					<img
						src={image.url}
                        loading="lazy"
						alt={image.alt}
						class={`h-24 w-auto object-cover cursor-pointer rounded-lg shadow-sm hover:shadow-lg duration-300 grayscale border border-white dark:border-black opacity-80 hover:opacity-100 transition-all ease-in`}
					/>
			</a>
		{/each}
	</div>
</div>
{#if selectedImage}
	<div
		class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
		on:click={closeModal}
	>
		<div
			class="max-w-3xl max-h-[90vh] p-4 bg-white dark:bg-black rounded-lg"
			on:click|stopPropagation
		>
			<img
				src={selectedImage.url}
				alt={selectedImage.alt}
				class="max-w-full max-h-[80vh] object-contain"
			/>
			<button class="absolute top-4 right-4 text-3xl text-gray-200" on:click={closeModal}>
				&times;
			</button>
		</div>
	</div>
{/if}
