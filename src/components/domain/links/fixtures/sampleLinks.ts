import type { ExternalLink } from '../../../../util/links';

export const sampleLinks: ExternalLink[] = [
	{
		title: 'GitHub',
		url: 'https://github.com/example',
		host: 'github.com',
		kind: 'github'
	},
	{
		title: 'Email',
		url: 'mailto:hello@example.com',
		host: 'Email',
		kind: 'email'
	},
	{
		title: 'Personal site',
		url: 'https://example.com',
		host: 'example.com',
		kind: 'website'
	}
];

export const sampleGithubLink = sampleLinks[0];
