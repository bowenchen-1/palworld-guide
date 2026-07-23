# Palworld Guide

An English-language, fan-made Palworld strategy website built with Next.js, React, TypeScript, and Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production checks

```bash
npm test
```

## Local R2 asset sync

Only the resources explicitly listed in `config/r2-assets.json` are published to R2. This deliberately does not upload all of `public/`. Add a new asset to that file before it can be synced.

Audit all three R2 allowlists and report intentionally unlisted files:

```bash
npm run r2:audit
```

Set the following values in your local shell or an ignored `.env.local` file (never commit credentials):

```bash
R2_BUCKET=palworldguide-assets
ASSET_BASE_URL=https://assets.palworldguide.net
NEXT_PUBLIC_PAL_ASSET_BASE_URL=https://cdn.palworldguide.net
CLOUDFLARE_ZONE_ID=your-zone-id
CLOUDFLARE_CACHE_PURGE_TOKEN=your-cache-purge-token
```

Run a one-time sync:

```bash
npm run r2:sync -- --apply
```

Run a no-write inspection (it prints each configured file, R2 key, byte size, SHA-256 and target URL):

```bash
npm run r2:sync -- --dry-run
```

Map tile migration uses a separate allowlist and manifest. It is dry-run by default; add `--apply` only after reviewing the output:

```bash
npm run r2:map
npm run r2:map -- --apply
```

Pal images use a separate allowlist and CDN manifest so map assets remain on `assets.palworldguide.net`:

```bash
npm run r2:pals
npm run r2:pals -- --apply
```

Pal images use `public, max-age=86400` while their fixed filenames remain subject to content updates.

The GitHub Actions sync audits and applies the ordinary, map, and Pal allowlists separately. It never deletes local files or R2 objects that are absent from the current scan.

Watch configured assets continuously:

```bash
npm run r2:watch
```

After an editor event, the watcher waits 1.2 seconds, then samples file size and modification time twice 0.5 seconds apart. It uploads only if both samples match. It ignores editor temporary files and coalesces rapid saves; atomic rename-overwrites are caught by watching each registered asset directory. Before every upload it validates existence, bytes, SHA-256, and JSON syntax. After upload it verifies the custom-domain response (200, size, type, cache policy, ETag), then purges that exact URL through Cloudflare's API. A failed purge makes the sync fail.

JSON uses `public, max-age=300, must-revalidate`; images use `public, max-age=31536000, immutable`. The fixed asset URL is purged after every changed upload, so a changed image is visible despite long browser/CDN caching. ETags are only presence-checked and are never treated as SHA-256 values.

The manifest at `docs/r2-asset-manifest.json` is written atomically. Repeated syncs skip an asset only when its recorded SHA-256 is unchanged *and* the remote response still passes validation. No local files or R2 objects are deleted by these commands.

To roll back a published asset, optionally stop the watcher with `Ctrl+C`, restore the file using `git checkout` or `git revert`, then restart the watcher (or run `npm run r2:sync`). The restored local version is uploaded and its cache entry is purged. Git remains the history and rollback system; R2 is only the public delivery copy.

## Deploy to Vercel

Import this GitHub repository into Vercel. Vercel will automatically detect Next.js and use the standard `next build` command. No environment variables are required for the current version.
