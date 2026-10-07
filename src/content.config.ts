import { glob } from 'astro/loaders';
import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*{md,mdx}', base: './src/data/blog' }),
  schema: ({image}) => z.object({title:z.string(), description:z.string(), authors:z.array(reference('authors')), pubDate:z.coerce.date(), updatedDate:z.coerce.date().optional(), heroImage:image().optional(), categories:z.array(z.string()).default([]), mappingKey:z.string(), draft:z.boolean().default(false)}),
});
const authors = defineCollection({
  loader: glob({pattern:'**/[^_]*{md,mdx}',base:'./src/data/authors'}),
  schema: ({image}) => z.object({name:z.string(),avatar:image(),about:z.string(),email:z.string(),authorLink:z.string()}),
});
const cases = defineCollection({
  loader: glob({pattern:'**/*.md',base:'./src/data/cases'}),
  schema: () => z.object({title:z.string(),description:z.string(),client:z.string(),year:z.string(),category:z.string()}),
});
export const collections = {blog, authors, cases};
