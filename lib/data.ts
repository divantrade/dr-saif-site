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
  // Next.js decodes URL-encoded slugs before handing them to us, while WP
  // stores them URL-encoded with lowercase hex. Compare both forms.
  const target = decodeURIComponent(slug);
  const lower = slug.toLowerCase();
  return posts.find(
    (p) =>
      p.slug === slug ||
      p.slug.toLowerCase() === lower ||
      decodeURIComponent(p.slug) === target
  );
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
      // Hide empty categories from the nav — they produce dead links.
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count)
      .map((cat) => ({ category: cat, children: build(cat.id) }));
  };
  return build(ARTICLES_ROOT_ID);
}

// ─── Tags ────────────────────────────────────────────────────────────────────

export async function getTagBySlug(slug: string): Promise<WPTag | undefined> {
  const tags = await loadTags();
  const target = decodeURIComponent(slug);
  const lower = slug.toLowerCase();
  return tags.find(
    (t) =>
      t.slug === slug ||
      t.slug.toLowerCase() === lower ||
      decodeURIComponent(t.slug) === target
  );
}

export async function getPostsByTagId(tagId: number): Promise<WPPost[]> {
  const posts = await loadPosts();
  return posts.filter((p) => p.tags.includes(tagId));
}

export async function getPaginatedPostsByTagId(
  tagId: number,
  page: number,
  perPage: number = 12
): Promise<{ posts: WPPost[]; totalPages: number; currentPage: number; total: number }> {
  const all = await getPostsByTagId(tagId);
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const start = (page - 1) * perPage;
  return {
    posts: all.slice(start, start + perPage),
    totalPages,
    currentPage: page,
    total: all.length,
  };
}

// ─── Search & related ────────────────────────────────────────────────────────

/** Normalize Arabic for search: remove diacritics, alef variants, etc. */
function normalizeArabic(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u064B-\u0652\u0670]/g, "") // tashkeel / diacritics
    .replace(/[\u0622\u0623\u0625]/g, "\u0627") // alef variants -> ا
    .replace(/\u0629/g, "\u0647") // ة -> ه
    .replace(/\u0649/g, "\u064A") // ى -> ي
    .replace(/[\u0640]/g, "") // tatweel (kashida)
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

export async function searchPosts(query: string, limit = 50): Promise<WPPost[]> {
  const q = normalizeArabic(query);
  if (!q) return [];
  const posts = await loadPosts();
  const results = posts
    .map((p) => {
      const title = normalizeArabic(stripTags(p.title.rendered));
      const excerpt = normalizeArabic(stripTags(p.excerpt.rendered));
      let score = 0;
      if (title.includes(q)) score += 10;
      if (excerpt.includes(q)) score += 3;
      // word boundary bonus
      const tokens = q.split(" ").filter(Boolean);
      for (const t of tokens) {
        if (title.includes(t)) score += 2;
        if (excerpt.includes(t)) score += 1;
      }
      return { post: p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.post);
  return results;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ");
}

/**
 * Find posts related to the given one by shared categories/tags.
 * Returns up to `limit` posts, ranked by overlap strength.
 */
export async function getRelatedPosts(
  post: WPPost,
  limit = 3
): Promise<WPPost[]> {
  const all = await loadPosts();
  const catSet = new Set(post.categories);
  const tagSet = new Set(post.tags);
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => {
      const catOverlap = p.categories.filter((c) => catSet.has(c)).length;
      const tagOverlap = p.tags.filter((t) => tagSet.has(t)).length;
      return { p, score: catOverlap * 3 + tagOverlap };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.p.date).getTime() - new Date(a.p.date).getTime();
    })
    .slice(0, limit)
    .map((r) => r.p);
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
