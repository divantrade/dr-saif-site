import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getYouTubePlaylists,
  playlistUrl,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/videos";

export const metadata: Metadata = {
  title: "فيديوهاتنا",
  description:
    "قوائم تشغيل فيديوهات القناة الرسمية للدكتور سيف الدين عبد الفتاح — محاضرات، حوارات، وبرامج",
};

export default async function VideosPage() {
  const playlists = await getYouTubePlaylists();
  const totalVideos = playlists.reduce((s, p) => s + p.videoCount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-emerald-600 transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <span className="text-gray-700">فيديوهاتنا</span>
      </nav>

      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            فيديوهاتنا
          </h1>
          <p className="text-gray-500 leading-relaxed">
            {playlists.length} قائمة تشغيل تحوي {totalVideos} فيديو على القناة
            الرسمية
          </p>
        </div>
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M23.498 6.186a3.02 3.02 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.02 3.02 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.02 3.02 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.02 3.02 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.546 15.568V8.432l6.273 3.568-6.273 3.568Z" />
          </svg>
          زيارة القناة
        </a>
      </header>

      {/* Playlists grid */}
      {playlists.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((pl) => (
            <a
              key={pl.id}
              href={playlistUrl(pl.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
            >
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {pl.thumbnail ? (
                  <Image
                    src={pl.thumbnail}
                    alt={pl.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white mr-0.5">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* Video count badge */}
                <span className="absolute bottom-3 left-3 bg-black/75 backdrop-blur text-white text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  {pl.videoCount} فيديو
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                  {pl.title}
                </h3>
                {pl.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {pl.description}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-gray-400">قائمة تشغيل</span>
                  <span className="text-emerald-600 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    شاهد
                    <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-400 text-lg">لا توجد قوائم تشغيل متاحة حالياً</p>
        </div>
      )}
    </div>
  );
}
