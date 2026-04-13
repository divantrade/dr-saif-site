# خريطة طبقة البيانات — الحالة و المستقبل

> **ملاحظة:** هذه الوثيقة مرجع معماري للفريق. تصف الحالة الحالية لمصادر
> البيانات، و الخطة الذهبية لتوحيدها على Sanity بوصفه مصدراً وحيداً للحقيقة.

---

## الحالة الحالية — مصدران للبيانات (انتقالي)

| الطريق | المصدر حالياً | الملف |
|---|---|---|
| `/` (الصفحة الرئيسية) | `public/data/*.json` (WordPress) | `app/page.tsx` |
| `/blog` | WP JSON | `app/blog/page.tsx` |
| `/blog/[slug]` | WP JSON | `app/blog/[slug]/page.tsx` |
| `/category/[slug]` | WP JSON | `app/category/[slug]/page.tsx` |
| `/tag/[slug]` | WP JSON | `app/tag/[slug]/page.tsx` |
| `/search` | WP JSON | `app/search/page.tsx` |
| `/axis`, `/axis/[slug]` | **Sanity** (GROQ) | `lib/sanity-data.ts` |
| `/series`, `/series/[slug]` | **Sanity** | `lib/sanity-data.ts` |
| `/archive`, `/archive/year/[year]` | **Sanity** | `lib/sanity-data.ts` |
| `components/Header.tsx` (نافيجيشن) | **Sanity** | — |
| `components/Footer.tsx` | **Sanity** | — |
| `app/sitemap.ts` | هجين (كلاهما) | — |

**المشكلة:** كل صفحة بيانات معدودات و حسابات (counts) خاصة بها، و التصنيفات
الجديدة (axes/series) ليست مربوطة بالمقالات في الصفحات القديمة. نتيجة ذلك:
مقال في `/blog/[slug]` لا يعرض شارة محوره الفكري.

---

## الحل الذهبي — Sanity مصدراً وحيداً

### الهدف

- جميع الـ reads تمرّ عبر Sanity GROQ
- يُحذف `public/data/*.json` بالكامل (يُؤرشَف في فرع منفصل `archive/wp-export`)
- المُحرِّر يضيف/يعدِّل المقالات من Sanity Studio → الموقع يعكس التغيير فوراً
- GitHub Actions تُدير عمليات الترحيل (reproducible, versioned, auditable)
- Webhook من Sanity → `revalidateTag()` على Next.js = تحديث فوري

### الطبقات — التنفيذ التدريجي

#### Phase 2.A — توحيد دوال القراءة

استبدال كل دوال `loadPosts()` / `loadCategories()` / `loadTags()` في
`lib/data.ts` بدوال GROQ متكافئة. مع الحفاظ على **الـ signatures** كما هي
حتى لا تُعدَّل الصفحات القائمة.

مبدأ: الصفحة تستدعي `getPostBySlug("foo")` — لا يهمّها مصدر البيانات.

##### الدوال المطلوب ترحيلها

- [ ] `loadPosts()` → GROQ `*[_type == "post"] | order(publishedAt desc)`
- [ ] `getPostBySlug(slug)` → GROQ `*[_type == "post" && slug.current == $s][0]`
- [ ] `getPaginatedPosts(page, perPage)` — يوحَّد مع helper الحالي في `sanity-data.ts`
- [ ] `loadCategories()` → GROQ `*[_type == "category"]`
- [ ] `getCategoryBySlug(slug)` → GROQ
- [ ] `getPostsByCategoryId(id)` → يتحوّل إلى `getPostsByCategorySlug(slug)` (أنظف)
- [ ] `loadTags()`, `getTagBySlug`, `getPostsByTagId` → GROQ
- [ ] `searchPosts(q)` → GROQ `*[... && (title match $q || pt::text(body) match $q)]`
- [ ] `getRelatedPosts(post)` → GROQ بناءً على axis + tags overlap
- [ ] `loadMedia()`, `getMediaById()` — تُحذَف؛ الصور الآن في Sanity assets عبر `featuredImage`

