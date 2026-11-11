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

  it('validates CANTIK20 Rp 150.000 minimum spend, rejects inactive promos, and caps duplicate cart items cleanly', () => {
    const CANTIK20: PromoCode = {
      code: 'CANTIK20',
      label: 'Potongan Rp 20.000',
      type: 'fixed',
      value: 20000,
      minSubtotal: 150000,
      active: true,
    };

    expect(validateAndComputePromo(CANTIK20, 149000).valid).toBe(false);
    expect(validateAndComputePromo(CANTIK20, 150000)).toEqual({ valid: true, discount: 20000 });
    expect(validateAndComputePromo({ ...CANTIK20, active: false }, 200000).valid).toBe(false);

    const mk01 = SEED_PRODUCTS.find((p) => p.sku === 'MK-01')!;
    const v1 = mk01.variants[0]; // stock 14
    const dupRes = calculateCartPricing(
      [
        { productId: mk01.id, variantId: v1.id, quantity: 10 },
        { productId: mk01.id, variantId: v1.id, quantity: 10 },
      ],
      SEED_PRODUCTS,
      'jabodetabek',
      'reguler',
    );
    expect(dupRes.lines).toHaveLength(1);
    expect(dupRes.lines[0].quantity).toBe(v1.stock);
    expect(dupRes.totalUnits).toBe(v1.stock);
    expect(dupRes.hasStockAdjustment).toBe(true);
  });
});

