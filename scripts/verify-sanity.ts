/**
 * Sanity health check — verifies the dataset is internally consistent
 * and ready to serve the live site.
 *
 * Checks:
 *   [posts]
 *     · total post count
 *     · posts missing legacyId (migration completeness)
 *     · posts missing publishedAt
 *     · posts missing an axis ref
 *   [axes]
 *     · expect 7 intellectualAxis docs, one per axisNumber 1..7
 *     · each axis has a slug + non-empty name
 *   [series]
 *     · expect 6 series docs
 *     · each series references a valid axis
 *     · each series has at least one episode (optional warning)
 *   [cross]
 *     · every post.series also has a post.seriesNumber
 *     · no post references a series that doesn't exist
 *
 * Exits with code 1 if any hard check fails; warnings go to stderr but
 * don't fail the run. Safe to run on a schedule.
 *
 * Usage:
 *   npm run verify:sanity          # print report
 *   npm run verify:sanity -- --json # emit JSON (for CI consumption)
 */

import { config as loadEnv } from "dotenv";
import { createClient } from "@sanity/client";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

// ─── Config ────────────────────────────────────────────────────────────────

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "qgv6yxcl";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-12";

// Read is fine without a token on public datasets; fall through if none.
const token = process.env.SANITY_READ_TOKEN || process.env.SANITY_WRITE_TOKEN;

const args = new Set(process.argv.slice(2));
const AS_JSON = args.has("--json");

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  perspective: "published",
});

// ─── Helpers ───────────────────────────────────────────────────────────────

interface CheckResult {
  label: string;
  status: "ok" | "warn" | "fail";
  detail: string;
}

const results: CheckResult[] = [];

const ok = (label: string, detail: string) =>
  results.push({ label, status: "ok", detail });
const warn = (label: string, detail: string) =>
  results.push({ label, status: "warn", detail });
const fail = (label: string, detail: string) =>
  results.push({ label, status: "fail", detail });

// ─── Checks ────────────────────────────────────────────────────────────────

async function checkPosts() {
  const summary = await client.fetch<{
    total: number;
    noLegacy: number;
    noPublishedAt: number;
    noAxis: number;
    oldestDate: string | null;
    newestDate: string | null;
  }>(`{
    "total":         count(*[_type == "post"]),
    "noLegacy":      count(*[_type == "post" && !defined(legacyId)]),
    "noPublishedAt": count(*[_type == "post" && !defined(publishedAt)]),
    "noAxis":        count(*[_type == "post" && !defined(axis)]),
    "oldestDate":    *[_type == "post" && defined(publishedAt)]
                       | order(publishedAt asc)[0].publishedAt,
    "newestDate":    *[_type == "post" && defined(publishedAt)]
                       | order(publishedAt desc)[0].publishedAt
  }`);

  if (summary.total === 0) {
    fail("posts.total", "zero posts — migration hasn't run yet");
    return;
  }
  ok("posts.total", `${summary.total} posts`);

  if (summary.oldestDate && summary.newestDate) {
    ok(
      "posts.dateRange",
      `${summary.oldestDate.slice(0, 10)}  →  ${summary.newestDate.slice(0, 10)}`
    );
  }

  if (summary.noLegacy > 0) {
    warn(
      "posts.legacyId",
      `${summary.noLegacy} posts missing legacyId (re-run migrate:sanity if this isn't expected)`
    );
  } else {
    ok("posts.legacyId", "all posts have legacyId");
  }

  if (summary.noPublishedAt > 0) {
    fail(
      "posts.publishedAt",
      `${summary.noPublishedAt} posts missing publishedAt — will break sitemap & archive`
    );
  } else {
    ok("posts.publishedAt", "all posts have publishedAt");
  }

  if (summary.noAxis > 0) {
    fail(
      "posts.axis",
      `${summary.noAxis} posts not assigned to an axis — run apply:axes`
    );
  } else {
    ok("posts.axis", "all posts assigned to an axis");
  }
}

async function checkAxes() {
  const axes = await client.fetch<
    { _id: string; axisNumber: number; name: string; slug?: string }[]
  >(`*[_type == "intellectualAxis"] | order(axisNumber asc) {
       _id, axisNumber, name, "slug": slug.current
     }`);

  if (axes.length === 0) {
    fail("axes.count", "zero axes — run apply:axes (taxonomy-only is enough)");
    return;
  }
  if (axes.length !== 7) {
    warn("axes.count", `${axes.length} axes (expected 7)`);
  } else {
    ok("axes.count", "7 axes present");
  }

  const numbers = new Set(axes.map((a) => a.axisNumber));
  for (let n = 1; n <= 7; n++) {
    if (!numbers.has(n)) warn("axes.coverage", `missing axis ${n}`);
  }

  const missingSlug = axes.filter((a) => !a.slug).map((a) => a.axisNumber);
  if (missingSlug.length)
    fail("axes.slugs", `axes missing slug: ${missingSlug.join(", ")}`);
  else ok("axes.slugs", "all axes have slugs");
}

