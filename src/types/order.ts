import type { PaymentMethod, ShippingService, ShippingZone } from './cart';

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface CustomerShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  shippingZone: ShippingZone;
  shippingService: ShippingService;
}

export interface OrderItemSnapshot {
  productId: string;
  sku: string;
  productName: string;
  brandName: string;
  variantId: string;
  variantLabel: string;
  colorHex?: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  orderId: string;
  createdAtIso: string;
  customerId?: string;
  customer: CustomerShippingDetails;
  paymentMethod: PaymentMethod;
  paymentStatusLabel: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  productSavings: number;
  promoCode?: string;
  promoDiscount: number;
  shippingCost: number;
  grandTotal: number;
  status: OrderStatus;
  stockDeducted: boolean;
}

