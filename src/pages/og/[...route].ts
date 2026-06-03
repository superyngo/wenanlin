import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { filterDrafts } from '../../lib/blog';

const posts = filterDrafts(await getCollection('blog'));

const pages = Object.fromEntries(posts.map((p) => [p.id, { title: p.data.title }]));

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page: { title: string }) => ({
    title: page.title,
    description: 'wenanlin',
    bgGradient: [[22, 22, 26]],
    padding: 80,
  }),
});
