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
	});

	$: $page.url.pathname, browser && Fathom.trackPageview();

</script>

<ThemeToggle />
<slot />
