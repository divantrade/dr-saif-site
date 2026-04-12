/**
 * Override the site chrome while the user is inside Sanity Studio.
 * The Studio is a full-screen SPA; it should not appear inside the
 * site header/footer.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  // Studio content should never be indexed by search engines.
  robots: { index: false, follow: false },
  title: "Sanity Studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <style>{`
        /* Hide site header and footer while the studio is active. */
        body > header,
        body > footer {
          display: none !important;
        }
        /* Let the studio fill the full viewport without the 'main' wrapper
           constraining it. */
        body > main {
          flex: 1 !important;
          padding: 0 !important;
          margin: 0 !important;
          display: flex;
          flex-direction: column;
        }
        body > main > div {
          flex: 1;
        }
        /* Ensure RTL inheritance from <html> doesn't fight Studio's own LTR
           layout — Sanity Studio is intentionally LTR. */
        body > main [data-ui="ToolMenu"] {
          direction: ltr;
        }
      `}</style>
    </>
  );
}
