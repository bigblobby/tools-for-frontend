import { type Request, type Response } from 'express';
import { parseColor } from '@/helpers/color.helpers';
import sharp from 'sharp';
import archiver from 'archiver';

export const createImageController = () => {
  return {
    getPlaceholderImage: (req: Request, res: Response) => {
      const [width, height] = req.params.dimensions.split('x').map(Number);
      const { color, bgColor } = req.query;

      const parsedColor = parseColor(color as string);
      const parsedBgColor = parseColor(bgColor as string);

      if (!width || !height) {
        return res.status(400).send('Invalid dimensions');
      }

      const fontSize = Math.min(width, height) / 10;

      const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${parsedBgColor || '#cccccc'}"/>
          <text 
            x="50%" 
            y="50%" 
            dominant-baseline="middle" 
            text-anchor="middle" 
            font-family="Arial, sans-serif" 
            font-size="${fontSize}" 
            font-weight="bold" 
            fill="${parsedColor || '#666666'}"
          >
            ${width} × ${height}
          </text>
        </svg>
      `.trim();

      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return res.send(svg);
    },

    optimiseImages: async (req: Request, res: Response): Promise<void> => {
      try {
        const files = req.files as Express.Multer.File[];
        const { width, height, quality } = req.body;

        if (!files || files.length === 0) {
          res.status(400).json({ error: 'No images provided' });
          return;
        }

        const optimisedImages = await Promise.all(
          files.map(async (file) => {
            let sharpInstance = sharp(file.buffer)
              .resize(
                width ? Number(width) : undefined,
                height ? Number(height) : undefined,
                {
                  fit: 'inside',
                  withoutEnlargement: true,
                }
              );

            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
              sharpInstance = sharpInstance.jpeg({ quality: Number(quality) || 85, progressive: true });
            } else if (file.mimetype === 'image/png') {
              sharpInstance = sharpInstance.png({ quality: Number(quality) || 85 });
            } else {
              sharpInstance = sharpInstance.jpeg({ quality: Number(quality) || 85, progressive: true });
            }

            const optimisedBuffer = await sharpInstance.toBuffer();
            const originalName = file.originalname.replace(/\.[^/.]+$/, '');
            const newFileName = `${originalName}_optimised.${file.mimetype.split('/')[1]}`;

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
    }
  };
};