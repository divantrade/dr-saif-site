import { defineField, defineType } from "sanity";

/**
 * Top-level thematic axis of Dr. Saif's intellectual project.
 *
 * The site is organized around 7 axes that re-classify the 1161 articles
 * thematically (instead of the legacy WordPress publisher-based grouping).
 * Every post is assigned to exactly one axis.
 */
export const intellectualAxis = defineType({
  name: "intellectualAxis",
  title: "المحور الفكري",
  type: "document",
  fields: [
    defineField({
      name: "axisNumber",
      title: "رقم المحور",
      type: "number",
      validation: (r) => r.required().integer().min(1).max(7),
      description: "1 إلى 7. يحدّد ترتيب العرض في القائمة.",
    }),
    defineField({
      name: "name",
      title: "اسم المحور",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortName",
      title: "الاسم المختصر",
      type: "string",
      description: "يُستخدم في الفتات (breadcrumbs) و الأماكن الضيقة.",
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
      description: "جملة قصيرة تظهر تحت اسم المحور في صفحته.",
    }),
    defineField({
      name: "description",
      title: "الوصف",
      type: "text",
      rows: 4,
      description: "فقرة تشرح ماهيّة المحور و لماذا يهمّ.",
    }),
    defineField({
      name: "color",
      title: "لون المحور",
      type: "string",
      options: {
        list: [
          { title: "زمرّدي", value: "emerald" },
          { title: "نيلي", value: "indigo" },
          { title: "كهرماني", value: "amber" },
          { title: "قرمزي", value: "rose" },
          { title: "فيروزي", value: "teal" },
          { title: "أرجواني", value: "violet" },
          { title: "نحاسي", value: "orange" },
        ],
      },
      description: "يُستخدم لتمييز بصري في القوائم و البطاقات.",
    }),
    defineField({
      name: "icon",
      title: "أيقونة",
      type: "string",
      description: "اسم رمزي للأيقونة (compass / book / scroll / chain / scales / spark / shield).",
    }),
  ],
  orderings: [
    {
      title: "حسب الرقم",
      name: "axisNumberAsc",
      by: [{ field: "axisNumber", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "tagline",
      number: "axisNumber",
    },
    prepare({ title, subtitle, number }) {
      return {
        title: `${number}. ${title}`,
        subtitle: subtitle || "",
      };
    },
  },
});
