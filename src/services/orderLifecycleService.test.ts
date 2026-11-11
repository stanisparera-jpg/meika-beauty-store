import { describe, expect, it } from 'vitest';
import { SEED_PRODUCTS } from '../data/products';
import {
  applyOrderStockChange,
  computeSimulatedRevenue,
  createOrderFromCheckout,
} from './orderLifecycleService';

describe('orderLifecycleService atomic stock & revenue tracking', () => {
  it('deducts selected variant stock when placing a checkout order and restores stock on cancellation', () => {
    const mk01 = SEED_PRODUCTS.find((p) => p.sku === 'MK-01')!;
    const variant = mk01.variants[0];
    const startStock = variant.stock;

    const { order, updatedProducts } = createOrderFromCheckout({
      products: SEED_PRODUCTS,
      cartItems: [{ productId: mk01.id, variantId: variant.id, quantity: 3 }],
      customer: {
        fullName: 'Nadia Putri',
        email: 'nadia@contoh.id',
        phone: '081288990011',
        address: 'Jl. Kemang Raya No. 24',
        province: 'DKI Jakarta',
        city: 'Jakarta Selatan',
        district: 'Mampang Prapatan',
        postalCode: '12730',
        shippingZone: 'jabodetabek',
        shippingService: 'reguler',
      },
      paymentMethod: 'qris',
    });

    expect(order.status).toBe('Pending');
    expect(order.stockDeducted).toBe(true);
    const afterOrderProduct = updatedProducts.find((p) => p.id === mk01.id)!;
    expect(afterOrderProduct.variants.find((v) => v.id === variant.id)!.stock).toBe(
      startStock - 3,
    );

    // Admin transitions order to Cancelled -> restores stock
    const cancelledResult = applyOrderStockChange({
      products: updatedProducts,
      orders: [order],
      orderId: order.orderId,
      nextStatus: 'Cancelled',
    });
    const restoredProduct = cancelledResult.updatedProducts.find((p) => p.id === mk01.id)!;
    expect(restoredProduct.variants.find((v) => v.id === variant.id)!.stock).toBe(startStock);
    expect(cancelledResult.updatedOrders[0].status).toBe('Cancelled');
    expect(computeSimulatedRevenue(cancelledResult.updatedOrders)).toBe(0);
  });
});

