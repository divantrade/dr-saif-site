import Link from "next/link";

export interface SocialLink {
  href: string;
  label: string;
  icon: "youtube" | "twitter" | "facebook";
}

export const SOCIAL_LINKS: SocialLink[] = [
  { href: "https://www.youtube.com/", label: "يوتيوب", icon: "youtube" },
  { href: "https://twitter.com/", label: "تويتر", icon: "twitter" },
  { href: "https://www.facebook.com/", label: "فيسبوك", icon: "facebook" },
];

function Icon({ name }: { name: SocialLink["icon"] }) {
  switch (name) {
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M23.498 6.186a3.02 3.02 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.02 3.02 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.02 3.02 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.02 3.02 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.546 15.568V8.432l6.273 3.568-6.273 3.568Z" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M13.5 21.95v-8.78h2.95l.44-3.43H13.5V7.55c0-.99.27-1.67 1.7-1.67h1.81V2.82a24.4 24.4 0 0 0-2.64-.13c-2.61 0-4.4 1.59-4.4 4.52v2.53H7v3.43h2.97v8.78h3.53Z" />
        </svg>
      );
  }
}

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
}

export default function SocialLinks({
  className = "",
  iconClassName = "",
}: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {SOCIAL_LINKS.map((s) => (
        <Link
          key={s.icon}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className={`w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors ${iconClassName}`}
        >
          <Icon name={s.icon} />
        </Link>
      ))}
    </div>
  );
}
