# دليل Sanity CMS

يشرح هذا الملف بنية تكامل Sanity في المشروع، وكيفية إدارته يومياً.

## البنية

```
dr-saif-site/
├── sanity.config.ts              ← إعداد Studio الرئيسي (root)
├── sanity/
│   ├── env.ts                    ← متغيّرات البيئة مع افتراضات
│   ├── client.ts                 ← Sanity client للسيرفر (read-only)
│   ├── image.ts                  ← builder لروابط صور Sanity
│   └── schemas/
│       ├── index.ts              ← تصدير كل النماذج
│       ├── post.ts               ← نموذج المقال (الأكبر)
│       ├── category.ts           ← التصنيف (مع parent self-reference)
│       ├── tag.ts                ← الوسم
│       └── author.ts             ← الكاتب
├── app/studio/
│   ├── layout.tsx                ← يُخفي header/footer الموقع داخل Studio
│   └── saif/[[...tool]]/page.tsx ← catch-all route لـ NextStudio
├── scripts/
│   ├── migrate-to-sanity.ts      ← سكريبت الترحيل لمرة واحدة
│   └── README.md                 ← توثيق السكريبت
└── .env.local                    ← متغيّرات السرّية (مُستثنى من Git)
```

## متغيّرات البيئة

في `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-04-12

# مفتاح كتابة — يُستخدم فقط في سكريبت الترحيل والـ webhooks
SANITY_WRITE_TOKEN=sk...

# اختياري: لمعاينة المسوّدات
SANITY_READ_TOKEN=

# يُستخدم لتوقيع webhooks من Sanity إلى Vercel (Phase 2)
SANITY_WEBHOOK_SECRET=
```

⚠️ **لا تشارك `SANITY_WRITE_TOKEN` في أي مكان عام** — Git, Slack, لقطات الشاشة، إلخ.

## الوصول إلى Studio

بعد تشغيل `npm run dev`:
```
http://localhost:3000/studio/saif
```

على الإنتاج (بعد النشر):
```
https://<your-domain>/studio/saif
```

المحرّر يُسجّل دخوله بحساب Sanity (Google / GitHub / إيميل).

## سير العمل اليومي للمحرّر

### نشر مقال جديد

1. افتح `/studio/saif`
2. من القائمة: **المقالات** → **+ Create**
3. املأ:
   - العنوان (يُنشئ slug تلقائياً — يمكن تعديله)
   - الملخّص (للـ SEO وبطاقات المشاركة)
   - الصورة المميّزة (اسحب/أفلت)
   - المحتوى الكامل (Portable Text — تنسيق غنيّ، صور، حواشي، اقتباسات)
   - التصنيفات والوسوم
   - تاريخ النشر
4. اضغط **Publish**

### تعديل مقال موجود
نفس الخطوات لكن افتح المقال من القائمة بدل Create.

### المقالات المُرحَّلة من WordPress
المقالات التي تحمل `isMigrated: true` تُعرض بـ `rawHtml` بدل `body` (الـ Portable Text). لو أردت إعادة تحريرها بـ Studio:
1. افتح المقال
2. انسخ محتوى `rawHtml`
3. الصقه في `body` وأعد تنسيقه بأدوات Studio
4. احذف `rawHtml` (الحقل مخفي، يحتاج GROQ mutation من Vision)

## سير عمل الترحيل (الأوّلي)

سكريبت الترحيل يحتاج تشغيله من جهاز له **اتصال إنترنت كامل** (للوصول لـ `api.sanity.io` ولتحميل صور WordPress).

```bash
# ١) ملء .env.local بمفتاح كتابة (Editor permission على Sanity)
cp .env.example .env.local
# أضف SANITY_WRITE_TOKEN=sk... يدوياً

# ٢) فحص أوّلي بدون اتصال بـ Sanity
npm run migrate:sanity:dry

# ٣) الترحيل الفعلي
npm run migrate:sanity

# ٤) لو أردت ترحيلاً أسرع بدون صور (يمكن إضافتها لاحقاً)
npm run migrate:sanity -- --skip-images
```

السكريبت **idempotent**: لو توقّف وأعدت تشغيله، يتخطّى ما أُنجز (يعتمد على `legacyId`).

## استعلام البيانات من الموقع

### القراءة (في Server Components)

```typescript
import { sanityClient } from "@/sanity/client";

const posts = await sanityClient.fetch(
  `*[_type == "post"] | order(publishedAt desc)[0...10]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    featuredImage,
    "categories": categories[]->{name, "slug": slug.current},
  }`
);
```

### الصور

```typescript
import { urlForImage } from "@/sanity/image";

// في Component:
<Image
  src={urlForImage(post.featuredImage).width(800).url()}
  alt={post.featuredImage.alt || post.title}
  width={800}
  height={450}
/>
```

## Webhook Sanity → Vercel (Phase 2 — لم يُنفَّذ بعد)

الهدف: عند نشر/تعديل مقال في Studio، Vercel يُعيد بناء الموقع تلقائياً.

### الخطوات المستقبلية
1. Vercel → Project → Settings → Git → Deploy Hooks → Create
2. انسخ الـ URL
3. Sanity → API → Webhooks → Add
4. URL = Deploy Hook من Vercel
5. Trigger = `create` + `update` + `delete` على post/category/tag

## حدود Sanity Free tier

| المورد | الحدّ |
|---|---|
| المستخدمون | 3 |
| عدد المستندات | 10,000 |
| طلبات CDN شهرياً | 500,000 |
| مساحة التخزين | 5 GB |
| تحميل البيانات شهرياً | 100 GB |

**كفاية للمشروع**: 100 مقال حالياً + 36 تصنيف + 100 وسم = 236 مستند. المساحة تكفي لأكثر من 15 سنة بنفس معدّل النشر.

## استكشاف الأخطاء

### "Missing SANITY_WRITE_TOKEN"
`.env.local` غير موجود أو المتغيّر فارغ. افحص بـ:
```bash
cat .env.local | grep WRITE_TOKEN
```

### "CORS error" في المتصفح
Sanity → API → CORS origins — أضف `http://localhost:3000` مع Allow credentials.

### Studio لا يُحمِّل (شاشة فارغة)
- تأكّد من `"use client"` في `app/studio/saif/[[...tool]]/page.tsx`
- تأكّد من صحة `projectId` في `sanity/env.ts`

### Images من Sanity تظهر broken
تأكّد من `cdn.sanity.io` في `next.config.ts` → `images.remotePatterns`.

آخر تحديث: 2026-04-12
