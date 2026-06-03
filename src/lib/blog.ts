type WithDate = { data: { date: Date } };
type WithTags = { data: { tags: string[] } };
type WithDraft = { data: { draft: boolean } };

export function filterDrafts<T extends WithDraft>(posts: T[]): T[] {
  return posts.filter((p) => !p.data.draft);
}

export function sortPostsByDate<T extends WithDate>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getAllTags<T extends WithTags>(posts: T[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
