import { z } from 'zod';

export const getPlaceholderImageSchema = z.object({
  params: z.object({
    dimensions: z.string().min(1, 'Dimensions parameter is required'),
  }),
  query: z.object({
    bgColor: z.string().optional(),
    color: z.string().optional(),
    text: z.string().optional(),
  }).optional(),
});

export const optimiseImageSchema = z.object({
  // files: z.array(z.any()),
  body: z.object({
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
    quality: z.coerce.number().min(1).max(100).optional(),
    fitment: z.string().optional(),
    position: z.string().optional(),
    output: z.string().optional(),
  }).optional(),
});