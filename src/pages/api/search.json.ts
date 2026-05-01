import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  
  const searchData = posts
    .filter(post => !post.data.draft)
    .map(post => ({
      title: post.data.title,
      description: post.data.description,
      date: post.data.date.toISOString(),
      slug: post.slug,
      tags: post.data.tags || [],
      body: post.body,
    }));

  return new Response(JSON.stringify(searchData), {
    headers: { 'Content-Type': 'application/json' },
  });
};
