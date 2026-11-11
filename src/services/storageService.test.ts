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
});

