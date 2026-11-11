import { describe, expect, it } from 'vitest';
import {
  calculateDiscountPercent,
  formatIDR,
  generateOrderId,
  getEffectivePrice,
  getProductTotalStock,
} from './formatters';
import type { Product } from '../types/product';

describe('formatters utility', () => {
  it('formats IDR values cleanly with Indonesian dot grouping and no decimals', () => {
    expect(formatIDR(139000)).toBe('Rp 139.000');
    expect(formatIDR(28500)).toBe('Rp 28.500');
    expect(formatIDR(0)).toBe('Rp 0');
    expect(formatIDR(-5000)).toBe('Rp 0');
  });

  it('computes rounded discount percentage only when discountPrice is lower than price', () => {
    expect(calculateDiscountPercent(169000, 139000)).toBe(18);
    expect(calculateDiscountPercent(45000, undefined)).toBe(0);
    expect(calculateDiscountPercent(45000, 50000)).toBe(0);
  });

  it('resolves effective unit price respecting variant priceOverride then product discountPrice', () => {
    const sample = {
      id: 'mk-25',
      price: 149000,
      discountPrice: 129000,
      variants: [
        { id: 'v1', label: '30g Jar', skuSuffix: '30G', stock: 10 },
        { id: 'v2', label: '80g Value Jar', skuSuffix: '80G', stock: 5, priceOverride: 215000 },
      ],
    } as Product;

    expect(getEffectivePrice(sample, sample.variants[0])).toBe(129000);
    expect(getEffectivePrice(sample, sample.variants[1])).toBe(215000);
    expect(getProductTotalStock(sample)).toBe(15);
  });

  it('generates deterministic MEIKA order ID format MK-YYYYMMDD-XXXX', () => {
    const id = generateOrderId(new Date('2026-11-11T07:00:00Z'), 42);
    expect(id).toBe('MK-20261111-0042');
    expect(id).toMatch(/^MK-\d{8}-\d{4}$/);
  });
});

