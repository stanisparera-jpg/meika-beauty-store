import { describe, expect, it } from 'vitest';
import { SEED_PRODUCTS } from '../data/products';
import {
  calculateCartPricing,
  clampQuantityToStock,
  validateAndComputePromo,
} from './cartPricingService';
import type { PromoCode } from '../types/cart';

const MEIKA10: PromoCode = {
  code: 'MEIKA10',
  label: 'Diskon 10% Member Kurasi',
  type: 'percent',
  value: 10,
  minSubtotal: 100000,
  active: true,
};

describe('cartPricingService calculations', () => {
  it('uses discounted effective prices as subtotal, applies promo, and computes shipping by zone', () => {
    const mk01 = SEED_PRODUCTS.find((p) => p.sku === 'MK-01')!;
    const v1 = mk01.variants[0];
    const unit = mk01.discountPrice ?? mk01.price; // Rp 139.000

    const res = calculateCartPricing(
      [{ productId: mk01.id, variantId: v1.id, quantity: 1 }],
      SEED_PRODUCTS,
      'jabodetabek',
      'reguler',
      MEIKA10,
    );

    expect(res.subtotal).toBe(unit);
    expect(res.productSavings).toBe(mk01.price - unit);
    expect(res.promoDiscount).toBe(Math.round(unit * 0.1));
    expect(res.shippingCost).toBe(12000);
    expect(res.grandTotal).toBe(unit - res.promoDiscount + 12000);
  });

  it('grants free reguler Jabodetabek shipping at >= Rp 250.000 post-promo and enforces variant stock cap', () => {
    const mk02 = SEED_PRODUCTS.find((p) => p.sku === 'MK-02')!;
    const v1 = mk02.variants[0];
    const res = calculateCartPricing(
      [{ productId: mk02.id, variantId: v1.id, quantity: 2 }],
      SEED_PRODUCTS,
      'jabodetabek',
      'reguler',
    );
    expect(res.isFreeShipping).toBe(true);
    expect(res.shippingCost).toBe(0);
    expect(clampQuantityToStock(99, 7)).toBe(7);
    expect(clampQuantityToStock(0, 7)).toBe(1);
    expect(validateAndComputePromo(MEIKA10, 50000).valid).toBe(false);
  });
});

