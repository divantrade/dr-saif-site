import { defineField, defineType, defineArrayMember } from "sanity";

export const post = defineType({
  name: "post",
  title: "المقال",
  type: "document",
  groups: [
    { name: "content", title: "المحتوى", default: true },
    { name: "taxonomy", title: "التصنيف" },
    { name: "meta", title: "البيانات الوصفية" },
  ],
  fields: [
    // ─── Content ──────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "العنوان",
      type: "string",
      group: "content",
      validation: (r) => r.required().min(4).max(200),
    }),
    defineField({
      name: "slug",
      title: "الرابط (Slug)",
      type: "slug",
      group: "content",
      description:
        "يُنشأ تلقائياً من العنوان — يمكن تعديله. يُحافَظ على روابط WordPress القديمة للمقالات المُرحَّلة.",
      options: {
        source: "title",
        // Preserve Arabic characters rather than transliterating — matches
        // the WordPress-era URLs which are URL-encoded Arabic.
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
      name: "excerpt",
      title: "الملخّص",
      type: "text",
      rows: 3,
      group: "content",
      description: "يظهر في قوائم المقالات وبطاقات المشاركة الاجتماعية.",
      validation: (r) => r.max(400),
    }),
    defineField({
      name: "featuredImage",
      title: "الصورة المميّزة",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "النص البديل (Alt)",
          type: "string",
        }),
        defineField({
          name: "caption",
          title: "التعليق على الصورة",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "النص الكامل",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "عادي", value: "normal" },
            { title: "عنوان 2", value: "h2" },
            { title: "عنوان 3", value: "h3" },
            { title: "عنوان 4", value: "h4" },
            { title: "اقتباس", value: "blockquote" },
          ],
          lists: [
            { title: "قائمة نقطية", value: "bullet" },
            { title: "قائمة مرقّمة", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "غامق", value: "strong" },
              { title: "مائل", value: "em" },
              { title: "تسطير", value: "underline" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "رابط",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "الرابط",
                    validation: (r) =>
                      r.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                  {
                    name: "openInNewTab",
                    type: "boolean",
                    title: "فتح في تبويب جديد",
                    initialValue: true,
                  },
                ],
              },
              {
                name: "footnote",
                type: "object",
                title: "حاشية",
                fields: [
                  {
                    name: "text",
                    type: "text",
                    title: "نص الحاشية",
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "النص البديل" },
            { name: "caption", type: "string", title: "التعليق" },
          ],
        }),
        defineArrayMember({
          name: "pullQuote",
          type: "object",
          title: "اقتباس مميّز",
          fields: [
            { name: "text", type: "text", title: "النص", rows: 3 },
            { name: "attribution", type: "string", title: "النسبة إلى" },
          ],
          preview: {
            select: { title: "text" },
            prepare: ({ title }) => ({
              title: title || "اقتباس",
              subtitle: "Pull quote",
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "rawHtml",
      title: "HTML خام (للمقالات المُرحَّلة فقط)",
      type: "text",
      rows: 6,
      group: "content",
      hidden: ({ document }) => !document?.isMigrated,
      description:
        "يُستخدم للمقالات المهاجرة من WordPress حيث الحفاظ على HTML الأصلي أدق من التحويل إلى Portable Text.",
      readOnly: true,
    }),

    // ─── Taxonomy ─────────────────────────────────────────────────────────
    defineField({
      name: "categories",
      title: "التصنيفات",
      type: "array",
      group: "taxonomy",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "tags",
      title: "الوسوم",
      type: "array",
      group: "taxonomy",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "author",
      title: "الكاتب",
      type: "reference",
      to: [{ type: "author" }],
      group: "taxonomy",
    }),

    // ─── Meta ─────────────────────────────────────────────────────────────
    defineField({
      name: "publishedAt",
      title: "تاريخ النشر",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sticky",
      title: "مقال مُلصَق (featured)",
      type: "boolean",
      group: "meta",
      initialValue: false,
      description: "المقال المُلصَق يظهر في الأعلى على الصفحة الرئيسية.",
    }),
    defineField({
      name: "originalSource",
      title: "مكان النشر الأصلي",
      type: "object",
      group: "meta",
      description: "إذا نُشر المقال أصلاً في موقع آخر.",
      fields: [
        { name: "publication", type: "string", title: "اسم الموقع" },
        { name: "url", type: "url", title: "الرابط الأصلي" },
        { name: "publishedAt", type: "date", title: "تاريخ النشر الأصلي" },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "meta",
      fields: [
        {
          name: "metaTitle",
          type: "string",
          title: "عنوان Meta",
          description: "يُستخدم في نتائج Google. افتراضياً = العنوان.",
          validation: (r) => r.max(70),
        },
        {
          name: "metaDescription",
          type: "text",
          rows: 2,
          title: "وصف Meta",
          description: "يظهر تحت العنوان في نتائج البحث. 150–160 حرف مثالي.",
          validation: (r) => r.max(180),
        },
      ],
    }),

    // ─── Hidden migration markers ─────────────────────────────────────────
    defineField({
      name: "isMigrated",
      type: "boolean",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "legacyId",
      title: "المعرّف القديم (WordPress)",
      type: "number",
      hidden: true,
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "الأحدث أولاً",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "الأقدم أولاً",
      name: "publishedAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "featuredImage",
      sticky: "sticky",
    },
    prepare({ title, subtitle, media, sticky }) {
      const date = subtitle
        ? new Date(subtitle).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "";
      return {
        title: sticky ? `★ ${title}` : title,
        subtitle: date,
        media,
      };
    },
  },
});
