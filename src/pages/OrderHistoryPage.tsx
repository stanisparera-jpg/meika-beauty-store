import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { OrderStatusBadge } from '../components/StatusBadge';
import { useMeikaStore } from '../hooks/useMeikaStore';
import type { OrderStatus } from '../types/order';
import { formatIDR } from '../utils/formatters';

const LIFECYCLE_STEPS: Array<{ status: OrderStatus; label: string }> = [
  { status: 'Pending', label: '1. Pending' },
  { status: 'Processing', label: '2. Processing' },
  { status: 'Shipped', label: '3. Shipped' },
  { status: 'Delivered', label: '4. Delivered' },
];

export function OrderHistoryPage() {
  const { orders } = useMeikaStore();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') ?? '');

  const visibleOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q),
    );
  }, [orders, query]);

  return (
    <div className="wrap py-8 lg:py-12">
      <div className="border-b border-[var(--border-hairline)] pb-5 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[13px] uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
            Pemantauan Transaksi Simulasi
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#292626] m-0 mt-1">
            Riwayat &amp; Pelacakan Pesanan
          </h1>
        </div>
        <input
          type="search"
          aria-label="Cari Order ID atau nama pelanggan"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari Order ID (contoh: MK-...)"
          className="w-full md:w-72 min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-white text-sm"
        />
      </div>

      {visibleOrders.length === 0 ? (
        <div className="bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-8 text-center">
          <p className="m-0 text-sm text-[#5E5857]">Tidak ada pesanan sesuai pencarian Anda.</p>
          <Link to="/shop" className="text-sm font-medium text-[#7A3D49] inline-block mt-3">
            Belanja di Katalog
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {visibleOrders.map((order) => {
            const activeStepIndex = LIFECYCLE_STEPS.findIndex((s) => s.status === order.status);
            return (
              <article
                key={order.orderId}
                className="bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-5 sm:p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-hairline)] pb-4">
                  <div>
                    <h2 className="font-display text-2xl text-[#292626] m-0">{order.orderId}</h2>
                    <p className="m-0 text-xs text-[#5E5857]">
                      Pemesan: {order.customer.fullName} ({order.customer.city}) · Total:{' '}
                      <strong className="text-[#292626] tabular-nums">
                        {formatIDR(order.grandTotal)}
                      </strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <Link
                      to={`/order-confirmation/${order.orderId}`}
                      className="text-xs font-medium text-[#7A3D49] hover:underline no-underline"
                    >
                      Lihat Rincian
                    </Link>
                  </div>
                </div>

                {order.status === 'Cancelled' ? (
                  <div className="p-3 rounded-[var(--r-sm)] bg-[#94232D]/10 text-xs text-[#94232D] font-medium">
                    Status Pesanan: Cancelled (Dibatalkan; stok produk otomatis dikembalikan).
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LIFECYCLE_STEPS.map((step, idx) => {
                      const reached = idx <= activeStepIndex;
                      return (
                        <div
                          key={step.status}
                          className={`p-2.5 rounded-[var(--r-sm)] text-xs font-medium border ${
                            reached
                              ? 'bg-[#F6E8E9] border-[#7A3D49] text-[#292626]'
                              : 'bg-[#FAF8F5] border-[var(--border-hairline)] text-[#5E5857]'
                          }`}
                        >
                          {step.label}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="text-xs text-[#5E5857] flex flex-wrap gap-3">
                  {order.items.map((item) => (
                    <span
                      key={`${item.productId}-${item.variantId}`}
                      className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[#FAF8F5] border border-[var(--border-hairline)] text-[#292626]"
                    >
                      {item.productName} ({item.variantLabel}) x{item.quantity}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

