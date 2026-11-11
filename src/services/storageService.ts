export const MEIKA_STORAGE_KEYS = {
  PRODUCTS: 'meika_v1_products',
  BRANDS: 'meika_v1_brands',
  PROMO_CODES: 'meika_v1_promo_codes',
  HOME_BANNERS: 'meika_v1_home_banners',
  CART: 'meika_v1_cart',
  WISHLIST: 'meika_v1_wishlist',
  ORDERS: 'meika_v1_orders',
  CUSTOMER_SESSION: 'meika_v1_customer_session',
  ADMIN_SESSION: 'meika_v1_admin_session',
  NEWSLETTER: 'meika_v1_newsletter',
  UT_ENTRIES: 'meika_v1_ut_entries',
  ANNOUNCEMENT_DISMISSED: 'meika_v1_announcement_dismissed',
} as const;

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage removal errors in restricted environments
  }
}

export function resetAllMeikaStorage(): void {
  for (const key of Object.values(MEIKA_STORAGE_KEYS)) {
    removeKey(key);
  }
}

