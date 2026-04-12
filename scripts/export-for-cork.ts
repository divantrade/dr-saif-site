/**
 * Export every post from public/data/posts.json into a set of readable
 * Markdown files that can be handed to Claude Cork for thematic analysis.
 *
 * Outputs into docs/cork/:
 *   - README.md              ← brief for the Cork conversation
 *   - 00-summary.md          ← totals + current category & tag inventory
 *   - 01-year-<YEAR>.md      ← one file per publication year, chronological
 *
 * Per post we include:
 *   - title
 *   - date
 *   - slug (for later cross-referencing)
 *   - legacy WordPress id
 *   - current categories (by NAME, not id)
 *   - current tags (by NAME, not id)
 *   - excerpt (stripped of HTML)
 *   - first paragraph of the body (stripped of HTML, trimmed)
 *
 * Rationale: Cork is the right tool for the *editorial* work of proposing
 * a new taxonomy that reflects Dr Saif's intellectual project. It needs
 * enough context to understand the shape of each article without being
 * buried in the full HTML. Title + excerpt + opening paragraph is the
 * minimum useful snapshot.
 */

import fs from "node:fs/promises";
import path from "node:path";

interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  categories?: number[];
  tags?: number[];
}

interface Taxonomy {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent?: number;
}

const dataDir = path.join(process.cwd(), "public", "data");
const outDir = path.join(process.cwd(), "docs", "cork");

// ─── HTML helpers ────────────────────────────────────────────────────────

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;|&#8212;/g, "—")
    .replace(/&#8230;/g, "…")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pull the first non-empty paragraph from rendered content. WordPress wraps
 * paragraphs in `<p>`, so we grab the first `<p>...</p>` block.
 */
function firstParagraph(html: string): string {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const candidate = match ? match[1] : html.slice(0, 800);
  return stripHtml(candidate);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// ─── IO ──────────────────────────────────────────────────────────────────

async function readJSON<T>(name: string): Promise<T> {
  const raw = await fs.readFile(path.join(dataDir, name), "utf-8");
  return JSON.parse(raw) as T;
}

async function writeFile(name: string, contents: string) {
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, name), contents, "utf-8");
}

// ─── Build ───────────────────────────────────────────────────────────────

interface Row {
  id: number;
  date: string;
  year: number;
  title: string;
  slug: string;
  categories: string[];
  tags: string[];
  excerpt: string;
  opening: string;
}

