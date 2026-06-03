type Fetch = typeof fetch;

export interface GithubFallback {
  stars: number | null;
  version: string | null;
}
export interface GithubStats {
  stars: number | null;
  version: string | null;
}

export async function fetchGithubStats(
  repo: string,
  fallback: GithubFallback,
  fetchFn: Fetch = fetch,
): Promise<GithubStats> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'wenanlin-studio',
    };
    const token = import.meta.env?.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetchFn(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = (await res.json()) as { stargazers_count?: number };
    return {
      stars: json.stargazers_count ?? fallback.stars,
      version: fallback.version,
    };
  } catch {
    return { stars: fallback.stars, version: fallback.version };
  }
}

export interface AppStoreFallback {
  rating: number | null;
  version: string | null;
}
export interface AppStoreStats {
  rating: number | null;
  version: string | null;
}

export async function fetchAppStoreStats(
  appStoreId: string,
  fallback: AppStoreFallback,
  fetchFn: Fetch = fetch,
): Promise<AppStoreStats> {
  try {
    const res = await fetchFn(`https://itunes.apple.com/lookup?id=${appStoreId}`);
    if (!res.ok) throw new Error(`iTunes API ${res.status}`);
    const json = (await res.json()) as {
      results?: { version?: string; averageUserRating?: number }[];
    };
    const r = json.results?.[0];
    if (!r) throw new Error('app not found');
    return {
      rating: r.averageUserRating ?? fallback.rating,
      version: r.version ?? fallback.version,
    };
  } catch {
    return { rating: fallback.rating, version: fallback.version };
  }
}
