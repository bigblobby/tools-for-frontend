import { parseColor } from '@/helpers/color.helpers';
import type { Request } from 'express';

export class ImageService {
  generatePlaceHolderImage(req: Request) {
    const [width, height] = req.params.dimensions.split('x').map(Number);
    const { color, bgColor } = req.query;

    const parsedColor = parseColor(color as string);
    const parsedBgColor = parseColor(bgColor as string);
    const fontSize = Math.min(width, height) / 10;

    return `
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
  }
}