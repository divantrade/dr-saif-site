import fs from "fs/promises";
import path from "path";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  slug: string;
  status: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  sticky: boolean;
  categories: number[];
  tags: number[];
}

export interface WPPage {
  id: number;
  date: string;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
}

export interface WPCategory {
  id: number;
  count: number;
  name: string;
  slug: string;
  parent: number;
}

export interface WPTag {
  id: number;
  count: number;
  name: string;
  slug: string;
}

export interface WPMedia {
  id: number;
  title: { rendered: string };
  alt_text: string;
  source_url: string;
  media_details: {
    width: number;
    height: number;
    sizes: Record<
      string,
      { source_url: string; width: number; height: number }
    >;
  };
}

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
  return pages.find((p) => p.slug === slug);
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

// ─── Utilities ───────────────────────────────────────────────────────────────

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}
