/**
 * Utilities for cleaning WordPress/Elementor HTML into readable content
 * that renders well under Tailwind's prose styles.
 */

/** Remove <script> and <style> blocks. These are never safe to render. */
export function stripScriptsAndStyles(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
}

/**
 * Strip Elementor-specific wrapper divs (section, column, widget-wrap, etc.)
 * while keeping their inner content. Tailwind typography then styles the
 * real content (p, ul, img, h1..h6) cleanly.
 */
export function unwrapElementorDivs(html: string): string {
  // Remove any <div>...</div> whose opening tag has class="elementor..."
  // We iterate until no more changes because divs may be nested.
  let prev = "";
  let current = html;
  let iterations = 0;
  while (prev !== current && iterations < 40) {
    prev = current;
    // Match opening divs with elementor class, unwrap them.
    current = current.replace(
      /<div\b[^>]*\bclass="[^"]*\belementor[^"]*"[^>]*>/gi,
      ""
    );
    // Match closing div tags that had opening consumed above.
    // We can't easily track pairs; instead, strip all remaining </div>
    // that immediately follow now-removed opens. Safe approach: do it once
    // at the end after opens are stripped.
    iterations += 1;
  }
  // Finally, remove trailing </div> closures that no longer have partners.
  // Balance by counting — but since we stripped matching opens, we strip the
  // same count of closes that appear after elementor-style markup.
  // Simpler heuristic: strip any `</div>` since we've removed their opens.
  current = current.replace(/<\/div>/gi, "");
  return current;
}

/** Remove WordPress shortcodes (e.g. [dearpdf id="…"][/dearpdf]). */
export function stripShortcodes(html: string): string {
  return html
    .replace(/\[[^\]]+\]\s*\[\/[^\]]+\]/g, "")
    .replace(/\[\/?[a-zA-Z][^\]]*\]/g, "");
}

/** Collapse sequences of empty paragraphs into a single spacer. */
export function collapseEmptyParagraphs(html: string): string {
  return html
    .replace(/<p>\s*(?:&nbsp;|<strong>\s*<\/strong>)?\s*<\/p>/gi, "")
    .replace(/(\s*<br\s*\/?>\s*){3,}/gi, "<br><br>");
}

/** Remove inline style attributes (often break dark mode / layout). */
export function stripInlineStyles(html: string): string {
  return html
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sdata-[a-z-]+="[^"]*"/gi, "");
}

/** Rewrite absolute URLs pointing to the WP install so images still load. */
export function rewriteWpUrls(html: string): string {
  return html.replace(
    /http:\/\/www\.saifabdelfattah\.net/gi,
    "https://www.saifabdelfattah.net"
  );
}

/** Full cleanup pipeline suitable for rendering legacy WP pages. */
export function cleanWpHtml(html: string): string {
  let out = html;
  out = stripScriptsAndStyles(out);
  out = unwrapElementorDivs(out);
  out = stripShortcodes(out);
  out = stripInlineStyles(out);
  out = rewriteWpUrls(out);
  out = collapseEmptyParagraphs(out);
  return out.trim();
}
