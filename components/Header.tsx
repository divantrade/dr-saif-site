import Link from "next/link";
import { getArticlesTree } from "@/lib/data";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";
import SocialLinks from "./SocialLinks";

function SearchIconLink() {
  return (
    <Link
      href="/search"
      aria-label="البحث"
      className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </Link>
  );
}

const TOP_LEVEL_LINKS = [
  { href: "/podcast", label: "بودكاست" },
  { href: "/videos", label: "فيديوهاتنا" },
  { href: "/waqf-alqalam", label: "وقف القلم" },
  { href: "/civilizational-school", label: "المدرسة الحضارية" },
  { href: "/about", label: "السيرة الذاتية" },
];

export default async function Header() {
  const articlesTree = await getArticlesTree();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-xl">س</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-gray-900 leading-tight">
                أ.د. سيف الدين عبد الفتاح
              </h1>
              <p className="text-xs text-gray-400">كتابات ومقالات</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              الرئيسية
            </Link>
            <MegaMenu articlesTree={articlesTree} />
            {TOP_LEVEL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop search + social icons */}
          <div className="hidden md:flex items-center gap-1">
            <SearchIconLink />
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <SocialLinks />
          </div>

          {/* Mobile menu */}
          <MobileNav articlesTree={articlesTree} />
        </div>
      </div>
    </header>
  );
}
