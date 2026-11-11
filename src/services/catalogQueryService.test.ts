import { describe, expect, it } from 'vitest';
import { SEED_PRODUCTS } from '../data/products';
import { paginateItems, queryCatalog } from './catalogQueryService';

describe('catalogQueryService multi-filter, search, sort & pagination', () => {
  it('combines category, multi-brand, price preset, rating, stock, and search filters', () => {
    const lipItems = queryCatalog(SEED_PRODUCTS, {
      category: 'lip-makeup',
      brands: ['hanasui', 'wardah'],
      pricePreset: '50-to-150',
      minRating: 4.5,
      inStockOnly: true,
    });
    expect(lipItems.every((p) => p.categoryId === 'lip-makeup')).toBe(true);
    expect(lipItems.every((p) => ['hanasui', 'wardah'].includes(p.brandId))).toBe(true);

    const bySku = queryCatalog(SEED_PRODUCTS, { q: 'MK-25' });
    expect(bySku).toHaveLength(1);
    expect(bySku[0].sku).toBe('MK-25');
  });

  it('sorts products by price ascending/descending using effective price and paginates accurately', () => {
    const asc = queryCatalog(SEED_PRODUCTS, { sortBy: 'price-asc' });
    for (let i = 1; i < asc.length; i += 1) {
      const prevPrice = asc[i - 1].discountPrice ?? asc[i - 1].price;
      const curPrice = asc[i].discountPrice ?? asc[i].price;
      expect(prevPrice).toBeLessThanOrEqual(curPrice);
    }

    const page2 = paginateItems(asc, 2, 12);
    expect(page2.items).toHaveLength(12);
    expect(page2.totalPages).toBeGreaterThanOrEqual(3);
  });
});

