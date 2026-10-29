// ISO date strings (`YYYY-MM-DD`) parse as UTC midnight in `new Date`.
// Format in UTC so a 1st-of-month date cannot roll back into the previous month.
export const getFormattedDate = (date: Date): string => {
	const month = date.toLocaleString('default', { month: 'long', timeZone: 'UTC' });
	const year = date.getUTCFullYear();
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
