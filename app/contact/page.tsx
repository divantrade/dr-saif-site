import type { Metadata } from "next";
import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description:
    "تواصل مع فريق موقع الدكتور سيف الدين عبد الفتاح — للاستفسارات والمراسلات والتعاون",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-700">تواصل معنا</span>
      </nav>

      {/* Header */}
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          تواصل معنا
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
          نسعد بتلقي استفساراتكم ومقترحاتكم. فريق عمل الموقع يعمل على الرد
          خلال أقرب وقت ممكن.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Email */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="font-bold text-gray-900 text-lg mb-1">البريد الإلكتروني</h2>
          <p className="text-gray-500 text-sm mb-3">للتواصل الرسمي والمراسلات</p>
          <a
            href="mailto:info@saifabdelfattah.net"
            className="text-emerald-700 font-medium hover:underline"
          >
            info@saifabdelfattah.net
          </a>
        </div>

        {/* Social */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="font-bold text-gray-900 text-lg mb-1">وسائل التواصل</h2>
          <p className="text-gray-500 text-sm mb-4">تابعونا على منصاتنا الرسمية</p>
          <SocialLinks />
        </div>
      </div>

      {/* Note */}
      <div className="mt-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
        <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ملاحظة
        </h3>
        <p className="text-emerald-800 text-sm leading-relaxed">
          الموقع يعرض كتابات ومقالات الأستاذ الدكتور سيف الدين عبد الفتاح.
          للتواصل المباشر مع الدكتور نرجو استخدام وسائل التواصل الرسمية
          الموثقة على حساباته في منصات التواصل الاجتماعي.
        </p>
      </div>
    </div>
  );
}
