import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getPostsByCategoryId, getCategoryById } from "@/lib/data";

// "إضاءات حضارية" — the broad civilizational-school umbrella category (id 40).
const SCHOOL_CATEGORY_ID = 40;

export const metadata: Metadata = {
  title: "المدرسة الحضارية",
  description:
    "المدرسة الحضارية — مشروع فكري يعيد قراءة الواقع من منظور الفكر الحضاري الإسلامي",
};

export default async function CivilizationalSchoolPage() {
  const [posts, category] = await Promise.all([
    getPostsByCategoryId(SCHOOL_CATEGORY_ID),
    getCategoryById(SCHOOL_CATEGORY_ID),
  ]);

  const recent = posts.slice(0, 12);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-700">المدرسة الحضارية</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white rounded-3xl p-8 md:p-12 mb-10 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            مشروع فكري حضاري
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
            المدرسة الحضارية
          </h1>
          <p className="text-amber-50 text-lg leading-relaxed">
            مشروع علمي فكري يعمل على تجديد قراءة الواقع من منظور الفكر
            الحضاري الإسلامي، ويجمع بين الدراسات الأكاديمية والإضاءات الفكرية
            والإنتاج الكتابي لإعادة بناء وعي حضاري مقاوم.
          </p>
        </div>
      </div>

      {/* Pillars */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">محاور المدرسة</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Pillar
            title="الدراسات"
            description="دراسات علمية متعمّقة في الفكر السياسي والحضاري الإسلامي"
            iconPath="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
          <Pillar
            title="الكتب"
            description="إصدارات ومؤلفات تمثّل ثمرة مشروع فكري متكامل"
            iconPath="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
          />
          <Pillar
            title="الأنشطة والفعاليات"
            description="مؤتمرات ومحاضرات وورشات عمل لنقاش القضايا الحضارية"
            iconPath="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </div>
      </section>

      {/* Recent content */}
      {recent.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">آخر الإنتاج</h2>
            <span className="text-sm text-gray-500">
              {category?.count || posts.length} مادة منشورة
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Pillar({
  title,
  description,
  iconPath,
}: {
  title: string;
  description: string;
  iconPath: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={iconPath} />
        </svg>
      </div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
