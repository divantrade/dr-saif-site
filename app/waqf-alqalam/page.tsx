import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug, stripHtml } from "@/lib/data";
import { cleanWpHtml } from "@/lib/sanitize";

export const metadata: Metadata = {
  title: "وقف القلم — الأعمال الكاملة",
  description:
    "مشروع وقف القلم: الأعمال الكاملة للأستاذ الدكتور سيف الدين عبد الفتاح — علمٌ ينتفع به، وقفٌ لوجه الله تعالى، متاحٌ مجاناً للقارئ والباحث.",
};

export default async function WaqfAlQalamPage() {
  const page = await getPageBySlug(
    encodeURIComponent("وقف-القلم-ـ-الأعمال-الكاملة")
  );
  if (!page) notFound();

  const html = cleanWpHtml(page.content.rendered);
  const title = stripHtml(page.title.rendered);

  return (
    <div>
      {/* ───────── Breadcrumb ───────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-emerald-700 transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-gray-700">وقف القلم</span>
        </nav>
      </div>

      {/* ───────── Majestic Hero ───────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900" />

        {/* Subtle Arabic geometric pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fff' stroke-width='1'%3E%3Cpath d='M40 0l40 40-40 40L0 40z'/%3E%3Cpath d='M40 20l20 20-20 20-20-20z'/%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Soft blurred glows */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          {/* Ornamental top divider */}
          <div className="flex items-center justify-center gap-4 text-amber-300/80 mb-6">
            <span className="h-px w-12 md:w-24 bg-gradient-to-l from-amber-300/60 to-transparent" />
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z" />
            </svg>
            <span className="h-px w-12 md:w-24 bg-gradient-to-r from-amber-300/60 to-transparent" />
          </div>

          <p className="text-amber-200/90 font-medium tracking-[0.2em] text-xs md:text-sm mb-4 uppercase">
            مشروع علمي موقوف لوجه الله تعالى
          </p>

          <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-3">
            {title}
          </h1>

          <p className="text-emerald-100 text-lg md:text-xl font-medium mb-6">
            للأستاذ الدكتور سيف الدين عبد الفتاح
          </p>

          <p className="text-emerald-50/90 text-base md:text-lg leading-loose max-w-3xl mx-auto">
            مجموعُ أعمالِ وأفكار الدكتور سيف الدين عبد الفتاح، موقوفٌ لوجه الله
            تعالى، متاحٌ مجاناً للقارئ والباحث،
            <br className="hidden sm:block" />
            رغبةً في نشر العلم وعدم كتمانه.
          </p>

          {/* Ornamental bottom divider */}
          <div className="flex items-center justify-center gap-4 text-amber-300/60 mt-8">
            <span className="h-px w-16 md:w-32 bg-gradient-to-l from-amber-300/50 to-transparent" />
            <span className="text-xl">❈</span>
            <span className="h-px w-16 md:w-32 bg-gradient-to-r from-amber-300/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* ───────── Quranic Verse Feature ───────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-14 relative z-10 mb-16">
        <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 p-8 md:p-14 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-1.5 rounded-full text-xs font-medium mb-6">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z" />
            </svg>
            إلهامُ المشروع
          </div>

          {/* Decorative frame around verse */}
          <div className="relative inline-block px-8 py-4">
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-400/60 rounded-tr-2xl" />
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-400/60 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-400/60 rounded-br-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-400/60 rounded-bl-2xl" />

            <p
              className="text-emerald-900 text-2xl md:text-4xl font-bold leading-loose"
              style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
            >
              ن ۚ وَٱلْقَلَمِ وَمَا يَسْطُرُونَ
            </p>
          </div>
          <p className="text-gray-400 text-sm mt-4 tracking-wide">
            — سورة القلم، الآية ١
          </p>
        </div>
      </section>

      {/* ───────── Three Pillars ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            ثلاثةُ أركان للمشروع
          </h2>
          <p className="text-gray-500">معانٍ يقوم عليها وقف القلم</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Pillar
            icon={
              <path d="M12 21v-6m0 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14M12 15a4 4 0 0 0-4-4H4v10h8M12 15h8M3 21h18" />
            }
            title="وقفٌ لوجه الله"
            description="خالصاً لوجهه الكريم، لا ابتغاء أجرٍ ولا مقابل — إنما رجاءَ ما عند الله من الأجر والمثوبة."
            color="emerald"
          />
          <Pillar
            icon={
              <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            }
            title="علمٌ يُنتفعُ به"
            description="إحياءٌ لسنّة الصدقة الجارية في العلم، ليبقى النور ممتداً بعد صاحبه، ينفع القارئ والباحث."
            color="amber"
          />
          <Pillar
            icon={
              <path d="M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
            }
            title="إتاحةٌ مجانية"
            description="للعلم طريقٌ مفتوح — لا قيود ولا مقابل، يصل إلى كل طالبِ معرفة في أرض الله الواسعة."
            color="teal"
          />
        </div>
      </section>

      {/* ───────── The Will / Testament ───────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 text-emerald-800 mb-4">
            <span className="h-px w-12 bg-emerald-300" />
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z" />
            </svg>
            <span className="h-px w-12 bg-emerald-300" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            الوصيّةُ العلمية
          </h2>
          <p className="text-gray-500 leading-relaxed">
            كلماتٌ يبوح بها الدكتور سيف عبد الفتاح، يؤسّس بها لهذا المشروع،
            ويضعه بين يدي القارئ.
          </p>
        </div>

        {/* Elegant framed content */}
        <div className="relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Decorative top band */}
          <div className="h-2 bg-gradient-to-l from-emerald-600 via-amber-400 to-emerald-600" />

          <div className="p-8 md:p-12">
            <article
              className="prose prose-lg prose-gray max-w-none
                prose-headings:hidden
                prose-p:leading-[2.1] prose-p:text-gray-700
                prose-p:first:first-letter:text-6xl prose-p:first:first-letter:font-bold
                prose-p:first:first-letter:text-emerald-700 prose-p:first:first-letter:float-right
                prose-p:first:first-letter:ml-2 prose-p:first:first-letter:leading-[0.9]
                prose-p:first:first-letter:mt-1
                prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-emerald-900
                prose-blockquote:border-amber-400 prose-blockquote:bg-amber-50/40
                prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-6
                prose-blockquote:text-gray-800 prose-blockquote:not-italic"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>

          {/* Decorative bottom band */}
          <div className="h-2 bg-gradient-to-l from-emerald-600 via-amber-400 to-emerald-600" />
        </div>
      </section>

      {/* ───────── Featured Hadith Pull Quote ───────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
        <div className="relative bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-3xl p-8 md:p-14 shadow-2xl overflow-hidden">
          {/* Background ornament */}
          <svg
            className="absolute -top-8 -right-8 w-48 h-48 text-white/5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z" />
          </svg>
          <svg
            className="absolute -bottom-8 -left-8 w-56 h-56 text-white/5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z" />
          </svg>

          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-200 px-4 py-1.5 rounded-full text-xs font-medium mb-6 backdrop-blur">
              ☪ حديثٌ نبوي
            </div>

            <blockquote className="text-xl md:text-3xl font-bold leading-loose mb-5">
              «إذا ماتَ ابنُ آدمَ انقطعَ عملُه إلا من ثلاث: صدقةٍ جارية،
              <br className="hidden md:block" />
              أو علمٍ يُنتفعُ به، أو ولدٍ صالحٍ يدعو له»
            </blockquote>

            <p className="text-emerald-200 text-sm">
              رواه مسلم — صلى الله عليه وسلم
            </p>

            <div className="mt-8 text-emerald-100/90 text-sm md:text-base leading-loose max-w-2xl mx-auto">
              ومن هنا كان هذا المشروع — رجاءَ أن يكون
              <span className="text-amber-300 font-semibold"> علماً يُنتفعُ به </span>
              يصلُ إلى صاحبه ولو بعد حين.
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Explore the Works ───────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            تصفَّحِ الأعمال
          </h2>
          <p className="text-gray-500">
            ثمرةُ عقودٍ من البحث والكتابة، بين يديك مجاناً
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ExploreCard
            href="/books"
            title="الكتب والمؤلفات"
            description="إصداراتٌ ودراسات في الفكر السياسي والحضاري الإسلامي"
            iconPath="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
          />
          <ExploreCard
            href="/blog"
            title="المقالات"
            description="أكثر من ألف مقال في الفكر والسياسة والمجتمع"
            iconPath="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m0-6a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5ZM3.375 4.5a1.125 1.125 0 0 1 1.125-1.125h4.125M12 2.25h2.25l5.25 5.25V19.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V5.625c0-.621.504-1.125 1.125-1.125Z"
          />
          <ExploreCard
            href="/civilizational-school"
            title="المدرسة الحضارية"
            description="مشروعٌ فكري لقراءة الواقع من منظورٍ حضاريٍّ إسلامي"
            iconPath="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
          />
        </div>
      </section>

      {/* ───────── Closing Dua ───────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mb-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-amber-700 mb-5">
            <span className="h-px w-12 bg-amber-400" />
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z" />
            </svg>
            <span className="h-px w-12 bg-amber-400" />
          </div>
          <p
            className="text-gray-800 text-xl md:text-2xl leading-loose font-medium"
            style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
          >
            اللّهمَّ اجعلْهُ طاقةَ نورٍ مُضيئة،
            <br />
            لمعرفةٍ أنقى، ولعلمٍ أرقى،
            <br />
            يَنهَضُ بهذه الأمةِ وعياً وسعياً.
          </p>
          <p className="text-gray-400 text-sm mt-6">
            — من افتتاحيّة وقف القلم
          </p>
        </div>
      </section>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────

interface PillarProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "emerald" | "amber" | "teal";
}

function Pillar({ icon, title, description, color }: PillarProps) {
  const colors = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      icon: "text-emerald-700",
      ring: "ring-emerald-100",
      title: "text-emerald-900",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      icon: "text-amber-700",
      ring: "ring-amber-100",
      title: "text-amber-900",
    },
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-100",
      icon: "text-teal-700",
      ring: "ring-teal-100",
      title: "text-teal-900",
    },
  }[color];

  return (
    <article
      className={`bg-white border ${colors.border} rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center`}
    >
      <div
        className={`mx-auto w-16 h-16 rounded-2xl ${colors.bg} ring-4 ${colors.ring} flex items-center justify-center mb-5`}
      >
        <svg
          className={`w-8 h-8 ${colors.icon}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          {icon}
        </svg>
      </div>
      <h3 className={`text-xl font-bold ${colors.title} mb-3`}>{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </article>
  );
}

interface ExploreCardProps {
  href: string;
  title: string;
  description: string;
  iconPath: string;
}

function ExploreCard({ href, title, description, iconPath }: ExploreCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-700 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-4">{description}</p>
      <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
        تصفّح
        <svg
          className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </Link>
  );
}
