/**
 * Resolve static public paths against Vite BASE_URL so assets load cleanly
 * both at root ("/") and under subpaths such as GitHub Pages ("/meika-beauty-store/").
 */
export function resolveAssetUrl(path: string, baseOverride?: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/.test(path)) return path;

  const rawBase = baseOverride ?? import.meta.env.BASE_URL ?? '/';
  const normalizedBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (normalizedBase !== '/' && path.startsWith(normalizedBase)) {
    return path;
  }
  return `${normalizedBase}${cleanPath}`;
}
