import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/data";
import { cleanWpHtml } from "@/lib/sanitize";

export const metadata: Metadata = {
  title: "السيرة الذاتية",
  description:
    "السيرة الذاتية للأستاذ الدكتور سيف الدين عبد الفتاح إسماعيل — أستاذ العلوم السياسية بجامعة القاهرة",
};

export default async function AboutPage() {
  const page = await getPageBySlug("about-us");
  if (!page) notFound();

  const html = cleanWpHtml(page.content.rendered);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-700">السيرة الذاتية</span>
      </nav>

      {/* Header */}
      <header className="mb-10 pb-8 border-b border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 shadow-lg overflow-hidden shrink-0 flex items-center justify-center">
            <svg className="w-24 h-24 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="text-center md:text-right flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              أ.د. سيف الدين عبد الفتاح إسماعيل
            </h1>
            <p className="text-emerald-700 text-lg font-medium mb-3">
              أستاذ العلوم السياسية
            </p>
            <p className="text-gray-500 leading-relaxed">
              كلية الاقتصاد والعلوم السياسية — جامعة القاهرة
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <article
        className="prose prose-lg prose-gray max-w-none
          prose-headings:text-gray-900 prose-headings:font-bold
          prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto
          prose-strong:text-gray-800
          prose-ul:list-disc
          leading-loose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
