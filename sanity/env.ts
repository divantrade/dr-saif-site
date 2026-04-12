// Sanity project configuration.
// Values are read from environment variables with safe fallbacks so the app
// builds even when .env.local is missing (useful for CI / first-time setup).

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "qgv6yxcl";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// API version — a date string. Sanity recommends pinning to the date you
// developed against so future schema changes in the platform don't surprise you.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-12";

// Write-scope token used by server-side migration scripts and webhook
// handlers. MUST remain server-side only — never expose to the client.
export const writeToken = process.env.SANITY_WRITE_TOKEN || "";

// Optional read token for draft/preview content (not needed for public reads).
export const readToken = process.env.SANITY_READ_TOKEN || "";

// Studio is mounted at this path on the Next.js host.
export const studioBasePath = "/studio/saif";
