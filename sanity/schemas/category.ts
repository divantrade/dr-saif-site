import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "التصنيف",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "اسم التصنيف",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "الرابط (Slug)",
      type: "slug",
      options: {
        source: "name",
        // Preserve Arabic characters; only collapse spaces / strip control chars.
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
      name: "parent",
      title: "التصنيف الأب",
      type: "reference",
      to: [{ type: "category" }],
      description: "اتركه فارغاً إذا كان هذا تصنيفاً رئيسياً.",
    }),
    defineField({
      name: "description",
      title: "الوصف",
      type: "text",
      rows: 3,
    }),
    defineField({
      // Legacy id from the old WordPress site — used to preserve relations
      // during migration. Hidden from the UI once everything's in place.
      name: "legacyId",
      title: "المعرّف القديم (WordPress)",
      type: "number",
      readOnly: true,
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: "الأحدث أولاً",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
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
      subtitle: "parent.name",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `فرع من: ${subtitle}` : "تصنيف رئيسي",
      };
    },
  },
});
