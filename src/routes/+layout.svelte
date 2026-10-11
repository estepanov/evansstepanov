<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import * as Fathom from 'fathom-client';
	import { PUBLIC_FATHOM_SITE_ID } from '$env/static/public';
	import ThemeToggle from '../components/chrome/ThemeToggle.svelte';

	onMount(() => {
		Fathom.load(PUBLIC_FATHOM_SITE_ID);

		const root = document.documentElement;
		let idleTimer: ReturnType<typeof setTimeout> | undefined;
		let rafPending = false;

		const markIdle = () => {
			root.classList.remove('is-scrolling');
		};

		const onScroll = () => {
			if (rafPending) return;
			rafPending = true;
			requestAnimationFrame(() => {
				rafPending = false;
				if (!root.classList.contains('is-scrolling')) {
					root.classList.add('is-scrolling');
				}
				clearTimeout(idleTimer);
				idleTimer = setTimeout(markIdle, 500);
			});
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			clearTimeout(idleTimer);
		};
	});

	$: if (browser && $page.url.pathname) Fathom.trackPageview();
</script>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-800 focus:shadow-lg dark:focus:bg-slate-900 dark:focus:text-slate-100"
	>Skip to content</a
>
<slot />
<ThemeToggle />
