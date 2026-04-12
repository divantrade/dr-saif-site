import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug, stripHtml } from "@/lib/data";
import { cleanWpHtml } from "@/lib/sanitize";

export const metadata: Metadata = {
  title: "وقف القلم — الأعمال الكاملة",
  description:
    "مشروع وقف القلم: الأعمال الكاملة للدكتور سيف الدين عبد الفتاح — علم ينتفع به، متاح مجاناً للقارئ والباحث",
};

export default async function WaqfAlQalamPage() {
  const page = await getPageBySlug(
    encodeURIComponent("وقف-القلم-ـ-الأعمال-الكاملة")
  );
  if (!page) notFound();

  const html = cleanWpHtml(page.content.rendered);
  const title = stripHtml(page.title.rendered);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-700">وقف القلم</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white rounded-3xl p-8 md:p-12 mb-10 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            مشروع علمي مفتوح
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-emerald-50 text-lg leading-relaxed max-w-2xl">
            مجموع أعمال وأفكار الدكتور سيف الدين عبد الفتاح، وقفٌ لوجه الله
            تعالى، يُتاح مجاناً للقارئ والباحث رغبةً في نشر العلم وعدم كتمانه.
          </p>
        </div>
      </div>

      {/* Content */}
      <article
        className="prose prose-lg prose-gray max-w-none
          prose-headings:text-gray-900 prose-headings:font-bold
          prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto
          prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-4
          prose-strong:text-gray-800
          leading-loose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
