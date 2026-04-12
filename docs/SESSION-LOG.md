# سجل جلسة العمل — أبريل 2026

يوثّق هذا الملف ما أُنجز في جلسة العمل بين المستخدم والمساعد (Claude) على الفرع `claude/fix-doctor-image-layout-0LdFh`.

## المختصر التنفيذي

| المهمة | الحالة |
|---|---|
| إصلاح تموضع صورة الدكتور في `/about` و PDF | ✅ مُنجز ومدفوع |
| دمج تعديل صفحة وقف القلم من الفرع الآخر | ✅ مُنجز ومدفوع |
| إعداد Sanity Studio + Schemas + سكريبت ترحيل (Phase 1) | ✅ مُنجز ومدفوع |
| الموقع يعمل على Vercel ومربوط بـ GitHub | ✅ نشر تلقائي شغّال |
| ربط دومين `www.divanmax.com` مؤقتاً | ✅ الموقع يعمل على الدومين |
| تشغيل سكريبت الترحيل فعلياً | ⏸️ بانتظار المستخدم (محلياً) |
| تحويل `lib/data.ts` لقراءة من Sanity (Phase 2) | ⏸️ بانتظار إنجاز الترحيل |
| هجرة الدومين النهائية إلى دومين الدكتور | 🕓 بعد التأكّد من اكتمال المشروع |

## الدومين الحالي

**الموقع الحيّ**: [https://www.divanmax.com](https://www.divanmax.com)

- مُستضاف على Vercel، مربوط بـ GitHub repo `divantrade/dr-saif-site`.
- نشر تلقائي: كل push على الفرع الإنتاجي ⇒ Vercel يبني ويُنشر.
- الدومين **ملك المطوّر (المستخدم)** ويُستخدم مؤقتاً للتطوير والمراجعة.
- **الخطة النهائية**: بعد التأكّد أن كل الوظائف تعمل (المقالات، البحث، Sanity، إلخ)، سنُبدّل الدومين إلى دومين الدكتور الرسمي.

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

## ٤) ربط الدومين والنشر (مُنجز ✅)

**النتيجة النهائية**: المطوّر ربط الدومين `www.divanmax.com` بنجاح بمشروع Vercel.

- Vercel يُظهر `www.divanmax.com` → **Valid Configuration** ✅
- الموقع يعمل الآن بالكامل على [https://www.divanmax.com](https://www.divanmax.com)
- apex (`divanmax.com`) تُرك مع 307 redirect إلى `www.` (سلوك قياسي)
- المقالات كلها تعمل على الدومين الجديد (لم تعد هناك مشكلة 404)

**الخطة للدومين**: مؤقتاً `www.divanmax.com` (ملك المطوّر). بعد اكتمال مراجعة المشروع، ستجري هجرة إلى دومين الدكتور الرسمي.

### ملاحظات مهمّة للهجرة القادمة
- `lib/site.ts` يحتاج تحديث `SITE.url` إلى الدومين النهائي
- Sanity CORS origins يحتاج إضافة الدومين النهائي
- Vercel → Settings → Domains: إضافة الدومين الجديد وتعيينه Primary
- يُستحسَن الإبقاء على `www.divanmax.com` كـ redirect لفترة انتقالية

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
- Sanity project dashboard: `https://sanity.io/manage` (اختر المشروع من القائمة)

آخر تحديث: 2026-04-12
