// Sanity project configuration.
// All values are read from environment variables — no hardcoded fallbacks.
// Configure them in `.env.local` (see `.env.example` for the template).

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.example.`
    );
  }
  return value;
}

export const projectId = requireEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");

export const dataset = requireEnv("NEXT_PUBLIC_SANITY_DATASET");

// API version — a date string. Sanity recommends pinning to the date you
// developed against so future schema changes in the platform don't surprise you.
export const apiVersion = requireEnv("NEXT_PUBLIC_SANITY_API_VERSION");

// Write-scope token used by server-side migration scripts and webhook
// handlers. MUST remain server-side only — never expose to the client.
export const writeToken = process.env.SANITY_WRITE_TOKEN || "";

// Optional read token for draft/preview content (not needed for public reads).
export const readToken = process.env.SANITY_READ_TOKEN || "";

// Studio is mounted at this path on the Next.js host.
export const studioBasePath = "/studio/saif";
