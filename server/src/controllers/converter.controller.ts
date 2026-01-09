import { type Request, type Response } from 'express';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { json2csv, csv2json } from 'json-2-csv';

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
    },
    xmlToJson: (_req: Request, res: Response) => {
      try {
        const xmlString = _req.body.toString('utf8');

        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: '@_',
          textNodeName: '#text',
        });

        const jsonObj = parser.parse(xmlString);
        const jsonString = JSON.stringify(jsonObj, null, 2);

        res.status(200).json({ json: jsonString });
      } catch (error) {
        console.error('Error converting XML to JSON:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to convert XML to JSON' });
      }
    },
    jsonToCsv: (_req: Request, res: Response) => {
      try {
        const jsonString = _req.body.toString('utf8');
        const jsonObj = JSON.parse(jsonString);
        const csv = json2csv(jsonObj);
        res.status(200).json({ csv });
      } catch (error) {
        console.error('Error converting JSON to CSV:', error);
        res.status(500).send('Failed to convert JSON to CSV');
      }
    },
    csvToJson: async (_req: Request, res: Response) => {
      try {
        const csvString = _req.body.toString('utf8');
        const jsonObj = csv2json(csvString);
        const jsonString = JSON.stringify(jsonObj, null, 2);
        res.status(200).json({ json: jsonString });
      } catch (error) {
        console.error('Error converting CSV to JSON:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to convert CSV to JSON' });
      }
    },
  };
};