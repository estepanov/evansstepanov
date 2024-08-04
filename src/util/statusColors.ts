
export const getColorFromWeight = (weight: number) => {

	if (weight >= 3) {
		return 'text-green-400';
	}
	if (weight >= 2) {
		return 'text-green-300';
	}
	if (weight >= 1) {
		return 'text-green-200';
	}
	return 'text-gray-500';
};