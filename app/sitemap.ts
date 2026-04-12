import type { MetadataRoute } from "next";
import {
  loadPosts,
  loadCategories,
  loadTags,
  readableSlug,
} from "@/lib/data";
import { SITE } from "@/lib/site";

const STATIC_PATHS: { path: string; priority: number; frequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, frequency: "daily" },
  { path: "/blog", priority: 0.9, frequency: "daily" },
  { path: "/about", priority: 0.7, frequency: "yearly" },
  { path: "/waqf-alqalam", priority: 0.7, frequency: "monthly" },
  { path: "/videos", priority: 0.7, frequency: "weekly" },
  { path: "/podcast", priority: 0.6, frequency: "weekly" },
  { path: "/civilizational-school", priority: 0.7, frequency: "monthly" },
  { path: "/books", priority: 0.7, frequency: "monthly" },
  { path: "/search", priority: 0.3, frequency: "yearly" },
  { path: "/contact", priority: 0.4, frequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, cats, tags] = await Promise.all([
    loadPosts(),
    loadCategories(),
    loadTags(),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((e) => ({
    url: `${SITE.url}${e.path}`,
    lastModified: now,
    changeFrequency: e.frequency,
    priority: e.priority,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE.url}/blog/${encodeURIComponent(readableSlug(p.slug))}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = cats
    .filter((c) => c.count > 0)
    .map((c) => ({
      url: `${SITE.url}/category/${encodeURIComponent(readableSlug(c.slug))}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  const tagEntries: MetadataRoute.Sitemap = tags
    .filter((t) => t.count > 0)
    .map((t) => ({
      url: `${SITE.url}/tag/${encodeURIComponent(readableSlug(t.slug))}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    }));

  return [...staticEntries, ...postEntries, ...categoryEntries, ...tagEntries];
}
