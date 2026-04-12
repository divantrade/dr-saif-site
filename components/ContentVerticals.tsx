/**
 * Six large content-type cards shown on the homepage below the hero.
 * Each links to a dedicated landing page and shows a live count for
 * the category it represents.
 */

import Link from "next/link";

interface Vertical {
  href: string;
  title: string;
  count: number;
  countLabel: string;
  description: string;
  tone: "emerald" | "amber" | "slate" | "indigo" | "rose" | "teal";
  iconPath: string;
}

const TONES: Record<
  Vertical["tone"],
  {
    bg: string;
    accent: string;
    iconBg: string;
    iconText: string;
    number: string;
    arrow: string;
  }
> = {
  emerald: {
    bg: "from-emerald-50 to-white",
    accent: "border-emerald-200/60 hover:border-emerald-400",
    iconBg: "bg-emerald-600",
    iconText: "text-white",
    number: "text-emerald-700",
    arrow: "text-emerald-600 group-hover:text-emerald-700",
  },
  amber: {
    bg: "from-amber-50 to-white",
    accent: "border-amber-200/60 hover:border-amber-400",
    iconBg: "bg-amber-600",
    iconText: "text-white",
    number: "text-amber-700",
    arrow: "text-amber-600 group-hover:text-amber-700",
  },
  slate: {
    bg: "from-slate-50 to-white",
    accent: "border-slate-200/60 hover:border-slate-400",
    iconBg: "bg-slate-700",
    iconText: "text-white",
    number: "text-slate-700",
    arrow: "text-slate-600 group-hover:text-slate-800",
  },
  indigo: {
    bg: "from-indigo-50 to-white",
    accent: "border-indigo-200/60 hover:border-indigo-400",
    iconBg: "bg-indigo-600",
    iconText: "text-white",
    number: "text-indigo-700",
    arrow: "text-indigo-600 group-hover:text-indigo-700",
  },
  rose: {
    bg: "from-rose-50 to-white",
    accent: "border-rose-200/60 hover:border-rose-400",
    iconBg: "bg-rose-600",
    iconText: "text-white",
    number: "text-rose-700",
    arrow: "text-rose-600 group-hover:text-rose-700",
  },
  teal: {
    bg: "from-teal-50 to-white",
    accent: "border-teal-200/60 hover:border-teal-400",
    iconBg: "bg-teal-600",
    iconText: "text-white",
    number: "text-teal-700",
    arrow: "text-teal-600 group-hover:text-teal-700",
  },
};

export interface ContentVerticalsProps {
  articleCount: number;
  bookCount: number;
  studyCount: number;
  projectCount: number;
  podcastCount: number;
  videoCount: number;
}

export default function ContentVerticals({
  articleCount,
  bookCount,
  studyCount,
  projectCount,
  podcastCount,
  videoCount,
}: ContentVerticalsProps) {
  const verticals: Vertical[] = [
    {
      href: "/blog",
      title: "المقالات",
      count: articleCount,
      countLabel: "مقالاً",
      description:
        "كتابات منتظمة في الشأن العام والفكر السياسي والحضاري — على مدى أربعة عقود.",
      tone: "emerald",
      iconPath:
        "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      href: "/books",
      title: "الكتب والمؤلفات",
      count: bookCount,
      countLabel: "كتاباً",
      description:
        "إصدارات وأعمال علمية تمثّل ثمرة مشروع فكري متكامل في الفكر السياسي الإسلامي.",
      tone: "amber",
      iconPath:
        "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
    },
    {
      href: "/civilizational-school",
      title: "الدراسات والأبحاث",
      count: studyCount,
      countLabel: "دراسة",
      description:
        "دراسات متعمّقة في المنظور الحضاري، ومنهاجية قراءة الواقع من داخل التراث.",
      tone: "slate",
      iconPath:
        "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    },
    {
      href: "/category/مشروعات-النهوض-والتغيير",
      title: "المشروعات البحثية",
      count: projectCount,
      countLabel: "مادة",
      description:
        "مشروعات النهوض والتغيير — التعاون مع مراكز بحثية ومعاهد علمية عربية.",
      tone: "indigo",
      iconPath:
        "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    },
    {
      href: "/podcast",
      title: "البودكاست",
      count: podcastCount,
      countLabel: "حلقة",
      description:
        "حلقات صوتية تناقش قضايا الفكر والواقع في صيغة حوارية قابلة للاستماع.",
      tone: "rose",
      iconPath:
        "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
    },
    {
      href: "/videos",
      title: "الفيديوهات",
      count: videoCount,
      countLabel: "فيديو",
      description:
        "مقاطع مرئية من محاضرات ولقاءات وبرامج تلفزية تتناول مشروع الدكتور.",
      tone: "teal",
      iconPath:
        "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
      <div className="text-center mb-12">
        <p className="text-emerald-700 text-sm tracking-[0.3em] uppercase font-semibold mb-3">
          أقسام الموقع
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          ادخل من الباب الذي يليق بسؤالك
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          يضمّ الموقع أنواعاً مختلفة من الإنتاج الفكري للدكتور — من المقال
          الصحفي إلى الكتاب إلى الدراسة البحثية.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {verticals.map((v) => (
          <VerticalCard key={v.href} vertical={v} />
        ))}
      </div>
    </section>
  );
}

function VerticalCard({ vertical: v }: { vertical: Vertical }) {
  const tone = TONES[v.tone];
  return (
    <Link
      href={v.href}
      className={`group relative block overflow-hidden rounded-2xl border-2 ${tone.accent} bg-gradient-to-br ${tone.bg} p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="flex items-start justify-between mb-5">
        <div
          className={`w-12 h-12 rounded-xl ${tone.iconBg} ${tone.iconText} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={v.iconPath} />
          </svg>
        </div>
        <div className="text-left">
          <div className={`font-display font-bold text-3xl leading-none ${tone.number}`}>
            {v.count.toLocaleString("ar-EG")}
          </div>
          <div className="text-xs text-gray-500 mt-1">{v.countLabel}</div>
        </div>
      </div>

      <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
        {v.title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        {v.description}
      </p>

      <div className={`flex items-center gap-1.5 text-sm font-medium ${tone.arrow} transition-colors`}>
        <span>ادخل القسم</span>
        <svg
          className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Link>
  );
}
