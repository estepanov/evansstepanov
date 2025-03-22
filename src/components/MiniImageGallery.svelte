<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import LazyLoadImage from './LazyLoadImage.svelte';

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
	class={`w-full bg-gradient-to-br from-gray-200 to-emerald-200 dark:from-gray-800 dark:to-emerald-900 rounded-xl ${
		isOpen ? 'h-40 mt-2' : 'h-0 mt-0'
	} overflow-hidden transition-all ease-in-out duration-500`}
>
	<div class="flex overflow-x-auto space-x-4 p-4">
		{#each images as image}
			<button on:click={() => openModal(image)}>
				<LazyLoadImage
					classNames={`scale-100 ring-opacity-20 ring-white dark:ring-black ring-2 hover:scale-105 w-auto object-cover cursor-pointer rounded shadow-sm hover:shadow-lg duration-300 transition-all ease-in-out`}
					src={image.url}
					shouldLoad={isOpen}
					alt={image.alt}
				/>
			</button>
		{/each}
	</div>
</div>
{#if selectedImage}
	<div
		class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
		on:click={closeModal}
	>
		<div
			class="max-w-3xl max-h-[90vh] p-4 bg-white dark:bg-black rounded-lg m-2"
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
