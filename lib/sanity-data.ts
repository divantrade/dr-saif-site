import "server-only";
import { sanityClient } from "@/sanity/client";
import type {
  AxisSummary,
  SeriesSummary,
  PublisherSummary,
  YearSummary,
  WPPost,
  HomePost,
  BookSummary,
} from "./types";

// ─── Constants ──────────────────────────────────────────────────────────────

/** Legacy WP id of the المقالات root category — its direct children are the
 *  publisher-level taxonomy ("مقالات عربي 21", "مقالات العربي الجديد", …).
 *  We surface these in the "أرشيف → حسب منصة النشر" menu. */
const ARTICLES_ROOT_LEGACY_ID = 42;

// ─── Axis helpers ───────────────────────────────────────────────────────────

const AXIS_FIELDS = `
  _id,
  axisNumber,
  name,
  shortName,
  "slug": slug.current,
  tagline,
  description,
  color,
  icon,
  "postCount": count(*[_type == "post" && references(^._id)])
`;

export async function getAxes(): Promise<AxisSummary[]> {
  return sanityClient.fetch<AxisSummary[]>(
    `*[_type == "intellectualAxis"] | order(axisNumber asc) { ${AXIS_FIELDS} }`,
    {},
    { next: { revalidate: 600, tags: ["axes"] } }
  );
}

export async function getAxisBySlug(
  slug: string
): Promise<AxisSummary | null> {
  return sanityClient.fetch<AxisSummary | null>(
    `*[_type == "intellectualAxis" && slug.current == $slug][0] { ${AXIS_FIELDS} }`,
    { slug },
    { next: { revalidate: 600, tags: ["axes", `axis:${slug}`] } }
  );
}

// ─── Series helpers ─────────────────────────────────────────────────────────

const SERIES_FIELDS = `
  _id,
  name,
  "slug": slug.current,
  tagline,
  description,
  displayOrder,
  featured,
  "axisNumber": axis->axisNumber,
  "axisSlug": axis->slug.current,
  "axisName": axis->name,
  "postCount": count(*[_type == "post" && references(^._id)])
`;

export async function getSeriesList(): Promise<SeriesSummary[]> {
  return sanityClient.fetch<SeriesSummary[]>(
    `*[_type == "series"] | order(coalesce(displayOrder, 999) asc, name asc) {
       ${SERIES_FIELDS}
     }`,
    {},
    { next: { revalidate: 600, tags: ["series"] } }
  );
}

export async function getSeriesBySlug(
  slug: string
): Promise<SeriesSummary | null> {
  return sanityClient.fetch<SeriesSummary | null>(
    `*[_type == "series" && slug.current == $slug][0] { ${SERIES_FIELDS} }`,
    { slug },
    { next: { revalidate: 600, tags: ["series", `series:${slug}`] } }
  );
}

// ─── Post lookups (Sanity-backed, returned in WPPost shape) ────────────────
// We re-shape Sanity docs into the WPPost shape that the existing UI
// components (PostCard, etc.) already consume — so the same components
// render axis/series pages without any modification.

const POST_AS_WP_SHAPE = `
  "id": legacyId,
  "date": publishedAt,
  "date_gmt": publishedAt,
  "slug": slug.current,
  "status": "publish",
  "link": "/blog/" + slug.current,
  "title": { "rendered": title },
  "content": { "rendered": coalesce(rawHtml, "") },
  "excerpt": { "rendered": coalesce(excerpt, "") },
  "author": 1,
  "featured_media": 0,
  "sticky": coalesce(sticky, false),
  "categories": [],
  "tags": []
`;

interface Paginated {
  posts: WPPost[];
  totalPages: number;
  currentPage: number;
  total: number;
}

