# قائمة المهام

مرتّبة حسب الأولوية: 🔴 عاجل ← 🟡 متوسط ← 🟢 منخفض.

## 🔴 مهام عاجلة

### [١] تشخيص وإصلاح 404 على المقالات
**السياق**: `dr-saif-site.vercel.app` يُرجع 404 للمقالات، بينما `-xi` يعمل.

**المطلوب من المستخدم**:
- [ ] لقطة شاشة من Vercel Dashboard → Projects (عدد المشاريع)
- [ ] Production Branch للمشروع الرئيسي
- [ ] حالة آخر deployment (Ready / Error / Building)
- [ ] اختبار نفس slug على كلا الموقعين

**ما سيفعله المساعد بناءً على المعلومات**:
- إذا الفرع خاطئ: تصحيح إعدادات Vercel Git
- إذا deployment عالق: trigger rebuild
- إذا مشكلة في Next.js 16: middleware أو تعديل بنية الـ slugs

### [٢] تشغيل ترحيل Sanity (محلياً)
**الخطوات**:
```bash
git checkout claude/fix-doctor-image-layout-0LdFh
git pull
npm install
cp .env.example .env.local
# عدّل .env.local وضع SANITY_WRITE_TOKEN

npm run migrate:sanity:dry    # فحص
npm run migrate:sanity        # ترحيل فعلي
npm run dev
# افتح http://localhost:3000/studio/saif وتحقّق
```

**الوقت التقديري**: 5–10 دقائق.

## 🟡 مهام متوسطة

### [٣] Phase 2 — تحويل الموقع ليقرأ من Sanity
يحدث بعد إنجاز [٢]:
- [ ] تحديث `lib/data.ts` لاستخدام GROQ queries بدل قراءة JSON
- [ ] تحويل أنواع البيانات من WPPost إلى شكل Sanity
- [ ] اختبار كل المسارات (`/`, `/blog`, `/blog/[slug]`, `/category/[slug]`, `/tag/[slug]`)
- [ ] حذف `public/data/*.json` (بعد التأكّد أن كل شيء يعمل)

### [٤] ربط دومين `divanmax.com`
**بعد إصلاح [١]**:
- [ ] اختيار الحلّ من `DEPLOYMENT.md`
- [ ] إعدادات DNS في GoDaddy
- [ ] تحديث Sanity CORS
- [ ] تحديث `lib/site.ts` بالدومين الجديد

### [٥] Webhook Sanity → Vercel
**بعد إنجاز [٣]**:
- [ ] إنشاء Deploy Hook في Vercel
- [ ] إضافة Webhook في Sanity يُشغّل الـ Deploy Hook
- [ ] اختبار: نشر مقال جديد → Vercel يبني → يظهر في الموقع

### [٦] تبديل الـ API Token القديم
**بعد إنجاز [٢]**:
- [ ] Sanity → API → Tokens → حذف الـ token القديم (المُشارَك في الشات)
- [ ] إنشاء token جديد (اختياري — ليس مطلوباً إلا لترحيل إضافي)
- [ ] تحديث `.env.local` محلياً فقط

## 🟢 مهام تحسينية

### [٧] توحيد الفرع الافتراضي
الفرع الافتراضي حالياً `claude/push-to-github-QAaRx`. الاتفاقية المعيارية:
- [ ] إنشاء فرع `main` من `claude/fix-doctor-image-layout-0LdFh` (بعد التأكّد من الإنتاج)
- [ ] تعيين `main` كالفرع الافتراضي على GitHub
- [ ] تحديث Vercel ليبني من `main`
- [ ] أرشفة/حذف الفروع `claude/*` القديمة

### [٨] إضافة فحوصات CI
- [ ] GitHub Action على كل PR: `npm run build` + `npx tsc --noEmit` + `npm run lint`
- [ ] منع الـ merge إذا فشل CI

### [٩] تحسينات على Studio
- [ ] Logo مخصّص للدكتور في الشريط العلوي لـ Studio
- [ ] Preview live للمقالات (عرض نسخة المقال كما ستظهر على الموقع)
- [ ] تجميع المقالات في Studio حسب السنة أو التصنيف

### [١٠] تحسينات SEO
- [ ] Structured data (JSON-LD) للمقالات (Article schema)
- [ ] Breadcrumbs schema
- [ ] Open Graph images مخصّصة لكل مقال (لو الصورة المميّزة ناقصة)

### [١١] أداء
- [ ] lighthouse audit على الإنتاج
- [ ] تحسين الصور (إعدادات Sanity image URL: `.auto("format").width(...)` )
- [ ] تحميل Studio كـ async chunk (لتقليل حجم بناء الصفحات الأخرى)

---

## مهام مُنجزة ✅

- [x] إصلاح تموضع صورة الدكتور في `/about` و PDF
- [x] دمج تعديل صفحة وقف القلم
- [x] إعداد Sanity Studio على `/studio/saif`
- [x] تعريف Schemas: post, category, tag, author
- [x] كتابة سكريبت الترحيل (idempotent, with --dry-run, --skip-images)
- [x] إعداد `.env.local` و`.gitignore`
- [x] تحديث `next.config.ts` لـ Sanity CDN
- [x] توثيق كل ما سبق في `/docs/`

آخر تحديث: 2026-04-12
