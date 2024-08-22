<script lang="ts">
	import { imageCache } from '../util/image-cache';
	export let classNames: string;
	export let src: string;
	export let alt: string;
	export let shouldLoad: boolean = false;

	let loaded = false;
	let imageElement: HTMLImageElement;

	$: if (shouldLoad && imageElement && !loaded) {
		loadImage();
	}

	function loadImage() {
		const cachedImage = imageCache.getImage(src);
		if (cachedImage) {
			imageElement.src = cachedImage;
			loaded = true;
		} else {
			imageElement.onload = () => {
				loaded = true;
				// Cache the loaded image
				const canvas = document.createElement('canvas');
				canvas.width = imageElement.naturalWidth;
				canvas.height = imageElement.naturalHeight;
				canvas.getContext('2d')?.drawImage(imageElement, 0, 0);
				const dataUrl = canvas.toDataURL();
				imageCache.addImage(src, dataUrl);
			};
            setTimeout(() => {
                imageElement.src = src;
            }, 500);
		}
	}
</script>

<div class="block h-32 w-32 flex-shrink-0">
	{#if !loaded}
		<div
			class={`relative h-full flex-shrink-0 bg-emerald-50 dark:bg-emerald-950 rounded-md animate-pulse bg-opacity-40 px-10 transition-all ease-in-out ${
				loaded ? 'opacity-0' : 'opacity-100'
			}`}
		>
			<div class="spinner border-4 dark:border-black border-t-emerald-500 dark:border-t-emerald-500" />
		</div>
	{/if}
	<img
		bind:this={imageElement}
		{alt}
		class={`${classNames} h-32 ${loaded ? 'opacity-100' : 'opacity-0'}`}
	/>
</div>

<style>
	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 40px;
		height: 40px;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
</style>
