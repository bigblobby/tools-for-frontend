import { type Request, type Response } from 'express';
import sharp from 'sharp';
import archiver from 'archiver';
import ico from 'sharp-ico';
import { ImageService } from '@/services/image.service';

export const imageController = () => {
  const imageService = new ImageService();
  
  return {
    getPlaceholderImage: (req: Request, res: Response) => {
      const [width, height] = req.params.dimensions.split('x').map(Number);
      
      if (!width || !height) {
        return res.status(400).send('Invalid dimensions');
      }
      
      const placeholder = imageService.generatePlaceHolderImage(req);

      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return res.send(placeholder);
    },

    optimiseImages: async (req: Request, res: Response): Promise<void> => {
      try {
        const files = req.files as Express.Multer.File[];
        const { width, height, quality, fitment, position, output } = req.body;

        if (!files || files.length === 0) {
          res.status(400).json({ error: 'No images provided' });
          return;
        }

        const optimisedImages = await Promise.all(
          files.map(async (file) => {
            let sharpInstance = sharp(file.buffer)
              .resize(
                Number(width) || null,
                Number(height) || null,
                {
                  fit: fitment || 'cover',
                  position: position || 'centre',
                  withoutEnlargement: true,
                }
              );

            const useOutput = Boolean(output) && output !== 'auto';

            if ((!useOutput && file.mimetype === 'image/png') || (useOutput && output === 'png')) {
              sharpInstance = sharpInstance.png({ quality: Number(quality) || 85 });
            } else if ((!useOutput && file.mimetype === 'image/webp') || (useOutput && output === 'webp')) {
              sharpInstance = sharpInstance.webp({ quality: Number(quality) || 85 });
            } else {
              sharpInstance = sharpInstance.jpeg({ quality: Number(quality) || 85, progressive: true });
            }

            const optimisedBuffer = await sharpInstance.toBuffer();
            const originalName = file.originalname.replace(/\.[^/.]+$/, '');
            const newFileName = `${originalName}_optimised.${useOutput ? output : file.mimetype.split('/')[1]}`;

            return {
              name: newFileName,
              buffer: optimisedBuffer,
            };
          })
        );

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="optimized-images.zip"');

        const archive = archiver('zip', {
          zlib: { level: 9 },
        });

        archive.on('error', (err: Error) => {
          console.error('Archive error:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to create zip file' });
          }
        });

        archive.pipe(res);

        optimisedImages.forEach((image) => {
          archive.append(image.buffer, { name: image.name });
        });

        await archive.finalize();
      } catch (error) {
        console.error('Error optimizing images:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to optimize images' });
        }
      }
    },

    createIcoImages: async (req: Request, res: Response): Promise<void> => {
      try {
        const files = req.files as Express.Multer.File[];
        const { sizes } = req.body;

        if (!files || files.length === 0) {
          res.status(400).json({ error: 'No images provided' });
          return;
        }

        // All required sizes for comprehensive favicon package
        const allSizes = [16, 32, 36, 48, 57, 60, 70, 72, 76, 96, 114, 120, 144, 150, 152, 180, 192, 310];
        const icoSizes = [16, 32, 48, 64, 128, 256];

        // Use custom sizes if provided, otherwise use all sizes
        const pngSizes = sizes
          ? JSON.parse(sizes as string).map(Number).filter((size: number) => size > 0)
          : allSizes;

        if (pngSizes.length === 0) {
          res.status(400).json({ error: 'Invalid sizes provided' });
          return;
        }

        const zipFiles: Array<{ name: string; buffer: Buffer }> = [];

        await Promise.all(
          files.map(async (file) => {
            // Create a map to store buffers by size for reuse
            const sizeBufferMap = new Map<number, Buffer>();

            // Generate all PNG buffers
            await Promise.all(
              pngSizes.map(async (size: number) => {
                const pngBuffer = await sharp(file.buffer)
                  .resize(size, size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 },
                  })
                  .png()
                  .toBuffer();

                sizeBufferMap.set(size, pngBuffer);
              })
            );

            // Favicon PNGs
            const faviconSizes = [16, 32, 96];
            faviconSizes.forEach((size) => {
              const buffer = sizeBufferMap.get(size);
              if (buffer) {
                zipFiles.push({
                  name: `favicon-${size}x${size}.png`,
                  buffer: buffer,
                });
              }
            });

            // Microsoft Tile Icons
            const msIconSizes = [70, 144, 150, 310];
            msIconSizes.forEach((size) => {
              const buffer = sizeBufferMap.get(size);
              if (buffer) {
                zipFiles.push({
                  name: `ms-icon-${size}x${size}.png`,
                  buffer: buffer,
                });
              }
            });

            // Apple Touch Icons
            const appleSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];
            appleSizes.forEach((size) => {
              const buffer = sizeBufferMap.get(size);
              if (buffer) {
                zipFiles.push({
                  name: `apple-icon-${size}x${size}.png`,
                  buffer: buffer,
                });
              }
            });

            // Apple icon (default, typically 180x180)
            const appleIconBuffer = sizeBufferMap.get(180);
            if (appleIconBuffer) {
              zipFiles.push({
                name: 'apple-icon.png',
                buffer: appleIconBuffer,
              });
              zipFiles.push({
                name: 'apple-icon-precomposed.png',
                buffer: appleIconBuffer,
              });
            }

            // Android Icons
            const androidSizes = [36, 48, 72, 96, 144, 192];
            androidSizes.forEach((size) => {
              const buffer = sizeBufferMap.get(size);
              if (buffer) {
                zipFiles.push({
                  name: `android-icon-${size}x${size}.png`,
                  buffer: buffer,
                });
              }
            });

            // Create ICO file with multiple sizes embedded
            const icoPngBuffers = await Promise.all(
              icoSizes.map(async (size: number) => {
                return await sharp(file.buffer)
                  .resize(size, size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 },
                  })
                  .png()
                  .toBuffer();
              })
            );

            const icoBuffer = ico.encode(icoPngBuffers);
            zipFiles.push({
              name: 'favicon.ico',
              buffer: icoBuffer,
            });

            // Create manifest.json with all Android icons
            const manifest = {
              name: 'App',
              icons: [
                { src: '/android-icon-36x36.png', sizes: '36x36', type: 'image/png', density: '0.75' },
                { src: '/android-icon-48x48.png', sizes: '48x48', type: 'image/png', density: '1.0' },
                { src: '/android-icon-72x72.png', sizes: '72x72', type: 'image/png', density: '1.5' },
                { src: '/android-icon-96x96.png', sizes: '96x96', type: 'image/png', density: '2.0' },
                { src: '/android-icon-144x144.png', sizes: '144x144', type: 'image/png', density: '3.0' },
                { src: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png', density: '4.0' },
              ],
            };

            zipFiles.push({
              name: 'manifest.json',
              buffer: Buffer.from(JSON.stringify(manifest, null, 2)),
            });

            // Create browserconfig.xml for Microsoft tiles
            const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/ms-icon-70x70.png"/>
      <square150x150logo src="/ms-icon-150x150.png"/>
      <square310x310logo src="/ms-icon-310x310.png"/>
      <TileColor>#ffffff</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

            zipFiles.push({
              name: 'browserconfig.xml',
              buffer: Buffer.from(browserconfig),
            });
          })
        );

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="favicon-package.zip"');

        const archive = archiver('zip', {
          zlib: { level: 9 },
        });

        archive.on('error', (err: Error) => {
          console.error('Archive error:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to create zip file' });
          }
        });

        archive.pipe(res);

        zipFiles.forEach((file) => {
          archive.append(file.buffer, { name: file.name });
        });

        await archive.finalize();
      } catch (error) {
        console.error('Error creating ICO images:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to create ICO images' });
        }
      }
    }
  };
};