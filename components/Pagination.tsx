import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  /** Query-string key for the page param. Defaults to "page". */
  pageParam?: string;
}

/**
 * RTL-aware paginator. Renders first/last/current ± 1 with ellipses,
 * disabled prev/next when at the bounds.
 */
export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  pageParam = "page",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const sep = basePath.includes("?") ? "&" : "?";
  const pageLink = (p: number) =>
    p === 1 ? basePath : `${basePath}${sep}${pageParam}=${p}`;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
    .reduce<(number | "…")[]>((acc, p) => {
      const prev = acc[acc.length - 1];
      if (typeof prev === "number" && p - prev > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);

  return (
    <nav
      className="flex items-center justify-center gap-2 flex-wrap"
      aria-label="التنقل بين الصفحات"
    >
      {currentPage > 1 ? (
        <Link
          href={pageLink(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          السابق
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed">
          السابق
        </span>
      )}

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={pageLink(p)}
              className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                p === currentPage
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p}
            </Link>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={pageLink(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          التالي
          <svg
            className="w-4 h-4 rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed">
          التالي
        </span>
      )}
    </nav>
  );
}
