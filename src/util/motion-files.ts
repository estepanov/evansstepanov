
import fs from 'fs';
import path from 'path';
import https from 'https';

type fileFormat = (filePath: string) => string;

export const downloadImages = async (urls: string[], subdirectory: string, fileFormat:fileFormat ): Promise<void> => {
  // Clear the subdirectory if it exists
  if (fs.existsSync(subdirectory)) {
    fs.readdirSync(subdirectory).forEach((file) => {
      const filePath = path.join(subdirectory, file);
      fs.unlinkSync(filePath);
    });
    console.log(`Cleared existing contents of ${subdirectory}`);
  } else {
    // Create the subdirectory if it doesn't exist
    fs.mkdirSync(subdirectory, { recursive: true });
  }

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    await downloadSingleImage(url, subdirectory, fileFormat(url));
  }
}

const downloadSingleImage = (url: string, subdirectory: string, filename: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Check if the request was successful
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image, status code: ${response.statusCode}`));
        return;
      }

      // Determine the file extension
      const contentType = response.headers['content-type'];
      const extension = contentType ? contentType.split('/')[1] : 'jpg'; // Default to jpg if content-type is not available

      // Construct the full file path
      const fullPath = path.join(subdirectory, `${filename}.${extension}`);

      // Create a write stream
      const fileStream = fs.createWriteStream(fullPath);

      // Pipe the response to the file
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Image downloaded successfully: ${fullPath}`);
        resolve();
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}