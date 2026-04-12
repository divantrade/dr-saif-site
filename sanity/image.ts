import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = imageUrlBuilder({ projectId, dataset });

/**
 * Build a URL for a Sanity image asset. Supports chaining: `.width(800).auto('format')` etc.
 * See https://www.sanity.io/docs/image-url
 */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}
