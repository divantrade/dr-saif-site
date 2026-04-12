// ─── Shared types and pure utilities (safe for client components) ───────────

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

export interface CategoryNode {
  category: WPCategory;
  children: CategoryNode[];
}

/** Decode the WordPress URL-encoded slug into human-readable Arabic. */
export function readableSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

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

export function categoryHref(slug: string): string {
  return `/category/${encodeURIComponent(readableSlug(slug))}`;
}
