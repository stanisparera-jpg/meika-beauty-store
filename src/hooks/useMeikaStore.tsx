import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { SEED_BRANDS } from '../data/brands';
import { SEED_PRODUCTS } from '../data/products';
import {
  SEED_DEMO_ORDERS,
  SEED_HOME_BANNERS,
  SEED_PROMO_CODES,
} from '../data/promotions';
import { EMPTY_UT_SLOTS } from '../data/prototypeDocs';
import {
  isValidAdminSession,
  isValidCustomerSession,
  loginAdmin,
  loginCustomer,
  type AuthResult,
} from '../services/authService';
import {
  calculateCartPricing,
  clampQuantityToStock,
} from '../services/cartPricingService';
import { validateNewsletterEmail } from '../services/checkoutValidator';
import {
  applyOrderStockChange,
  createOrderFromCheckout,
} from '../services/orderLifecycleService';
import {
  MEIKA_STORAGE_KEYS,
  readJson,
  removeKey,
  resetAllMeikaStorage,
  writeJson,
} from '../services/storageService';
import type { AdminSession, CustomerSession } from '../types/auth';
import type { Brand } from '../types/brand';
import type {
  CartItem,
  HomePromoBanner,
  PaymentMethod,
  PromoCode,
} from '../types/cart';
import type { UsabilityTestEntry } from '../types/marketing';
import type {
  CustomerShippingDetails,
  Order,
  OrderStatus,
} from '../types/order';
import type { Product } from '../types/product';

interface MeikaStoreValue {
  products: Product[];
  brands: Brand[];
  promoCodes: PromoCode[];
  homeBanners: HomePromoBanner[];
  cart: CartItem[];
  appliedPromoCode: string | null;
  wishlist: string[];
  orders: Order[];
  customerSession: CustomerSession | null;
  adminSession: AdminSession | null;
  newsletterEmails: string[];
  utEntries: UsabilityTestEntry[];
  announcementDismissed: boolean;
  cartCount: number;
  wishlistCount: number;
  activePromoObject: PromoCode | undefined;

