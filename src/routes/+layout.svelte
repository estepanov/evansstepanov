<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import * as Fathom from 'fathom-client';
	import { PUBLIC_FATHOM_SITE_ID } from '$env/static/public';

	onMount(() => {
		Fathom.load(PUBLIC_FATHOM_SITE_ID);
	});

	$: $page.url.pathname, browser && Fathom.trackPageview();

</script>

<slot />
