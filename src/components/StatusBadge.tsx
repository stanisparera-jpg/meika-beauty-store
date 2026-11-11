import type { OrderStatus } from '../types/order';
import type { ProductStatus } from '../types/product';

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  if (status === 'regular') return null;

  const map: Record<Exclude<ProductStatus, 'regular'>, { label: string; cls: string }> = {
    'best-seller': {
      label: 'Best Seller',
      cls: 'bg-[#E8A5AD] text-[#292626]',
    },
    'new-arrival': {
      label: 'New Arrival',
      cls: 'bg-[#F6E8E9] text-[#292626] border border-[#B87883]/40',
    },
    trending: {
      label: 'Trending',
      cls: 'bg-[#292626] text-[#FAF8F5]',
    },
  };

  const info = map[status];
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-[var(--r-sm)] text-[13px] leading-none font-medium ${info.cls}`}
    >
      {info.label}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    Pending: 'bg-[#F6E8E9] text-[#292626] border border-[#B87883]',
    Processing: 'bg-[#E8A5AD] text-[#292626]',
    Shipped: 'bg-[#292626] text-[#FAF8F5]',
    Delivered: 'bg-[#245C3F] text-white',
    Cancelled: 'bg-[#94232D] text-white',
  };

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-[var(--r-sm)] text-[13px] leading-none font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

