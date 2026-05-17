<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import * as Fathom from 'fathom-client';
	import { PUBLIC_FATHOM_SITE_ID } from '$env/static/public';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	onMount(() => {
		Fathom.load(PUBLIC_FATHOM_SITE_ID);

		const root = document.documentElement;
		let idleTimer;
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

	$: $page.url.pathname, browser && Fathom.trackPageview();

</script>

<ThemeToggle />
<slot />
