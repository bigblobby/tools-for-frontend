import { type Request, type Response } from 'express';
import { XMLBuilder } from 'fast-xml-parser';

export const createConverterController = () => {
  return {
    jsonToXml: (_req: Request, res: Response) => {
      try {
        // req.body is now a Buffer due to express.raw() middleware
        // Convert Buffer to string
        const jsonString = _req.body.toString('utf8');

        // Parse the JSON string to an object
        const jsonObj = JSON.parse(jsonString);

        // Convert JSON object to XML
        const builder = new XMLBuilder();
        const xml = builder.build(jsonObj);

        res.status(200).json({ xml });
      } catch (error) {
        console.error('Error converting JSON to XML:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to convert JSON to XML' });
      }
    }
  }
}