import { Router } from 'express';
import { createImageController } from '../controllers/image.controller';

export const createImageRouter = (): Router => {
  const router = Router();
  const controller = createImageController();

  router.get('/placeholder/:dimensions', controller.getPlaceholderImage);

  return router;
};