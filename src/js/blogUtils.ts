import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/config/site';
export const postSlug = (post: CollectionEntry<'blog'>) => post.id.replace(/^(fr|en)\//,'').replace(/\/index$/,'');
export async function getAllPosts(lang: Locale) {
  const now = new Date();
  return (await getCollection('blog')).filter(p => p.id.startsWith(lang + '/') && !p.data.draft && p.data.pubDate <= now).sort((a,b)=>b.data.pubDate.getTime()-a.data.pubDate.getTime());
}
export const readingTime = (body: string = '') => Math.max(1, Math.ceil(body.replace(/<[^>]*>/g,'').split(/\s+/).length / 220));
