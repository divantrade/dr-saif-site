# Scripts

## `apply-axes-to-sanity.ts` — apply the new thematic taxonomy

Reads `docs/cork/reclassification-map.json` and writes:

- 7 `intellectualAxis` documents (deterministic ids: `axis-1` … `axis-7`)
- 6 `series` documents (ids: `series-<slug>`)
- patches every post (looked up by `legacyId`) with `axis._ref`,
  `series._ref` (when applicable), and `seriesNumber`.

Idempotent — uses `createOrReplace` for taxonomy nodes and batched
`patch` transactions for posts. Re-running is safe.

```bash
npm run apply:axes:dry          # plan only
npm run apply:axes              # write
npm run apply:axes -- --only=taxonomy   # axes & series only
npm run apply:axes -- --only=posts      # patch posts only
```

Prereqs:
- Posts must already be in Sanity with `legacyId` set
  (run `npm run migrate:sanity` first).
- `SANITY_WRITE_TOKEN` in `.env.local` with Editor permission.

---

## `migrate-to-sanity.ts` — one-shot WordPress → Sanity migration

### Before running

1. Make sure `.env.local` exists at the repo root and contains a working `SANITY_WRITE_TOKEN` (Editor permission or higher).
2. You need outbound network access to both `api.sanity.io` and `www.saifabdelfattah.net` (for image downloads).
3. Run once — it is idempotent. Safe to stop and re-run.

### Commands

```bash
# Offline dry run — parses JSON and prints what would happen.
# Does not touch Sanity at all. Good for a pre-flight check.
npm run migrate:sanity:dry

# Real migration.
npm run migrate:sanity

# Skip downloading + uploading featured images (faster, but posts get no hero image).
npm run migrate:sanity -- --skip-images
```

### What gets migrated

| Source (`public/data/*.json`) | Target Sanity type |
|---|---|
| `categories.json` | `category` (with parent references resolved) |
| `tags.json` | `tag` |
| `posts.json` | `post` (rawHtml preserved exactly; slugs preserved for SEO) |
| `media.json` referenced by `post.featured_media` | image assets in Sanity CDN |

Every migrated document gets `legacyId` set to its WordPress id, and `isMigrated: true`. Re-running the script skips anything already present.

### After a successful run

1. Open Sanity Studio at `http://localhost:3000/studio/saif` (start dev server with `npm run dev`) and verify posts / categories / tags look right.
2. Revoke the temporary `SANITY_WRITE_TOKEN` (Sanity → API → Tokens) and create a fresh one. The fresh one only needs to exist on deploy environments that need it (usually none — the public site uses an anonymous read-only client).
