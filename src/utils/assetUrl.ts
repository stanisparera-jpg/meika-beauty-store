/**
 * Resolve static public paths against Vite BASE_URL so assets load cleanly
 * both at root ("/") and under subpaths such as GitHub Pages ("/meika-beauty-store/").
 */
export function resolveAssetUrl(path: string, baseOverride?: string): string {
  const trimmed = path.trim();
  if (!trimmed) return '';
  if (/^(javascript|vbscript):/i.test(trimmed)) return '';
  if (/^data:/i.test(trimmed)) {
    return /^data:image\//i.test(trimmed) ? trimmed : '';
  }
  if (/^(https?:|blob:)/i.test(trimmed)) return trimmed;

  const rawBase = baseOverride ?? import.meta.env.BASE_URL ?? '/';
  const normalizedBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;

  if (normalizedBase !== '/' && trimmed.startsWith(normalizedBase)) {
    return trimmed;
  }
  return `${normalizedBase}${cleanPath}`;
}

