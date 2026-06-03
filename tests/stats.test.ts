import { describe, it, expect } from 'vitest';
import { fetchGithubStats, fetchAppStoreStats } from '../src/lib/stats';

describe('fetchGithubStats', () => {
  it('returns live stars on success', async () => {
    const fakeFetch = async () =>
      ({ ok: true, json: async () => ({ stargazers_count: 42 }) }) as Response;
    const result = await fetchGithubStats('a/b', { stars: 1, version: 'v0' }, fakeFetch);
    expect(result.stars).toBe(42);
  });

  it('falls back to baseline on non-ok response', async () => {
    const fakeFetch = async () => ({ ok: false, status: 403 }) as Response;
    const result = await fetchGithubStats('a/b', { stars: 7, version: 'v1' }, fakeFetch);
    expect(result).toEqual({ stars: 7, version: 'v1' });
  });

  it('falls back to baseline when fetch throws', async () => {
    const fakeFetch = async () => {
      throw new Error('network down');
    };
    const result = await fetchGithubStats('a/b', { stars: 3, version: 'v2' }, fakeFetch);
    expect(result).toEqual({ stars: 3, version: 'v2' });
  });
});

describe('fetchAppStoreStats', () => {
  it('returns live version/rating on success', async () => {
    const fakeFetch = async () =>
      ({
        ok: true,
        json: async () => ({ results: [{ version: '2.1', averageUserRating: 4.5 }] }),
      }) as Response;
    const result = await fetchAppStoreStats('123', { rating: null, version: '1.0' }, fakeFetch);
    expect(result).toEqual({ rating: 4.5, version: '2.1' });
  });

  it('falls back when results are empty', async () => {
    const fakeFetch = async () => ({ ok: true, json: async () => ({ results: [] }) }) as Response;
    const result = await fetchAppStoreStats('123', { rating: 3.0, version: '1.0' }, fakeFetch);
    expect(result).toEqual({ rating: 3.0, version: '1.0' });
  });
});
