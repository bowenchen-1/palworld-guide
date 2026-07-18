const assetBaseUrl = (process.env.NEXT_PUBLIC_ASSET_BASE_URL || '').replace(/\/$/, '');

/** Resolve a public asset to R2 when configured, with a local public/ fallback. */
export function assetUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return assetBaseUrl ? `${assetBaseUrl}${normalized}` : normalized;
}
