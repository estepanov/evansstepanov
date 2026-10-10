import { getFileExtension, hashFileName } from './file-names';
import { WEBP_COMPATIBLE_EXTENSIONS } from './image-constants';

type NotionFile = {
	name: string;
	type: string;
	file: InnerFile;
};

type InnerFile = {
	url: string;
	expiry_time: string;
};

export const formatNotionFiles = (files: NotionFile[]): string[] => {
	console.log(files);
	return files.map((item) => {
		const fileName = hashFileName(item.file.url);
		const fileExtension = getFileExtension(item.file.url);
		const lowerExtension = fileExtension?.toLowerCase();
		const ext =
			lowerExtension && (WEBP_COMPATIBLE_EXTENSIONS as readonly string[]).includes(lowerExtension)
				? 'webp'
				: (fileExtension ?? '');
		return `_dld/static/${fileName}${ext ? '.' + ext : ''}`;
	});
};
