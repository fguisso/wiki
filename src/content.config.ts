import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const wiki = defineCollection({
  loader: glob({
    base: './src/content/wiki',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry,
  }),
  schema: z.object({
    title: z.string().trim().optional(),
    description: z.string().trim().nullish(),
    weight: z.number().optional(),
    draft: z.boolean().default(false),
    toc: z.boolean().default(true),
    aliases: z.array(z.string()).default([]),
    cards: z.array(z.object({
      title: z.string(),
      href: z.string(),
      icon: z.string(),
    })).default([]),
  }),
});

export const collections = { wiki };
