import type { Product, ProductVariant } from '../types/product';

export function formatIDR(amount: number): string {
  const safe = Number.isFinite(amount) && amount > 0 ? Math.round(amount) : 0;
  return `Rp ${safe.toLocaleString('id-ID')}`;
}

export function calculateDiscountPercent(price: number, discountPrice?: number): number {
  if (!discountPrice || discountPrice <= 0 || discountPrice >= price || price <= 0) {
    return 0;
  }
  return Math.round(((price - discountPrice) / price) * 100);
}

export function getEffectivePrice(product: Product, variant?: ProductVariant): number {
  if (variant?.priceOverride && variant.priceOverride > 0) {
    return variant.priceOverride;
  }
  if (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price) {
    return product.discountPrice;
  }
  return product.price;
}

export function getProductTotalStock(product: Product): number {
  return product.variants.reduce((total, variant) => total + Math.max(0, variant.stock), 0);
}

export function generateOrderId(date: Date = new Date(), sequence?: number): string {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const seq =
    sequence !== undefined
      ? Math.max(0, Math.min(9999, Math.floor(sequence)))
      : Math.floor(1000 + Math.random() * 8999);
  return `MK-${yyyy}${mm}${dd}-${String(seq).padStart(4, '0')}`;
}

