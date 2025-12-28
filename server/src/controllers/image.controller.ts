import { type Request, type Response } from 'express';

export const createImageController = () => {
  return {
    getPlaceholderImage: (req: Request, res: Response) => {
      const [width, height] = req.params.dimensions.split('x').map(Number);

      // Validate dimensions
      if (!width || !height) {
        return res.status(400).send('Invalid dimensions');
      }

      // Calculate font size based on image size (responsive)
      const fontSize = Math.min(width, height) / 10;

      // Generate SVG
      const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#cccccc"/>
          <text 
            x="50%" 
            y="50%" 
            dominant-baseline="middle" 
            text-anchor="middle" 
            font-family="Arial, sans-serif" 
            font-size="${fontSize}" 
            font-weight="bold" 
            fill="#666666"
          >
            ${width} × ${height}
          </text>
        </svg>
      `.trim();

      // Send as SVG image
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      return res.send(svg);
    }
  };
};