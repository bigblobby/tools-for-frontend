import { Router } from 'express';
import express from 'express';
import { createConverterController } from '@/controllers/converter.controller';

export const createConverterRouter = (): Router => {
  const router = Router();
  const controller = createConverterController();

  router.post('/json-to-xml', express.raw({ type: 'application/json' }), controller.jsonToXml);
  router.post('/xml-to-json', express.raw({ type: 'application/xml' }), controller.xmlToJson);

  return router;
};