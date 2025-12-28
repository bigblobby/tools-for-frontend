import { Router, type Request, type Response } from 'express';
import { createConverterRouter } from './converter.routes';
import { createImageRouter } from './image.routes';

export const createRouter = (): Router => {
  const router = Router();

  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
  });

  router.use('/converter', createConverterRouter());
  router.use('/image', createImageRouter());

  return router;
};

