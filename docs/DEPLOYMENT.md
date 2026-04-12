# النشر والدومين

## منصّة النشر: Vercel

المشروع يُنشر على Vercel. الفرع الافتراضي على GitHub حالياً هو `claude/push-to-github-QAaRx`.

### مستودع GitHub
`divantrade/dr-saif-site`

### عناوين Vercel المعروفة

| العنوان | الوصف | الحالة |
|---|---|---|
| `dr-saif-site.vercel.app` | العنوان الرئيسي للمشروع | ⚠️ مقالات تُرجع 404 (قيد التحقيق) |
| `dr-saif-site-xi.vercel.app` | deployment/مشروع بديل | ✅ يعمل |
| `dr-saif-site-git-<branch>-<team>.vercel.app` | preview URLs للفروع | حسب الفرع |

## ربط الدومين `divanmax.com`

### الوضع الحالي

| المجال الفرعي | الحالة في Vercel |
|---|---|
| `www.divanmax.com` | ✅ **Valid Configuration** — يعمل |
| `divanmax.com` (apex) | ❌ **Invalid Configuration** — سجلّات GoDaddy محجوزة |

### المشكلة

GoDaddy يحتفظ بسجلّين مقفلين لا يمكن حذفهما من الواجهة:
- `@` → `15.197.225.128`
- `@` → `3.33.251.168`

السبب عادةً: **Domain Forwarding** أو **Parking** مُفعّل في إعدادات الدومين.

### الحلول (مرتّبة من الأسهل)

#### ١) استخدام `www.` فقط (الأسرع والأسهل)
- استخدم `www.divanmax.com` كعنوان أساسي
- Vercel يُدير 307 redirect من apex إلى `www.` تلقائياً
- صالح وجاهز الآن

#### ٢) إيقاف Domain Forwarding في GoDaddy
1. GoDaddy → My Products → `divanmax.com`
2. ابحث عن قسم **Forwarding** أو **Domain Forwarding**
3. اضغط **Disable** أو **Remove**
4. ارجع لصفحة DNS — السجلّات المقفلة ستصبح قابلة للحذف
5. احذف الاثنين (`15.197.225.128` و`3.33.251.168`)
6. أبقِ فقط: `@` → `216.198.79.1` (هذا ما يطلبه Vercel)
7. انتظر 5–30 دقيقة للانتشار

#### ٣) نقل DNS إلى Cloudflare (الأقوى)
1. افتح حساب Cloudflare مجاني
2. أضِف `divanmax.com` — سيُعطيك 2 nameservers
3. GoDaddy → `divanmax.com` → Nameservers → غيّرها لـ Cloudflare
4. Cloudflare يتولّى DNS — تضبط records Vercel بدون قيود
5. يأخذ 1–24 ساعة للانتشار الكامل

## مشكلة 404 على المقالات (قيد التحقيق)

**الأعراض**: الصفحة الرئيسية تعمل، لكن الضغط على أي مقال يُرجع 404.

**ما تأكّدنا منه**:
- ✅ البناء المحلي ناجح (100 صفحة ستاتيكية مُولَّدة)
- ✅ `lib/data.ts` لم يتغيّر حديثاً
- ✅ commit Sanity لم يلمس routing
- ❌ المشكلة موجودة على الإنتاج `dr-saif-site.vercel.app`

**نظريات السبب**:
1. Vercel يبني من فرع قديم أو خاطئ
2. deployment قديم عالق بـ 404s
3. مشكلة في Next.js 16 مع URL-encoded Arabic slugs على Vercel's edge
4. مشكلة في التكوين (vercel.json ناقص؟)

**معلومات مطلوبة للتشخيص**:
1. عدد مشاريع Vercel المربوطة بالـ repo
2. Production branch للمشروع الرئيسي
3. حالة آخر deployment (Ready / Error)
4. اختبار نفس slug على deploymentين مختلفين

## ما بعد ربط الدومين

عند نجاح ربط الدومين، احرص على:

### ١) تحديث Sanity CORS
- Sanity → API → CORS origins
- أضف: `https://divanmax.com` و`https://www.divanmax.com` مع Allow credentials

### ٢) تحديث `lib/site.ts`
في `lib/site.ts`، غيّر `SITE.url` إلى الدومين الجديد — يؤثّر على:
- الـ canonical URLs
- sitemap.xml
- robots.txt
- RSS feed
- Open Graph metadata

### ٣) إعداد Redirects من الدومين القديم
إذا استبدلت `dr-saif-site.vercel.app`، Vercel يمكن أن يُحافظ على الـ URLs القديمة بـ redirects تلقائية.

### ٤) تحديث روابط خارجية
- حسابات سوشيال ميديا
- بطاقات العمل
- أي موقع آخر يُشير للموقع

## دليل سريع: متغيّرات البيئة للإنتاج

على Vercel → Settings → Environment Variables، أضف:

| المتغيّر | القيمة | البيئة |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `qgv6yxcl` | Production, Preview, Development |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Production, Preview, Development |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-04-12` | Production, Preview, Development |
| `SANITY_WEBHOOK_SECRET` | (توليد عشوائي) | Production فقط |

**ملاحظة**: `SANITY_WRITE_TOKEN` **لا يحتاج** أن يكون على Vercel لأن الموقع يقرأ فقط. استخدمه محلياً للترحيل.

آخر تحديث: 2026-04-12
