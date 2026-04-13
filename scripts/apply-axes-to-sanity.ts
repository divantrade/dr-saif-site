/**
 * Apply the new thematic taxonomy (axes + series) to Sanity.
 *
 * Reads:  docs/cork/reclassification-map.json  (1161 articles, classified)
 * Writes: Sanity dataset
 *   - 7 intellectualAxis documents (deterministic _id: axis-1 … axis-7)
 *   - 6 series documents (deterministic _id: series-<slug>)
 *   - patches each post (looked up by legacyId from WordPress) with
 *       axis._ref, series._ref (when applicable), and seriesNumber
 *
 * Idempotent: createOrReplace for taxonomy nodes, transactional patches
 * batched per post. Re-run is safe and only writes deltas.
 *
 * Prereqs:
 *   - posts must already be in Sanity with `legacyId` set (run
 *     `npm run migrate:sanity` first)
 *   - SANITY_WRITE_TOKEN must be in .env.local with Editor permission
 *
 * Usage:
 *   npm run apply:axes              # write
 *   npm run apply:axes -- --dry-run # plan only, no writes
 *   npm run apply:axes -- --only=taxonomy  # create/update axes & series only
 *   npm run apply:axes -- --only=posts     # patch posts only (assumes taxonomy exists)
 */

import { config as loadEnv } from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

// ─── Config ────────────────────────────────────────────────────────────────

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "qgv6yxcl";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-12";
const token = process.env.SANITY_WRITE_TOKEN;

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const ONLY = (() => {
  for (const a of args) {
    if (a.startsWith("--only=")) return a.slice("--only=".length);
  }
  return null;
})();

