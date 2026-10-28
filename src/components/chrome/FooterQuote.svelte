<script lang="ts">
	import { onMount } from 'svelte';
	import { pickRandomQuote, type Quote } from './pick-random-quote';

	export let quotes: Quote[] = [];
	export let fallback: Quote;

	let quote: Quote = fallback;

	onMount(() => {
		quote = pickRandomQuote(quotes, fallback);
	});
</script>

<p class="italic">“{quote.text}” ― {quote.attribution}</p>
