import type { TimelineEvent, TimelineKind } from "@/lib/cv";

interface TimelineProps {
  events: TimelineEvent[];
}

const KIND_META: Record<
  TimelineKind,
  { label: string; color: string; bg: string; ring: string; border: string; iconPath: string }
> = {
  birth: {
    label: "الميلاد",
    color: "text-rose-600",
    bg: "bg-rose-50",
    ring: "ring-rose-200",
    border: "border-rose-200",
    iconPath:
      "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
  },
  education: {
    label: "تعليم",
    color: "text-blue-600",
    bg: "bg-blue-50",
    ring: "ring-blue-200",
    border: "border-blue-200",
    iconPath:
      "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
  },
  career: {
    label: "مسيرة مهنية",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    border: "border-emerald-200",
    iconPath:
      "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z",
  },
  travel: {
    label: "دراسة بالخارج",
    color: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    border: "border-amber-200",
    iconPath:
      "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5",
  },
  milestone: {
    label: "محطة",
    color: "text-purple-600",
    bg: "bg-purple-50",
    ring: "ring-purple-200",
    border: "border-purple-200",
    iconPath:
      "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
  },
};

export default function Timeline({ events }: TimelineProps) {
  return (
    <ol className="relative">
      {/* Vertical line (RTL-aware: place on the right) */}
      <div className="absolute top-0 bottom-0 right-[19px] md:right-1/2 md:translate-x-1/2 w-0.5 bg-gradient-to-b from-emerald-200 via-gray-200 to-transparent" />

      {events.map((event, idx) => {
        const meta = KIND_META[event.kind];
        const isEven = idx % 2 === 0;
        return (
          <li
            key={`${event.year}-${idx}-${event.title}`}
            className={`relative flex items-start mb-8 md:mb-10 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-6 ${
              isEven ? "" : "md:[&>*:first-child]:order-3"
            }`}
          >
            {/* Card — one side on desktop, full-width on mobile */}
            <div
              className={`flex-1 pr-14 md:pr-0 md:col-span-1 ${
                isEven ? "md:text-left md:pl-8" : "md:text-right md:pr-8 md:col-start-3"
              }`}
            >
              <article
                className={`inline-block bg-white border ${meta.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow max-w-md`}
              >
                <div className={`inline-flex items-center gap-2 ${meta.bg} ${meta.color} text-xs font-medium px-2.5 py-1 rounded-full mb-2`}>
                  {meta.label}
                  <span className="opacity-50">•</span>
                  <time className="font-bold">{event.year}</time>
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-snug mb-1">
                  {event.title}
                </h3>
                {event.subtitle && (
                  <p className="text-sm text-gray-500 mb-2">{event.subtitle}</p>
                )}
                {event.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                )}
              </article>
            </div>

            {/* Marker — center column on desktop, right column on mobile */}
            <div className="absolute right-0 top-2 md:static md:col-start-2 md:row-start-1 md:flex md:items-center md:justify-center">
              <div className={`relative w-10 h-10 rounded-full ${meta.bg} ring-4 ${meta.ring} flex items-center justify-center z-10`}>
                <svg
                  className={`w-5 h-5 ${meta.color}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={meta.iconPath} />
                </svg>
              </div>
            </div>

            {/* Empty cell on the other side (desktop only) */}
            <div className="hidden md:block md:col-span-1" />
          </li>
        );
      })}
    </ol>
  );
}
