import type {
  CartItem,
  PromoCode,
  ShippingService,
  ShippingZone,
} from '../types/cart';
import type { Product, ProductVariant } from '../types/product';
import { getEffectivePrice } from '../utils/formatters';

export const FREE_SHIPPING_THRESHOLD_IDR = 250000;

export const SHIPPING_ZONE_OPTIONS: Array<{
  zone: ShippingZone;
  label: string;
  regulerRate: number;
  samedayRate?: number;
}> = [
  {
    zone: 'jabodetabek',
    label: 'Jabodetabek (Gratis Reguler >= Rp 250.000)',
    regulerRate: 12000,
    samedayRate: 22000,
  },
  {
    zone: 'jawa',
    label: 'Pulau Jawa (Non-Jabodetabek)',
    regulerRate: 18000,
  },
  {
    zone: 'luar-jawa',
    label: 'Luar Pulau Jawa (Nasional)',
    regulerRate: 28000,
  },
];

export interface CartPricedLine {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  lineSavings: number;
}

export interface CartPricingSummary {
  lines: CartPricedLine[];
  totalUnits: number;
  subtotal: number;
  productSavings: number;
  promoDiscount: number;
  appliedPromoCode?: string;
  promoMessage?: string;
  shippingCost: number;
  isFreeShipping: boolean;
  grandTotal: number;
}

export function clampQuantityToStock(requestedQty: number, variantStock: number): number {
  if (variantStock <= 0) return 0;
  const safeQty = Math.floor(Number.isFinite(requestedQty) ? requestedQty : 1);
  return Math.max(1, Math.min(safeQty, variantStock));
}

export function validateAndComputePromo(
  promo: PromoCode | undefined,
  subtotal: number,
): { valid: boolean; discount: number; reason?: string } {
  if (!promo) {
    return { valid: false, discount: 0, reason: 'Kode promo tidak ditemukan.' };
  }
  if (!promo.active) {
    return { valid: false, discount: 0, reason: 'Kode promo sedang tidak aktif.' };
  }
  if (subtotal < promo.minSubtotal) {
    return {
      valid: false,
      discount: 0,
      reason: `Minimal belanja Rp ${promo.minSubtotal.toLocaleString('id-ID')} untuk memakai ${promo.code}.`,
    };
  }
  const rawDiscount =
    promo.type === 'percent' ? Math.round((subtotal * promo.value) / 100) : promo.value;
  return {
    valid: true,
    discount: Math.min(subtotal, Math.max(0, rawDiscount)),
  };
}

export function computeShippingCost(
  zone: ShippingZone,
  service: ShippingService,
  subtotalAfterPromo: number,
): { shippingCost: number; isFreeShipping: boolean } {
  if (subtotalAfterPromo <= 0) {
    return { shippingCost: 0, isFreeShipping: false };
  }
  const zoneMeta =
    SHIPPING_ZONE_OPTIONS.find((item) => item.zone === zone) ?? SHIPPING_ZONE_OPTIONS[0];
  if (zone === 'jabodetabek' && service === 'sameday' && zoneMeta.samedayRate) {
    return { shippingCost: zoneMeta.samedayRate, isFreeShipping: false };
  }
  if (zone === 'jabodetabek' && subtotalAfterPromo >= FREE_SHIPPING_THRESHOLD_IDR) {
    return { shippingCost: 0, isFreeShipping: true };
  }
  return { shippingCost: zoneMeta.regulerRate, isFreeShipping: false };
}

export function calculateCartPricing(
  items: CartItem[],
  products: Product[],
  zone: ShippingZone,
  service: ShippingService,
  promo?: PromoCode,
): CartPricingSummary {
  const lines: CartPricedLine[] = [];
  let subtotal = 0;
  let productSavings = 0;
  let totalUnits = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;
    const variant = product.variants.find((v) => v.id === item.variantId) ?? product.variants[0];
    if (!variant || variant.stock <= 0) continue;

    const quantity = clampQuantityToStock(item.quantity, variant.stock);
    if (quantity <= 0) continue;

    const unitPrice = getEffectivePrice(product, variant);
    const compareBase = variant.priceOverride ? variant.priceOverride : product.price;
    const savingsPerUnit = Math.max(0, compareBase - unitPrice);
    const lineTotal = unitPrice * quantity;
    const lineSavings = savingsPerUnit * quantity;

    lines.push({
      product,
      variant,
      quantity,
      unitPrice,
      lineTotal,
      lineSavings,
    });

    subtotal += lineTotal;
    productSavings += lineSavings;
    totalUnits += quantity;
  }

  let promoDiscount = 0;
  let appliedPromoCode: string | undefined;
  let promoMessage: string | undefined;

  if (promo) {
    const check = validateAndComputePromo(promo, subtotal);
    if (check.valid) {
      promoDiscount = check.discount;
      appliedPromoCode = promo.code;
      promoMessage = `${promo.code} terpasang`;
    } else {
      promoMessage = check.reason;
    }
  }

  const subtotalAfterPromo = Math.max(0, subtotal - promoDiscount);
  const { shippingCost, isFreeShipping } = computeShippingCost(zone, service, subtotalAfterPromo);

  return {
    lines,
    totalUnits,
    subtotal,
    productSavings,
    promoDiscount,
    appliedPromoCode,
    promoMessage,
    shippingCost,
    isFreeShipping,
    grandTotal: subtotalAfterPromo + shippingCost,
  };
}

