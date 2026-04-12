import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Timeline from "@/components/Timeline";
import {
  PERSONAL,
  DEGREES,
  CAREER,
  FOREIGN_STUDY,
  TEACHING,
  MEMBERSHIPS,
  SELECTED_BOOKS,
  SELECTED_THESES,
  buildTimeline,
  getQuickStats,
} from "@/lib/cv";

const PORTRAIT =
  "https://www.saifabdelfattah.net/wp-content/uploads/2023/02/dr-site-m.png";

export const metadata: Metadata = {
  title: "السيرة الذاتية",
  description:
    "السيرة الذاتية للأستاذ الدكتور سيف الدين عبد الفتاح إسماعيل — أستاذ العلوم السياسية بجامعة القاهرة، ومسار علمي وأكاديمي يمتد لأكثر من أربعة عقود.",
};

export default function AboutPage() {
  const stats = getQuickStats();
  const timeline = buildTimeline();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.3'%3E%3Cpath d='M40 0v80M0 40h80'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-sm text-emerald-200 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-white">السيرة الذاتية</span>
          </nav>

          <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
            <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-emerald-900">
              <Image
                src={PORTRAIT}
                alt={PERSONAL.displayName}
                fill
                className="object-cover"
                style={{ objectPosition: "center 25%" }}
                sizes="224px"
                priority
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-emerald-200 font-medium mb-2 text-sm tracking-wider">
                السيرة الذاتية
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
                {PERSONAL.honorific} {PERSONAL.displayName}
              </h1>
              <p className="text-emerald-50 text-lg md:text-xl mb-5">
                {PERSONAL.currentTitle}
              </p>
              <p className="text-emerald-100/80 max-w-2xl mb-6 leading-relaxed">
                {PERSONAL.affiliation}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  href="/about/print"
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-white text-emerald-800 font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  تحميل السيرة (PDF)
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                >
                  قراءة المقالات
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-12 md:-mt-14 relative z-10 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          <StatCard value={String(stats.birthYear)} label="سنة الميلاد" color="rose" />
          <StatCard value={`+${stats.teachingYears}`} label="سنة من التدريس" color="emerald" />
          <StatCard value={String(stats.degrees)} label="درجات أكاديمية" color="blue" />
          <StatCard value={`+${stats.supervisedTheses}`} label="رسالة مُشرَف عليها" color="purple" />
          <StatCard value={String(stats.professorSince)} label="أستاذ منذ" color="amber" />
        </div>
      </section>

      {/* Identity card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-14">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">البيانات الأساسية</h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
          <dl className="grid md:grid-cols-2 gap-x-8 gap-y-5">
            <IdentityRow label="الاسم الكامل" value={PERSONAL.fullName} />
            <IdentityRow label="تاريخ الميلاد" value={PERSONAL.birthDate} />
            <IdentityRow label="محل الميلاد" value={PERSONAL.birthPlace} />
            <IdentityRow label="الجنسية" value={PERSONAL.nationality} />
            <IdentityRow label="الديانة" value={PERSONAL.religion} />
            <IdentityRow label="الحالة الاجتماعية" value={PERSONAL.maritalStatus} />
            <IdentityRow label="الوظيفة الحالية" value={PERSONAL.currentTitle} />
            <IdentityRow label="التخصص الدقيق" value={PERSONAL.specialty} />
            <div className="md:col-span-2">
              <IdentityRow label="الانتماء المؤسسي" value={PERSONAL.affiliation} />
            </div>
          </dl>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-14">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-medium px-4 py-1.5 rounded-full text-sm mb-3">
            الخط الزمني
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            مسيرة علمية تمتد لأكثر من أربعة عقود
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            من الميلاد في القاهرة إلى الأستاذية في أعرق كليات العلوم السياسية عربياً،
            محطات فارقة شكّلت المسار الفكري والأكاديمي.
          </p>
        </div>
        <Timeline events={timeline} />
      </section>

      {/* Degrees detail */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-14">
        <SectionHeader
          title="الدرجات العلمية"
          subtitle="المسار الأكاديمي من البكالوريوس إلى الدكتوراه"
          colorClass="bg-blue-100 text-blue-700"
          badge="التعليم"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {DEGREES.map((d) => (
            <article
              key={d.level}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                  {d.dateText}
                </span>
                <span className="text-2xl font-black text-blue-200">{d.year}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug">
                {d.degree}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{d.institution}</p>
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-semibold text-gray-600">التقدير: </span>
                {d.grade}
              </p>
              {d.thesis && (
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  <span className="font-semibold text-gray-600">الرسالة: </span>
                  {d.thesis}
                </p>
              )}
              {d.advisors && d.advisors.length > 0 && (
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-semibold">الإشراف: </span>
                  {d.advisors.join("، ")}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Career */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-14">
        <SectionHeader
          title="المسيرة المهنية"
          subtitle="التدرج في المناصب الأكاديمية بجامعة القاهرة"
          colorClass="bg-emerald-100 text-emerald-700"
          badge="وظائف"
        />
        <div className="space-y-3">
          {CAREER.map((c, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 p-4 rounded-xl border ${
                c.highlight
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="text-sm font-bold text-gray-500 shrink-0 w-32 tabular-nums">
                {c.fromText} — {c.toText}
              </div>
              <div className="w-px h-8 bg-gray-200 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900">{c.title}</h3>
                <p className="text-sm text-gray-500 truncate">{c.institution}</p>
              </div>
              {c.highlight && (
                <span className="text-xs font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded-full shrink-0">
                  الوظيفة الحالية
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Foreign study */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-14">
        <SectionHeader
          title="الدراسة والبحث في الخارج"
          subtitle="محطات علمية ومؤسسات دولية"
          colorClass="bg-amber-100 text-amber-700"
          badge="سفر"
        />
        <div className="grid md:grid-cols-2 gap-4">
          {FOREIGN_STUDY.map((f, i) => (
            <article
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-700 mb-1">{f.period}</p>
                  <h3 className="font-bold text-gray-900 leading-snug mb-1">
                    {f.institution}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{f.country}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.purpose}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Teaching + Memberships two-col */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-14 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">المواد التي قام بتدريسها</h3>
          <ul className="space-y-2">
            {TEACHING.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-gray-700 bg-white border border-gray-100 rounded-xl p-3"
              >
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">المناصب والعضويات</h3>
          <ul className="space-y-2">
            {MEMBERSHIPS.map((m, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-gray-700 bg-white border border-gray-100 rounded-xl p-3"
              >
                <svg className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Supervised theses */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-14">
        <SectionHeader
          title="نماذج من الإشراف الأكاديمي"
          subtitle="رسائل ماجستير ودكتوراه أشرف عليها"
          colorClass="bg-purple-100 text-purple-700"
          badge="إشراف"
        />
        <div className="grid md:grid-cols-2 gap-4">
          {SELECTED_THESES.map((t, i) => (
            <article
              key={i}
              className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    t.type === "دكتوراه"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {t.type}
                </span>
                <span className="text-xs text-gray-400 tabular-nums">{t.year}</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm leading-snug mb-1">
                {t.title}
              </h4>
              <p className="text-xs text-gray-500">
                الباحث: {t.student}
                {t.coAdvisors && t.coAdvisors.length > 0 && (
                  <span className="block mt-0.5">بالإشراف مع: {t.coAdvisors.join("، ")}</span>
                )}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Selected books */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-14">
        <SectionHeader
          title="نماذج من المؤلفات"
          subtitle="مختارات من الكتب والمساهمات العلمية"
          colorClass="bg-slate-100 text-slate-700"
          badge="كتب"
        />
        <div className="grid md:grid-cols-2 gap-4">
          {SELECTED_BOOKS.map((b, i) => (
            <article
              key={i}
              className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-14 rounded bg-gradient-to-br from-slate-200 to-slate-400 shrink-0 relative">
                <div className="absolute left-0.5 top-1 bottom-1 w-0.5 bg-white/50" />
                <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                  {b.year}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 leading-snug mb-1.5">
                  {b.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">{b.publisher}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
          >
            عرض جميع الكتب
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Download CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-8 md:p-10 text-center">
          <svg className="w-14 h-14 mx-auto mb-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            تحميل السيرة الذاتية كاملة
          </h3>
          <p className="text-gray-300 max-w-xl mx-auto mb-6 leading-relaxed">
            نسخة طباعية احترافية بتنسيق PDF تحتوي على كل التفاصيل — يمكنك تحميلها وطباعتها ومشاركتها.
          </p>
          <Link
            href="/about/print"
            target="_blank"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            تحميل PDF
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: "rose" | "emerald" | "blue" | "purple" | "amber";
}) {
  const map: Record<typeof color, string> = {
    rose: "text-rose-600",
    emerald: "text-emerald-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    amber: "text-amber-600",
  };
  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 text-center">
      <div className={`text-2xl md:text-3xl font-black ${map[color]} tabular-nums mb-1`}>
        {value}
      </div>
      <div className="text-xs md:text-sm text-gray-500 leading-tight">{label}</div>
    </div>
  );
}

function IdentityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
      <dt className="text-sm font-semibold text-gray-400 sm:w-36 shrink-0">{label}</dt>
      <dd className="text-sm text-gray-800 leading-relaxed">{value}</dd>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  badge,
  colorClass,
}: {
  title: string;
  subtitle: string;
  badge: string;
  colorClass: string;
}) {
  return (
    <div className="mb-6">
      <div className={`inline-flex items-center gap-2 ${colorClass} font-medium px-3 py-1 rounded-full text-xs mb-3`}>
        {badge}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}
