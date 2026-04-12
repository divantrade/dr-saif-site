# توثيق المشروع — موقع أ.د. سيف الدين عبد الفتاح

هذا المجلد يوثّق حالة المشروع والعمل المُنجز عليه، لتسهيل المتابعة مستقبلاً.

## الفهرس

- [`SESSION-LOG.md`](./SESSION-LOG.md) — سجل آخر جلسة عمل (أبريل 2026): إصلاح صورة الدكتور، إضافة Sanity، تشخيص مشكلة 404
- [`SANITY.md`](./SANITY.md) — دليل Sanity CMS: البنية، الترحيل من WordPress، خطوات التشغيل
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — ملاحظات النشر على Vercel، ربط الدومين، المشاكل المعروفة
- [`TODO.md`](./TODO.md) — قائمة المهام المتبقّية بترتيب الأولوية

## نظرة سريعة على المشروع

| العنصر | التفاصيل |
|---|---|
| **الإطار** | Next.js 16.2.3 (App Router, React 19, TypeScript) |
| **التنسيق** | Tailwind CSS v4 + @tailwindcss/typography |
| **مصدر المحتوى الحالي** | ملفات JSON في `public/data/` (مُرحَّلة من WordPress) |
| **مصدر المحتوى المُستقبلي** | Sanity CMS (قيد الهجرة — Phase 1 مُنجز) |
| **النشر** | Vercel مربوط بـ GitHub — نشر تلقائي عند كل push |
| **الموقع الحيّ (مؤقت)** | **https://www.divanmax.com** — دومين ملك المطوّر |
| **المستودع** | `divantrade/dr-saif-site` |

> **ملاحظة حول الدومين**: `www.divanmax.com` دومين مؤقت يملكه المطوّر يُستخدم للتطوير والاختبار. بعد التأكّد من اكتمال المشروع ستجري هجرة إلى دومين الدكتور الرسمي.

## الأوامر الأكثر استخداماً

```bash
# تطوير محلي
npm run dev                       # تشغيل الموقع على http://localhost:3000

# البناء والفحص
npm run build                     # بناء للإنتاج
npx tsc --noEmit                  # فحص أنواع TypeScript
npm run lint                      # فحص ESLint

# ترحيل Sanity (يتطلّب .env.local مع SANITY_WRITE_TOKEN)
npm run migrate:sanity:dry        # فحص بدون كتابة
npm run migrate:sanity            # ترحيل فعلي
```

## المسارات المهمّة

- `/` — الصفحة الرئيسية
- `/blog` — قائمة المقالات
- `/blog/[slug]` — صفحة مقال (100 مقال ستاتيكي)
- `/about` — السيرة الذاتية
- `/about/print` — نسخة PDF قابلة للطباعة
- `/waqf-alqalam` — صفحة وقف القلم
- `/studio/saif` — لوحة تحرير Sanity (جديد)

---

آخر تحديث: 2026-04-12
