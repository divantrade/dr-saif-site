/**
 * One-shot migration from public/data/*.json (WordPress export) to Sanity.
 *
 * What it does — in order:
 *   1. Creates a single "author" document for Dr. Saif.
 *   2. Creates all categories, preserving WordPress ids in `legacyId` and
 *      resolving parent references in a second pass.
 *   3. Creates all tags.
 *   4. Uploads every referenced featured image from WordPress to Sanity's
 *      asset store (can be disabled with --skip-images).
 *   5. Creates all posts with:
 *        - title, slug (original URL-encoded WP slug for SEO preservation)
 *        - excerpt (stripped plaintext)
 *        - publishedAt, sticky
 *        - references to categories / tags / author
 *        - featuredImage (when available)
 *        - rawHtml: the original content.rendered (preserved exactly; the
 *          frontend renders it via dangerouslySetInnerHTML + sanitize)
 *        - isMigrated=true, legacyId=<WP id>
 *
 * Idempotent: re-running skips any document whose legacyId already exists
 * in Sanity. Safe to stop and resume.
 *
 * Usage:
 *   npm run migrate:sanity              # full migration
 *   npm run migrate:sanity -- --dry-run # print plan, write nothing
 *   npm run migrate:sanity -- --skip-images
 */

import { config as loadEnv } from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { createClient, type SanityClient } from "@sanity/client";

// Next.js convention: .env.local overrides .env (and is the only one
// gitignored by default). Load both so either works.
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

// ─── Config ────────────────────────────────────────────────────────────────

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !apiVersion) {
  console.error(
    "\n❌ Missing Sanity configuration in .env.local. Required: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_API_VERSION. See .env.example.\n"
  );
  process.exit(1);
}

