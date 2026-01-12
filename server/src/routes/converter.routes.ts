import { Router } from 'express';
import express from 'express';
import { createConverterController } from '@/controllers/converter.controller';

export const createConverterRouter = (): Router => {
  const router = Router();
  const controller = createConverterController();

  // Set a large limit (50MB) for converter routes to handle large files
  const largeBodyLimit = '50mb';

  router.post('/json-to-xml', express.raw({ type: 'application/json', limit: largeBodyLimit }), controller.jsonToXml);
  router.post('/xml-to-json', express.raw({ type: 'application/xml', limit: largeBodyLimit }), controller.xmlToJson);
  router.post('/json-to-csv', express.raw({ type: 'application/json', limit: largeBodyLimit }), controller.jsonToCsv);
  router.post('/csv-to-json', express.raw({ type: 'text/csv', limit: largeBodyLimit }), controller.csvToJson);

  return router;
};