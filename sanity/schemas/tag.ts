import { defineField, defineType } from "sanity";

export const tag = defineType({
  name: "tag",
  title: "الوسم",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "اسم الوسم",
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
      name: "legacyId",
      title: "المعرّف القديم (WordPress)",
      type: "number",
      readOnly: true,
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: "أبجدياً",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name" },
  },
});
