import type { CartItem, PaymentMethod, PromoCode } from '../types/cart';
import type { CustomerShippingDetails, Order, OrderItemSnapshot, OrderStatus } from '../types/order';
import type { Product } from '../types/product';
import { generateOrderId } from '../utils/formatters';
import { calculateCartPricing } from './cartPricingService';

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  'va-bank': 'Transfer Bank Virtual Account (Simulasi Prototype)',
  qris: 'E-Wallet / QRIS (Simulasi Prototype)',
  cod: 'Bayar di Tempat / COD (Simulasi Prototype)',
};

export interface CreateOrderInput {
  products: Product[];
  cartItems: CartItem[];
  customer: CustomerShippingDetails;
  paymentMethod: PaymentMethod;
  promo?: PromoCode;
  customerId?: string;
  now?: Date;
}

export function createOrderFromCheckout(input: CreateOrderInput): {
  order: Order;
  updatedProducts: Product[];
} {
  const pricing = calculateCartPricing(
    input.cartItems,
    input.products,
    input.customer.shippingZone,
    input.customer.shippingService,
    input.promo,
  );

  const items: OrderItemSnapshot[] = pricing.lines.map((line) => ({
    productId: line.product.id,
    sku: line.product.sku,
    productName: line.product.name,
    brandName: line.product.brandName,
    variantId: line.variant.id,
    variantLabel: line.variant.label,
    colorHex: line.variant.colorHex,
    image: line.variant.previewImage ?? line.product.primaryImage,
    unitPrice: line.unitPrice,
    quantity: line.quantity,
  }));

  const deductMap = new Map<string, number>();
  for (const line of pricing.lines) {
    const key = `${line.product.id}::${line.variant.id}`;
    deductMap.set(key, (deductMap.get(key) ?? 0) + line.quantity);
  }

  const updatedProducts = input.products.map((product) => ({
    ...product,
    variants: product.variants.map((variant) => {
      const qtyToDeduct = deductMap.get(`${product.id}::${variant.id}`);
      if (!qtyToDeduct) return variant;
      return {
        ...variant,
        stock: Math.max(0, variant.stock - qtyToDeduct),
      };
    }),
  }));

  const order: Order = {
    orderId: generateOrderId(input.now ?? new Date()),
    createdAtIso: (input.now ?? new Date()).toISOString(),
    customerId: input.customerId,
    customer: input.customer,
    paymentMethod: input.paymentMethod,
    paymentStatusLabel: PAYMENT_LABELS[input.paymentMethod],
    items,
    subtotal: pricing.subtotal,
    productSavings: pricing.productSavings,
    promoCode: pricing.appliedPromoCode,
    promoDiscount: pricing.promoDiscount,
    shippingCost: pricing.shippingCost,
    grandTotal: pricing.grandTotal,
    status: 'Pending',
    stockDeducted: true,
  };

  return { order, updatedProducts };
}

export function applyOrderStockChange(params: {
  products: Product[];
  orders: Order[];
  orderId: string;
  nextStatus: OrderStatus;
}): { updatedProducts: Product[]; updatedOrders: Order[] } {
  const target = params.orders.find((o) => o.orderId === params.orderId);
  if (!target) {
    return { updatedProducts: params.products, updatedOrders: params.orders };
  }

  let stockDeltaSign: 0 | 1 | -1 = 0;
  let nextStockDeducted = target.stockDeducted;

  if (params.nextStatus === 'Cancelled' && target.stockDeducted) {
    stockDeltaSign = 1; // restore stock
    nextStockDeducted = false;
  } else if (target.status === 'Cancelled' && params.nextStatus !== 'Cancelled' && !target.stockDeducted) {
    stockDeltaSign = -1; // re-deduct stock
    nextStockDeducted = true;
  }

  let updatedProducts = params.products;
  if (stockDeltaSign !== 0) {
    const deltaMap = new Map<string, number>();
    for (const item of target.items) {
      const key = `${item.productId}::${item.variantId}`;
      deltaMap.set(key, (deltaMap.get(key) ?? 0) + item.quantity * stockDeltaSign);
    }

    updatedProducts = params.products.map((product) => ({
      ...product,
      variants: product.variants.map((variant) => {
        const delta = deltaMap.get(`${product.id}::${variant.id}`);
        if (!delta) return variant;
        return {
          ...variant,
          stock: Math.max(0, variant.stock + delta),
        };
      }),
    }));
  }

  const updatedOrders = params.orders.map((o) =>
    o.orderId === params.orderId
      ? { ...o, status: params.nextStatus, stockDeducted: nextStockDeducted }
      : o,
  );

  return { updatedProducts, updatedOrders };
}

export function computeSimulatedRevenue(orders: Order[]): number {
  return orders.reduce(
    (sum, order) => (order.status === 'Cancelled' ? sum : sum + order.grandTotal),
    0,
  );
}