if (!DRY_RUN && !token) {
  console.error(
    "\nMissing SANITY_WRITE_TOKEN in .env.local — create one in Sanity → API → Tokens (Editor) and try again.\n"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

// ─── Reclassification map (input) ──────────────────────────────────────────

interface Article {
  wp_id: string;
  title: string;
  date: string;
  year: number;
  new_axis: number;
  new_axis_name: string;
  series: string | null;
  series_number: number | null;
  publisher: string | null;
  old_categories: string[];
  classification_method: "series" | "old_category" | "keywords" | "default";
  matched_keyword: string | null;
  is_book_or_study: boolean;
}

interface ReclassMap {
  metadata: {
    total_articles: number;
    generated_date: string;
    axes: Record<string, string>;
  };
  articles: Article[];
}

// ─── Fixed taxonomy seed data ──────────────────────────────────────────────

interface AxisSeed {
  axisNumber: number;
  name: string;
  shortName: string;
  slug: string;
  tagline: string;
  description: string;
  color: string;
  icon: string;
}

const AXES: AxisSeed[] = [
  {
    axisNumber: 1,
    name: "التأسيس الحضاري والمنهجي",
    shortName: "التأسيس الحضاري",
    slug: "civilizational-foundations",
    tagline: "بناء المنظور و قواعد الاجتهاد و المفاهيم المؤسِّسة.",
    description:
      "كتابات في المنظور الحضاري الإسلامي و النظرية السياسية الإسلامية و " +
      "الفقه الحضاري و المقاصد و المنهجية الإسلامية و بناء المفاهيم.",
    color: "indigo",
    icon: "compass",
  },
  {
    axisNumber: 2,
    name: "سؤال التراث والذاكرة الحضارية",
    shortName: "سؤال التراث",
    slug: "heritage-and-memory",
    tagline: "قراءة في تراث الأمة و حواره مع الواقع.",
    description:
      "حوار مع رواد النهضة و الفكر الإسلامي (ابن خلدون، الكواكبي، الأفغاني، " +
      "محمد عبده، طارق البشري، حامد ربيع …) و سؤال الذاكرة و الاستشراق و الاستغراب.",
    color: "amber",
    icon: "scroll",
  },
  {
    axisNumber: 3,
    name: "مشروعات النهوض والإصلاح والتغيير",
    shortName: "مشروعات النهوض",
    slug: "renaissance-and-reform",
    tagline: "خرائط النهوض و طرائق الإصلاح و فقه التغيير.",
    description:
      "بحث في مشاريع النهضة و الإصلاح و فقه التغيير و سُنن الاجتماع و " +
      "التجديد و النقد الذاتي و مشاتل التغيير.",
    color: "emerald",
    icon: "spark",
  },
  {
    axisNumber: 4,
    name: "الاستبداد — تشريحه ومقاومته",
    shortName: "الاستبداد",
    slug: "tyranny-anatomy",
    tagline: "تشريح الظاهرة الاستبدادية و سُبل مقاومتها.",
    description:
      "تحليل الاستبداد و الجمهورية الجديدة و دولة الضد و عسكرة الدولة و " +
      "أحداث كاشفة و مفاهيم ملتبسة و فقه مقاومة الطغيان.",
    color: "rose",
    icon: "shield",
  },
  {
    axisNumber: 5,
    name: "المواطنة وحقوق الإنسان",
    shortName: "المواطنة",
    slug: "citizenship-and-rights",
    tagline: "في المواطن و حقوقه و الجماعة الوطنية.",
    description:
      "كتابات في المواطنة من جديد و حقوق الإنسان و المجتمع المدني و " +
      "الجماعة الوطنية و الإرادة الشعبية.",
    color: "teal",
    icon: "scales",
  },
  {
    axisNumber: 6,
    name: "الثورات والتحولات السياسية",
    shortName: "الثورات والتحولات",
    slug: "revolutions-and-transitions",
    tagline: "ثورة يناير و الربيع العربي و الانقلابات و المراحل الانتقالية.",
    description:
      "متابعة الثورات العربية، الانتقال الديموقراطي، الثورة المضادة، " +
      "و تحولات الإقليم منذ 2011.",
    color: "violet",
    icon: "wave",
  },
  {
    axisNumber: 7,
    name: "المقاومة والقضية الفلسطينية",
    shortName: "المقاومة",
    slug: "resistance-and-palestine",
    tagline: "قاموس المقاومة و طوفان الأقصى و القضية المركزية للأمة.",
    description:
      "كتابات في القضية الفلسطينية و المقاومة الحضارية و طوفان الأقصى و " +
      "الكيان الصهيوني و التطبيع و المقاطعة.",
    color: "orange",
    icon: "chain",
  },
];

interface SeriesSeed {
  name: string;
  slug: string;
  axisNumber: number;
  displayOrder: number;
  tagline: string;
  description: string;
  featured: boolean;
}

const SERIES: SeriesSeed[] = [
  {
    name: "قاموس المقاومة",
    slug: "qamoos-al-muqawama",
    axisNumber: 7,
    displayOrder: 1,
    tagline: "مفردات المقاومة و معجمها الحضاري في زمن الطوفان.",
    description:
      "سلسلة تُعيد بناء معجم المقاومة الفلسطينية و الحضارية، مفردةً مفردةً، " +
      "في ضوء طوفان الأقصى و صراع الأمة مع الكيان الصهيوني.",
    featured: true,
  },
  {
    name: "المواطنة من جديد",
    slug: "muwatana-min-jadeed",
    axisNumber: 5,
    displayOrder: 2,
    tagline: "إعادة تعريف المواطن و حقوقه في ظل دولة الاستبداد.",
    description:
      "سلسلة طويلة تتأمّل مفهوم المواطنة بين السلطة و المجتمع، و في فكر " +
      "الإسلام السياسي و النصوص المؤسِّسة كوثيقة المدينة.",
    featured: true,
  },
  {
    name: "مفاهيم ملتبسة",
    slug: "mafaheem-multabisa",
    axisNumber: 4,
    displayOrder: 3,
    tagline: "في المفاهيم التي خُطفت من معانيها الأصلية.",
    description:
      "تفكيك المفاهيم السياسية و الدينية التي وُظّفت في خدمة الاستبداد و " +
      "إعادة قراءتها قراءةً نقدية.",
    featured: true,
  },
  {
    name: "النقد الذاتي",
    slug: "al-naqd-al-zati",
    axisNumber: 3,
    displayOrder: 4,
    tagline: "محاسبة العلوم السياسية و النخبة العلمية.",
    description:
      "سلسلة في نقد العلوم السياسية و فقهائها في الجامعة المصرية و العربية، " +
      "و سيرة شخصية مع التخصص و علاقة الأكاديمي بالشأن العام.",
    featured: true,
  },
  {
    name: "مشاتل التغيير",
    slug: "mashatil-al-taghyeer",
    axisNumber: 3,
    displayOrder: 5,
    tagline: "بيئات التربية و التنشئة على فقه التغيير.",
    description:
      "كيف نزرع وعياً جديداً يصنع تغييراً مستداماً، عبر مشاتل تربوية " +
      "و فكرية و حركية.",
    featured: false,
  },
  {
    name: "أحداث كاشفة",
    slug: "ahdath-kashifa",
    axisNumber: 4,
    displayOrder: 6,
    tagline: "أحداث تكشف بنية النظام الاستبدادي و حقيقته.",
    description:
      "تحليل اللحظات الكاشفة في مسيرة الجمهورية الجديدة، حيث تنفلت الحقيقة " +
      "من تحت التغطية الإعلامية.",
    featured: false,
  },
];

// Map from the JSON's axis_number → axis _id we'll use in Sanity.
const axisDocId = (n: number) => `axis-${n}`;
const seriesDocId = (slug: string) => `series-${slug}`;

// Map from Arabic series name (as used in reclassification-map.json) → slug
const SERIES_NAME_TO_SLUG: Record<string, string> = Object.fromEntries(
  SERIES.map((s) => [s.name, s.slug])
);

// ─── Helpers ───────────────────────────────────────────────────────────────

const log = (msg: string) => console.log(msg);
const step = (title: string) => log(`\n━━━ ${title} ━━━`);

async function readMap(): Promise<ReclassMap> {
  const file = path.join(
    process.cwd(),
    "docs",
    "cork",
    "reclassification-map.json"
  );
  return JSON.parse(await fs.readFile(file, "utf-8")) as ReclassMap;
}

// ─── Steps ─────────────────────────────────────────────────────────────────

async function upsertAxes() {
  step("Upserting intellectualAxis documents");
  if (DRY_RUN) {
    AXES.forEach((a) => log(`  · ${a.axisNumber}. ${a.name}`));
    return;
  }
  for (const a of AXES) {
    await client.createOrReplace({
      _id: axisDocId(a.axisNumber),
      _type: "intellectualAxis",
      axisNumber: a.axisNumber,
      name: a.name,
      shortName: a.shortName,
      slug: { _type: "slug", current: a.slug },
      tagline: a.tagline,
      description: a.description,
      color: a.color,
      icon: a.icon,
    });
    log(`  ✓ ${a.axisNumber}. ${a.name}`);
  }
}

async function upsertSeries() {
  step("Upserting series documents");
  if (DRY_RUN) {
    SERIES.forEach((s) => log(`  · ${s.name} → axis-${s.axisNumber}`));
    return;
  }
  for (const s of SERIES) {
    await client.createOrReplace({
      _id: seriesDocId(s.slug),
      _type: "series",
      name: s.name,
      slug: { _type: "slug", current: s.slug },
      tagline: s.tagline,
      description: s.description,
      axis: { _type: "reference", _ref: axisDocId(s.axisNumber) },
      displayOrder: s.displayOrder,
      featured: s.featured,
    });
    log(`  ✓ ${s.name}`);
  }
}

async function patchPosts(map: ReclassMap) {
  step(`Patching ${map.articles.length} posts with axis + series refs`);

  // Pre-fetch the post-id map (legacyId → _id) in one go to avoid 1161
  // round-trips. Sanity caps the response, so page if needed.
  const idIndex = new Map<number, string>();

  if (!DRY_RUN) {
    log("  · Building legacyId → _id index from Sanity …");
    let cursor = 0;
    const PAGE = 500;
    for (;;) {
      const batch = await client.fetch<{ _id: string; legacyId: number }[]>(
        `*[_type == "post" && defined(legacyId)] | order(legacyId asc)
           [$start...$end]{ _id, legacyId }`,
        { start: cursor, end: cursor + PAGE }
      );
      if (batch.length === 0) break;
      batch.forEach((d) => idIndex.set(d.legacyId, d._id));
      cursor += PAGE;
      if (batch.length < PAGE) break;
    }
    log(`  · Indexed ${idIndex.size} posts`);
  }

  let patched = 0;
  let missing = 0;
  let unchanged = 0;

  // Sanity transactions cap at ~500 mutations, so we batch.
  const BATCH = 100;
  let tx = client.transaction();
  let inTx = 0;

  const flush = async () => {
    if (inTx === 0) return;
    if (!DRY_RUN) await tx.commit({ visibility: "async" });
    tx = client.transaction();
    inTx = 0;
  };

  for (const art of map.articles) {
    const legacy = parseInt(art.wp_id, 10);
    if (Number.isNaN(legacy)) {
      missing++;
      continue;
    }
    const docId = DRY_RUN ? `dry-${legacy}` : idIndex.get(legacy);
    if (!docId) {
      missing++;
      if (missing < 10) log(`  ⚠ no Sanity post for legacyId=${legacy}`);
      continue;
    }

    const seriesSlug = art.series ? SERIES_NAME_TO_SLUG[art.series] : null;

    const set: Record<string, unknown> = {
      axis: { _type: "reference", _ref: axisDocId(art.new_axis) },
    };
    const unset: string[] = [];

    if (seriesSlug) {
      set.series = { _type: "reference", _ref: seriesDocId(seriesSlug) };
      if (art.series_number != null) set.seriesNumber = art.series_number;
      else unset.push("seriesNumber");
    } else {
      unset.push("series", "seriesNumber");
    }

    if (DRY_RUN) {
      patched++;
      continue;
    }

    let p = client.patch(docId).set(set);
    if (unset.length > 0) p = p.unset(unset);
    tx = tx.patch(p);
    inTx++;
    patched++;

    if (inTx >= BATCH) {
      await flush();
      if (patched % 200 === 0) log(`  · ${patched} patched …`);
    }
  }
  await flush();

  log(`\n  ✓ patched: ${patched}`);
  log(`  ⚠ missing: ${missing}`);
  log(`  · unchanged: ${unchanged}`);
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  log(
    `apply-axes-to-sanity — project=${projectId} dataset=${dataset}` +
      (DRY_RUN ? " (DRY RUN)" : "")
  );

  const map = await readMap();
  log(
    `Loaded ${map.articles.length} classified articles ` +
      `(generated ${map.metadata.generated_date}).`
  );

  if (!ONLY || ONLY === "taxonomy") {
    await upsertAxes();
    await upsertSeries();
  }
  if (!ONLY || ONLY === "posts") {
    await patchPosts(map);
  }

  log("\nDone.");
}

main().catch((err) => {
  console.error("\nFatal:", err);
  process.exit(1);
});
