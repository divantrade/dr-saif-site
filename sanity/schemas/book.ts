import { defineField, defineType } from "sanity";

/**
 * Book / monograph document.
 *
 * The homepage "المشروع في كتب" section and the dedicated /books page
 * both read from this type. Until the editor fills it in, the public UI
 * falls back to a hardcoded list of the project's foundational titles
 * (see `lib/sanity-data.ts :: getFeaturedBooks`).
 *
 * A `book` is deliberately separate from `post`: books carry publisher /
 * year / ISBN / cover image — all shaped around the object, not around
 * an article. When an editor wants to link a book back to the long-form
 * post that announces it (e.g. "طبعة 2013 — المشروع الحضاري"), use the
 * optional `relatedPost` reference.
 */
export const book = defineType({
  name: "book",
  title: "الكتب",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "عنوان الكتاب",
      type: "string",
      validation: (r) => r.required().min(2).max(200),
    }),
    defineField({
      name: "subtitle",
      title: "العنوان الفرعي",
      type: "string",
      description: "اختياري — يظهر تحت العنوان في صفحة الكتاب.",
    }),
    defineField({
      name: "slug",
      title: "الرابط (Slug)",
      type: "slug",
      options: {
        source: "title",
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\p{L}\p{N}-]/gu, "")
            .slice(0, 96),
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year",
      title: "سنة النشر",
      type: "number",
      validation: (r) => r.integer().min(1950).max(2100),
    }),
    defineField({
      name: "publisher",
      title: "الناشر",
      type: "string",
    }),
    defineField({
      name: "isbn",
      title: "الرقم الدولي (ISBN)",
      type: "string",
    }),
    defineField({
      name: "cover",
      title: "صورة الغلاف",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "النص البديل (Alt)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "الوصف",
      type: "text",
      rows: 4,
      description: "فقرة قصيرة تصف الكتاب وأطروحته.",
      validation: (r) => r.max(500),
    }),
    defineField({
      name: "axis",
      title: "المحور الفكري",
      type: "reference",
      to: [{ type: "intellectualAxis" }],
      description: "المحور الذي ينتمي إليه الكتاب — يُستخدم للون الغلاف.",
    }),
    defineField({
      name: "displayOrder",
      title: "ترتيب العرض",
      type: "number",
      description:
        "الترقيم الذي يظهر به الكتاب في قائمة الكتب (الأصغر أولاً). " +
        "اتركه فارغاً لتتبع ترتيب السنة.",
    }),
    defineField({
      name: "featured",
      title: "يُعرض في الصفحة الرئيسية",
      type: "boolean",
      initialValue: true,
      description: "إذا فعّلت الخيار، يظهر الكتاب في قسم «المشروع في كتب».",
    }),
    defineField({
      name: "externalUrl",
      title: "رابط خارجي (PDF/متجر)",
      type: "url",
      description: "اختياري — لتحميل نسخة أو صفحة الكتاب في متجر.",
    }),
    defineField({
      name: "relatedPost",
      title: "المقال/الخبر المرتبط",
      type: "reference",
      to: [{ type: "post" }],
      description: "المقال الذي يعلن عن الكتاب أو يستعرض طبعته.",
    }),
  ],
  orderings: [
    {
      title: "ترتيب يدوي",
      name: "orderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
    {
      title: "السنة (الأحدث أولاً)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      year: "year",
      media: "cover",
    },
    prepare({ title, year, media }) {
      return {
        title,
        subtitle: year ? String(year) : "",
        media,
      };
    },
  },
});
