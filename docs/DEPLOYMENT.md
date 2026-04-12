# النشر والدومين

## الوضع الحالي — الموقع يعمل ✅

| العنصر | التفاصيل |
|---|---|
| **الموقع الحيّ** | **[https://www.divanmax.com](https://www.divanmax.com)** |
| **نوع الدومين** | مؤقّت — ملك المطوّر |
| **الاستضافة** | Vercel (مربوط بـ GitHub بـ CI/CD تلقائي) |
| **المستودع** | `divantrade/dr-saif-site` |
| **الحالة** | كل الوظائف تعمل (المقالات، التصنيفات، البحث، إلخ) |

## آلية النشر

Vercel مربوط بـ GitHub مباشرة:

1. المطوّر يُجري `git push` إلى الفرع الإنتاجي
2. Vercel يكتشف التغيير تلقائياً ويبني
3. بعد البناء الناجح، الـ deployment الجديد يصبح الحيّ على `www.divanmax.com`
4. الفروع الأخرى تحصل على **preview URLs** تلقائياً للمراجعة قبل الدمج

## الخطة المستقبلية للدومين

الدومين الحالي `www.divanmax.com` **مؤقّت** ويخصّ المطوّر. بعد:
- اكتمال ترحيل Sanity (Phase 2)
- مراجعة كل الصفحات والوظائف
- موافقة الدكتور النهائية

ستجري **هجرة إلى دومين الدكتور الرسمي**. خطوات الهجرة المتوقَّعة:

### ١) إضافة الدومين الجديد في Vercel
- Vercel → Project → Settings → Domains → Add Domain
- اكتب دومين الدكتور (مثلاً `saifabdelfattah.com`)
- Vercel يعطي DNS records محدّدة لإضافتها لدى مسجّل الدومين
- SSL يُفعَّل تلقائياً عبر Let's Encrypt

### ٢) تحديث الكود
```typescript
// lib/site.ts
export const SITE = {
  url: "https://saifabdelfattah.com", // بدلاً من divanmax.com
  // ...
};
```

يؤثّر على:
- Canonical URLs
- `sitemap.xml`
- `robots.txt`
- RSS feed
- Open Graph metadata

### ٣) تحديث Sanity CORS
- Sanity → API → CORS origins
- أضف الدومين الجديد مع Allow credentials
- يمكن إبقاء `www.divanmax.com` لفترة انتقالية

### ٤) تعيين Primary Domain
- Vercel → Domains → اضغط على الدومين الجديد → اجعله **Primary**
- Vercel سيعيد توجيه `www.divanmax.com` → الدومين الجديد تلقائياً

### ٥) تحديث الروابط الخارجية
- حسابات سوشيال ميديا للدكتور
- أي موقع يُشير للمقالات
- الـ QR codes أو بطاقات العمل

### ٦) (بعد 30 يوماً من الاستقرار) — إزالة الدومين المؤقت
- Vercel → Domains → احذف `www.divanmax.com` و`divanmax.com`
- يمكن إعادة استخدامه لمشروع آخر للمطوّر

## ملاحظات تاريخية (للأرشيف)

### عملية ربط `divanmax.com` الأولى
كان هناك تحدٍّ أوّلي مع GoDaddy يمنع حذف سجلّين:
- `@` → `15.197.225.128`
- `@` → `3.33.251.168`

السبب: **Domain Forwarding** مُفعّل في إعدادات GoDaddy. بعد إيقافه أو تجاوزه باستخدام `www.` كنقطة دخول أساسية، عمل كل شيء.

### `dr-saif-site.vercel.app` القديم
كان هذا رابط Vercel الافتراضي (قبل ربط `divanmax.com`). أظهر سابقاً 404 للمقالات بسبب deployment قديم. تمّ تجاوزه بإعادة نشر وربط الدومين.

## دليل سريع: متغيّرات البيئة للإنتاج

على Vercel → Settings → Environment Variables، أضف:

| المتغيّر | القيمة | البيئة |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | (من لوحة Sanity) | Production, Preview, Development |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Production, Preview, Development |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-04-12` | Production, Preview, Development |
| `SANITY_WEBHOOK_SECRET` | (توليد عشوائي) | Production فقط |

**ملاحظة**: `SANITY_WRITE_TOKEN` **لا يحتاج** أن يكون على Vercel لأن الموقع يقرأ فقط. استخدمه محلياً للترحيل.

آخر تحديث: 2026-04-12
