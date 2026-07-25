<script lang="ts">
	import * as Fathom from 'fathom-client';
	import WorkExperienceCardView from './WorkExperienceCardView.svelte';
	import { workExperienceHref } from '../../../util/work-experience-href';
	import type { Work } from '../../../data/work';

	export let item: Work;

	const handleCardClick = () => {
		if (!workExperienceHref(item.companySlug)) return;
		Fathom.trackEvent(`click_work_card-${item.title}`);
	};
</script>

<WorkExperienceCardView {item} onCardClick={handleCardClick} />
