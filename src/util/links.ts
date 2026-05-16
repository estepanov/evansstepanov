export type ExternalLinkKind =
	| 'github'
	| 'linkedin'
	| 'email'
	| 'x'
	| 'bluesky'
	| 'mastodon'
	| 'instagram'
	| 'threads'
	| 'youtube'
	| 'twitch'
	| 'stackoverflow'
	| 'medium'
	| 'substack'
	| 'devto'
	| 'codepen'
	| 'dribbble'
	| 'behance'
	| 'producthunt'
	| 'npm'
	| 'discord'
	| 'slack'
	| 'calendly'
	| 'notion'
	| 'figma'
	| 'website'
	| 'other';

export interface ExternalLink {
	title: string;
	url: string;
	host: string;
	kind: ExternalLinkKind;
}

interface RawExternalLink {
	title?: string | null;
	url?: string | null;
}

const getDisplayHost = (url: string): string => {
	if (url.startsWith('mailto:')) return 'Email';

	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return (
			url
				.replace(/^https?:\/\//, '')
				.replace(/^www\./, '')
				.split('/')[0] || 'External link'
		);
	}
};

const getLinkKind = (url: string, host: string): ExternalLinkKind => {
	if (url.startsWith('mailto:')) return 'email';
	const normalizedHost = host.toLowerCase();

	if (normalizedHost === 'github.com' || normalizedHost.endsWith('.github.com')) return 'github';
	if (normalizedHost === 'linkedin.com' || normalizedHost.endsWith('.linkedin.com'))
		return 'linkedin';
	if (
		normalizedHost === 'x.com' ||
		normalizedHost.endsWith('.x.com') ||
		normalizedHost === 'twitter.com' ||
		normalizedHost.endsWith('.twitter.com')
	)
		return 'x';
	if (normalizedHost === 'bsky.app' || normalizedHost.endsWith('.bsky.app')) return 'bluesky';
	if (normalizedHost === 'mastodon.social' || normalizedHost.includes('mastodon'))
		return 'mastodon';
	if (normalizedHost === 'instagram.com' || normalizedHost.endsWith('.instagram.com'))
		return 'instagram';
	if (normalizedHost === 'threads.net' || normalizedHost.endsWith('.threads.net')) return 'threads';
	if (normalizedHost === 'youtube.com' || normalizedHost.endsWith('.youtube.com')) return 'youtube';
	if (normalizedHost === 'youtu.be') return 'youtube';
	if (normalizedHost === 'twitch.tv' || normalizedHost.endsWith('.twitch.tv')) return 'twitch';
	if (normalizedHost === 'stackoverflow.com' || normalizedHost.endsWith('.stackoverflow.com'))
		return 'stackoverflow';
	if (normalizedHost === 'medium.com' || normalizedHost.endsWith('.medium.com')) return 'medium';
	if (normalizedHost === 'substack.com' || normalizedHost.endsWith('.substack.com'))
		return 'substack';
	if (normalizedHost === 'dev.to') return 'devto';
	if (normalizedHost === 'codepen.io') return 'codepen';
	if (normalizedHost === 'dribbble.com' || normalizedHost.endsWith('.dribbble.com'))
		return 'dribbble';
	if (normalizedHost === 'behance.net' || normalizedHost.endsWith('.behance.net')) return 'behance';
	if (normalizedHost === 'producthunt.com' || normalizedHost.endsWith('.producthunt.com'))
		return 'producthunt';
	if (normalizedHost === 'npmjs.com' || normalizedHost.endsWith('.npmjs.com')) return 'npm';
	if (normalizedHost === 'discord.com' || normalizedHost === 'discord.gg') return 'discord';
	if (normalizedHost === 'slack.com' || normalizedHost.endsWith('.slack.com')) return 'slack';
	if (normalizedHost === 'calendly.com' || normalizedHost.endsWith('.calendly.com'))
		return 'calendly';
	if (normalizedHost === 'notion.so' || normalizedHost.endsWith('.notion.so')) return 'notion';
	if (normalizedHost === 'figma.com' || normalizedHost.endsWith('.figma.com')) return 'figma';
	if (host) return 'website';

	return 'other';
};

export const normalizeExternalLink = ({
	title,
	url
}: RawExternalLink): ExternalLink | undefined => {
	const cleanUrl = url?.trim();
	if (!cleanUrl) return undefined;

	const host = getDisplayHost(cleanUrl);

	return {
		title: title?.trim() || host,
		url: cleanUrl,
		host,
		kind: getLinkKind(cleanUrl, host)
	};
};
