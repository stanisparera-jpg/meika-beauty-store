import { describe, expect, it } from 'vitest';
import { resolveAssetUrl } from './assetUrl';

describe('resolveAssetUrl', () => {
  it('keeps root-relative asset paths working at root base "/"', () => {
    expect(resolveAssetUrl('/images/products/mk-01.svg', '/')).toBe('/images/products/mk-01.svg');
    expect(resolveAssetUrl('images/products/mk-01.svg', '/')).toBe('/images/products/mk-01.svg');
  });

  it('prefixes subpath base cleanly for GitHub Pages deployments', () => {
    expect(resolveAssetUrl('/images/hero/hero-beauty-studio.svg', '/meika-beauty-store/')).toBe(
      '/meika-beauty-store/images/hero/hero-beauty-studio.svg',
    );
    expect(
      resolveAssetUrl('/meika-beauty-store/images/products/mk-02.svg', '/meika-beauty-store/'),
    ).toBe('/meika-beauty-store/images/products/mk-02.svg');
  });

  it('leaves external URLs, data URIs, and empty values untouched', () => {
    expect(resolveAssetUrl('https://example.com/demo.png', '/meika-beauty-store/')).toBe(
      'https://example.com/demo.png',
    );
    expect(resolveAssetUrl('data:image/svg+xml;base64,abc', '/meika-beauty-store/')).toBe(
      'data:image/svg+xml;base64,abc',
    );
    expect(resolveAssetUrl('', '/meika-beauty-store/')).toBe('');
  });
});
