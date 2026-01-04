import { Router, type Request } from 'express';
import multer from 'multer';
import { imageController } from '@/controllers/image.controller';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
  fileFilter: (_req: Request, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export const createImageRouter = (): Router => {
  const router = Router();
  const controller = imageController();

  router.get('/placeholder/:dimensions', controller.getPlaceholderImage);
  router.post('/optimise', upload.array('images'), controller.optimiseImages);
  router.post('/create-ico', upload.array('images'), controller.createIcoImages);

  return router;
};