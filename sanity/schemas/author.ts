import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "الكاتب",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "الاسم",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "الرابط (Slug)",
      type: "slug",
      options: { source: "name" },
    }),
    defineField({
      name: "honorific",
      title: "اللقب",
      type: "string",
      description: "مثل: أ.د. / د. / الأستاذ",
    }),
    defineField({
      name: "picture",
      title: "الصورة",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "نبذة مختصرة",
      type: "text",
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "honorific",
      media: "picture",
    },
  },
});
