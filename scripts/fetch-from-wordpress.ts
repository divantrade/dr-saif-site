/**
 * Fetches all content from the source WordPress site into public/data/*.json.
 *
 * Source URL is configured via WP_SOURCE_URL (defaults to the Dr Saif site).
 * Endpoints used (all public, no auth required for published content):
 *   - /wp/v2/posts        (status=publish)
 *   - /wp/v2/categories
 *   - /wp/v2/tags
 *   - /wp/v2/media        (only those referenced as featured_media by posts)
 *
 * Idempotent by WordPress `id`:
 *   - Reads existing public/data/*.json
 *   - Merges new items in, overwriting entries with the same id
 *   - Never creates duplicates
 *   - Safe to stop and resume
 *
 * Usage:
 *   npm run fetch:wp                                # fetch from default URL
 *   WP_SOURCE_URL=https://example.com npm run fetch:wp
 *   npm run fetch:wp -- --only=posts,categories     # restrict what's fetched
 */

import fs from "node:fs/promises";
import path from "node:path";

// ─── Config ────────────────────────────────────────────────────────────────

const WP_BASE = (
  process.env.WP_SOURCE_URL || "https://saifabdelfattah.net"
).replace(/\/+$/, "");
const API_ROOT = `${WP_BASE}/wp-json/wp/v2`;

const PER_PAGE = 100; // WordPress max
const POLITE_DELAY_MS = 150; // between page requests
const MAX_RETRIES = 3;
const dataDir = path.join(process.cwd(), "public", "data");

const args = process.argv.slice(2);
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg
  ? new Set(onlyArg.replace("--only=", "").split(","))
  : null;

function shouldRun(name: string): boolean {
  return !only || only.has(name);
}

// ─── Types (what the REST API returns; we write these through verbatim) ─────

interface WithId {
  id: number;
}

interface WPPost extends WithId {
  date: string;
  slug: string;
  status: string;
  featured_media: number;
  categories?: number[];
  tags?: number[];
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  sticky?: boolean;
}

interface WPCategory extends WithId {
  name: string;
  slug: string;
  parent: number;
  count: number;
}

interface WPTag extends WithId {
  name: string;
  slug: string;
  count: number;
}

interface WPMedia extends WithId {
  source_url: string;
  alt_text?: string;
  title?: { rendered: string };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function log(msg: string) {
  console.log(msg);
}

function logStep(title: string) {
  log(`\n━━━ ${title} ━━━`);
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function readExisting<T>(filename: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(dataDir, filename), "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeJSON(filename: string, data: unknown) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(
    path.join(dataDir, filename),
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

/**
 * Fetch with retries for transient errors (5xx, network failures).
 * Returns the Response on success or throws after MAX_RETRIES.
 */
async function fetchWithRetry(url: string): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "dr-saif-site migration (node)" },
      });
      // WordPress returns 400 for pages past the last — not a retryable error,
      // let the caller handle it.
      if (res.status >= 500) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRIES) {
        const backoff = attempt * 1000;
        log(
          `    ⚠ ${(err as Error).message} — retrying in ${backoff}ms (${attempt}/${MAX_RETRIES})`
        );
        await sleep(backoff);
      }
    }
  }
  throw lastErr;
}

/**
 * Iterate every page of a REST endpoint. WordPress exposes the total page
 * count in the `X-WP-TotalPages` header, which we use to size the loop.
 */
async function fetchAllPages<T extends WithId>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  let totalPages: number | null = null;
  let totalItems: number | null = null;

  while (true) {
    const url = new URL(`${API_ROOT}/${endpoint}`);
    url.searchParams.set("per_page", String(PER_PAGE));
    url.searchParams.set("page", String(page));
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

    const res = await fetchWithRetry(url.toString());

    // WordPress returns 400 when requesting a page beyond the last. Treat as
    // end-of-stream rather than an error — this also covers the case where
    // totalPages was not reported.
    if (res.status === 400) break;
    if (!res.ok) {
      throw new Error(
        `${endpoint} page ${page}: ${res.status} ${res.statusText}`
      );
    }

    if (totalPages === null) {
      totalPages = Number(res.headers.get("x-wp-totalpages") || "0") || null;
      totalItems = Number(res.headers.get("x-wp-total") || "0") || null;
      if (totalItems !== null) log(`  · reports ${totalItems} total items`);
    }

    const batch = (await res.json()) as T[];
    if (!Array.isArray(batch) || batch.length === 0) break;

    all.push(...batch);
    log(
      `  · page ${page}${totalPages ? `/${totalPages}` : ""}: +${batch.length} (running total: ${all.length})`
    );

    if (totalPages !== null && page >= totalPages) break;
    page++;
    await sleep(POLITE_DELAY_MS);
  }

  return all;
}

