# سجل جلسة العمل — أبريل 2026

يوثّق هذا الملف ما أُنجز في جلسة العمل بين المستخدم والمساعد (Claude) على الفرع `claude/fix-doctor-image-layout-0LdFh`.

## المختصر التنفيذي

| المهمة | الحالة |
|---|---|
| إصلاح تموضع صورة الدكتور في `/about` و PDF | ✅ مُنجز ومدفوع |
| دمج تعديل صفحة وقف القلم من الفرع الآخر | ✅ مُنجز ومدفوع |
| إعداد Sanity Studio + Schemas + سكريبت ترحيل (Phase 1) | ✅ مُنجز ومدفوع |
| تشغيل سكريبت الترحيل فعلياً | ⏸️ بانتظار المستخدم (محلياً) |
| تحويل `lib/data.ts` لقراءة من Sanity (Phase 2) | ⏸️ بانتظار إنجاز الترحيل |
| تشخيص مشكلة 404 على المقالات في الإنتاج | ⏸️ قيد التحقيق |
| ربط دومين `divanmax.com` بـ Vercel | ⏸️ قيد الإعداد |

---

## ١) إصلاح تموضع صورة الدكتور

**المشكلة**: الصورة الدائرية في `/about` و PDF كانت تقطع جبهة الدكتور لأن `objectPosition: "center 25%"` يُحرّك الصورة بحيث يُقصّ الجزء العلوي (الشعر/الجبهة).

**الحل**: تغيير `objectPosition` إلى `"center top"` مع الاحتفاظ بـ `object-cover`. الصورة الأصلية طولية (515×914)، لذا بعد التغيير: يُحاذى أعلى الصورة مع أعلى الإطار، فيظهر الشعر والجبهة كاملين، ويُقتصّ أسفل الكتف.

**الملفات المُعدَّلة**:
- `app/about/page.tsx:58`
- `app/about/print/page.tsx:41`

**Commit**: `c18cd24 fix(about): align portrait to top so forehead and hair show fully`

---

## ٢) دمج تعديل صفحة وقف القلم

**السياق**: كانت صفحة `/waqf-alqalam` مُحدَّثة على فرع آخر (`claude/push-to-github-QAaRx`). طلب المستخدم دمج التغيير في نفس فرع العمل الحالي.

**الإجراء**: `git cherry-pick 81b0a9b` — نقل commit الوقف للفرع الحالي بدون تعارض (الملفات مختلفة).

**Commit الناتج**: `e3fb149 feat(waqf-alqalam): redesign to reflect the gravity of the project`

**ما تضمّنه التصميم الجديد**:
- Hero بتدرّج أخضر غامق مع فواصل زخرفية
- بطاقة الآية القرآنية "ن ۚ وَٱلْقَلَمِ وَمَا يَسْطُرُونَ" مع زوايا ذهبية
- ثلاثة أركان (وقفٌ لوجه الله / علمٌ يُنتفعُ به / إتاحةٌ مجانية)
- قسم "الوصية العلمية" بـ drop-cap ونُصّ ممتاز
- بطاقة حديث النبي ﷺ ("صدقة جارية...")
- CTA grid لكتب وبلوغ ومدرسة حضارية
- دعاء ختامي بخط مُزخرف

---

## ٣) إعداد Sanity CMS (Phase 1)

**القرار الاستراتيجي**: هجر WordPress لصالح Sanity كمصدر محتوى، لأن:
- الدكتور/المحرر سيستخدم واجهة احترافية بدلاً من تعديل JSON
- الفريق قد يكبر مستقبلاً
- Sanity Free tier كافٍ (3 محرّرين، 10k مستند)

**القرارات الفرعية**:
- ✅ Studio داخل الموقع على `/studio/saif`
- ✅ ترحيل الصور إلى Sanity CDN (استقلال كامل عن WP)
- ✅ الحفاظ على الـ slugs الحالية (URL-encoded Arabic) لحماية SEO

### ما أُنجز في Phase 1

#### حزم مُثبَّتة
- `sanity` (core + Studio)
- `next-sanity` (تكامل Next.js)
- `@sanity/vision` (أداة استعلام GROQ داخل Studio)
- `@sanity/image-url` (بناء روابط الصور)
- `tsx` + `dotenv` (devDependencies لتشغيل سكريبتات TypeScript)

#### Studio
- `sanity.config.ts` (جذر المشروع): إعدادات المشروع، Schemas، البنية الشجرية
- `app/studio/saif/[[...tool]]/page.tsx`: catch-all route يعرض `<NextStudio />`
- `app/studio/layout.tsx`: يُخفي header/footer الموقع داخل Studio

#### Schemas (نماذج البيانات)
| النموذج | الحقول الرئيسية |
|---|---|
| `post` | العنوان، slug، الملخّص، الصورة المميّزة، Portable Text body (مع حواشي وPull quotes)، التصنيفات، الوسوم، الكاتب، تاريخ النشر، sticky، مكان النشر الأصلي، SEO، rawHtml للمُرحَّل |
| `category` | الاسم، slug، التصنيف الأب (self-reference)، الوصف |
| `tag` | الاسم، slug |
| `author` | الاسم، slug، اللقب، الصورة، النبذة |

كل النماذج تحتوي على `legacyId` (مخفي) للحفاظ على العلاقة مع WordPress IDs أثناء الترحيل.

