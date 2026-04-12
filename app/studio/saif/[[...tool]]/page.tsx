/**
 * Sanity Studio — mounted as a Next.js catch-all route at /studio/saif.
 * This lets the Studio live on the same domain as the site without needing
 * a separate deployment.
 *
 * The "use client" directive is required because Sanity Studio is a rich
 * client application that uses React context, window globals, etc.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

// Next.js 16 sets `export const dynamic = 'force-static'` by default for some
// routes. Studio needs to run at request time so users can log in.
export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
