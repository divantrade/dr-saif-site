import "server-only";
import { getPageBySlug } from "./data";

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
  publishedAt: string;
}

interface RawYRCItem {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: Record<string, { url?: string } | undefined>;
  };
  contentDetails?: { itemCount?: number };
}

/** Extract the YRC.Data JSON blob embedded in the فيديوهاتنا page. */
export async function getYouTubePlaylists(): Promise<YouTubePlaylist[]> {
  const page = await getPageBySlug(encodeURIComponent("فيديوهاتنا"));
  if (!page) return [];
  const html = page.content.rendered;
  const match = html.match(/YRC\.Data\[[^\]]+\]\s*=\s*(\{[\s\S]+?\});/);
  if (!match) return [];
  try {
    const data = JSON.parse(match[1]) as {
      playlists?: { items?: RawYRCItem[] };
    };
    const items = data.playlists?.items ?? [];
    return items
      .filter((it): it is RawYRCItem & { id: string } => typeof it.id === "string")
      .map((it) => {
        const thumbs = it.snippet?.thumbnails ?? {};
        const thumb =
          thumbs.maxres?.url ||
          thumbs.high?.url ||
          thumbs.standard?.url ||
          thumbs.medium?.url ||
          thumbs.default?.url ||
          "";
        return {
          id: it.id,
          title: it.snippet?.title ?? "بدون عنوان",
          description: it.snippet?.description ?? "",
          thumbnail: thumb,
          videoCount: it.contentDetails?.itemCount ?? 0,
          publishedAt: it.snippet?.publishedAt ?? "",
        };
      });
  } catch {
    return [];
  }
}

export function playlistUrl(id: string): string {
  return `https://www.youtube.com/playlist?list=${id}`;
}

export const YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/@saifabdelfattah";
