import { ZodObject, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';

export const validate = (schema: ZodObject<any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query || {},
        params: req.params || {},
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          error: 'Validation failed',
          details: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      console.error('Validation error:', error);
      return res.status(422).json({ error: 'Validation failed' });
    }
  };
}