async function paginatedFetch(
  filter: string,
  params: Record<string, unknown>,
  page: number,
  perPage: number,
  cacheTags: string[]
): Promise<Paginated> {
  const offset = (page - 1) * perPage;
  const limit = offset + perPage;
  // Offsets are integers derived from validated inputs, so inline them
  // into the query string. Keeping them out of `params` prevents
  // accidental clashes with the caller's own filter parameters (e.g.
  // getPaginatedPostsByYear uses $start / $end for the date range).
  const data = await sanityClient.fetch<{ total: number; posts: WPPost[] }>(
    `{
       "total": count(*[_type == "post" && ${filter}]),
       "posts": *[_type == "post" && ${filter}]
                  | order(publishedAt desc)
                  [${offset}...${limit}] { ${POST_AS_WP_SHAPE} }
     }`,
    params,
    { next: { revalidate: 600, tags: cacheTags } }
  );
  return {
    posts: data.posts,
    total: data.total,
    totalPages: Math.max(1, Math.ceil(data.total / perPage)),
    currentPage: page,
  };
}

export async function getPaginatedPostsByAxisSlug(
  slug: string,
  page: number,
  perPage = 12
): Promise<Paginated> {
  // Use the projection-from-target pattern instead of post-side dereference
  // (`axis->slug.current == $slug`). The dereference works in isolation but
  // proved unreliable on our pinned API version when combined with counts
  // and nested projections — `references(^._id)` from the axis doc is the
  // same pattern `getAxes().postCount` uses, and is the canonical recipe.
  const offset = (page - 1) * perPage;
  const limit = offset + perPage;
  const result = await sanityClient.fetch<{
    total: number;
    posts: WPPost[];
  } | null>(
    `*[_type == "intellectualAxis" && slug.current == $slug][0] {
       "total": count(*[_type == "post" && references(^._id)]),
       "posts": *[_type == "post" && references(^._id)]
         | order(publishedAt desc)
         [${offset}...${limit}] { ${POST_AS_WP_SHAPE} }
     }`,
    { slug },
    {
      next: {
        revalidate: 600,
        tags: ["axes", `axis:${slug}`, "posts"],
      },
    }
  );
  const total = result?.total ?? 0;
  return {
    posts: result?.posts ?? [],
    total,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    currentPage: page,
  };
}

export async function getPostsBySeriesSlug(
  slug: string
): Promise<WPPost[]> {
  // Mirrors `postCount` in getSeriesList — project from the series document
  // and count/fetch posts that `references(^._id)`. This is more reliable
  // than filtering posts via `series->slug.current == $slug` because it
  // avoids the reverse-dereference entirely.
  const result = await sanityClient.fetch<{ episodes: WPPost[] } | null>(
    `*[_type == "series" && slug.current == $slug][0] {
       "episodes": *[_type == "post" && references(^._id)]
         | order(coalesce(seriesNumber, 9999) asc, publishedAt asc) {
           ${POST_AS_WP_SHAPE},
           "seriesNumber": seriesNumber
         }
     }`,
    { slug },
    { next: { revalidate: 600, tags: ["series", `series:${slug}`, "posts"] } }
  );
  return result?.episodes ?? [];
}

// ─── Archive: years ─────────────────────────────────────────────────────────

