<script lang="ts">
	import * as Fathom from 'fathom-client';
	import WorkExperienceCardView from './WorkExperienceCardView.svelte';

	export let item: any;

	const handleCardClick = () => {
		if (!item?.companySlug) return;
		Fathom.trackEvent(`click_work_card-${item.title}`);
	};
</script>

<WorkExperienceCardView {item} onCardClick={handleCardClick} />
