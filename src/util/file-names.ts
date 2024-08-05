
import crypto from 'crypto';

export const extractFilePath = (url: string): string => {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        return pathname;
    } catch (error) {
        console.error("Invalid URL provided:", error);
        return "";
    }
}

export const getFileExtension = (url: string): string | null => {
    // Create a URL object
    const parsedUrl = new URL(url);
    // Get the pathname from the URL
    const pathname = parsedUrl.pathname;
    // Split the pathname by '/' and get the last part
    const lastSegment = pathname.split('/').pop();
    
    if (lastSegment) {
        // Split the last segment by '.' and get the last part
        const extension = lastSegment.split('.').pop();
        // Check if there is an extension and it's not the same as the filename
        if (extension && extension !== lastSegment) {
            return extension;
        }
    }
    
    // Return null if no extension is found
    return null;
}

export const hashFileName = (url: string): string => {
    const filePath = extractFilePath(url);
    const hash = crypto.createHash('md5').update(filePath).digest('hex');
    return hash;
}