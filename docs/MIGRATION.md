# دليل ترحيل المقالات من WordPress إلى Sanity

كيف تُرحِّل الـ 100 مقال من `public/data/*.json` إلى Sanity CMS دفعةً واحدة، **بدون أي إعداد محلي** — تشغيل كامل من GitHub.

## لمحة

- 100 مقال + التصنيفات + الوسوم + الصور البارزة ← Sanity
- يعمل عبر **GitHub Action** تُشغَّل يدوياً بضغطة زر.
- **Idempotent**: آمن إعادة التشغيل — يتخطَّى ما تم ترحيله (بالاعتماد على `legacyId`).
- الـ slugs الأصلية (URL-encoded Arabic) محفوظة لسلامة الـ SEO.

## الخطوات

### 1) أنشئ token كتابة في Sanity

1. افتح <https://sanity.io/manage>.
2. اختر المشروع ← **API** ← **Tokens** ← **Add API token**.
3. الاسم: `migration-one-shot`. الصلاحية: **Editor**.
4. انسخ الـ token فوراً (لن يُعرض مرة أخرى).

### 2) أضف الـ secrets إلى GitHub

اذهب إلى: **Settings → Secrets and variables → Actions → New repository secret**.

أضف المفتاحين التاليين:

| Secret name | القيمة |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | معرّف مشروع Sanity (تجده في sanity.io/manage) |
| `SANITY_WRITE_TOKEN` | الـ token الذي أنشأته في الخطوة السابقة |

(اختياري — فقط إذا أردت قيماً مختلفة عن الافتراضيّات): من تبويب **Variables** بنفس الصفحة:

| Variable name | الافتراضي |
|---|---|
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-04-12` |

### 3) شغِّل الـ Action

1. اذهب إلى تبويب **Actions** في الريبو.
2. اختر workflow **Migrate posts to Sanity** من القائمة اليسرى.
3. اضغط **Run workflow** (الزر الأزرق).
4. اختر الـ mode — ابدأ دائماً بـ **dry-run**:
   - **dry-run**: يقرأ الملفات ويطبع الخطة دون كتابة أي شيء. آمن 100%.
   - **skip-images**: ترحيل كامل بدون رفع الصور (سريع، الصور البارزة ستكون فارغة).
   - **full**: الترحيل الكامل مع الصور. يستغرق عدة دقائق.
5. اضغط **Run workflow** الأخضر.

### 4) راقب التقدّم

افتح الـ job من Actions، وشاهد الـ logs مباشرةً. يطبع السكريبت تقدُّمه كل 10 مقالات.

### 5) تحقَّق في Studio

بعد انتهاء الـ action بنجاح:

1. افتح `https://www.divanmax.com/studio/saif` (أو محلياً على dev server إن شغَّلت).
2. تفقَّد **المقالات** — يجب أن تجد الـ 100 مقال.
3. تفقَّد **التصنيفات** و**الوسوم** — العلاقات (parent) محفوظة.

### 6) ألغِ الـ token المؤقَّت

بعد نجاح الترحيل، احذف token `migration-one-shot` من Sanity → API → Tokens. لن يحتاجه الموقع — الموقع يقرأ فقط.

## أسئلة شائعة

**ما الذي يحدث لو تعطّل الـ action في المنتصف؟**
أعد تشغيله بنفس الـ mode. السكريبت يتخطَّى أي مستند موجود بالفعل (مقارنةً بواسطة `legacyId`). آمن تماماً.

**هل ستُستبدَل المقالات الموجودة في Sanity؟**
لا. أي مقال في Sanity بنفس `legacyId` (رقم مقال WordPress) سيُتخطَّى. لو أردتَ إعادة كتابته، احذفه يدوياً من Studio ثم أعد تشغيل الـ action.

**بعد الترحيل، هل سيقرأ الموقع تلقائياً من Sanity؟**
**لا** — هذه هي المرحلة الثانية. حالياً `lib/data.ts` يقرأ من `public/data/*.json`. بعد التأكُّد من نجاح الترحيل، سنُعدِّل `lib/data.ts` ليستعلم عن Sanity بـ GROQ، ثم نحذف ملفات JSON.

**هل الـ slugs العربية ستعمل؟**
نعم. السكريبت يحفظ الـ slug كما هو من WordPress (URL-encoded lowercase hex) — وهو ما يستخدمه الموقع حالياً. لا تغيير في الروابط.

**ماذا لو أردتُ ترحيل مقالات جديدة لاحقاً؟**
أضف المقالات الجديدة إلى `public/data/posts.json` ثم شغِّل الـ action مجدداً — سيُرحِّل الجديد فقط.
