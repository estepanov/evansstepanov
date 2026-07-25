// input JS Date expect Month Year fromate
export const getFormattedDate = (date: Date): string => {
	const month = date.toLocaleString('default', { month: 'long' });
	const year = date.getFullYear();
	return `${month} ${year}`;
};

export function formatDateRange(
	startDate: Date | string | undefined,
	endDate: Date | string | undefined,
	isCurrent?: boolean
): string {
	if (!startDate) return '';
	const start = getFormattedDate(new Date(startDate));
	if (isCurrent || !endDate) return `${start} — Present`;
	return `${start} — ${getFormattedDate(new Date(endDate))}`;
}
