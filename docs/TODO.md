# قائمة المهام

مرتّبة حسب الأولوية: 🔴 عاجل ← 🟡 متوسط ← 🟢 منخفض.

## 🔴 مهام عاجلة

### [١] تشغيل ترحيل Sanity (محلياً)
**الخطوات**:
```bash
git checkout claude/fix-doctor-image-layout-0LdFh
git pull
npm install
cp .env.example .env.local
# عدّل .env.local وضع SANITY_WRITE_TOKEN من Sanity → API → Tokens

npm run migrate:sanity:dry    # فحص بدون اتصال
npm run migrate:sanity        # ترحيل فعلي
npm run dev
# افتح http://localhost:3000/studio/saif وتحقّق من ظهور:
#  - 100 مقال في تبويب المقالات
#  - 36 تصنيف
#  - 100 وسم
#  - author واحد (الدكتور)
```

**الوقت التقديري**: 5–10 دقائق (حسب سرعة الإنترنت لتحميل الصور).

## 🟡 مهام متوسطة

### [٢] Phase 2 — تحويل الموقع ليقرأ من Sanity
يحدث بعد إنجاز [١]:
- [ ] تحديث `lib/data.ts` لاستخدام GROQ queries بدل قراءة JSON
- [ ] تحويل أنواع البيانات من `WPPost` إلى شكل Sanity
- [ ] اختبار كل المسارات على `www.divanmax.com`:
  - [ ] `/` (الرئيسية)
  - [ ] `/blog` (القائمة)
  - [ ] `/blog/[slug]` (مقال)
  - [ ] `/category/[slug]`
  - [ ] `/tag/[slug]`
  - [ ] `/search`
- [ ] حذف `public/data/*.json` (بعد التأكّد أن كل شيء يعمل)
- [ ] اختبار Studio يُحدّث الموقع (بعد Webhook — المهمة [٣])

### [٣] Webhook Sanity → Vercel
**بعد إنجاز [٢]**:
- [ ] إنشاء Deploy Hook في Vercel:
  - Vercel → Project → Settings → Git → Deploy Hooks → Create
- [ ] إضافة Webhook في Sanity:
  - Sanity → API → Webhooks → Add
  - URL = رابط Deploy Hook
  - Trigger: `create` + `update` + `delete` على post/category/tag/author
  - Filter: `_type in ["post", "category", "tag", "author"]`
- [ ] اختبار: نشر مقال جديد في Studio → Vercel يبني تلقائياً → يظهر في الموقع

### [٤] تبديل الـ API Token القديم
**بعد إنجاز [١]**:
- [ ] Sanity → API → Tokens → حذف الـ token القديم (المُشارَك سابقاً)
- [ ] (اختياري) إنشاء token جديد إذا احتجت ترحيلاً إضافياً
- [ ] تحديث `.env.local` محلياً فقط — لا يحتاج أن يكون على Vercel

### [٥] الهجرة النهائية لدومين الدكتور
**بعد اكتمال كل المهام أعلاه ومراجعة الموقع الكاملة**:
- [ ] تأكيد اسم دومين الدكتور الرسمي
- [ ] Vercel → Settings → Domains → إضافة الدومين الجديد
- [ ] إعداد DNS records لدى مسجّل الدومين
- [ ] تحديث `lib/site.ts` → `SITE.url`
- [ ] تحديث Sanity CORS origins
- [ ] تعيين الدومين الجديد كـ **Primary** في Vercel
- [ ] تحديث روابط السوشيال ميديا للدكتور
- [ ] (بعد 30 يوم استقرار) حذف `www.divanmax.com` من Vercel

## 🟢 مهام تحسينية

### [٦] توحيد الفرع الافتراضي على GitHub
الفرع الافتراضي حالياً `claude/push-to-github-QAaRx`. الاتفاقية المعيارية:
- [ ] إنشاء/تحديث فرع `main` من أحدث فرع إنتاجي
- [ ] تعيين `main` كالفرع الافتراضي على GitHub
- [ ] تحديث Vercel ليبني من `main`
- [ ] أرشفة/حذف الفروع `claude/*` القديمة

### [٧] إضافة فحوصات CI
- [ ] GitHub Action على كل PR:
  - `npm run build`
  - `npx tsc --noEmit`
  - `npm run lint`
- [ ] منع الـ merge إذا فشل CI

### [٨] تحسينات على Studio
- [ ] Logo مخصّص للدكتور في الشريط العلوي لـ Studio
- [ ] Live Preview للمقالات (عرض نسخة المقال كما ستظهر على الموقع داخل Studio)
- [ ] تجميع المقالات في Studio حسب السنة أو التصنيف
- [ ] إضافة Custom Document Actions (مثل: "تصدير كـ PDF")

### [٩] تحسينات SEO
- [ ] Structured data (JSON-LD) للمقالات (Article schema)
- [ ] Breadcrumbs schema
- [ ] Open Graph images مخصّصة لكل مقال (توليد تلقائي من Sanity)
- [ ] Submit sitemap لـ Google Search Console على الدومين النهائي

### [١٠] أداء
- [ ] Lighthouse audit على الإنتاج بعد Phase 2
- [ ] تحسين الصور (Sanity image URL: `.auto("format").width(...)`)
- [ ] تحميل Studio كـ async chunk (لتقليل حجم بناء الصفحات الأخرى)
- [ ] مراجعة bundle size بعد إضافة Sanity (حوالي 865 packages جديدة)

---

## مهام مُنجزة ✅

- [x] إصلاح تموضع صورة الدكتور في `/about` و PDF
- [x] دمج تعديل صفحة وقف القلم
- [x] إعداد Sanity Studio على `/studio/saif`
- [x] تعريف Schemas: post, category, tag, author
- [x] كتابة سكريبت الترحيل (idempotent, with --dry-run, --skip-images)
- [x] إعداد `.env.local` و`.gitignore`
- [x] تحديث `next.config.ts` لـ Sanity CDN
- [x] ربط الدومين المؤقت `www.divanmax.com`
- [x] التأكّد من نشر Vercel تلقائي من GitHub
- [x] توثيق كل ما سبق في `/docs/`

آخر تحديث: 2026-04-12