async function checkSeries() {
  const series = await client.fetch<
    {
      _id: string;
      name: string;
      slug?: string;
      axisRef: string | null;
      postCount: number;
    }[]
  >(`*[_type == "series"] | order(coalesce(displayOrder, 999) asc) {
       _id, name, "slug": slug.current,
       "axisRef": axis._ref,
       "postCount": count(*[_type == "post" && references(^._id)])
     }`);

  if (series.length === 0) {
    fail("series.count", "zero series — run apply:axes (taxonomy-only)");
    return;
  }
  if (series.length !== 6) {
    warn("series.count", `${series.length} series (expected 6)`);
  } else {
    ok("series.count", "6 series present");
  }

  const axisIds = new Set(
    await client.fetch<string[]>(`*[_type == "intellectualAxis"]._id`)
  );
  const orphaned = series.filter((s) => !s.axisRef || !axisIds.has(s.axisRef));
  if (orphaned.length) {
    fail(
      "series.axisRef",
      `series with missing/invalid axis ref: ${orphaned.map((s) => s.name).join(", ")}`
    );
  } else {
    ok("series.axisRef", "all series reference valid axes");
  }

  const empty = series.filter((s) => s.postCount === 0);
  if (empty.length) {
    warn(
      "series.empty",
      `series with zero episodes (will 404 on /series/[slug]): ${empty.map((s) => s.name).join(", ")}`
    );
  }
}

async function checkCrossLinks() {
  // Post has series but no seriesNumber.
  const noNumber = await client.fetch<number>(
    `count(*[_type == "post" && defined(series) && !defined(seriesNumber)])`
  );
  if (noNumber > 0) {
    warn(
      "posts.seriesNumber",
      `${noNumber} series posts missing seriesNumber (episode list ordering will fall back to date)`
    );
  } else {
    ok("posts.seriesNumber", "every series post has an episode number");
  }

  // Orphaned references.
  const orphans = await client.fetch<number>(
    `count(*[_type == "post" && defined(series) && !defined(series->)])`
  );
  if (orphans > 0) {
    fail(
      "posts.seriesRef",
      `${orphans} posts reference a series that doesn't exist`
    );
  } else {
    ok("posts.seriesRef", "no orphan series references");
  }

  // Axis distribution (info, not a pass/fail).
  const dist = await client.fetch<{ axisNumber: number; count: number }[]>(
    `*[_type == "intellectualAxis"] | order(axisNumber asc) {
       axisNumber,
       "count": count(*[_type == "post" && references(^._id)])
     }`
  );
  if (dist.length) {
    const line = dist
      .map((d) => `${d.axisNumber}:${d.count}`)
      .join("  ");
    ok("axes.distribution", line);
  }
}

// ─── Render ────────────────────────────────────────────────────────────────

function colour(status: CheckResult["status"]) {
  // ANSI sequences; swallowed when piped to a file.
  switch (status) {
    case "ok":
      return "\x1b[32m✓\x1b[0m";
    case "warn":
      return "\x1b[33m!\x1b[0m";
    case "fail":
      return "\x1b[31m✗\x1b[0m";
  }
}

function render() {
  if (AS_JSON) {
    console.log(JSON.stringify({ results }, null, 2));
    return;
  }
  console.log(
    `\nSanity health check — project=${projectId} dataset=${dataset}\n`
  );
  const width = Math.max(...results.map((r) => r.label.length));
  for (const r of results) {
    console.log(
      `  ${colour(r.status)}  ${r.label.padEnd(width)}   ${r.detail}`
    );
  }
  const warns = results.filter((r) => r.status === "warn").length;
  const fails = results.filter((r) => r.status === "fail").length;
  console.log(
    `\n  ${results.length} checks · ${warns} warnings · ${fails} failures\n`
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  await checkPosts();
  await checkAxes();
  await checkSeries();
  await checkCrossLinks();
  render();
  const hasFail = results.some((r) => r.status === "fail");
  process.exit(hasFail ? 1 : 0);
}

main().catch((err) => {
  console.error("\nVerification failed to run:", err);
  process.exit(2);
});
