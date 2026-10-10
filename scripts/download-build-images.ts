import { Client } from '@notionhq/client';
import { downloadImages } from '../src/util/motion-files';
import { hashFileName } from '../src/util/file-names';
const notion = new Client({
	auth: process.env.NOTION_TOKEN as string
});

const projects = await notion.databases.query({
	database_id: process.env.PROJECTS_NOTION_DB_ID as string
});

const images: string[] = [];

projects.results.forEach((project) => {
	if (!('properties' in project)) return;
	const media = project.properties.Media;
	if (media?.type !== 'files') return;
	media.files.forEach((file) => {
		if ('file' in file) images.push(file.file.url);
	});
});

console.log(images);

try {
	await downloadImages(images, 'static/_dld/static', hashFileName);
} catch (err) {
	console.error('Failed to download images:', err);
	process.exit(1);
}
