import { parseColor } from '@/helpers/color.helpers';
import type { Request } from 'express';

export class ImageService {
  generatePlaceHolderImage(req: Request) {
    const [width, height] = req.params.dimensions.split('x').map(Number);
    const { color, bgColor, text } = req.query;

    const parsedColor = parseColor(color as string);
    const parsedBgColor = parseColor(bgColor as string);

    const resultText = text ? String(text).replaceAll('\\n', '\n') : `${width} × ${height}`;
    const lines = resultText.split('\n');
    const numLines = lines.length;
    
    const baseFontSize = Math.min(width, height) / 5;
    const fontSize = baseFontSize / Math.sqrt(numLines);
    const lineHeight = fontSize * 1.2;
    
    const totalHeight = numLines * lineHeight;
    const centerY = height / 2;
    const startY = centerY - (totalHeight / 2) + (lineHeight / 2);

    const textElements = lines.map((line, index) => {
      const y = startY + (index * lineHeight);
      return `<tspan x="50%" y="${y}">${line}</tspan>`;
    }).join('');

    return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${parsedBgColor || '#cccccc'}"/>
          <text 
            x="50%" 
            text-anchor="middle" 
            font-family="Arial, sans-serif" 
            font-size="${fontSize}" 
            font-weight="bold" 
            fill="${parsedColor || '#666666'}"
          >
            ${textElements}
          </text>
        </svg>
      `.trim();
  }
}