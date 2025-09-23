import { TechProficiency } from "../data/tech";

export const getColorFromWeight = (proficiency: TechProficiency) => {
	switch (proficiency) {
		case TechProficiency.Expert:
			return 'text-purple-900 border-purple-900 dark:text-purple-200 dark:border-purple-200';
		case TechProficiency.Advanced:
			return 'text-purple-800 border-purple-800 dark:text-purple-300 dark:border-purple-300';
		case TechProficiency.Intermediate:
			return 'text-purple-700 border-purple-700 dark:text-purple-400 dark:border-purple-400';
		case TechProficiency.Beginner:
			return 'text-gray-500 border-gray-500 dark:text-gray-500 dark:border-gray-500';
		default:
			return 'text-gray-500 border-gray-500 dark:text-gray-500 dark:border-gray-500';
	}
};