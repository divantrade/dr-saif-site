import Link from "next/link";
import { getNavData } from "@/lib/sanity-data";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";
import HeaderLink from "./HeaderLink";

function SearchIconLink() {
  return (
    <Link
      href="/search"
      aria-label="البحث"
      className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </Link>
  );
}

export default async function Header() {
  const { axes, series, years, publishers } = await getNavData();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo + name */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-xl font-display leading-none">
                س
              </span>
            </div>
            <div className="hidden sm:block leading-tight">
              <h1 className="text-[1.05rem] font-bold text-gray-900">
                أ.د. سيف الدين عبد الفتاح
              </h1>
              <p className="text-[0.72rem] text-gray-400 tracking-wide">
                كتابات و مقالات
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-stretch self-stretch"
            aria-label="القائمة الرئيسية"
          >
            <HeaderLink href="/" label="الرئيسية" />
            <MegaMenu
              axes={axes}
              series={series}
              years={years}
              publishers={publishers}
            />
            <HeaderLink href="/books" label="الكتب" matchDescendants />
            <HeaderLink href="/about" label="عن الدكتور" matchDescendants />
          </nav>

          {/* Search (desktop) */}
          <div className="hidden md:flex items-center shrink-0">
            <SearchIconLink />
          </div>

          {/* Mobile menu */}
          <MobileNav
            axes={axes}
            series={series}
            years={years}
            publishers={publishers}
          />
        </div>
      </div>
    </header>
  );
}
