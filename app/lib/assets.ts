const assetBaseUrl = (process.env.NEXT_PUBLIC_ASSET_BASE_URL || 'https://assets.palworldguide.net').replace(/\/$/, '');
const palAssetBaseUrl = (process.env.NEXT_PUBLIC_PAL_ASSET_BASE_URL || '').replace(/\/$/, '');

/** Resolve a public asset to R2 when configured, with a local public/ fallback. */
export function assetUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return assetBaseUrl ? `${assetBaseUrl}${normalized}` : normalized;
}

/** Resolve a Pal image to the dedicated Pal CDN, or keep the local public path. */
export function palAssetUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return palAssetBaseUrl ? `${palAssetBaseUrl}${normalized}` : normalized;
}
