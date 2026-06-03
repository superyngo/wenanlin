import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { filterDrafts, sortPostsByDate } from '../lib/blog';

export async function GET(context: APIContext) {
  const posts = sortPostsByDate(filterDrafts(await getCollection('blog')));
  return rss({
    title: 'wenanlin — Blog',
    description: 'Writing from the studio.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  });
}
