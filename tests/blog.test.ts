import { describe, it, expect } from 'vitest';
import { filterDrafts, sortPostsByDate, getAllTags } from '../src/lib/blog';

type Post = { data: { date: Date; tags: string[]; draft: boolean } };

const make = (date: string, tags: string[], draft = false): Post => ({
  data: { date: new Date(date), tags, draft },
});

describe('filterDrafts', () => {
  it('removes drafts', () => {
    const posts = [make('2026-01-01', [], false), make('2026-01-02', [], true)];
    expect(filterDrafts(posts)).toHaveLength(1);
  });
});

describe('sortPostsByDate', () => {
  it('sorts newest first', () => {
    const posts = [make('2026-01-01', []), make('2026-03-01', []), make('2026-02-01', [])];
    const sorted = sortPostsByDate(posts);
    expect(sorted.map((p) => p.data.date.getMonth())).toEqual([2, 1, 0]);
  });

  it('does not mutate the input array', () => {
    const posts = [make('2026-01-01', []), make('2026-03-01', [])];
    sortPostsByDate(posts);
    expect(posts[0].data.date.getMonth()).toBe(0);
  });
});

describe('getAllTags', () => {
  it('counts tags and sorts by count then name', () => {
    const posts = [make('2026-01-01', ['a', 'b']), make('2026-01-02', ['a'])];
    expect(getAllTags(posts)).toEqual([
      { tag: 'a', count: 2 },
      { tag: 'b', count: 1 },
    ]);
  });
});
