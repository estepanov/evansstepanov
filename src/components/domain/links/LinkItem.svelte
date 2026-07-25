<script lang="ts">
	import * as Fathom from 'fathom-client';
	import type { ExternalLink } from '../../../util/links';
	import LinkItemView from './LinkItemView.svelte';

	export let link: ExternalLink;

	const handleClick = () => {
		Fathom.trackEvent(`click_main_link-${link.title}`);
	};
</script>

<LinkItemView {link} onClick={handleClick} />
