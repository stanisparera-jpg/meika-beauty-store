import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMeikaStore } from '../hooks/useMeikaStore';
import {
  SHIPPING_ZONE_OPTIONS,
  calculateCartPricing,
} from '../services/cartPricingService';
import type { ShippingService, ShippingZone } from '../types/cart';
import { resolveAssetUrl } from '../utils/assetUrl';
import { formatIDR } from '../utils/formatters';

export function CartPage() {
  const {
    cart,
    products,
    activePromoObject,
    appliedPromoCode,
    updateCartQty,
    removeFromCart,
    applyPromoCode,
    clearPromoCode,
  } = useMeikaStore();

  const [zone, setZone] = useState<ShippingZone>('jabodetabek');
  const [service, setService] = useState<ShippingService>('reguler');
  const [promoInput, setPromoInput] = useState(appliedPromoCode ?? '');
  const [promoFeedback, setPromoFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const summary = useMemo(
    () => calculateCartPricing(cart, products, zone, service, activePromoObject),
    [activePromoObject, cart, products, service, zone],
  );

  const handlePromoSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(promoInput);
    if (!res.ok) {
      setPromoFeedback({ ok: false, text: res.message });
    } else {
      setPromoFeedback(null);
    }
  };

  if (summary.lines.length === 0) {
    return (
      <div className="wrap py-16 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-full bg-[#F6E8E9] text-[#7A3D49] flex items-center justify-center mx-auto">
          <ShoppingBag size={24} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h1 className="font-display text-4xl text-[#292626] m-0 mt-4">Keranjang Anda Kosong</h1>
        <p className="mt-2 text-sm text-[#5E5857]">
          Tambahkan produk kecantikan pilihan Anda dari katalog atau pindahkan item dari Wishlist.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className="meika-btn min-h-[44px] px-6 inline-flex items-center justify-center rounded-[var(--r-md)] bg-[#7A3D49] text-white text-sm font-medium no-underline"
          >
            Mulai Belanja
          </Link>
          <Link
            to="/wishlist"
            className="meika-btn min-h-[44px] px-6 inline-flex items-center justify-center rounded-[var(--r-md)] border border-[var(--border-strong)] text-[#292626] text-sm font-medium no-underline"
          >
            Buka Wishlist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-8 lg:py-12">
      <div className="border-b border-[var(--border-hairline)] pb-5 mb-8">
        <h1 className="font-display text-4xl sm:text-5xl text-[#292626] m-0">
          Keranjang Belanja
        </h1>
        <p className="m-0 mt-1 text-sm text-[#5E5857] tabular-nums">
          {summary.totalUnits} item siap diproses ke checkout simulasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          {summary.hasStockAdjustment && (
            <div
              role="status"
              className="rounded-[var(--r-md)] border border-[#7A3D49]/30 bg-[#F6E8E9]/60 px-4 py-3 text-xs text-[#292626]"
            >
              Sebagian item atau kuantitas disesuaikan otomatis mengikuti ketersediaan stok terbaru.
            </div>
          )}
          {summary.lines.map((line) => (
            <div
              key={`${line.product.id}-${line.variant.id}`}
              className="bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-4 flex flex-col sm:flex-row gap-4 justify-between"
            >
              <div className="flex gap-4">
                <Link
                  to={`/product/${line.product.slug}`}
                  className="w-20 h-20 rounded-[var(--r-sm)] bg-[#FAF8F5] border border-[var(--border-hairline)] shrink-0 overflow-hidden"
                >
                  <img
                    src={resolveAssetUrl(line.variant.previewImage ?? line.product.primaryImage)}
                    alt={line.product.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </Link>
                <div>
                  <p className="m-0 text-xs uppercase tracking-wider text-[#5E5857]">
                    {line.product.brandName} · {line.product.sku}
                  </p>
                  <Link
                    to={`/product/${line.product.slug}`}
                    className="font-medium text-base text-[#292626] hover:text-[#7A3D49] no-underline block mt-0.5"
                  >
                    {line.product.name}
                  </Link>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[#5E5857]">
                    {line.variant.colorHex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 inline-block"
                        style={{ backgroundColor: line.variant.colorHex }}
                      />
                    )}
                    <span>
                      {line.product.hasShades ? 'Shade' : 'Varian'}: {line.variant.label}
                    </span>
                  </div>
                  <p className="m-0 mt-1.5 text-sm font-medium tabular-nums text-[#292626]">
                    {formatIDR(line.unitPrice)} / unit
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                <div className="inline-flex items-center border border-[var(--border-strong)] rounded-[var(--r-sm)] bg-[#FAF8F5]">
                  <button
                    type="button"
                    aria-label={`Kurangi jumlah ${line.product.name}`}
                    onClick={() =>
                      updateCartQty(line.product.id, line.variant.id, line.quantity - 1)
                    }
                    className="tap-target min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#292626] cursor-pointer"
                  >
                    <Minus size={14} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  <span className="w-9 text-center text-sm font-medium tabular-nums">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Tambah jumlah ${line.product.name}`}
                    disabled={line.quantity >= line.variant.stock}
                    onClick={() =>
                      updateCartQty(line.product.id, line.variant.id, line.quantity + 1)
                    }
                    className="tap-target min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-[#292626] disabled:opacity-40 cursor-pointer"
                  >
                    <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-medium tabular-nums text-[#292626]">
                    {formatIDR(line.lineTotal)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Hapus ${line.product.name} dari keranjang`}
                    onClick={() => removeFromCart(line.product.id, line.variant.id)}
                    className="tap-target min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-[var(--r-sm)] text-[#94232D] hover:bg-[#F6E8E9] cursor-pointer"
                  >
                    <Trash2 size={16} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:col-span-4 bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-5 space-y-5">
          <h2 className="font-display text-2xl text-[#292626] m-0">Ringkasan Belanja</h2>

          <form onSubmit={handlePromoSubmit} className="space-y-2">
            <label htmlFor="cart-promo-input" className="block text-xs font-medium text-[#5E5857]">
              Kode Promo (Contoh: MEIKA10)
            </label>
            <div className="flex gap-2">
              <input
                id="cart-promo-input"
                type="text"
                aria-label="Kode promo"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Masukkan kode"
                className="flex-1 min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm text-[#292626]"
              />
              <button
                type="submit"
                className="meika-btn min-h-[44px] px-4 rounded-[var(--r-sm)] bg-[#292626] text-white text-sm font-medium cursor-pointer"
              >
                Terapkan
              </button>
            </div>
            {appliedPromoCode && (
              <button
                type="button"
                onClick={() => {
                  clearPromoCode();
                  setPromoInput('');
                  setPromoFeedback(null);
                }}
                className="text-xs text-[#7A3D49] underline bg-transparent border-0 p-0 cursor-pointer"
              >
                Lepas kode {appliedPromoCode}
              </button>
            )}
            {promoFeedback && !promoFeedback.ok && (
              <p role="alert" className="m-0 text-xs font-medium text-[#94232D]">
                {promoFeedback.text}
              </p>
            )}
            {(!promoFeedback || promoFeedback.ok) && activePromoObject && (
              summary.promoDiscount > 0 ? (
                <p className="m-0 text-xs font-medium text-[#245C3F]">
                  Kode promo {activePromoObject.code} berhasil diterapkan (-
                  {formatIDR(summary.promoDiscount)}).
                </p>
              ) : (
                <p role="alert" className="m-0 text-xs font-medium text-[#94232D]">
                  {summary.promoMessage ?? 'Kode promo belum memenuhi ketentuan minimum belanja.'}
                </p>
              )
            )}
          </form>

          <div className="space-y-2 pt-3 border-t border-[var(--border-hairline)]">
            <label htmlFor="cart-zone" className="block text-xs font-medium text-[#5E5857]">
              Estimasi Tujuan Pengiriman
            </label>
            <select
              id="cart-zone"
              value={zone}
              onChange={(e) => {
                const nextZone = e.target.value as ShippingZone;
                setZone(nextZone);
                if (nextZone !== 'jabodetabek') setService('reguler');
              }}
              className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm text-[#292626]"
            >
              {SHIPPING_ZONE_OPTIONS.map((z) => (
                <option key={z.zone} value={z.zone}>
                  {z.label}
                </option>
              ))}
            </select>
          </div>

          <dl className="m-0 space-y-2 pt-3 border-t border-[var(--border-hairline)] text-sm">
            <div className="flex justify-between">
              <dt className="text-[#5E5857]">Subtotal Produk</dt>
              <dd className="m-0 font-medium tabular-nums text-[#292626]">
                {formatIDR(summary.subtotal)}
              </dd>
            </div>
            {summary.productSavings > 0 && (
              <div className="flex justify-between">
                <dt className="text-[#245C3F]">Hemat Promo Katalog</dt>
                <dd className="m-0 tabular-nums text-[#245C3F]">
                  -{formatIDR(summary.productSavings)}
                </dd>
              </div>
            )}
            {summary.promoDiscount > 0 && (
              <div className="flex justify-between">
                <dt className="text-[#245C3F]">Diskon Kode ({summary.appliedPromoCode})</dt>
                <dd className="m-0 tabular-nums text-[#245C3F]">
                  -{formatIDR(summary.promoDiscount)}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[#5E5857]">Estimasi Ongkos Kirim</dt>
              <dd className="m-0 tabular-nums text-[#292626]">
                {summary.isFreeShipping ? 'Gratis (Rp 0)' : formatIDR(summary.shippingCost)}
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-[var(--border-hairline)] text-base font-medium">
              <dt className="text-[#292626]">Total Estimasi</dt>
              <dd className="m-0 tabular-nums text-[#292626]">{formatIDR(summary.grandTotal)}</dd>
            </div>
          </dl>

          <Link
            to="/checkout"
            className="meika-btn w-full min-h-[48px] inline-flex items-center justify-center rounded-[var(--r-md)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-sm font-medium no-underline"
          >
            Lanjut ke Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

