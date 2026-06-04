import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

const productions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/productions' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['github', 'appstore']),
    tags: z.array(z.string()).default([]),
    repo: z.string().optional(),
    appStoreId: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    // Decorative baseline values; refreshed from API at build, fall back to these.
    stars: z.number().optional(),
    rating: z.number().optional(),
    version: z.string().optional(),
  }),
});

export const collections = { blog, productions };
