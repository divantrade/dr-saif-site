import "server-only";
import fs from "fs/promises";
import path from "path";

// Re-export shared types and utilities so existing imports keep working.
export {
  readableSlug,
  stripHtml,
  formatDate,
  categoryHref,
} from "./types";
export type {
  WPPost,
  WPPage,
  WPCategory,
  WPTag,
  WPMedia,
  CategoryNode,
} from "./types";

import type {
  WPPost,
  WPPage,
  WPCategory,
  WPTag,
  WPMedia,
  CategoryNode,
} from "./types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const dataDir = path.join(process.cwd(), "public", "data");

async function readJSON<T>(filename: string): Promise<T> {
  const raw = await fs.readFile(path.join(dataDir, filename), "utf-8");
  return JSON.parse(raw) as T;
}

// ─── Posts ───────────────────────────────────────────────────────────────────

let postsCache: WPPost[] | null = null;

export async function loadPosts(): Promise<WPPost[]> {
  if (postsCache) return postsCache;
  const posts = await readJSON<WPPost[]>("posts.json");
  // sort newest first
  posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  postsCache = posts;
  return posts;
}

export async function getPostBySlug(
  slug: string
): Promise<WPPost | undefined> {
  const posts = await loadPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getPaginatedPosts(
  page: number,
  perPage: number = 12
): Promise<{ posts: WPPost[]; totalPages: number; currentPage: number }> {
  const allPosts = await loadPosts();
  const totalPages = Math.ceil(allPosts.length / perPage);
  const start = (page - 1) * perPage;
  const posts = allPosts.slice(start, start + perPage);
  return { posts, totalPages, currentPage: page };
}

// ─── Pages ───────────────────────────────────────────────────────────────────

let pagesCache: WPPage[] | null = null;

export async function loadPages(): Promise<WPPage[]> {
  if (pagesCache) return pagesCache;
  const pages = await readJSON<WPPage[]>("pages.json");
  pagesCache = pages;
  return pages;
}

export async function getPageBySlug(
  slug: string
): Promise<WPPage | undefined> {
  const pages = await loadPages();
  // WP slugs are URL-encoded with lowercase hex, while JS encodeURIComponent
  // produces uppercase hex. Compare both the raw slug (case-insensitive) and
  // the decoded Arabic form so either works.
  const target = decodeURIComponent(slug);
  const lower = slug.toLowerCase();
  return pages.find(
    (p) =>
      p.slug === slug ||
      p.slug.toLowerCase() === lower ||
      decodeURIComponent(p.slug) === target
  );
}

// ─── Categories & Tags ───────────────────────────────────────────────────────

let categoriesCache: WPCategory[] | null = null;
let tagsCache: WPTag[] | null = null;

export async function loadCategories(): Promise<WPCategory[]> {
  if (categoriesCache) return categoriesCache;
  categoriesCache = await readJSON<WPCategory[]>("categories.json");
  return categoriesCache;
}

export async function loadTags(): Promise<WPTag[]> {
  if (tagsCache) return tagsCache;
  tagsCache = await readJSON<WPTag[]>("tags.json");
  return tagsCache;
}

export async function getCategoryById(
  id: number
): Promise<WPCategory | undefined> {
  const cats = await loadCategories();
  return cats.find((c) => c.id === id);
}

export async function getCategoriesByIds(
  ids: number[]
): Promise<WPCategory[]> {
  const cats = await loadCategories();
  return cats.filter((c) => ids.includes(c.id));
}

export async function getTagsByIds(ids: number[]): Promise<WPTag[]> {
  const tags = await loadTags();
  return tags.filter((t) => ids.includes(t.id));
}

// ─── Category tree helpers ───────────────────────────────────────────────────

export async function getCategoryBySlug(
  slug: string
): Promise<WPCategory | undefined> {
  const cats = await loadCategories();
  const target = decodeURIComponent(slug);
  return cats.find(
    (c) => c.slug === slug || decodeURIComponent(c.slug) === target
  );
}

export async function getChildCategories(
  parentId: number
): Promise<WPCategory[]> {
  const cats = await loadCategories();
  return cats.filter((c) => c.parent === parentId);
}

/** Recursively collect a category's id plus all descendant ids. */
export async function getCategoryWithDescendantIds(
  rootId: number
): Promise<number[]> {
  const cats = await loadCategories();
  const collected = new Set<number>([rootId]);
  const queue: number[] = [rootId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const c of cats) {
      if (c.parent === current && !collected.has(c.id)) {
        collected.add(c.id);
        queue.push(c.id);
      }
    }
  }
  return Array.from(collected);
}

/** Get posts that belong to a category or any of its descendants. */
export async function getPostsByCategoryId(
  categoryId: number
): Promise<WPPost[]> {
  const [posts, ids] = await Promise.all([
    loadPosts(),
    getCategoryWithDescendantIds(categoryId),
  ]);
  const idSet = new Set(ids);
  return posts.filter((p) => p.categories.some((c) => idSet.has(c)));
}

export async function getPaginatedPostsByCategoryId(
  categoryId: number,
  page: number,
  perPage: number = 12
): Promise<{ posts: WPPost[]; totalPages: number; currentPage: number; total: number }> {
  const all = await getPostsByCategoryId(categoryId);
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const start = (page - 1) * perPage;
  return {
    posts: all.slice(start, start + perPage),
    totalPages,
    currentPage: page,
    total: all.length,
  };
}

/**
 * The main "Articles" hierarchy the site is organized around.
 * Top level is "المقالات" (id=42), which has 6 children that form the header menu.
 * Two of those children themselves have sub-categories.
 */
export const ARTICLES_ROOT_ID = 42;

export async function getArticlesTree(): Promise<CategoryNode[]> {
  const cats = await loadCategories();
  const byParent = new Map<number, WPCategory[]>();
  for (const c of cats) {
    if (!byParent.has(c.parent)) byParent.set(c.parent, []);
    byParent.get(c.parent)!.push(c);
  }
  const build = (parentId: number): CategoryNode[] => {
    const children = byParent.get(parentId) ?? [];
    return children
      .slice()
      .sort((a, b) => b.count - a.count)
      .map((cat) => ({ category: cat, children: build(cat.id) }));
  };
  return build(ARTICLES_ROOT_ID);
}

// ─── Media ───────────────────────────────────────────────────────────────────

let mediaCache: WPMedia[] | null = null;

export async function loadMedia(): Promise<WPMedia[]> {
  if (mediaCache) return mediaCache;
  mediaCache = await readJSON<WPMedia[]>("media.json");
  return mediaCache;
}

export async function getMediaById(
  id: number
): Promise<WPMedia | undefined> {
  const media = await loadMedia();
  return media.find((m) => m.id === id);
}
