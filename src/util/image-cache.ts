import { writable } from 'svelte/store';

interface ImageCache {
  [key: string]: string;
}

function createImageCache() {
  const { subscribe, update, set } = writable<ImageCache>({});

  return {
    subscribe,
    addImage: (src: string, dataUrl: string) => update(cache => ({ ...cache, [src]: dataUrl })),
    getImage: (src: string) => {
      let cachedImage: string | undefined;
      subscribe(cache => {
        cachedImage = cache[src];
      })();
      return cachedImage;
    }
  };
}

export const imageCache = createImageCache();