  dismissAnnouncement: () => void;
  addToCart: (productId: string, variantId?: string, quantity?: number) => void;
  updateCartQty: (productId: string, variantId: string, nextQty: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  applyPromoCode: (codeInput: string) => { ok: boolean; message: string };
  clearPromoCode: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (customer: CustomerShippingDetails, paymentMethod: PaymentMethod) => Order | null;
  signInCustomer: (email: string, password: string) => AuthResult<CustomerSession>;
  signOutCustomer: () => void;
  signInAdmin: (email: string, password: string) => AuthResult<AdminSession>;
  signOutAdmin: () => void;
  subscribeNewsletter: (email: string) => { ok: boolean; error?: string };

  adminSaveProduct: (product: Product) => void;
  adminDeleteProduct: (productId: string) => void;
  adminUpdateVariantStock: (productId: string, variantId: string, stock: number) => void;
  adminSavePromoCode: (promo: PromoCode) => void;
  adminTogglePromoActive: (code: string) => void;
  adminToggleBannerActive: (bannerId: string) => void;
  adminUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;

  saveUtEntry: (index: number, entry: UsabilityTestEntry) => void;
  resetUtEntries: () => void;
  resetAllDemoData: () => void;
}

const MeikaStoreContext = createContext<MeikaStoreValue | null>(null);

export function MeikaStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    readJson<Product[]>(MEIKA_STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS),
  );
  const [brands] = useState<Brand[]>(() =>
    readJson<Brand[]>(MEIKA_STORAGE_KEYS.BRANDS, SEED_BRANDS),
  );
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() =>
    readJson<PromoCode[]>(MEIKA_STORAGE_KEYS.PROMO_CODES, SEED_PROMO_CODES),
  );
  const [homeBanners, setHomeBanners] = useState<HomePromoBanner[]>(() =>
    readJson<HomePromoBanner[]>(MEIKA_STORAGE_KEYS.HOME_BANNERS, SEED_HOME_BANNERS),
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    readJson<CartItem[]>(
      MEIKA_STORAGE_KEYS.CART,
      [],
      (val): val is CartItem[] =>
        Array.isArray(val) &&
        val.every(
          (i) =>
            Boolean(i) &&
            typeof i === 'object' &&
            typeof (i as CartItem).productId === 'string' &&
            typeof (i as CartItem).variantId === 'string' &&
            typeof (i as CartItem).quantity === 'number' &&
            Number.isFinite((i as CartItem).quantity),
        ),
    ),
  );
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(() =>
    readJson<string | null>(
      MEIKA_STORAGE_KEYS.APPLIED_PROMO,
      null,
      (val): val is string | null => val === null || (typeof val === 'string' && val.trim().length > 0),
    ),
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readJson<string[]>(
      MEIKA_STORAGE_KEYS.WISHLIST,
      [],
      (val): val is string[] => Array.isArray(val) && val.every((x) => typeof x === 'string'),
    ),
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    readJson<Order[]>(
      MEIKA_STORAGE_KEYS.ORDERS,
      SEED_DEMO_ORDERS,
      (val): val is Order[] =>
        Array.isArray(val) &&
        val.every(
          (o) =>
            Boolean(o) &&
            typeof o === 'object' &&
            typeof (o as Order).orderId === 'string' &&
            Array.isArray((o as Order).items),
        ),
    ),
  );
  const [customerSession, setCustomerSession] = useState<CustomerSession | null>(() =>
    readJson<CustomerSession | null>(
      MEIKA_STORAGE_KEYS.CUSTOMER_SESSION,
      null,
      (val): val is CustomerSession | null => val === null || isValidCustomerSession(val),
    ),
  );
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() =>
    readJson<AdminSession | null>(
      MEIKA_STORAGE_KEYS.ADMIN_SESSION,
      null,
      (val): val is AdminSession | null => val === null || isValidAdminSession(val),
    ),
  );
  const [newsletterEmails, setNewsletterEmails] = useState<string[]>(() =>
    readJson<string[]>(
      MEIKA_STORAGE_KEYS.NEWSLETTER,
      [],
      (val): val is string[] => Array.isArray(val) && val.every((x) => typeof x === 'string'),
    ),
  );
  const [utEntries, setUtEntries] = useState<UsabilityTestEntry[]>(() =>
    readJson<UsabilityTestEntry[]>(
      MEIKA_STORAGE_KEYS.UT_ENTRIES,
      EMPTY_UT_SLOTS,
      (val): val is UsabilityTestEntry[] =>
        Array.isArray(val) &&
        val.length === EMPTY_UT_SLOTS.length &&
        val.every(
          (entry) =>
            Boolean(entry) &&
            typeof entry === 'object' &&
            typeof (entry as UsabilityTestEntry).testerSlot === 'string' &&
            typeof (entry as UsabilityTestEntry).respondentName === 'string' &&
            typeof (entry as UsabilityTestEntry).completedTasks === 'string',
        ),
    ),
  );
  const [announcementDismissed, setAnnouncementDismissed] = useState<boolean>(() =>
    readJson<boolean>(MEIKA_STORAGE_KEYS.ANNOUNCEMENT_DISMISSED, false),
  );

  const dismissAnnouncement = useCallback(() => {
    setAnnouncementDismissed(true);
    writeJson(MEIKA_STORAGE_KEYS.ANNOUNCEMENT_DISMISSED, true);
  }, []);

  const persistProducts = useCallback((next: Product[]) => {
    setProducts(next);
    writeJson(MEIKA_STORAGE_KEYS.PRODUCTS, next);
  }, []);

  const persistCart = useCallback((next: CartItem[]) => {
    setCart(next);
    writeJson(MEIKA_STORAGE_KEYS.CART, next);
  }, []);

  const addToCart = useCallback(
    (productId: string, variantId?: string, quantity = 1) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      const variant =
        (variantId ? product.variants.find((v) => v.id === variantId) : undefined) ??
        product.variants[0];
      if (!variant || variant.stock <= 0) return;

      setCart((prev) => {
        const existing = prev.find(
          (item) => item.productId === product.id && item.variantId === variant.id,
        );
        const nextQty = clampQuantityToStock((existing?.quantity ?? 0) + quantity, variant.stock);
        const next = existing
          ? prev.map((item) =>
              item.productId === product.id && item.variantId === variant.id
                ? { ...item, quantity: nextQty }
                : item,
            )
          : [...prev, { productId: product.id, variantId: variant.id, quantity: nextQty }];
        writeJson(MEIKA_STORAGE_KEYS.CART, next);
        return next;
      });
    },
    [products],
  );

  const updateCartQty = useCallback(
    (productId: string, variantId: string, nextQty: number) => {
      const product = products.find((p) => p.id === productId);
      const variant = product?.variants.find((v) => v.id === variantId);
      if (!variant) return;

      if (nextQty <= 0) {
        setCart((prev) => {
          const next = prev.filter(
            (i) => !(i.productId === productId && i.variantId === variantId),
          );
          writeJson(MEIKA_STORAGE_KEYS.CART, next);
          return next;
        });
        return;
      }

      const clamped = clampQuantityToStock(nextQty, variant.stock);
      setCart((prev) => {
        const next = prev.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: clamped }
            : item,
        );
        writeJson(MEIKA_STORAGE_KEYS.CART, next);
        return next;
      });
    },
    [products],
  );

  const removeFromCart = useCallback((productId: string, variantId: string) => {
    setCart((prev) => {
      const next = prev.filter((i) => !(i.productId === productId && i.variantId === variantId));
      writeJson(MEIKA_STORAGE_KEYS.CART, next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    persistCart([]);
  }, [persistCart]);

  const applyPromoCode = useCallback(
    (codeInput: string) => {
      const code = codeInput.trim().toUpperCase();
      if (!code) return { ok: false, message: 'Masukkan kode promo terlebih dahulu.' };
      const match = promoCodes.find((p) => p.code.toUpperCase() === code && p.active);
      if (!match) {
        return { ok: false, message: `Kode promo "${code}" tidak tersedia atau nonaktif.` };
      }
      setAppliedPromoCode(match.code);
      writeJson(MEIKA_STORAGE_KEYS.APPLIED_PROMO, match.code);
      return { ok: true, message: `Kode promo ${match.code} berhasil diterapkan.` };
    },
    [promoCodes],
  );

  const clearPromoCode = useCallback(() => {
    setAppliedPromoCode(null);
    removeKey(MEIKA_STORAGE_KEYS.APPLIED_PROMO);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      writeJson(MEIKA_STORAGE_KEYS.WISHLIST, next);
      return next;
    });
  }, []);

  const activePromoObject = useMemo(
    () =>
      appliedPromoCode
        ? promoCodes.find((p) => p.code.toUpperCase() === appliedPromoCode.toUpperCase())
        : undefined,
    [appliedPromoCode, promoCodes],
  );

  const placeOrder = useCallback(
    (customer: CustomerShippingDetails, paymentMethod: PaymentMethod): Order | null => {
      if (cart.length === 0) return null;
      const { order, updatedProducts } = createOrderFromCheckout({
        products,
        cartItems: cart,
        customer,
        paymentMethod,
        promo: activePromoObject,
        customerId: customerSession?.id,
      });
      if (order.items.length === 0) return null;

      persistProducts(updatedProducts);
      const nextOrders = [order, ...orders];
      setOrders(nextOrders);
      writeJson(MEIKA_STORAGE_KEYS.ORDERS, nextOrders);
      persistCart([]);
      setAppliedPromoCode(null);
      removeKey(MEIKA_STORAGE_KEYS.APPLIED_PROMO);
      return order;
    },
    [activePromoObject, cart, customerSession?.id, orders, persistCart, persistProducts, products],
  );

  const signInCustomer = useCallback((email: string, password: string) => {
    const res = loginCustomer(email, password);
    if (res.ok) {
      setCustomerSession(res.session);
      writeJson(MEIKA_STORAGE_KEYS.CUSTOMER_SESSION, res.session);
    }
    return res;
  }, []);

  const signOutCustomer = useCallback(() => {
    setCustomerSession(null);
    removeKey(MEIKA_STORAGE_KEYS.CUSTOMER_SESSION);
  }, []);

  const signInAdmin = useCallback((email: string, password: string) => {
    const res = loginAdmin(email, password);
    if (res.ok) {
      setAdminSession(res.session);
      writeJson(MEIKA_STORAGE_KEYS.ADMIN_SESSION, res.session);
    }
    return res;
  }, []);

  const signOutAdmin = useCallback(() => {
    setAdminSession(null);
    removeKey(MEIKA_STORAGE_KEYS.ADMIN_SESSION);
  }, []);

  const subscribeNewsletter = useCallback(
    (emailInput: string) => {
      const error = validateNewsletterEmail(emailInput);
      if (error) return { ok: false, error };
      const normalized = emailInput.trim().toLowerCase();
      if (!newsletterEmails.includes(normalized)) {
        const next = [normalized, ...newsletterEmails];
        setNewsletterEmails(next);
        writeJson(MEIKA_STORAGE_KEYS.NEWSLETTER, next);
      }
      return { ok: true };
    },
    [newsletterEmails],
  );

  const adminSaveProduct = useCallback(
    (product: Product) => {
      const exists = products.some((p) => p.id === product.id);
      const next = exists
        ? products.map((p) => (p.id === product.id ? product : p))
        : [product, ...products];
      persistProducts(next);
    },
    [persistProducts, products],
  );

  const adminDeleteProduct = useCallback(
    (productId: string) => {
      persistProducts(products.filter((p) => p.id !== productId));
      const nextCart = cart.filter((item) => item.productId !== productId);
      if (nextCart.length !== cart.length) {
        persistCart(nextCart);
      }
      const nextWishlist = wishlist.filter((id) => id !== productId);
      if (nextWishlist.length !== wishlist.length) {
        setWishlist(nextWishlist);
        writeJson(MEIKA_STORAGE_KEYS.WISHLIST, nextWishlist);
      }
    },
    [cart, persistCart, persistProducts, products, wishlist],
  );

  const adminUpdateVariantStock = useCallback(
    (productId: string, variantId: string, stock: number) => {
      const safeStock = Math.max(0, Math.floor(stock));
      const next = products.map((p) =>
        p.id === productId
          ? {
              ...p,
              variants: p.variants.map((v) =>
                v.id === variantId ? { ...v, stock: safeStock } : v,
              ),
            }
          : p,
      );
      persistProducts(next);
    },
    [persistProducts, products],
  );

  const adminSavePromoCode = useCallback(
    (promo: PromoCode) => {
      const normalized = { ...promo, code: promo.code.trim().toUpperCase() };
      const exists = promoCodes.some((p) => p.code === normalized.code);
      const next = exists
        ? promoCodes.map((p) => (p.code === normalized.code ? normalized : p))
        : [normalized, ...promoCodes];
      setPromoCodes(next);
      writeJson(MEIKA_STORAGE_KEYS.PROMO_CODES, next);
    },
    [promoCodes],
  );

  const adminTogglePromoActive = useCallback(
    (code: string) => {
      const next = promoCodes.map((p) => (p.code === code ? { ...p, active: !p.active } : p));
      setPromoCodes(next);
      writeJson(MEIKA_STORAGE_KEYS.PROMO_CODES, next);
    },
    [promoCodes],
  );

  const adminToggleBannerActive = useCallback(
    (bannerId: string) => {
      const next = homeBanners.map((b) =>
        b.id === bannerId ? { ...b, active: !b.active } : b,
      );
      setHomeBanners(next);
      writeJson(MEIKA_STORAGE_KEYS.HOME_BANNERS, next);
    },
    [homeBanners],
  );

  const adminUpdateOrderStatus = useCallback(
    (orderId: string, nextStatus: OrderStatus) => {
      const { updatedProducts, updatedOrders } = applyOrderStockChange({
        products,
        orders,
        orderId,
        nextStatus,
      });
      persistProducts(updatedProducts);
      setOrders(updatedOrders);
      writeJson(MEIKA_STORAGE_KEYS.ORDERS, updatedOrders);
    },
    [orders, persistProducts, products],
  );

  const saveUtEntry = useCallback(
    (index: number, entry: UsabilityTestEntry) => {
      const next = utEntries.map((row, idx) => (idx === index ? entry : row));
      setUtEntries(next);
      writeJson(MEIKA_STORAGE_KEYS.UT_ENTRIES, next);
    },
    [utEntries],
  );

  const resetUtEntries = useCallback(() => {
    setUtEntries(EMPTY_UT_SLOTS);
    writeJson(MEIKA_STORAGE_KEYS.UT_ENTRIES, EMPTY_UT_SLOTS);
  }, []);

  const resetAllDemoData = useCallback(() => {
    resetAllMeikaStorage();
    setProducts(SEED_PRODUCTS);
    setPromoCodes(SEED_PROMO_CODES);
    setHomeBanners(SEED_HOME_BANNERS);
    setCart([]);
    setAppliedPromoCode(null);
    setWishlist([]);
    setOrders(SEED_DEMO_ORDERS);
    setCustomerSession(null);
    setAdminSession(null);
    setNewsletterEmails([]);
    setUtEntries(EMPTY_UT_SLOTS);
    setAnnouncementDismissed(false);
  }, []);

  const cartCount = useMemo(
    () => calculateCartPricing(cart, products, 'jabodetabek', 'reguler').totalUnits,
    [cart, products],
  );
  const wishlistCount = wishlist.length;

  const value: MeikaStoreValue = {
    products,
    brands,
    promoCodes,
    homeBanners,
    cart,
    appliedPromoCode,
    wishlist,
    orders,
    customerSession,
    adminSession,
    newsletterEmails,
    utEntries,
    announcementDismissed,
    cartCount,
    wishlistCount,
    activePromoObject,
    dismissAnnouncement,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    applyPromoCode,
    clearPromoCode,
    toggleWishlist,
    placeOrder,
    signInCustomer,
    signOutCustomer,
    signInAdmin,
    signOutAdmin,
    subscribeNewsletter,
    adminSaveProduct,
    adminDeleteProduct,
    adminUpdateVariantStock,
    adminSavePromoCode,
    adminTogglePromoActive,
    adminToggleBannerActive,
    adminUpdateOrderStatus,
    saveUtEntry,
    resetUtEntries,
    resetAllDemoData,
  };

  return <MeikaStoreContext.Provider value={value}>{children}</MeikaStoreContext.Provider>;
}

export function useMeikaStore(): MeikaStoreValue {
  const ctx = useContext(MeikaStoreContext);
  if (!ctx) {
    throw new Error('useMeikaStore must be rendered inside MeikaStoreProvider');
  }
  return ctx;
}

