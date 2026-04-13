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

// ─── New thematic taxonomy (Sanity-native) ──────────────────────────────────

export interface AxisSummary {
  _id: string;
  axisNumber: number;
  name: string;
  shortName: string | null;
  slug: string;
  tagline: string | null;
  description: string | null;
  color: string | null;
  icon: string | null;
  postCount: number;
}

export interface SeriesSummary {
  _id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  axisNumber: number;
  axisSlug: string;
  axisName: string;
  displayOrder: number | null;
  featured: boolean;
  postCount: number;
}

export interface PublisherSummary {
  /** Old WP category slug (preserved — feeds /category/[slug]) */
  slug: string;
  name: string;
  count: number;
}

export interface YearSummary {
  year: number;
  count: number;
}

/**
 * Book / monograph summary consumed by the homepage `BooksShowcase`
 * and the `/books` page. `cover` is the raw Sanity image object so the
 * `urlForImage` builder can size it on demand; it's `null` for the
 * fallback hardcoded books (we render a coloured plate in its place).
 */
export interface BookSummary {
  _id: string;
  title: string;
  subtitle: string | null;
  slug: string | null;
  year: number | null;
  publisher: string | null;
  cover: unknown | null;
  coverAlt: string | null;
  description: string | null;
  /** Which axis the book belongs to — drives the fallback tile colour. */
  axisNumber: number | null;
  axisName: string | null;
  axisSlug: string | null;
  axisColor: string | null;
  externalUrl: string | null;
  /** True when the record came from the in-code fallback list, not Sanity. */
  isFallback: boolean;
}

export function axisHref(slug: string): string {
  return `/axis/${encodeURIComponent(readableSlug(slug))}`;
}

export function seriesHref(slug: string): string {
  return `/series/${encodeURIComponent(readableSlug(slug))}`;
}

export function yearHref(year: number): string {
  return `/archive/year/${year}`;
}

// ─── Home feed (Sanity-native rich post shape) ──────────────────────────────

/**
 * A post as consumed by the homepage & card components. Carries the axis
 * + series inline so the card can render the thematic badge without a
 * second round-trip. `featuredImage` is the raw Sanity image object so
 * the `urlForImage` builder can generate sized URLs on demand.
 */
export interface HomePost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  sticky: boolean;
  featuredImage: unknown | null;
  imageAlt: string | null;
  axis: {
    name: string;
    shortName: string | null;
    slug: string;
    color: string | null;
    axisNumber: number;
  } | null;
  series: {
    name: string;
    slug: string;
  } | null;
  seriesNumber: number | null;
}

export function postHref(slug: string): string {
  return `/blog/${encodeURIComponent(readableSlug(slug))}`;
}