function renderPost(row: Row, indexWithinYear: number): string {
  const lines: string[] = [];
  lines.push(`### ${indexWithinYear}. ${row.title}`);
  lines.push("");
  lines.push(`- **التاريخ**: ${row.date.slice(0, 10)}`);
  lines.push(`- **المعرّف (WP)**: \`${row.id}\``);
  lines.push(
    `- **التصنيفات الحالية**: ${row.categories.length ? row.categories.join("، ") : "_(بدون تصنيف)_"}`
  );
  lines.push(
    `- **الوسوم**: ${row.tags.length ? row.tags.map((t) => `#${t}`).join("، ") : "_(بدون وسوم)_"}`
  );
  if (row.excerpt) {
    lines.push("");
    lines.push(`**المُلخَّص**: ${row.excerpt}`);
  }
  if (row.opening && row.opening !== row.excerpt) {
    lines.push("");
    lines.push(`**مستهلّ المقال**:`);
    lines.push("");
    lines.push(`> ${row.opening}`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  return lines.join("\n");
}

function renderYearFile(year: number, rows: Row[]): string {
  const sorted = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const header = [
    `# مقالات ${year}`,
    "",
    `عدد المقالات: **${rows.length}**`,
    "",
    "المقالات مرتّبة من الأقدم إلى الأحدث داخل السنة.",
    "",
    "---",
    "",
  ].join("\n");
  return header + sorted.map((r, i) => renderPost(r, i + 1)).join("");
}

function renderSummary(rows: Row[]): string {
  const byYear = new Map<number, number>();
  const byCategory = new Map<string, number>();
  const byTag = new Map<string, number>();
  let noCategory = 0;
  let noTags = 0;

  for (const r of rows) {
    byYear.set(r.year, (byYear.get(r.year) || 0) + 1);
    if (r.categories.length === 0) noCategory++;
    else for (const c of r.categories) byCategory.set(c, (byCategory.get(c) || 0) + 1);
    if (r.tags.length === 0) noTags++;
    else for (const t of r.tags) byTag.set(t, (byTag.get(t) || 0) + 1);
  }

  const yearRows = Array.from(byYear.entries()).sort((a, b) => a[0] - b[0]);
  const catRows = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]);
  const tagRows = Array.from(byTag.entries()).sort((a, b) => b[1] - a[1]);

  const lines: string[] = [];
  lines.push("# الإحصائيات والتصنيفات الحالية");
  lines.push("");
  lines.push(`- إجمالي المقالات: **${rows.length}**`);
  lines.push(`- أقدم مقال: ${rows.reduce((a, b) => (a.date < b.date ? a : b)).date.slice(0, 10)}`);
  lines.push(`- أحدث مقال: ${rows.reduce((a, b) => (a.date > b.date ? a : b)).date.slice(0, 10)}`);
  lines.push(`- مقالات بدون تصنيف: **${noCategory}**`);
  lines.push(`- مقالات بدون وسوم: **${noTags}**`);
  lines.push("");

  lines.push("## التوزيع السنوي");
  lines.push("");
  lines.push("| السنة | عدد المقالات |");
  lines.push("|---|---|");
  for (const [y, c] of yearRows) lines.push(`| ${y} | ${c} |`);
  lines.push("");

  lines.push("## التصنيفات الحالية (مرتَّبة بالأكثر استخداماً)");
  lines.push("");
  lines.push("| التصنيف | عدد المقالات |");
  lines.push("|---|---|");
  for (const [c, n] of catRows) lines.push(`| ${c} | ${n} |`);
  lines.push("");

  lines.push("## الوسوم (مرتَّبة بالأكثر استخداماً)");
  lines.push("");
  lines.push("| الوسم | عدد المقالات |");
  lines.push("|---|---|");
  for (const [t, n] of tagRows) lines.push(`| ${t} | ${n} |`);
  lines.push("");

  return lines.join("\n");
}

function renderReadme(rows: Row[], yearFiles: string[]): string {
  return `# أرشيف مقالات أ.د. سيف الدين عبد الفتاح — للتحليل الفكري

## السياق

هذه الملفات تحتوي على **${rows.length} مقال** من موقع أ.د. سيف الدين عبد الفتاح — أستاذ العلوم السياسية بجامعة القاهرة، صاحب مشروع فكري في **المنظور الحضاري الإسلامي**.

المهمّة المطلوبة: **اقتراح توزيع/تصنيف جديد** للمقالات يعكس مشروع الدكتور الفكري بدلاً من التوزيع الحالي الذي يعتمد بشكل أساسي على **مكان النشر** (أي أن المقال مُصنَّف بـ "مقالات عربي 21" أو "مقالات العربي الجديد" بدلاً من موضوعه).

## لماذا نحتاج إعادة التصنيف؟

١. **التصنيف الحالي يعكس الناشر، لا الموضوع**: 1081 من المقالات مُصنَّفة باسم الجريدة التي نُشرت فيها.

٢. **تصنيفات مُكرَّرة ومتداخلة**:
   - "الدراسات" و "في الكتب والدراسات المعاصرة"
   - "الكتب" و "في الكتب والدراسات المعاصرة"
   - "مقالات عربي 21" و "مقالات عربي ٢١" (نفس المصدر، كتابتان)

٣. **تصنيفات حسب المؤسسات البحثية** (المعهد المصري للدراسات، مركز الحضارة، ...) مختلطة مع تصنيفات موضوعية.

## الأسلوب المقترَح للحوار مع هذا الأرشيف

١. **ابدأ من \`00-summary.md\`** لترى توزيع السنوات والتصنيفات والوسوم الحالية.

٢. **اقرأ الملفات السنوية** (01-year-YYYY.md) بترتيبها. كل مقال فيها يحتوي:
   - العنوان
   - التاريخ
   - التصنيفات والوسوم القديمة
   - المُلخَّص
   - مستهلّ المقال (أول فقرة)

٣. **لاحظ الخطوط الفكرية الكبرى** التي تتكرّر عبر السنوات (المنظور الحضاري، الإصلاح، الاستبداد، الثورات، الفقه السياسي، ...).

٤. **اقترح بنية تصنيفية جديدة** على طبقتين أو ثلاث:
   - **التصنيف الرئيسي** (5-8 أقسام تعكس المشروع الفكري)
   - **التصنيف الفرعي** (داخل كل قسم، تقسيم أدقّ)
   - (اختياري) **وسوم متقاطعة** لعلاقات أفقية

٥. **قدّم خريطة إسناد** توضّح كيف تُعاد تصنيف كل مقال (بـ ID أو معيار واضح) من البنية القديمة إلى الجديدة.

## الملفات في هذا المجلّد

- \`00-summary.md\` — إحصائيات وتوزيع كامل
${yearFiles.map((f) => `- \`${f}\``).join("\n")}

