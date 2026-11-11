import { ShieldCheck, X } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  wishlistCount: number;
  cartCount: number;
}

const MOBILE_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop Katalog (32 SKU)' },
  { to: '/brands', label: 'Brands Directory' },
  { to: '/about', label: 'About MEIKA & Usability Testing' },
  { to: '/marketing', label: 'Digital Marketing Hub' },
  { to: '/orders', label: 'Lacak & Riwayat Pesanan' },
  { to: '/account', label: 'Akun Demo Pelanggan' },
];

export function MobileDrawer({ open, onClose, wishlistCount, cartCount }: MobileDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#292626]/45 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Menu navigasi mobile"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs h-full bg-[#FAF8F5] border-l border-[var(--border-hairline)] p-5 flex flex-col justify-between overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-hairline)]">
            <span className="font-display text-2xl text-[#292626]">MEIKA</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup menu"
              className="tap-target inline-flex items-center justify-center rounded-[var(--r-sm)] text-[#292626] hover:bg-white cursor-pointer"
            >
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Navigasi utama mobile" className="mt-4 flex flex-col gap-1">
            {MOBILE_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className="min-h-[44px] px-3 flex items-center rounded-[var(--r-sm)] text-[#292626] hover:bg-[#F6E8E9] font-medium text-sm no-underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 pt-4 border-t border-[var(--border-hairline)] flex flex-col gap-2">
            <Link
              to="/wishlist"
              onClick={onClose}
              className="min-h-[44px] px-3 flex items-center justify-between rounded-[var(--r-sm)] bg-white border border-[var(--border-hairline)] text-sm text-[#292626] no-underline"
            >
              <span>Wishlist Saya</span>
              <span className="tabular-nums font-medium">{wishlistCount}</span>
            </Link>
            <Link
              to="/cart"
              onClick={onClose}
              className="min-h-[44px] px-3 flex items-center justify-between rounded-[var(--r-sm)] bg-[#7A3D49] text-white text-sm font-medium no-underline"
            >
              <span>Keranjang Belanja</span>
              <span className="tabular-nums">{cartCount}</span>
            </Link>
          </div>
        </div>

        <Link
          to="/admin/login"
          onClick={onClose}
          className="mt-6 min-h-[44px] px-3 flex items-center gap-2 rounded-[var(--r-sm)] border border-[var(--border-strong)] text-sm text-[#292626] no-underline"
        >
          <ShieldCheck size={16} strokeWidth={1.5} aria-hidden="true" />
          <span>Portal Administrator</span>
        </Link>
      </div>
    </div>
  );
}

