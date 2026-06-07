
import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { WEBP_COMPATIBLE_EXTENSIONS } from './image-constants';

type FileFormat = (url: string) => string;

const CONCURRENCY = 3;
const MAX_CONTENT_LENGTH = 50 * 1024 * 1024;

const SVG_CONTENT_TYPES = new Set(['image/svg+xml', 'svg+xml']);

const isLosslessSource = (ext: string) => ext === 'png' || ext === 'tiff' || ext === 'avif';

export const downloadImages = async (urls: string[], subdirectory: string, fileFormat: FileFormat): Promise<void> => {
  if (urls.length === 0) {
    console.log('No images to download');
    return;
  }

  if (fs.existsSync(subdirectory)) {
    fs.readdirSync(subdirectory).forEach((file) => {
      fs.unlinkSync(path.join(subdirectory, file));
    });
    console.log(`Cleared existing contents of ${subdirectory}`);
  } else {
    fs.mkdirSync(subdirectory, { recursive: true });
  }

  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map((url) => downloadSingleImage(url, subdirectory, fileFormat(url))));
  }
}

const downloadSingleImage = (url: string, subdirectory: string, filename: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image, status code: ${response.statusCode}`));
        return;
      }

      const contentLength = response.headers['content-length'];
      if (contentLength && parseInt(contentLength, 10) > MAX_CONTENT_LENGTH) {
        reject(new Error(`Image too large: ${contentLength} bytes exceeds ${MAX_CONTENT_LENGTH} limit`));
        response.destroy();
        return;
      }

      const contentType = (response.headers['content-type'] || '').split(';')[0].trim();
      const isSvg = SVG_CONTENT_TYPES.has(contentType);

      const chunks: Buffer[] = [];
      response.on('data', (chunk: Buffer) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);

          if (isSvg) {
            const svgPath = path.join(subdirectory, `${filename}.svg`);
            fs.writeFileSync(svgPath, buffer);
            console.log(`Image downloaded: ${svgPath}`);
            resolve();
            return;
          }

          const ext = contentType.split('/')[1] || 'jpg';
          const originalPath = path.join(subdirectory, `${filename}.${ext}`);
          fs.writeFileSync(originalPath, buffer);

          if (WEBP_COMPATIBLE_EXTENSIONS.includes(ext.toLowerCase() as any)) {
            await convertToWebp(buffer, ext, filename, subdirectory, originalPath);
          } else {
            console.log(`Image downloaded: ${originalPath}`);
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      response.on('error', reject);
    });

    req.on('error', reject);
  });
}

async function convertToWebp(
  buffer: Buffer,
  sourceExt: string,
  filename: string,
  subdirectory: string,
  originalPath: string
): Promise<void> {
  const webpPath = path.join(subdirectory, `${filename}.webp`);
  const webpOptions = isLosslessSource(sourceExt)
    ? { lossless: true, quality: 90 }
    : { quality: 85 };

  const webpBuffer = await sharp(buffer).webp(webpOptions).toBuffer();

  if (webpBuffer.length >= buffer.length) {
    console.log(`WebP not smaller (${webpBuffer.length} >= ${buffer.length}), keeping original: ${originalPath}`);
    return;
  }

  fs.writeFileSync(webpPath, webpBuffer);
  if (fs.existsSync(originalPath)) {
    fs.unlinkSync(originalPath);
  }
  console.log(`Image optimized to WebP: ${webpPath}`);
}