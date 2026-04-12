# موقع د. سيف الدين عبد الفتاح

> الموقع الرسمي للأستاذ الدكتور سيف الدين عبد الفتاح — كتابات ومقالات في الفكر الحضاري الإسلامي والعلوم السياسية.

نسخة حديثة من الموقع الأصلي [saifabdelfattah.net](https://www.saifabdelfattah.net) — مبنية على **Next.js 16** مع بيانات محولة من WordPress إلى JSON ستاتيكي.

🌐 **الموقع المنشور:** [dr-saif-site.vercel.app](https://dr-saif-site.vercel.app)

---

## 🧱 التقنيات

| الطبقة | المستخدم |
|--------|----------|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Runtime** | React 19 |
| **Styling** | Tailwind CSS 4 + `@tailwindcss/typography` |
| **Language** | TypeScript 5 |
| **Data** | JSON ستاتيكي مصدَّر من WordPress (posts, pages, categories, tags, media) |
| **Hosting** | Vercel |
| **Linting** | ESLint 9 + `eslint-config-next` |

---

## 🗂️ هيكل المشروع

```
dr-saif-site/
├── app/
│   ├── layout.tsx              # الجذر — Header/Footer + metadata + OG
│   ├── page.tsx                # الرئيسية — Hero + آخر المقالات + أقسام التصنيفات
│   ├── sitemap.ts              # sitemap.xml ديناميكي
│   ├── robots.ts               # robots.txt
│   ├── feed.xml/route.ts       # RSS 2.0
│   ├── blog/
│   │   ├── page.tsx            # قائمة كل المقالات + pagination
│   │   └── [slug]/page.tsx     # مقال واحد + مقالات ذات صلة
│   ├── category/[slug]/        # صفحات التصنيفات الديناميكية
│   ├── tag/[slug]/             # صفحات الوسوم الديناميكية
│   ├── search/page.tsx         # البحث العربي الذكي
│   ├── books/page.tsx          # الكتب (تصنيف 41)
│   ├── podcast/page.tsx        # البودكاست (تصنيف 245)
│   ├── videos/page.tsx         # قوائم تشغيل يوتيوب (11 قائمة)
│   ├── about/
│   │   ├── page.tsx            # السيرة الذاتية (Timeline + Infographic)
│   │   └── print/page.tsx      # نسخة PDF احترافية A4
│   ├── waqf-alqalam/page.tsx   # وقف القلم (تصميم مَهيب)
│   ├── civilizational-school/  # المدرسة الحضارية
│   └── contact/page.tsx        # تواصل معنا
│
├── components/
│   ├── Header.tsx              # القائمة العلوية + Mega Menu + بحث + سوشيال
│   ├── Footer.tsx              # التذييل مع التصنيفات + سوشيال
│   ├── MegaMenu.tsx            # قائمة المقالات متعددة المستويات (ديناميكية)
│   ├── MobileNav.tsx           # قائمة الجوّال accordion
│   ├── SearchForm.tsx          # نموذج البحث
│   ├── SocialLinks.tsx         # روابط YouTube/Twitter/Facebook
│   ├── PostCard.tsx            # بطاقة المقال المشتركة
│   ├── Timeline.tsx            # التايم لاين البصري للسيرة
│   └── PrintButton.tsx         # زر طباعة PDF
│
├── lib/
│   ├── data.ts                 # دوال قراءة البيانات (posts, categories, tags, media)
│   ├── types.ts                # الأنواع المشتركة + utilities النقية
│   ├── site.ts                 # إعدادات الموقع (الاسم، الوصف، URL)
│   ├── cv.ts                   # بيانات السيرة الذاتية المنظّمة
│   ├── sanitize.ts             # تنظيف HTML من Elementor
│   └── videos.ts               # استخراج قوائم يوتيوب من بيانات WP
│
└── public/
    └── data/                   # بيانات WordPress المصدَّرة
        ├── posts.json          # 100 مقال
        ├── pages.json          # 14 صفحة
        ├── categories.json     # 36 تصنيف هرمي
        ├── tags.json           # 100 وسم
        └── media.json          # الوسائط
```

---

## 🚀 التشغيل المحلي

```bash
# تثبيت المكتبات
npm install

# تشغيل dev server
npm run dev                     # http://localhost:3000

# البناء للإنتاج
npm run build                   # يُنتج ~249 صفحة ستاتيكية

# تشغيل نسخة الإنتاج
npm start

# فحص الكود
npm run lint
```

**متطلبات:** Node.js 18.18+ (موصى به 20+)

---

## ✨ المزايا

### 🧭 التصفّح
- **Mega Menu ديناميكي** للمقالات يعرض 6 أقسام رئيسية مع تصنيفات فرعية
- القائمة الفرعية **تظهر فقط عند الوقوف على قسم له أطفال**
- **قائمة موبايل accordion** بنفس الهيكل الهرمي
- **أيقونة بحث** في الهيدر + **بحث في الهيرو** على الصفحة الرئيسية
- **روابط السوشيال** (يوتيوب، تويتر، فيسبوك)

### 📰 المحتوى
- عرض كل مقالات WordPress بتصفّح صفحات (12 لكل صفحة)
- **صفحات التصنيف الديناميكية** (36 تصنيف + تصنيفات فرعية)
- **صفحات الوسوم الديناميكية**
- **المقالات ذات الصلة** في صفحة كل مقال (بناءً على التصنيفات والوسوم المشتركة)

### 🔍 البحث
- **بحث عربي ذكي** — يُطبّع: التشكيل، الكشيدة، الهمزات (ا/أ/إ/آ)، التاء المربوطة (ة/ه)، الألف المقصورة (ى/ي)
- ترتيب نتائج بنظام نقاط: العنوان ×10، المقتطف ×3، الكلمات الفردية ×2/×1

### 👤 السيرة الذاتية (`/about`)
- **Hero** بصورة + 5 بطاقات إحصائيات (سنة الميلاد، سنوات التدريس، الدرجات، الرسائل، أستاذ منذ)
- **Timeline بصري** بخط عمودي + علامات ملوّنة (ميلاد/تعليم/وظيفة/سفر)
- بيانات منظّمة type-safe في `lib/cv.ts` (درجات، وظائف، سفر، تدريس، عضويات، إشراف، كتب)
- **نسخة PDF احترافية A4** (`/about/print`) بزر تحميل مدمج

### 📜 وقف القلم (`/waqf-alqalam`)
- تصميم يليق بجلال المشروع
- Hero بنقوش هندسية + فواصل ذهبية
- **آية قرآنية مُؤطّرة بذهب** (ن والقلم وما يسطرون)
- ثلاثة أركان (وقف/علم/إتاحة)
- **Drop Cap** في بداية الوصية العلمية
- **حديث نبوي** pull quote على خلفية داكنة
- دعاء ختامي بخط Amiri الكلاسيكي

### 🎥 فيديوهاتنا (`/videos`)
- **11 قائمة تشغيل يوتيوب** (132 فيديو) مستخرجة من بيانات Yottie في WP
- صور مصغّرة مباشرة من `i.ytimg.com`
- روابط خارجية للـ youtube.com

### 📡 SEO والتوزيع
- `sitemap.xml` ديناميكي يشمل: static routes + 100 مقال + 30+ تصنيف + الوسوم
- `robots.txt` مع إشارة للـ sitemap
- **Open Graph + Twitter Cards** في metadata الجذر
- **RSS 2.0** عند `/feed.xml` (آخر 30 مقال)
- `metadataBase` + `alternates` (canonical + RSS)

### 📱 التصميم
- **RTL عربي** كامل
- **Responsive** للجوّال والتابلت والسطح
- **Dark green / emerald** كلون أساسي
- بطاقات بتأثيرات hover أنيقة
- `prose` من Tailwind Typography لمحتوى المقالات

---

## 🏗️ مراحل التطوير

تم تطوير المشروع على **أربع مراحل** رئيسية:

### 🥇 المرحلة الأولى — هيكل التصفّح (`5b229f9`)
- بناء نظام شجرة التصنيفات الهرمية من `categories.json`
- Mega Menu للمقالات (6 أقسام رئيسية + تصنيفات فرعية)
- صفحات `/category/[slug]` الديناميكية مع pagination و breadcrumb
- Footer احترافي مع روابط التصنيفات والسوشيال
- فصل `lib/types.ts` عن `lib/data.ts` لحل مشاكل Client Components
- **نتيجة البناء:** 141 صفحة ستاتيكية

### 🥈 المرحلة الثانية — الصفحات المستقلة (`01b29b2`)
- `/about` — السيرة الذاتية (21,000 حرف من الـ WP)
- `/waqf-alqalam` — مشروع وقف القلم
- `/videos` — 11 قائمة يوتيوب (parsed from YRC.Data JSON)
- `/podcast` — البودكاست (تصنيف 245)
- `/civilizational-school` — المدرسة الحضارية
- `/contact` — تواصل معنا
- `lib/sanitize.ts` — تنظيف HTML من Elementor
- `lib/videos.ts` — parsing لبيانات يوتيوب
- إصلاح `getPageBySlug` للعمل مع uppercase/lowercase hex في URL encoding
- **نتيجة البناء:** 147 صفحة ستاتيكية

### 🥉 المرحلة الثالثة — البحث والـ SEO (`d3218dc`)
- `/search?q=…` — بحث عربي ذكي مع تطبيع النص
- `/tag/[slug]` — صفحات الوسوم الديناميكية
- `/books` — صفحة الكتب (تصنيف 41)
- مقالات ذات صلة في `/blog/[slug]`
- إعادة تصميم الصفحة الرئيسية (Hero بالصورة + أقسام حسب التصنيف + CTA)
- `sitemap.xml`, `robots.txt`, `feed.xml`
- Open Graph + Twitter Cards
- إصلاح `getPostBySlug` case-insensitivity
- **نتيجة البناء:** 248 صفحة ستاتيكية

### 🎨 مراحل التحسين المتتالية

| Commit | التحسين |
|--------|---------|
| `2642cb5` | إعادة تصميم السيرة الذاتية كـ Timeline + نسخة PDF للطباعة |
| `66c0db3` | ضبط تموضع الصورة الشخصية في الدائرة |
| `06ebba3` | إعادة تصميم MegaMenu بعمودين واضحين + عدد المقالات |
| `5e9e36c` | ضبط الصورة + تحديث الاسم في الترويسة |
| `70dd5e6` | جعل القائمة الفرعية ديناميكية (تظهر عند الحاجة فقط) |
| `9c3f699` | حذف "إسماعيل" من ترويسة السيرة + تحسين تموضع الوجه |
| `81b0a9b` | إعادة تصميم وقف القلم بشكل مَهيب |

---

## 📊 الإحصائيات

- **249 صفحة** ستاتيكية تُولَّد في البناء
- **0 أخطاء** ESLint و TypeScript
- **~3 ثوانٍ** لبناء Turbopack
- **100 مقال** + 14 صفحة + 36 تصنيف + 100 وسم + 11 قائمة يوتيوب
- **13 commit** رئيسي عبر 4 مراحل

---

## 📝 ملاحظات عن البيانات

- البيانات مصدَّرة من WordPress إلى JSON ستاتيكي في `public/data/`
- **100 مقال فقط** من أصل +1000 في الموقع الأصلي (عيّنة للتطوير)
- المقالات تحتوي HTML من Elementor — تُنظَّف بواسطة `lib/sanitize.ts` قبل العرض
- الـ slugs مخزّنة URL-encoded بـ hex صغير (مثل `%d9%85`) بينما JS يُنتج hex كبير (`%D9%85`) — معالَج في `getPostBySlug` / `getPageBySlug` / `getCategoryBySlug` / `getTagBySlug` بمقارنة case-insensitive
- بعض تصنيفات WP فارغة (count=0) — تُستبعد تلقائياً من القائمة في `getArticlesTree`

---

## 🔧 نقاط مهمة للمطوّرين

### Next.js 16 specifics
- `params` و `searchParams` هما **Promises** الآن — يجب `await params`
- `PageProps<'/route'>` helper متاح عالمياً
- Turbopack في الإنتاج بشكل افتراضي
- الـ build يولّد ملفات في `.next/` (مُهمَل من git عبر `.gitignore`)

### Server/Client boundaries
- `lib/data.ts` فيه `import "server-only"` — يستخدم `fs/promises`
- `lib/types.ts` للأنواع والأدوات النقية — آمن للـ Client Components
- الـ MegaMenu و MobileNav و SearchForm و PrintButton عبارة عن Client Components (بسبب state/interactivity)

### Deployment on Vercel
- Production Branch: `claude/push-to-github-QAaRx` (يمكن تغييره إلى `main`)
- خطة Hobby لا تُفعّل Deployment Protection افتراضياً، فالروابط عامة
- `next.config.ts` يسمح بصور من `www.saifabdelfattah.net` و `i.ytimg.com`

---

## 🤝 المساهمة

هذا مشروع شخصي — للتطوير:

```bash
git checkout -b feature/my-feature
# ... عدّل
npm run lint && npm run build   # تأكد أن لا أخطاء
git commit -m "feat: ..."
git push origin feature/my-feature
```

---

## 📜 الرخصة

المحتوى (المقالات، الكتب، السيرة الذاتية) محفوظ الحقوق لأ.د. سيف الدين عبد الفتاح — انظر **مشروع وقف القلم** للتفاصيل.

الكود متاح للمرجعية التعليمية.
