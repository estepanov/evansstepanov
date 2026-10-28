import { TechProficiency } from '../data/tech';

const missingProficiencyColor =
	'text-mist-500 border-mist-500 dark:text-mist-400 dark:border-mist-400';

export const getColorFromWeight = (proficiency?: TechProficiency) => {
	switch (proficiency) {
		case TechProficiency.Expert:
			return 'text-iris-800 border-iris-800 dark:text-iris-200 dark:border-iris-200';
		case TechProficiency.Advanced:
			return 'text-iris-700 border-iris-700 dark:text-iris-300 dark:border-iris-300';
		case TechProficiency.Intermediate:
			return 'text-iris-600 border-iris-600 dark:text-iris-400 dark:border-iris-400';
		case TechProficiency.Beginner:
			return missingProficiencyColor;
		case undefined:
			return missingProficiencyColor;
		default: {
			const _exhaustive: never = proficiency;
			return _exhaustive;
		}
	}
};
