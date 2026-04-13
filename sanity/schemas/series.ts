import { defineField, defineType } from "sanity";

/**
 * A numbered, ongoing column / series of articles (e.g. "قاموس المقاومة",
 * "النقد الذاتي", "المواطنة من جديد"). Each series is anchored to one of
 * the 7 intellectual axes, and each post in the series carries a
 * `seriesNumber` (the episode number).
 */
export const series = defineType({
  name: "series",
  title: "السلسلة",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "اسم السلسلة",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "الرابط (Slug)",
      type: "slug",
      options: {
        source: "name",
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\p{L}\p{N}-]/gu, "")
            .slice(0, 96),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "العنوان التعريفي",
      type: "string",
      description: "جملة قصيرة تشرح موضوع السلسلة.",
    }),
    defineField({
      name: "description",
      title: "الوصف",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "axis",
      title: "المحور الفكري",
      type: "reference",
      to: [{ type: "intellectualAxis" }],
      validation: (r) => r.required(),
      description: "المحور الذي تنتمي إليه السلسلة.",
    }),
    defineField({
      name: "displayOrder",
      title: "ترتيب العرض",
      type: "number",
      description:
        "يحدّد ترتيب السلسلة في قائمة 'السلاسل'. الأقل يظهر أوّلاً.",
    }),
    defineField({
      name: "featured",
      title: "سلسلة مميزة",
      type: "boolean",
      initialValue: false,
      description: "إذا كانت true تظهر بشكل بارز في الصفحة الرئيسية.",
    }),
  ],
  orderings: [
    {
      title: "ترتيب العرض",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
    {
      title: "أبجدياً",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "axis.name",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `محور: ${subtitle}` : "بدون محور",
      };
    },
  },
});