/**
 * Merge incoming items into an existing array, keyed by `id`. Incoming items
 * overwrite existing ones with the same id (so re-running the script picks
 * up post edits). Returns merged list and counts.
 */
function mergeById<T extends WithId>(
  existing: T[],
  incoming: T[]
): { merged: T[]; added: number; updated: number; unchanged: number } {
  const byId = new Map<number, T>(existing.map((x) => [x.id, x]));
  let added = 0;
  let updated = 0;
  for (const item of incoming) {
    if (byId.has(item.id)) {
      byId.set(item.id, item);
      updated++;
    } else {
      byId.set(item.id, item);
      added++;
    }
  }
  const unchanged = existing.length - updated;
  return {
    merged: Array.from(byId.values()),
    added,
    updated,
    unchanged,
  };
}

// ─── Steps ─────────────────────────────────────────────────────────────────

async function fetchCategories() {
  if (!shouldRun("categories")) return;
  logStep("Categories");
  const existing = await readExisting<WPCategory>("categories.json");
  const fresh = await fetchAllPages<WPCategory>("categories");
  const m = mergeById(existing, fresh);
  await writeJSON("categories.json", m.merged);
  log(
    `  ✓ ${m.merged.length} total (+${m.added} new, ${m.updated} updated, ${m.unchanged} unchanged)`
  );
}

async function fetchTags() {
  if (!shouldRun("tags")) return;
  logStep("Tags");
  const existing = await readExisting<WPTag>("tags.json");
  const fresh = await fetchAllPages<WPTag>("tags");
  const m = mergeById(existing, fresh);
  await writeJSON("tags.json", m.merged);
  log(
    `  ✓ ${m.merged.length} total (+${m.added} new, ${m.updated} updated, ${m.unchanged} unchanged)`
  );
}

async function fetchPosts(): Promise<WPPost[]> {
  if (!shouldRun("posts")) return await readExisting<WPPost>("posts.json");
  logStep("Posts (status=publish)");
  const existing = await readExisting<WPPost>("posts.json");
  const fresh = await fetchAllPages<WPPost>("posts", { status: "publish" });
  const m = mergeById(existing, fresh);
  await writeJSON("posts.json", m.merged);
  log(
    `  ✓ ${m.merged.length} total (+${m.added} new, ${m.updated} updated, ${m.unchanged} unchanged)`
  );
  return m.merged;
}

/**
 * Fetch only the media referenced as `featured_media` by the posts we just
 * saved. Fetching /media in full can return tens of thousands of assets on
 * an old site — most are inline-content images we don't need here.
 */
async function fetchFeaturedMedia(posts: WPPost[]) {
  if (!shouldRun("media")) return;
  logStep("Media (featured images only)");

  const existing = await readExisting<WPMedia>("media.json");
  const existingIds = new Set(existing.map((m) => m.id));
  const referenced = new Set(
    posts.map((p) => p.featured_media).filter((id): id is number => !!id && id > 0)
  );

  const missing = Array.from(referenced).filter((id) => !existingIds.has(id));
  log(
    `  · ${referenced.size} referenced / ${existingIds.size} already on disk / ${missing.length} to fetch`
  );

  const fetched: WPMedia[] = [];
  let failed = 0;
  for (const [i, id] of missing.entries()) {
    try {
      const res = await fetchWithRetry(`${API_ROOT}/media/${id}`);
      if (!res.ok) {
        failed++;
        log(`    ⚠ media ${id}: ${res.status} ${res.statusText}`);
        continue;
      }
      fetched.push((await res.json()) as WPMedia);
      if ((i + 1) % 25 === 0) {
        log(`  · fetched ${i + 1}/${missing.length}`);
      }
      await sleep(POLITE_DELAY_MS);
    } catch (err) {
      failed++;
      log(`    ⚠ media ${id}: ${(err as Error).message}`);
    }
  }

  const m = mergeById(existing, fetched);
  await writeJSON("media.json", m.merged);
  log(
    `  ✓ ${m.merged.length} total (+${m.added} new, ${failed} failed to fetch)`
  );
}

// ─── Entry ─────────────────────────────────────────────────────────────────

async function main() {
  log(`\nWordPress → JSON export`);
  log(`  source: ${WP_BASE}`);
  if (only) log(`  only: ${Array.from(only).join(", ")}`);

  await fetchCategories();
  await fetchTags();
  const posts = await fetchPosts();
  await fetchFeaturedMedia(posts);

  log(`\n✓ Done. JSON files in public/data/ are ready for migration.\n`);
}

main().catch((err) => {
  console.error("\n❌ Failed:", err);
  process.exit(1);
});
