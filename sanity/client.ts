import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

// Read-only client for the public site. Uses Sanity's CDN for speed — fine
// for published content.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

// Fresh (non-CDN) client for webhook handlers or when we need the newest
// content. Slightly slower but always up-to-date.
export const sanityFreshClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});
