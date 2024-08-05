import { getFileExtension, hashFileName } from "./file-names";

type NotionFile = {
    name: string,
    type: string,
    file: InnerFile
}

type InnerFile = {
    url: string,
    expiry_time: string,
}

export const formatNotionFiles = (files: NotionFile[]): string[] => {
    console.log(files);
    return files.map(item => {
        const fileName = hashFileName(item.file.url);
        const fileExtension = getFileExtension(item.file.url);
        return `_dld/static/${fileName}.${fileExtension}`;
    });
}