#### سكريبت الترحيل
`scripts/migrate-to-sanity.ts` — idempotent (آمن لإعادة التشغيل):
1. يُنشئ author document للدكتور
2. يُنشئ التصنيفات في passe واحدة، ثم يُحدّث الـ parent references
3. يُنشئ الوسوم
4. لكل مقال:
   - يحمّل الصورة المميّزة من WordPress ويرفعها لـ Sanity CDN
   - ينشئ post document مع `rawHtml` يحتفظ بـ content.rendered الأصلي بالحرف
   - يربط التصنيفات والوسوم والكاتب
5. يتخطّى أي مستند لديه `legacyId` موجود مسبقاً (resumable)

**أوضاع التشغيل**:
- `--dry-run`: يعمل بدون اتصال بـ Sanity، لفحص الـ parsing
- `--skip-images`: يتخطّى تحميل الصور لترحيل أسرع

#### بيئة التشغيل
- `.env.example`: قالب قابل للنشر (بدون أسرار)
- `.env.local`: يحتوي الـ API token — **مُستثنى من Git**
- `.gitignore`: حُدِّث ليحتفظ بـ `.env.example` متتبَّعاً

#### Next.js config
- أُضيف `cdn.sanity.io` إلى `remotePatterns` في `next.config.ts` لتعمل صور Sanity مع Next.js Image

**Commit**: `b2ec51b feat(sanity): add Studio at /studio/saif + WP→Sanity migration script`

### ما لم يُنجز بعد (Phase 2)
- [ ] تحويل `lib/data.ts` ليقرأ من Sanity بدل JSON
- [ ] حذف `public/data/*.json` بعد التأكّد
- [ ] webhook من Sanity إلى Vercel لإعادة البناء عند النشر
- [ ] تبديل الـ API token بواحد جديد آمن

---

## ٤) تشخيص مشكلة 404 على المقالات (قيد التحقيق)

**البلاغ**: المقالات على `dr-saif-site.vercel.app` تُرجع 404 عند الضغط. بينما `dr-saif-site-xi.vercel.app` يعمل.

**النتائج الأوّلية من المساعد**:
- ✅ البناء المحلي (`next build`) نجح وولّد 100 صفحة مقال ستاتيكية
- ✅ `lib/data.ts` لم يتغيّر منذ commit `06ebba3` (أيام قبل جلسة Sanity)
- ✅ Phase 1 commit `b2ec51b` لم يلمس routing المقالات
- ❓ الفرع الافتراضي على GitHub هو `claude/push-to-github-QAaRx` (وليس `main`) — قد يرتبط بالمشكلة
- ❓ `-xi` في `dr-saif-site-xi.vercel.app` يدلّ على مشروع Vercel منفصل أو deployment مختلف

**معلومات مطلوبة من المستخدم لاستكمال التشخيص**:
1. كم مشروع Vercel مربوط بالمستودع؟
2. الفرع الإنتاجي في إعدادات `dr-saif-site`؟
3. آخر deployment ناجح: حالته، فرعه، تاريخه
4. نتيجة اختبار مقال واحد على الموقعين بنفس slug
5. نتيجة اختبار Preview الخاص بفرعنا

---

## ٥) ربط دومين `divanmax.com` (قيد الإعداد)

**الوضع**:
- Vercel يُظهر `www.divanmax.com` → **Valid Configuration** ✅
- Vercel يُظهر `divanmax.com` (apex) → **Invalid Configuration** ❌
- السبب: GoDaddy يقفل سجلّين (`15.197.225.128` و`3.33.251.168`) بسبب Domain Forwarding أو Parking مُفعّل

**الحلول المقترحة مرتّبة من الأسهل**:
1. **استخدام `www.`**: اجعل `www.divanmax.com` هو الأساسي (يعمل الآن)، وترك apex مع 307 redirect
2. **إيقاف Forwarding في GoDaddy**: بعدها تصبح الـ records قابلة للحذف
3. **نقل DNS إلى Cloudflare**: للتحكّم الكامل (الأقوى لكن يتطلّب انتشار)

**تحذير مهم**: مشكلة الـ 404 ستظهر على الدومين الجديد أيضاً ما لم نُشخّص السبب الأصلي أولاً.

---

## الـ commits على هذا الفرع (مختصر)

```
b2ec51b feat(sanity): add Studio at /studio/saif + WP→Sanity migration script
e3fb149 feat(waqf-alqalam): redesign to reflect the gravity of the project
c18cd24 fix(about): align portrait to top so forehead and hair show fully
9c3f699 fix(about): move portrait focus down, drop إسماعيل from hero titles  ← النقطة المشتركة
```

---

## الخطوات التالية الموصى بها (بالترتيب)

1. **تشخيص 404** — إرسال لقطات شاشة من Vercel Dashboard لتحديد المصدر
2. **إصلاح 404** — بناءً على التشخيص
3. **ربط الدومين** — بعد التأكّد من أن الإنتاج سليم
4. **تشغيل ترحيل Sanity** — محلياً بـ `npm run migrate:sanity`
5. **التحقّق من Studio** — فتح `/studio/saif` والتأكّد من ظهور المحتوى
6. **Phase 2** — تحويل الموقع ليقرأ من Sanity
7. **حذف JSON** و**webhook Sanity→Vercel**

---

## مراجع مفيدة

- Next.js 16 docs داخل المشروع: `node_modules/next/dist/docs/`
- سكريبت الترحيل: `scripts/migrate-to-sanity.ts`
- دليل السكريبت: `scripts/README.md`
- Sanity project dashboard: `https://sanity.io/organizations/oTf5E0V6b/project/qgv6yxcl`

آخر تحديث: 2026-04-12
