import { CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { OrderStatusBadge } from '../components/StatusBadge';
import { useMeikaStore } from '../hooks/useMeikaStore';
import { formatIDR } from '../utils/formatters';

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useMeikaStore();
  const order = orders.find((o) => o.orderId === orderId);

  if (!order) {
    return (
      <div className="wrap py-16 text-center max-w-lg mx-auto">
        <h1 className="font-display text-4xl text-[#292626] m-0">Pesanan Tidak Ditemukan</h1>
        <p className="mt-2 text-sm text-[#5E5857]">
          Data pesanan {orderId} tidak tersedia di penyimpanan lokal sesi ini.
        </p>
        <Link
          to="/orders"
          className="meika-btn mt-5 min-h-[44px] px-6 inline-flex items-center justify-center rounded-[var(--r-md)] bg-[#7A3D49] text-white text-sm font-medium no-underline"
        >
          Cek Riwayat Pesanan
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap py-10 max-w-3xl mx-auto">
      <div className="bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-hairline)] pb-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={28} className="text-[#245C3F] shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h1 className="font-display text-4xl text-[#292626] m-0">
                Pesanan Simulasi Diterima
              </h1>
              <p className="m-0 mt-1 text-sm text-[#5E5857] tabular-nums">
                Nomor Pesanan: <strong className="text-[#292626]">{order.orderId}</strong> ·{' '}
                Status Pesanan: {order.status}
              </p>
            </div>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="p-4 rounded-[var(--r-sm)] bg-[#F6E8E9] text-sm text-[#292626]">
          <strong>Catatan Prototype:</strong> {order.paymentStatusLabel}. Stok varian produk telah
          diperbarui secara lokal dan pesanan dapat dipantau atau diubah statusnya melalui Admin
          Console.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="m-0 text-xs uppercase tracking-wider text-[#5E5857]">Penerima</p>
            <p className="m-0 mt-1 font-medium text-[#292626]">{order.customer.fullName}</p>
            <p className="m-0 text-[#5E5857]">
              {order.customer.email} · {order.customer.phone}
            </p>
          </div>
          <div>
            <p className="m-0 text-xs uppercase tracking-wider text-[#5E5857]">Alamat Kirim</p>
            <p className="m-0 mt-1 text-[#292626]">{order.customer.address}</p>
            <p className="m-0 text-[#5E5857]">
              {order.customer.district}, {order.customer.city}, {order.customer.province}{' '}
              {order.customer.postalCode}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-base font-medium text-[#292626] m-0 mb-3">Rincian Produk</h2>
          <ul className="m-0 p-0 list-none divide-y divide-[var(--border-hairline)] border-t border-b border-[var(--border-hairline)]">
            {order.items.map((item) => (
              <li
                key={`${item.productId}-${item.variantId}`}
                className="py-3 flex items-center justify-between gap-3 text-sm"
              >
                <div>
                  <p className="m-0 font-medium text-[#292626]">
                    {item.brandName} · {item.productName}
                  </p>
                  <p className="m-0 text-xs text-[#5E5857]">
                    Varian: {item.variantLabel} · Jumlah: {item.quantity}
                  </p>
                </div>
                <span className="tabular-nums font-medium text-[#292626]">
                  {formatIDR(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="m-0 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-[#5E5857]">Subtotal</dt>
            <dd className="m-0 tabular-nums">{formatIDR(order.subtotal)}</dd>
          </div>
          {order.promoDiscount > 0 && (
            <div className="flex justify-between text-[#245C3F]">
              <dt>Diskon ({order.promoCode})</dt>
              <dd className="m-0 tabular-nums">-{formatIDR(order.promoDiscount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-[#5E5857]">Ongkos Kirim</dt>
            <dd className="m-0 tabular-nums">{formatIDR(order.shippingCost)}</dd>
          </div>
          <div className="flex justify-between pt-2 border-t border-[var(--border-hairline)] text-lg font-medium">
            <dt>Grand Total</dt>
            <dd className="m-0 tabular-nums">{formatIDR(order.grandTotal)}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to={`/orders?search=${order.orderId}`}
            className="meika-btn min-h-[44px] px-6 inline-flex items-center justify-center rounded-[var(--r-md)] bg-[#7A3D49] text-white text-sm font-medium no-underline"
          >
            View Order
          </Link>
          <Link
            to="/shop"
            className="meika-btn min-h-[44px] px-6 inline-flex items-center justify-center rounded-[var(--r-md)] border border-[var(--border-strong)] text-[#292626] text-sm font-medium no-underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

