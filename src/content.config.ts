import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string().optional(),
    title: z.string().min(1),
    author: z.string().min(1),
    date: z.string().min(1),
    price: z.number().positive(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { articles };