##### تحديثات المُكوِّنات

- `PostCard.tsx`: استخدام `post.featuredImage` (Sanity) بدل `featured_media` + `getMediaById`
- `components/Header.tsx`: يستعمل بالفعل Sanity — لا تغيير
- `app/blog/[slug]/page.tsx`: حقن شارة المحور (axis badge) + رابط السلسلة

#### Phase 2.B — حذف ملفات WordPress JSON

بعد التحقق من أن كل الصفحات تعمل من Sanity:

```bash
git mv public/data archive-wp-export    # نسخة احتياطية في الريبو
git rm -r public/data                    # حذف من الحالي
```

تحديث `lib/data.ts` لحذف أي `readJSON<...>` وبقاء دوال مساعدة فقط
(مثل `readableSlug`, `formatDate`, `stripHtml`).

#### Phase 2.C — Webhook للتحديث الفوري

في Sanity Studio → Settings → API → Webhooks:

- URL: `https://saifabdelfattah.net/api/revalidate`
- Dataset: `production`
- Trigger on: `create`, `update`, `delete`
- Filter: `_type in ["post", "intellectualAxis", "series", "category"]`
- Secret: value in `SANITY_WEBHOOK_SECRET` env var

إنشاء `app/api/revalidate/route.ts` يستقبل الـ payload و يُشغّل
`revalidateTag("posts")` / `revalidateTag("axes")` حسب النوع المُعدَّل.
الـ ISR tags موجودة بالفعل في كل GROQ query ⇒ كل ما نحتاجه هو الـ route.

#### Phase 2.D — تكامل نشر جديد

GitHub Actions workflow إضافي `.github/workflows/verify-on-pr.yml`:
- يُشغَّل على أي PR
- يُشغّل `verify:sanity --json` ويفشل لو فيه مشاكل
- يمنع merge لأي تغيير يكسر سلامة البيانات

---

## workflows الحالية (Phase 1 — منجز)

| Workflow | الدور | الـ trigger |
|---|---|---|
| `fetch-from-wordpress.yml` | استخراج archive WP إلى JSON | يدوي |
| `migrate-to-sanity.yml` | ترحيل المقالات إلى Sanity | يدوي |
| `apply-axes.yml` | تطبيق المحاور و السلاسل + patch المقالات | يدوي |
| `verify-sanity.yml` | فحص سلامة dataset | يومياً + يدوي |

## workflows مقترحة (Phase 2)

| Workflow | الدور | الـ trigger |
|---|---|---|
| `verify-on-pr.yml` | فحص سلامة قبل merge | PR |

---

## سيناريوهات التحديث اليومية

### 1. المقال الجديد يُنشر من Sanity Studio

- المحرِّر يكتب المقال، يختار المحور، يُعيِّن السلسلة (إن لزم)
- يضغط Publish
- Sanity webhook → `/api/revalidate` → `revalidateTag("posts")`
- الموقع يعكس المقال خلال ثوانٍ

### 2. مراجعة تصنيف عدّة مقالات

- يُعاد تشغيل `classify_articles.py` (نتيجة جديدة)
- Commit للـ `reclassification-map.json`
- في GitHub: Actions → "Apply axes" → Run workflow (full أو posts-only)
- الـ Webhook يُحدّث cache الـ Next

### 3. إضافة محور أو سلسلة جديدة

- خياران:
  - **يدوياً من Studio** → يظهر فوراً على الموقع (بفضل الـ webhook)
  - **من الكود** → تحديث `AXES`/`SERIES` في `apply-axes-to-sanity.ts` +
    GitHub workflow

### 4. كشف مشكلة في البيانات

- تشغيل `verify:sanity` يومياً يكشف:
  - مقالات بلا محور
  - سلاسل بلا حلقات
  - مراجع معطوبة
- التقرير يُرسَل للمُحرِّر بتفاصيل الحلّ
