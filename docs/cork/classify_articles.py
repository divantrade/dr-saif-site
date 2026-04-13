#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
classify_articles.py
====================

Re-classifies the 1161 articles of Dr. Saif Eldin Abdel-Fattah from publisher-
based categories into a thematic axis structure that reflects his intellectual
project.

Reads:   01-year-2014.md ... 13-year-2026.md (in the same directory)
Writes:  reclassification-map.json
         reclassification-summary.md
         series-index.md

Self-contained: only standard-library imports (re, json, os, glob, collections).
"""

import json
import os
import re
import glob
from collections import Counter, defaultdict, OrderedDict
from datetime import date as _date


# ---------------------------------------------------------------------------
# Configuration tables
# ---------------------------------------------------------------------------

AXES = OrderedDict([
    (1, "التأسيس الحضاري والمنهجي"),
    (2, "سؤال التراث والذاكرة الحضارية"),
    (3, "مشروعات النهوض والإصلاح والتغيير"),
    (4, "الاستبداد — تشريحه ومقاومته"),
    (5, "المواطنة وحقوق الإنسان"),
    (6, "الثورات والتحولات السياسية"),
    (7, "المقاومة والقضية الفلسطينية"),
])

# Numbered series — title contains series name + (N) at the end
SERIES_RULES = {
    "النقد الذاتي":      {"axis": 3, "series": "النقد الذاتي"},
    "مشاتل التغيير":     {"axis": 3, "series": "مشاتل التغيير"},
    "المواطنة من جديد":  {"axis": 5, "series": "المواطنة من جديد"},
    "مواطنة من جديد":    {"axis": 5, "series": "المواطنة من جديد"},
    "مفاهيم ملتبسة":     {"axis": 4, "series": "مفاهيم ملتبسة"},
    "أحداث كاشفة":       {"axis": 4, "series": "أحداث كاشفة"},
    "احداث كاشفة":       {"axis": 4, "series": "أحداث كاشفة"},
    "قاموس المقاومة":    {"axis": 7, "series": "قاموس المقاومة"},
}

# Old categories that already carry a thematic meaning
OLD_CAT_RULES = {
    "الاستبداد":               4,
    "مشروعات النهوض والتغيير": 3,
    "سؤال التراث":             2,
    "سؤال الهوية":             2,
    "إضاءات حضارية":           1,
    "المسلم المعاصر":          1,
}

# Order matters: axis 7 evaluated before 6, before 4, etc.
KEYWORD_RULES = [
    (7, ["طوفان الأقصى", "المقاومة الفلسطينية", "فلسطين", "غزة", "القدس",
         "التطبيع", "الصهيون", "التصهين", "المقاطعة", "الكيان", "الاحتلال",
         "المقاومة الحضارية", "إسرائيل", "نتنياهو", "الانتفاضة", "حماس",
         "السنوار", "هنية", "المرابط"]),

    (6, ["ثورة يناير", "25 يناير", "الثورة المصرية", "الربيع العربي",
         "الثورات العربية", "الانقلاب", "3 يوليو", "الثالث من يوليو",
         "المرحلة الانتقالية", "الثورة السورية", "سوريا الجديد",
         "الانتقال الديموقراطي", "الثورة المضادة"]),

    (4, ["الاستبداد", "السيسي", "الجمهورية الجديدة", "دولة الضد",
         "العسكرة", "الطغيان", "القمع", "المعتقلون", "السجن",
         "التزوير", "الفساد", "البلطجة", "المستبد", "التسمم السياسي",
         "جغرافيا الاستبداد", "عسكرة"]),

    (5, ["المواطنة", "حقوق الإنسان", "المجتمع المدني", "الجماعة الوطنية",
         "الشرعية", "الإرادة الشعبية", "حقوق المواطن", "المواطن"]),

    (3, ["النهوض", "الإصلاح", "التغيير", "التجديد", "المنعطف",
         "منعطف تاريخي", "خرائط", "مشروعات النهوض", "النهضة",
         "الارتحال الفكري"]),

    (2, ["التراث", "ابن خلدون", "الكواكبي", "طارق البشري", "حامد ربيع",
         "الذاكرة الحضارية", "الوعي التاريخي", "الاستشراق", "الاستغراب",
         "مالك بن نبي", "الرافعي", "اللغة العربية", "سؤال التاريخ",
         "شكيب أرسلان", "رفاعة الطهطاوي", "خير الدين التونسي",
         "جمال الدين الأفغاني", "محمد عبده"]),

    (1, ["المنظور الحضاري", "النظرية السياسية", "الفقه الحضاري",
         "المقاصد", "المدخل السفني", "سفينة", "العلاقات الدولية في الإسلام",
         "المنهجية الإسلامية", "مدخل القيم", "الفكر السياسي الإسلامي",
         "بناء المفاهيم", "التأصيل", "أصول الفقه", "الاجتهاد المقاصدي",
         "المنظور المقاصدي", "التربية المدنية"]),
]

CONTENT_TYPE_KEYWORDS = ["كتاب", "طبعة", "بودكاست", "محاضرة", "ندوة",
                         "لقاء", "حوار"]

PUBLISHER_MAP = {
    "مقالات عربي ٢١":            "عربي 21",
    "مقالات عربي 21":            "عربي 21",
    "مقالات العربي الجديد":      "العربي الجديد",
    "مقالات الشروق":             "الشروق",
    "مقالات الاهرام":            "الأهرام",
    "مقالات الجزيرة":            "الجزيرة",
    "المعهد المصري للدراسات":    "المعهد المصري",
    "مركز الحضارة":              "مركز الحضارة",
    "المسلم المعاصر":            "المسلم المعاصر",
    "مجلة المجتمع":              "مجلة المجتمع",
}

DEFAULT_AXIS = 6  # ثورات وتحولات


# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------

ARABIC_COMMA = "،"

ARTICLE_HEADER_RE = re.compile(r'^###\s+(\d+)\.\s+(.+?)\s*$')
DATE_RE           = re.compile(r'^-\s+\*\*التاريخ\*\*:\s*(.+?)\s*$')
WP_RE             = re.compile(r'^-\s+\*\*المعرّف \(WP\)\*\*:\s*`?([^`]+?)`?\s*$')
CATS_RE           = re.compile(r'^-\s+\*\*التصنيفات الحالية\*\*:\s*(.*?)\s*$')
TAGS_RE           = re.compile(r'^-\s+\*\*الوسوم\*\*:\s*(.*?)\s*$')
SUMMARY_INLINE_RE = re.compile(r'^\*\*المُلخَّص\*\*:\s*(.*)$')
INTRO_INLINE_RE   = re.compile(r'^\*\*مستهلّ المقال\*\*:\s*(.*)$')

# Episode number at end of title — `(N)`, possibly with spaces, parens
# variations, or no space before the paren.
EPISODE_NUM_RE = re.compile(r'\(\s*(\d+)\s*\)\s*$')


def split_arabic_list(s):
    """Split a string by Arabic commas (and ASCII commas as fallback)."""
    if not s:
        return []
    parts = re.split(r'[،,]', s)
    return [p.strip().lstrip("#").strip() for p in parts if p.strip()]


def parse_year_file(path):
    """Yield article dicts from a single year markdown file."""
    with open(path, "r", encoding="utf-8") as f:
        lines = f.read().splitlines()

    # Pre-determine year from filename: NN-year-YYYY.md
    fname = os.path.basename(path)
    year_match = re.search(r'year-(\d{4})', fname)
    file_year = int(year_match.group(1)) if year_match else None

    current = None

    def _flush():
        if current is not None:
            yield current

    for raw in lines:
        line = raw.rstrip("\n")

        m = ARTICLE_HEADER_RE.match(line)
        if m:
            if current is not None:
                yield current
            current = {
                "index_in_year":   int(m.group(1)),
                "title":           m.group(2).strip(),
                "date":            None,
                "wp_id":           None,
                "old_categories":  [],
                "old_tags":        [],
                "summary":         "",
                "intro":           "",
                "year":            file_year,
                "_section":        "header",
            }
            continue

        if current is None:
            continue

        m = DATE_RE.match(line)
        if m:
            current["date"] = m.group(1).strip()
            continue

        m = WP_RE.match(line)
        if m:
            current["wp_id"] = m.group(1).strip()
            continue

        m = CATS_RE.match(line)
        if m:
            current["old_categories"] = split_arabic_list(m.group(1))
            continue

        m = TAGS_RE.match(line)
        if m:
            current["old_tags"] = split_arabic_list(m.group(1))
            continue

        m = SUMMARY_INLINE_RE.match(line)
        if m:
            current["_section"] = "summary"
            current["summary"]  = m.group(1).strip()
            continue

        m = INTRO_INLINE_RE.match(line)
        if m:
            current["_section"] = "intro"
            current["intro"]    = m.group(1).strip()
            continue

        # Continuation of summary / intro across multiple lines
        if current["_section"] == "summary" and line.strip() and not line.startswith("**"):
            current["summary"] += " " + line.strip()
        elif current["_section"] == "intro":
            stripped = line.strip()
            if stripped.startswith(">"):
                current["intro"] += " " + stripped.lstrip(">").strip()
            elif stripped and not stripped.startswith("**"):
                current["intro"] += " " + stripped

    if current is not None:
        yield current


# ---------------------------------------------------------------------------
# Classification
# ---------------------------------------------------------------------------

def detect_series(title):
    """Return (series_name, episode_num, axis) if title matches a known series,
    else (None, None, None). The episode number is extracted from `(N)` at end."""
    ep_match = EPISODE_NUM_RE.search(title)
    if not ep_match:
        return None, None, None

    # Title without trailing (N)
    head = title[:ep_match.start()].strip()
    for trigger, info in SERIES_RULES.items():
        if trigger in title:
            return info["series"], int(ep_match.group(1)), info["axis"]

    # Some series occasionally drop the trigger from the headline; we still
    # require *one* of the triggers to claim this is a "series" episode.
    # If none matched we treat it as a non-series article.
    return None, None, None


def detect_publisher(old_cats, intro_text):
    for cat in old_cats:
        if cat in PUBLISHER_MAP:
            return PUBLISHER_MAP[cat]
    # Try to detect from intro line ("نَشْرٌ المقال في ...")
    if intro_text:
        for needle, name in (
            ("العربي الجديد", "العربي الجديد"),
            ("عربي21",        "عربي 21"),
            ("عربي 21",       "عربي 21"),
            ("عربي ٢١",       "عربي 21"),
            ("الشروق",        "الشروق"),
            ("الأهرام",       "الأهرام"),
            ("الاهرام",       "الأهرام"),
            ("الجزيرة",       "الجزيرة"),
            ("المعهد المصري", "المعهد المصري"),
            ("مركز الحضارة",  "مركز الحضارة"),
            ("المسلم المعاصر","المسلم المعاصر"),
            ("مجلة المجتمع",  "مجلة المجتمع"),
        ):
            if needle in intro_text:
                return name
    return None


def classify_old_category(old_cats):
    for cat in old_cats:
        if cat in OLD_CAT_RULES:
            return OLD_CAT_RULES[cat]
    return None


def classify_keywords(haystack):
    for axis, keywords in KEYWORD_RULES:
        for kw in keywords:
            if kw in haystack:
                return axis, kw
    return None, None


def is_book_or_study(title, old_cats):
    if any(c in old_cats for c in
           ("الكتب", "الدراسات", "في الكتب والدراسات المعاصرة",
            "الانشطة والفعاليات", "بودكاست", "تعاون مؤسسي")):
        return True
    return any(kw in title for kw in CONTENT_TYPE_KEYWORDS)


def classify(article):
    title    = article["title"]
    summary  = article.get("summary", "")
    old_cats = article.get("old_categories", [])
    intro    = article.get("intro", "")

    # 1. Series rule (highest priority)
    series, ep, axis = detect_series(title)
    if series is not None:
        return {
            "axis": axis,
            "series": series,
            "series_number": ep,
            "method": "series",
            "matched_keyword": None,
        }

    # 2. Old thematic category
    axis = classify_old_category(old_cats)
    if axis is not None:
        return {
            "axis": axis,
            "series": None,
            "series_number": None,
            "method": "old_category",
            "matched_keyword": None,
        }

    # 3. Keyword search in title + summary
    haystack = f"{title} \n {summary}"
    axis, kw = classify_keywords(haystack)
    if axis is not None:
        return {
            "axis": axis,
            "series": None,
            "series_number": None,
            "method": "keywords",
            "matched_keyword": kw,
        }

    # 4. Default
    return {
        "axis": DEFAULT_AXIS,
        "series": None,
        "series_number": None,
        "method": "default",
        "matched_keyword": None,
    }


# ---------------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------------

def main():
    here  = os.path.dirname(os.path.abspath(__file__))
    files = sorted(glob.glob(os.path.join(here, "[0-9][0-9]-year-*.md")))

    all_articles = []
    for path in files:
        for art in parse_year_file(path):
            cls = classify(art)
            publisher = detect_publisher(art["old_categories"], art["intro"])

            entry = {
                "wp_id":                 art["wp_id"],
                "title":                 art["title"],
                "date":                  art["date"],
                "year":                  art["year"],
                "new_axis":              cls["axis"],
                "new_axis_name":         AXES[cls["axis"]],
                "series":                cls["series"],
                "series_number":         cls["series_number"],
                "publisher":             publisher,
                "old_categories":        art["old_categories"],
                "classification_method": cls["method"],
                "matched_keyword":       cls["matched_keyword"],
                "is_book_or_study":      is_book_or_study(
                    art["title"], art["old_categories"]),
            }
            all_articles.append(entry)

    # ---------------------- write JSON map ----------------------
    today = _date.today().isoformat()
    out_json = {
        "metadata": {
            "total_articles": len(all_articles),
            "generated_date": today,
            "axes": {str(k): v for k, v in AXES.items()},
        },
        "articles": all_articles,
    }
    with open(os.path.join(here, "reclassification-map.json"), "w",
              encoding="utf-8") as f:
        json.dump(out_json, f, ensure_ascii=False, indent=2)

    # ---------------------- summary tables ----------------------
    write_summary(all_articles, today, here)
    write_series_index(all_articles, here)

    # Console report
    print(f"Parsed {len(all_articles)} articles from {len(files)} files.")
    method_counts = Counter(a["classification_method"] for a in all_articles)
    print("Methods:", dict(method_counts))
    axis_counts = Counter(a["new_axis"] for a in all_articles)
    print("Axes:   ", {AXES[k]: v for k, v in sorted(axis_counts.items())})


# ---------------------------------------------------------------------------
# Markdown report writers
# ---------------------------------------------------------------------------

def _md_table(headers, rows):
    out = ["| " + " | ".join(headers) + " |",
           "|" + "|".join(["---"] * len(headers)) + "|"]
    for row in rows:
        out.append("| " + " | ".join(str(c) for c in row) + " |")
    return "\n".join(out)


def write_summary(articles, today, out_dir):
    total = len(articles)

    # 1. axis distribution
    axis_counts = Counter(a["new_axis"] for a in articles)
    axis_rows = []
    for axis_id in sorted(AXES.keys()):
        n = axis_counts.get(axis_id, 0)
        pct = (100.0 * n / total) if total else 0.0
        axis_rows.append([f"{axis_id}. {AXES[axis_id]}", n, f"{pct:.1f}%"])

    # 2. series distribution
    series_counts = Counter(a["series"] for a in articles if a["series"])
    series_rows = [[s, n] for s, n in
                   sorted(series_counts.items(), key=lambda x: -x[1])]

    # 3. publisher distribution
    pub_counts = Counter(a["publisher"] or "—غير معروف—" for a in articles)
    pub_rows   = [[p, n] for p, n in
                  sorted(pub_counts.items(), key=lambda x: -x[1])]

    # 4. axis × year cross-tab
    years = sorted({a["year"] for a in articles if a["year"]})
    cross = defaultdict(lambda: Counter())
    for a in articles:
        if a["year"] is None:
            continue
        cross[a["new_axis"]][a["year"]] += 1

    cross_headers = ["المحور"] + [str(y) for y in years] + ["الإجمالي"]
    cross_rows = []
    for axis_id in sorted(AXES.keys()):
        row = [f"{axis_id}. {AXES[axis_id]}"]
        total_axis = 0
        for y in years:
            n = cross[axis_id].get(y, 0)
            row.append(n if n else "")
            total_axis += n
        row.append(total_axis)
        cross_rows.append(row)
    # totals row
    totals_row = ["الإجمالي"]
    grand = 0
    for y in years:
        col_total = sum(cross[a].get(y, 0) for a in AXES)
        totals_row.append(col_total)
        grand += col_total
    totals_row.append(grand)
    cross_rows.append(totals_row)

    # 5. classification methods
    method_counts = Counter(a["classification_method"] for a in articles)
    method_rows = [[m, n, f"{100.0*n/total:.1f}%"]
                   for m, n in sorted(method_counts.items(), key=lambda x: -x[1])]

    # 6. defaults — for manual review
    defaults = [a for a in articles if a["classification_method"] == "default"]

    # ----- assemble markdown -----
    md = []
    md.append(f"# تقرير إعادة تصنيف المقالات\n")
    md.append(f"- إجمالي المقالات: **{total}**")
    md.append(f"- تاريخ التوليد: {today}\n")

    md.append("## 1. توزيع المقالات على المحاور\n")
    md.append(_md_table(["المحور", "العدد", "النسبة"], axis_rows))
    md.append("")

    md.append("## 2. توزيع المقالات على السلاسل\n")
    if series_rows:
        md.append(_md_table(["السلسلة", "عدد الحلقات"], series_rows))
    else:
        md.append("_لا توجد سلاسل._")
    md.append("")

    md.append("## 3. توزيع المقالات على منصات النشر\n")
    md.append(_md_table(["المنصة", "العدد"], pub_rows))
    md.append("")

    md.append("## 4. المحاور × السنوات\n")
    md.append(_md_table(cross_headers, cross_rows))
    md.append("")

    md.append("## 5. توزيع طرق التصنيف\n")
    md.append(_md_table(["الطريقة", "العدد", "النسبة"], method_rows))
    md.append("")

    md.append(f"## 6. مقالات تم تصنيفها بـ default — للمراجعة اليدوية ({len(defaults)})\n")
    if defaults:
        rows = []
        for a in defaults:
            rows.append([
                a["wp_id"] or "—",
                a["date"] or "—",
                a["title"].replace("|", "\\|"),
                ", ".join(a["old_categories"]) or "—",
            ])
        md.append(_md_table(
            ["WP", "التاريخ", "العنوان", "التصنيفات القديمة"], rows))
    else:
        md.append("_لا شيء — كل المقالات صُنِّفت بقاعدة معروفة._")
    md.append("")

    with open(os.path.join(out_dir, "reclassification-summary.md"), "w",
              encoding="utf-8") as f:
        f.write("\n".join(md))


def write_series_index(articles, out_dir):
    grouped = defaultdict(list)
    for a in articles:
        if a["series"]:
            grouped[a["series"]].append(a)

    md = ["# فهرس السلاسل\n"]
    for series in sorted(grouped.keys(),
                         key=lambda s: -len(grouped[s])):
        items = grouped[series]
        # Sort by series_number when available, fall back to date
        items.sort(key=lambda x: (
            x["series_number"] if x["series_number"] is not None else 10**9,
            x["date"] or "9999-99-99"))
        md.append(f"## {series} ({len(items)} حلقة)\n")
        for a in items:
            num = f"{a['series_number']}." if a["series_number"] else "—"
            wp  = a["wp_id"] or "—"
            md.append(f"{num} {a['title']} (WP {wp}) — {a['date']}")
        md.append("")

    with open(os.path.join(out_dir, "series-index.md"), "w",
              encoding="utf-8") as f:
        f.write("\n".join(md))


if __name__ == "__main__":
    main()
