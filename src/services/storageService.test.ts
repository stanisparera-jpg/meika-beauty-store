import { describe, expect, it } from 'vitest';
import { MEIKA_STORAGE_KEYS, readJson, writeJson } from './storageService';

describe('storageService', () => {
  it('writes and reads structured JSON values cleanly', () => {
    writeJson(MEIKA_STORAGE_KEYS.WISHLIST, ['mk-01', 'mk-11']);
    expect(readJson<string[]>(MEIKA_STORAGE_KEYS.WISHLIST, [])).toEqual(['mk-01', 'mk-11']);
  });

  it('returns fallback safely without throwing when stored JSON is corrupted', () => {
    window.localStorage.setItem(MEIKA_STORAGE_KEYS.CART, '{broken-json');
    expect(readJson(MEIKA_STORAGE_KEYS.CART, [{ productId: 'fallback', variantId: 'v1', quantity: 1 }])).toEqual([
      { productId: 'fallback', variantId: 'v1', quantity: 1 },
    ]);
  });

  it('guards against tampered localStorage JSON with mismatched container types or failing validator', () => {
    window.localStorage.setItem(MEIKA_STORAGE_KEYS.CART, JSON.stringify({ evil: true }));
    expect(readJson(MEIKA_STORAGE_KEYS.CART, [])).toEqual([]);

    window.localStorage.setItem(MEIKA_STORAGE_KEYS.ANNOUNCEMENT_DISMISSED, JSON.stringify('yes'));
    expect(readJson(MEIKA_STORAGE_KEYS.ANNOUNCEMENT_DISMISSED, false)).toBe(false);

    window.localStorage.setItem(
      MEIKA_STORAGE_KEYS.ADMIN_SESSION,
      JSON.stringify({ id: 'forged', role: 'admin' }),
    );
    const isStrict = (val: unknown): val is { id: string; role: 'admin' } =>
      Boolean(val && typeof val === 'object' && (val as { id?: string }).id === 'admin-real');
    expect(readJson<{ id: string; role: 'admin' } | null>(MEIKA_STORAGE_KEYS.ADMIN_SESSION, null, isStrict)).toBeNull();
  });
});