## بعد الانتهاء

أعد النتيجة (البنية المقترَحة + خريطة الإسناد) إلى كلود كود وسينفّذها تقنياً:
- تحديث Schemas في Sanity
- إعادة تصنيف المقالات الـ ${rows.length} بناءً على الخريطة
- تحديث الواجهة لعرض البنية الجديدة
- الحفاظ على الروابط القديمة بـ 301 redirect حيث لزم
`;
}

// ─── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log("Loading data…");
  const posts = await readJSON<WPPost[]>("posts.json");
  const cats = await readJSON<Taxonomy[]>("categories.json");
  const tags = await readJSON<Taxonomy[]>("tags.json");

  const catMap = new Map(cats.map((c) => [c.id, c.name]));
  const tagMap = new Map(tags.map((t) => [t.id, t.name]));

  console.log(`  · posts: ${posts.length}`);
  console.log(`  · categories: ${cats.length}`);
  console.log(`  · tags: ${tags.length}`);

  console.log("\nBuilding rows…");
  const rows: Row[] = posts.map((p) => {
    const excerpt = truncate(stripHtml(p.excerpt.rendered), 400);
    const opening = truncate(firstParagraph(p.content.rendered), 600);
    return {
      id: p.id,
      date: p.date,
      year: Number(p.date.slice(0, 4)),
      title: stripHtml(p.title.rendered),
      slug: p.slug,
      categories: (p.categories || [])
        .map((id) => catMap.get(id))
        .filter((x): x is string => Boolean(x)),
      tags: (p.tags || [])
        .map((id) => tagMap.get(id))
        .filter((x): x is string => Boolean(x)),
      excerpt,
      opening,
    };
  });

  // Group by year
  const byYear = new Map<number, Row[]>();
  for (const r of rows) {
    const arr = byYear.get(r.year) || [];
    arr.push(r);
    byYear.set(r.year, arr);
  }

  const years = Array.from(byYear.keys()).sort((a, b) => a - b);
  const yearFiles: string[] = [];

  console.log("\nWriting files…");
  let fileIndex = 1;
  for (const y of years) {
    const fname = `${String(fileIndex).padStart(2, "0")}-year-${y}.md`;
    await writeFile(fname, renderYearFile(y, byYear.get(y)!));
    yearFiles.push(fname);
    console.log(`  · ${fname} (${byYear.get(y)!.length} posts)`);
    fileIndex++;
  }

  await writeFile("00-summary.md", renderSummary(rows));
  console.log(`  · 00-summary.md`);

  await writeFile("README.md", renderReadme(rows, yearFiles));
  console.log(`  · README.md`);

  console.log("\n✓ Done. Files are in docs/cork/");
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
