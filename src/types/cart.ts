export type ShippingZone = 'jabodetabek' | 'jawa' | 'luar-jawa';

export type ShippingService = 'reguler' | 'sameday';

export type PaymentMethod = 'va-bank' | 'qris' | 'cod';

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface PromoCode {
  code: string;
  label: string;
  type: 'percent' | 'fixed';
  value: number;
  minSubtotal: number;
  active: boolean;
}

export interface HomePromoBanner {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  ctaLabel: string;
  ctaHref: string;
  promoCode?: string;
  active: boolean;
}

