export const sampleWorkItem = {
	title: 'Staff Engineer',
	companyName: 'Example Co',
	companySlug: 'example-co',
	description: 'Built platform APIs and design systems.',
	url: 'https://example.com',
	image: '/favicon.png',
	isCurrent: true,
	startDate: new Date('2022-01-01'),
	endDate: undefined as Date | undefined,
	techTags: ['TypeScript', 'Svelte', 'PostgreSQL']
};

export const sampleTech = [
	{ name: 'TypeScript', type: 'Language', proficiencyWeight: 5 },
	{ name: 'Svelte', type: 'Framework', proficiencyWeight: 4 },
	{ name: 'PostgreSQL', type: 'Database', proficiencyWeight: 3 }
];
