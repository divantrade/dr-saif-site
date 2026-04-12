import Link from "next/link";
import { getArticlesTree, categoryHref } from "@/lib/data";
import SocialLinks from "./SocialLinks";

export default async function Footer() {
  const articlesTree = await getArticlesTree();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xl">س</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-white leading-tight">
                  د. سيف عبد الفتاح
                </h2>
                <p className="text-xs text-gray-400">كتابات ومقالات</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              الموقع الرسمي للدكتور سيف الدين عبد الفتاح — كتابات ومقالات في
              الفكر الحضاري الإسلامي والعلوم السياسية.
            </p>
            <SocialLinks iconClassName="border-gray-700 text-gray-400 hover:text-emerald-400 hover:border-emerald-500 hover:bg-gray-800" />
          </div>

          {/* Articles categories */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-4">المقالات</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {articlesTree.map((node) => (
                <Link
                  key={node.category.id}
                  href={categoryHref(node.category.slug)}
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  {node.category.name}
                  <span className="text-xs text-gray-600 mr-1">
                    ({node.category.count})
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">روابط</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  جميع المقالات
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  الكتب
                </Link>
              </li>
              <li>
                <Link href="/podcast" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  بودكاست
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  فيديوهاتنا
                </Link>
              </li>
              <li>
                <Link href="/waqf-alqalam" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  وقف القلم
                </Link>
              </li>
              <li>
                <Link href="/civilizational-school" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  المدرسة الحضارية
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  السيرة الذاتية
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} د. سيف عبد الفتاح. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