export async function getPostYears(): Promise<YearSummary[]> {
  // Project just the ISO date string and bucket by year in JS. Sanity's
  // `string::split` isn't available on the API version we pin to, and the
  // post set is small (~1.2k) so the JS aggregation is cheap.
  const rows = await sanityClient.fetch<{ publishedAt: string | null }[]>(
    `*[_type == "post" && defined(publishedAt)] { publishedAt }`,
    {},
    { next: { revalidate: 1800, tags: ["posts", "archive"] } }
  );
  const counts = new Map<number, number>();
  for (const r of rows) {
    if (!r.publishedAt) continue;
    const y = Number(r.publishedAt.slice(0, 4));
    if (!Number.isFinite(y)) continue;
    counts.set(y, (counts.get(y) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year);
}

export async function getPaginatedPostsByYear(
  year: number,
  page: number,
  perPage = 12
): Promise<Paginated> {
  const start = `${year}-01-01T00:00:00Z`;
  const end = `${year + 1}-01-01T00:00:00Z`;
  return paginatedFetch(
    `publishedAt >= $start && publishedAt < $end`,
    { start, end },
    page,
    perPage,
    ["posts", `year:${year}`]
  );
}

// ─── Archive: publishers (legacy WP publisher categories) ───────────────────

export async function getPublishers(): Promise<PublisherSummary[]> {
  // The publisher-level taxonomy in WordPress was children of "المقالات"
  // (legacyId=42). We surface them under "أرشيف → حسب منصة النشر".
  const rows = await sanityClient.fetch<
    { name: string; slug: string; count: number }[]
  >(
    `*[_type == "category" && parent->legacyId == $rootId] {
       name,
       "slug": slug.current,
       "count": count(*[_type == "post" && references(^._id)])
     } | order(count desc)`,
    { rootId: ARTICLES_ROOT_LEGACY_ID },
    { next: { revalidate: 1800, tags: ["categories", "archive"] } }
  );
  // Hide empty publisher entries from the menu (would 404).
  return rows.filter((r) => r.count > 0);
}

// ─── Composite navigation payload ───────────────────────────────────────────
// One round-trip helper used by the Header / MobileNav so the menu renders
// in a single fetch instead of three.

export interface NavData {
  axes: AxisSummary[];
  series: SeriesSummary[];
  years: YearSummary[];
  publishers: PublisherSummary[];
}

export async function getNavData(): Promise<NavData> {
  const [axes, series, years, publishers] = await Promise.all([
    getAxes(),
    getSeriesList(),
    getPostYears(),
    getPublishers(),
  ]);
  return { axes, series, years, publishers };
}

// ─── Home feed (rich post shape for the homepage) ──────────────────────────

const HOME_POST_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  "excerpt": coalesce(excerpt, ""),
  publishedAt,
  "sticky": coalesce(sticky, false),
  featuredImage,
  "imageAlt": featuredImage.alt,
  "axis": axis-> {
    name,
    shortName,
    "slug": slug.current,
    color,
    axisNumber
  },
  "series": series-> {
    name,
    "slug": slug.current
  },
  seriesNumber
`;

/**
 * Fetch the top N posts for the homepage — sticky posts first, then newest.
 * Sanity-native shape (HomePost) with axis + series joined in.
 */
export async function getHomeFeed(limit: number): Promise<HomePost[]> {
  return sanityClient.fetch<HomePost[]>(
    `*[_type == "post" && defined(publishedAt)]
       | order(coalesce(sticky, false) desc, publishedAt desc)
       [0...$limit] {
         ${HOME_POST_PROJECTION}
       }`,
    { limit },
    { next: { revalidate: 300, tags: ["posts", "home"] } }
  );
}

/**
 * Fetch the total published post count. Used for the hero stats strip.
 */
export async function getPublishedPostCount(): Promise<number> {
  return sanityClient.fetch<number>(
    `count(*[_type == "post" && defined(publishedAt)])`,
    {},
    { next: { revalidate: 1800, tags: ["posts"] } }
  );
}

/**
 * Counts of posts filed under the "books" and "studies" legacy
 * categories, looked up by their original WordPress ids so the result
 * tracks the archive exactly as migrated. Studies additionally include
 * pieces in "في الكتب والدراسات المعاصرة" (legacyId 39) since editors
 * treated that as a sibling bucket in the old taxonomy.
 *
 * These are displayed in the StatsStrip alongside the total-posts and
 * axes/series counts.
 */
export async function getArchiveCredits(): Promise<{
  books: number;
  studies: number;
}> {
  const BOOKS_LEGACY = 41;
  const STUDIES_LEGACY = 43;
  const BOOKS_AND_STUDIES_LEGACY = 39; // "في الكتب والدراسات المعاصرة"

  return sanityClient.fetch<{ books: number; studies: number }>(
    `{
       "books": count(*[
         _type == "post" && defined(publishedAt) &&
         count(categories[@->legacyId == $booksId]) > 0
       ]),
       "studies": count(*[
         _type == "post" && defined(publishedAt) &&
         count(categories[@->legacyId in $studiesIds]) > 0
       ])
     }`,
    {
      booksId: BOOKS_LEGACY,
      studiesIds: [STUDIES_LEGACY, BOOKS_AND_STUDIES_LEGACY],
    },
    { next: { revalidate: 1800, tags: ["posts", "categories"] } }
  );
}

// ─── Books ──────────────────────────────────────────────────────────────────

/**
 * Foundational titles of the intellectual project. Used as a fallback
 * when the `book` content type in Sanity is still empty — so the
 * homepage section never renders blank. Once an editor adds real `book`
 * documents, those take over automatically.
 *
 * Axis mapping mirrors the BOOK ↔ AXIS pairing in the brief:
 *   1 التأسيس الحضاري, 2 التراث, 3 النهوض, 4 الاستبداد,
 *   5 المواطنة, 6 الثورات, 7 المقاومة.
 */
const FALLBACK_BOOKS: BookSummary[] = [
  {
    _id: "fallback-book-1",
    title: "النظرية السياسية من منظور حضاري إسلامي",
    subtitle: null,
    slug: null,
    year: 2002,
    publisher: "المعهد العالمي للفكر الإسلامي",
    cover: null,
    coverAlt: null,
    description:
      "تأسيس منهجي لعلم السياسة من مرجعية حضارية إسلامية، يَبني مفرداته ومفاهيمه على الكتاب والسنة والخبرة التاريخية للأمّة.",
    axisNumber: 1,
    axisName: "التأسيس الحضاري",
    axisSlug: null,
    axisColor: "emerald",
    externalUrl: null,
    isFallback: true,
  },
  {
    _id: "fallback-book-2",
    title: "الزحف غير المقدَّس: تأميم الدولة للدين",
    subtitle: null,
    slug: null,
    year: 2016,
    publisher: null,
    cover: null,
    coverAlt: null,
    description:
      "قراءة في توظيف السلطة للمؤسّسة الدينية وتحويلها إلى أداة في يد الاستبداد، وتفكيك هذا النمط من منظور مقاصدي.",
    axisNumber: 4,
    axisName: "الاستبداد ومقاومته",
    axisSlug: null,
    axisColor: "red",
    externalUrl: null,
    isFallback: true,
  },
  {
    _id: "fallback-book-3",
    title: "العولمة والإسلام: رؤيتان للعالم",
    subtitle: null,
    slug: null,
    year: 2009,
    publisher: null,
    cover: null,
    coverAlt: null,
    description:
      "مقاربة بين رؤيتين متضادّتين للعالَم: رؤية عولمة بلا مرجعية، ورؤية إسلامية تَصْدُر عن كلّيات الوحي وسُنن التدافع.",
    axisNumber: 5,
    axisName: "المواطنة والدولة",
    axisSlug: null,
    axisColor: "amber",
    externalUrl: null,
    isFallback: true,
  },
  {
    _id: "fallback-book-4",
    title: "المشروع الحضاري الإسلامي للتغيير",
    subtitle: "سيرة ومسيرة",
    slug: null,
    year: 2013,
    publisher: null,
    cover: null,
    coverAlt: null,
    description:
      "معالم مشروع حضاري متكامل في التغيير والنهوض، يقرأ التجربة ويستخلص قواعد العمل والمسيرة.",
    axisNumber: 3,
    axisName: "النهوض والإصلاح",
    axisSlug: null,
    axisColor: "violet",
    externalUrl: null,
    isFallback: true,
  },
  {
    _id: "fallback-book-5",
    title: "فتاوى الأمّة وأصول الفقه الحضاري",
    subtitle: null,
    slug: null,
    year: null,
    publisher: null,
    cover: null,
    coverAlt: null,
    description:
      "اجتهاد في أصول الفقه الحضاري عبر فقه الأمّة لا فقه الفرد — مدخل لقراءة مستأنفة لنصوص الوحي في ضوء الواقع.",
    axisNumber: 1,
    axisName: "التأسيس الحضاري",
    axisSlug: null,
    axisColor: "emerald",
    externalUrl: null,
    isFallback: true,
  },
  {
    _id: "fallback-book-6",
    title: "المداخل المنهاجية للبحث في العلاقات الدولية في الإسلام",
    subtitle: null,
    slug: null,
    year: 1996,
    publisher: "المعهد العالمي للفكر الإسلامي",
    cover: null,
    coverAlt: null,
    description:
      "تأصيل منهجي لدراسة العلاقات الدولية من المرجعية الإسلامية — الإطار والموضوع والمنهج وحدود القول المعرفي.",
    axisNumber: 5,
    axisName: "المواطنة والدولة",
    axisSlug: null,
    axisColor: "amber",
    externalUrl: null,
    isFallback: true,
  },
  {
    _id: "fallback-book-7",
    title: "العلاقات الدولية في الإسلام — مدخل القيم",
    subtitle: "إطار مرجعي لدراسة العلاقات الدولية",
    slug: null,
    year: 1999,
    publisher: "المعهد العالمي للفكر الإسلامي",
    cover: null,
    coverAlt: null,
    description:
      "القيم الإسلامية أطراً مرجعية لدراسة العلاقات الدولية: العدل والشورى والكرامة والسلم — أساس التنظير لا زينة له.",
    axisNumber: 5,
    axisName: "المواطنة والدولة",
    axisSlug: null,
    axisColor: "amber",
    externalUrl: null,
    isFallback: true,
  },
];

const BOOK_FIELDS = `
  _id,
  title,
  subtitle,
  "slug": slug.current,
  year,
  publisher,
  cover,
  "coverAlt": cover.alt,
  description,
  displayOrder,
  featured,
  externalUrl,
  "axisNumber": axis->axisNumber,
  "axisName": axis->name,
  "axisSlug": axis->slug.current,
  "axisColor": axis->color
`;

/**
 * Fetch featured books from Sanity. Returns the hardcoded foundational
 * titles when Sanity has no `book` documents yet, so the homepage
 * section always has something meaningful to render.
 */
export async function getFeaturedBooks(): Promise<BookSummary[]> {
  const rows = await sanityClient.fetch<
    Omit<BookSummary, "isFallback">[]
  >(
    `*[_type == "book" && coalesce(featured, true)]
       | order(coalesce(displayOrder, 999) asc, year desc) {
         ${BOOK_FIELDS}
       }`,
    {},
    { next: { revalidate: 600, tags: ["books"] } }
  );
  if (rows.length === 0) return FALLBACK_BOOKS;
  return rows.map((r) => ({ ...r, isFallback: false }));
}

/**
 * Full book catalogue for the dedicated `/books` page. Falls back to
 * the foundational list for the same reason as the homepage helper.
 */
export async function getAllBooks(): Promise<BookSummary[]> {
  const rows = await sanityClient.fetch<
    Omit<BookSummary, "isFallback">[]
  >(
    `*[_type == "book"]
       | order(coalesce(displayOrder, 999) asc, year desc) {
         ${BOOK_FIELDS}
       }`,
    {},
    { next: { revalidate: 600, tags: ["books"] } }
  );
  if (rows.length === 0) return FALLBACK_BOOKS;
  return rows.map((r) => ({ ...r, isFallback: false }));
}

/**
 * For every axis, return the most recent published post in that axis.
 * Drives the homepage "مختارات من المحاور" feed — one recent piece per
 * axis, so the section showcases the breadth of the project rather
 * than a burst of recent posts from the same theme.
 */
export async function getLatestPostPerAxis(): Promise<
  {
    axisNumber: number;
    axisName: string;
    axisShortName: string | null;
    axisSlug: string;
    axisColor: string | null;
    post: HomePost | null;
  }[]
> {
  return sanityClient.fetch(
    `*[_type == "intellectualAxis"] | order(axisNumber asc) {
       "axisNumber": axisNumber,
       "axisName": name,
       "axisShortName": shortName,
       "axisSlug": slug.current,
       "axisColor": color,
       "post": *[_type == "post" && references(^._id) && defined(publishedAt)]
         | order(publishedAt desc)[0] {
           ${HOME_POST_PROJECTION}
         }
     }`,
    {},
    { next: { revalidate: 300, tags: ["posts", "home", "axes"] } }
  );
}