if (!token) {
  console.error(
    "\n❌ Missing SANITY_WRITE_TOKEN in .env.local — create one at Sanity → API → Tokens (Editor permission) and add it to .env.local before running.\n"
  );
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const SKIP_IMAGES = args.has("--skip-images");

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const dataDir = path.join(process.cwd(), "public", "data");

// ─── Types (matching WordPress export format) ──────────────────────────────

interface WPPost {
  id: number;
  date: string;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  sticky: boolean;
  categories: number[];
  tags: number[];
}

interface WPCategory {
  id: number;
  count: number;
  name: string;
  slug: string;
  parent: number;
  description?: string;
}

interface WPTag {
  id: number;
  count: number;
  name: string;
  slug: string;
}

interface WPMedia {
  id: number;
  alt_text: string;
  source_url: string;
  title?: { rendered: string };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8211;|&#8212;/g, "—")
    .replace(/&#8230;/g, "…")
    .replace(/\s+/g, " ")
    .trim();
}

async function readJSON<T>(name: string): Promise<T> {
  const raw = await fs.readFile(path.join(dataDir, name), "utf-8");
  return JSON.parse(raw) as T;
}

function log(msg: string) {
  console.log(msg);
}

function logStep(title: string) {
  log(`\n━━━ ${title} ━━━`);
}

/**
 * Look up which Sanity document represents a given WordPress legacyId.
 * Returns the _id (including `drafts.` if applicable) or null.
 * Dry-run skips the API call entirely so the script works fully offline.
 */
async function findByLegacyId(
  docType: string,
  legacyId: number
): Promise<string | null> {
  if (DRY_RUN) return null;
  const doc = await client.fetch<{ _id: string } | null>(
    `*[_type == $t && legacyId == $id][0]{_id}`,
    { t: docType, id: legacyId }
  );
  return doc?._id ?? null;
}

// ─── Migrations ────────────────────────────────────────────────────────────

async function migrateAuthor(): Promise<string> {
  logStep("Author");
  if (!DRY_RUN) {
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "author" && slug.current == "saif"][0]{_id}`
    );
    if (existing) {
      log(`  · Author already exists → ${existing._id}`);
      return existing._id;
    }
  }
  if (DRY_RUN) {
    log("  · Would create author: Dr. Saif Abdel Fattah");
    return "dry-run-author-id";
  }
  const doc = await client.create({
    _type: "author",
    name: "سيف الدين عبد الفتاح إسماعيل",
    slug: { _type: "slug", current: "saif" },
    honorific: "أ.د.",
    bio:
      "أستاذ العلوم السياسية بكلية الاقتصاد والعلوم السياسية — جامعة القاهرة. " +
      "باحث في الفكر السياسي الإسلامي والمنظور الحضاري.",
  });
  log(`  ✓ Created author → ${doc._id}`);
  return doc._id;
}

async function migrateCategories(): Promise<Map<number, string>> {
  logStep("Categories");
  const wpCats = await readJSON<WPCategory[]>("categories.json");
  log(`  · Found ${wpCats.length} WP categories`);

  // Pass 1: create (or find) each category without parent.
  const idMap = new Map<number, string>();
  for (const c of wpCats) {
    const existing = await findByLegacyId("category", c.id);
    if (existing) {
      idMap.set(c.id, existing);
      continue;
    }
    if (DRY_RUN) {
      idMap.set(c.id, `dry-${c.id}`);
      log(`  · Would create category: ${c.name}`);
      continue;
    }
    const doc = await client.create({
      _type: "category",
      name: c.name,
      slug: { _type: "slug", current: c.slug },
      description: c.description || undefined,
      legacyId: c.id,
    });
    idMap.set(c.id, doc._id);
    log(`  ✓ ${c.name}`);
  }

  // Pass 2: set parent references.
  if (!DRY_RUN) {
    for (const c of wpCats) {
      if (c.parent && c.parent > 0) {
        const childId = idMap.get(c.id);
        const parentId = idMap.get(c.parent);
        if (childId && parentId) {
          await client
            .patch(childId)
            .set({
              parent: { _type: "reference", _ref: parentId },
            })
            .commit();
        }
      }
    }
    log(`  ✓ Parent relationships resolved`);
  }

  return idMap;
}

async function migrateTags(): Promise<Map<number, string>> {
  logStep("Tags");
  const wpTags = await readJSON<WPTag[]>("tags.json");
  log(`  · Found ${wpTags.length} WP tags`);

  const idMap = new Map<number, string>();
  for (const t of wpTags) {
    const existing = await findByLegacyId("tag", t.id);
    if (existing) {
      idMap.set(t.id, existing);
      continue;
    }
    if (DRY_RUN) {
      idMap.set(t.id, `dry-${t.id}`);
      continue;
    }
    const doc = await client.create({
      _type: "tag",
      name: t.name,
      slug: { _type: "slug", current: t.slug },
      legacyId: t.id,
    });
    idMap.set(t.id, doc._id);
  }
  log(`  ✓ ${idMap.size} tags ready`);
  return idMap;
}

/**
 * Upload a WordPress image URL to Sanity. Returns the asset _id or null on
 * failure (network error, unavailable, etc.).
 */
async function uploadImage(
  client: SanityClient,
  url: string,
  altText: string | undefined,
  cache: Map<string, string>
): Promise<string | null> {
  if (cache.has(url)) return cache.get(url) ?? null;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      log(`    ⚠ ${res.status} ${res.statusText} — ${url}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const filename = decodeURIComponent(path.basename(new URL(url).pathname));
    const asset = await client.assets.upload("image", buf, {
      filename,
      title: altText || filename,
    });
    cache.set(url, asset._id);
    return asset._id;
  } catch (err) {
    log(`    ⚠ Failed to fetch ${url}: ${(err as Error).message}`);
    return null;
  }
}

async function migratePosts(
  authorId: string,
  catMap: Map<number, string>,
  tagMap: Map<number, string>
) {
  logStep("Posts");
  const posts = await readJSON<WPPost[]>("posts.json");
  const media = await readJSON<WPMedia[]>("media.json");
  const mediaById = new Map(media.map((m) => [m.id, m]));
  log(`  · Found ${posts.length} WP posts`);

  const assetCache = new Map<string, string>();
  let created = 0;
  let skipped = 0;
  let imagesOk = 0;
  let imagesFail = 0;

  for (const [i, p] of posts.entries()) {
    const existing = await findByLegacyId("post", p.id);
    if (existing) {
      skipped++;
      continue;
    }

    // Upload featured image.
    let featuredImage: Record<string, unknown> | undefined;
    if (p.featured_media && !SKIP_IMAGES) {
      const m = mediaById.get(p.featured_media);
      if (m?.source_url) {
        const assetId = await uploadImage(
          client,
          m.source_url,
          m.alt_text,
          assetCache
        );
        if (assetId) {
          featuredImage = {
            _type: "image",
            asset: { _type: "reference", _ref: assetId },
            alt: m.alt_text || undefined,
          };
          imagesOk++;
        } else {
          imagesFail++;
        }
      }
    }

    // Build post doc.
    const title = stripHtml(p.title.rendered);
    const excerpt = stripHtml(p.excerpt.rendered).slice(0, 400);

    const doc: { _type: string; [k: string]: unknown } = {
      _type: "post",
      title,
      slug: { _type: "slug", current: p.slug },
      excerpt,
      publishedAt: new Date(p.date).toISOString(),
      sticky: Boolean(p.sticky),
      author: { _type: "reference", _ref: authorId },
      categories: p.categories
        .map((id) => catMap.get(id))
        .filter(Boolean)
        .map((ref, idx) => ({
          _type: "reference",
          _ref: ref as string,
          _key: `cat-${idx}`,
        })),
      tags: p.tags
        .map((id) => tagMap.get(id))
        .filter(Boolean)
        .map((ref, idx) => ({
          _type: "reference",
          _ref: ref as string,
          _key: `tag-${idx}`,
        })),
      rawHtml: p.content.rendered,
      isMigrated: true,
      legacyId: p.id,
    };

    if (featuredImage) doc.featuredImage = featuredImage;

    if (DRY_RUN) {
      log(`  · [${i + 1}/${posts.length}] would create: ${title.slice(0, 60)}`);
      created++;
      continue;
    }

    await client.create(doc);
    created++;
    if ((created + skipped) % 10 === 0) {
      log(
        `  · progress: ${created + skipped}/${posts.length} (${created} new, ${skipped} skipped)`
      );
    }
  }

  log(
    `\n  ✓ Posts done. Created=${created}, Skipped=${skipped}, Images OK=${imagesOk}, Images failed=${imagesFail}`
  );
}

// ─── Entry point ───────────────────────────────────────────────────────────

async function main() {
  log(`\nSanity migration`);
  log(`  project=${projectId} dataset=${dataset}`);
  if (DRY_RUN) log(`  ⚠ DRY RUN — nothing will be written`);
  if (SKIP_IMAGES) log(`  ⚠ --skip-images: featured images will be omitted`);

  const authorId = await migrateAuthor();
  const catMap = await migrateCategories();
  const tagMap = await migrateTags();
  await migratePosts(authorId, catMap, tagMap);

  log(`\n✓ All done.\n`);
}

main().catch((err) => {
  console.error("\n❌ Migration failed:", err);
  process.exit(1);
});
