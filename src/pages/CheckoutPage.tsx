import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMeikaStore } from '../hooks/useMeikaStore';
import {
  SHIPPING_ZONE_OPTIONS,
  calculateCartPricing,
} from '../services/cartPricingService';
import { validateCheckoutForm } from '../services/checkoutValidator';
import type { PaymentMethod, ShippingService, ShippingZone } from '../types/cart';
import type { CustomerShippingDetails } from '../types/order';
import { formatIDR } from '../utils/formatters';

export function CheckoutPage() {
  const {
    cart,
    products,
    activePromoObject,
    appliedPromoCode,
    customerSession,
    applyPromoCode,
    clearPromoCode,
    placeOrder,
  } = useMeikaStore();
  const navigate = useNavigate();

  const [form, setForm] = useState<CustomerShippingDetails>(() => ({
    fullName: customerSession?.name ?? '',
    email: customerSession?.email ?? '',
    phone: customerSession?.phone ?? '',
    address: customerSession?.defaultAddress ?? '',
    province: customerSession ? 'DKI Jakarta' : '',
    city: customerSession?.defaultCity ?? '',
    district: customerSession ? 'Mampang Prapatan' : '',
    postalCode: customerSession ? '12730' : '',
    shippingZone: 'jabodetabek',
    shippingService: 'reguler',
  }));

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('va-bank');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [promoInput, setPromoInput] = useState(appliedPromoCode ?? '');
  const [promoMsg, setPromoMsg] = useState<string | null>(null);

  const summary = useMemo(
    () =>
      calculateCartPricing(
        cart,
        products,
        form.shippingZone,
        form.shippingService,
        activePromoObject,
      ),
    [activePromoObject, cart, form.shippingService, form.shippingZone, products],
  );

  const setField = <K extends keyof CustomerShippingDetails>(
    key: K,
    value: CustomerShippingDetails[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    const created = placeOrder(form, paymentMethod);
    if (created) {
      navigate(`/order-confirmation/${created.orderId}`);
    }
  };

  if (summary.lines.length === 0) {
    return (
      <div className="wrap py-16 text-center max-w-md mx-auto">
        <h1 className="font-display text-4xl text-[#292626] m-0">Belum Ada Item Checkout</h1>
        <p className="mt-2 text-sm text-[#5E5857]">
          Keranjang belanja masih kosong. Pilih produk dari katalog terlebih dahulu sebelum
          melanjutkan ke checkout.
        </p>
        <Link
          to="/shop"
          className="meika-btn mt-5 min-h-[44px] px-6 inline-flex items-center justify-center rounded-[var(--r-md)] bg-[#7A3D49] text-white text-sm font-medium no-underline"
        >
          Buka Katalog Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap py-8 lg:py-12">
      <div className="border-b border-[var(--border-hairline)] pb-5 mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[13px] uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
            Simulasi Transaksi Tervalidasi
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#292626] m-0 mt-1">
            Checkout Simulasi
          </h1>
        </div>
        <button
          type="button"
          onClick={() =>
            setForm({
              fullName: 'Nadia Putri',
              email: 'nadia@contoh.id',
              phone: '081288990011',
              address: 'Jl. Kemang Raya No. 24, Mampang Prapatan',
              province: 'DKI Jakarta',
              city: 'Jakarta Selatan',
              district: 'Mampang Prapatan',
              postalCode: '12730',
              shippingZone: 'jabodetabek',
              shippingService: 'reguler',
            })
          }
          className="meika-btn min-h-[44px] px-3.5 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-white text-xs font-medium text-[#292626] cursor-pointer"
        >
          Isi Contoh Data Uji
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-6 space-y-4">
            <h2 className="font-display text-2xl text-[#292626] m-0">
              Data Pemesan &amp; Alamat Pengiriman
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-name" className="block text-sm font-medium text-[#292626] mb-1">
                  Nama Lengkap
                </label>
                <input
                  id="chk-name"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm"
                />
                {errors.fullName && (
                  <p role="alert" className="m-0 mt-1 text-xs text-[#94232D]">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="chk-email" className="block text-sm font-medium text-[#292626] mb-1">
                  Email
                </label>
                <input
                  id="chk-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm"
                />
                {errors.email && (
                  <p role="alert" className="m-0 mt-1 text-xs text-[#94232D]">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="chk-phone" className="block text-sm font-medium text-[#292626] mb-1">
                  Nomor HP
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm"
                />
                {errors.phone && (
                  <p role="alert" className="m-0 mt-1 text-xs text-[#94232D]">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="chk-postal" className="block text-sm font-medium text-[#292626] mb-1">
                  Kode Pos
                </label>
                <input
                  id="chk-postal"
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => setField('postalCode', e.target.value)}
                  placeholder="5 digit angka"
                  className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm"
                />
                {errors.postalCode && (
                  <p role="alert" className="m-0 mt-1 text-xs text-[#94232D]">
                    {errors.postalCode}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="chk-address" className="block text-sm font-medium text-[#292626] mb-1">
                Alamat Lengkap
              </label>
              <textarea
                id="chk-address"
                rows={2}
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                className="w-full p-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm"
              />
              {errors.address && (
                <p role="alert" className="m-0 mt-1 text-xs text-[#94232D]">
                  {errors.address}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="chk-prov" className="block text-sm font-medium text-[#292626] mb-1">
                  Provinsi
                </label>
                <input
                  id="chk-prov"
                  type="text"
                  value={form.province}
                  onChange={(e) => setField('province', e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm"
                />
                {errors.province && (
                  <p role="alert" className="m-0 mt-1 text-xs text-[#94232D]">
                    {errors.province}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="chk-city" className="block text-sm font-medium text-[#292626] mb-1">
                  Kota / Kabupaten
                </label>
                <input
                  id="chk-city"
                  type="text"
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm"
                />
                {errors.city && (
                  <p role="alert" className="m-0 mt-1 text-xs text-[#94232D]">
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="chk-dist" className="block text-sm font-medium text-[#292626] mb-1">
                  Kecamatan
                </label>
                <input
                  id="chk-dist"
                  type="text"
                  value={form.district}
                  onChange={(e) => setField('district', e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm"
                />
                {errors.district && (
                  <p role="alert" className="m-0 mt-1 text-xs text-[#94232D]">
                    {errors.district}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-6 space-y-4">
            <h2 className="font-display text-2xl text-[#292626] m-0">
              Zona Pengiriman &amp; Metode Bayar (Simulasi Prototype)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-zone" className="block text-sm font-medium text-[#292626] mb-1">
                  Wilayah Pengiriman
                </label>
                <select
                  id="chk-zone"
                  value={form.shippingZone}
                  onChange={(e) => {
                    const nextZone = e.target.value as ShippingZone;
                    setField('shippingZone', nextZone);
                    if (nextZone !== 'jabodetabek') setField('shippingService', 'reguler');
                  }}
                  className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm"
                >
                  {SHIPPING_ZONE_OPTIONS.map((z) => (
                    <option key={z.zone} value={z.zone}>
                      {z.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="chk-service" className="block text-sm font-medium text-[#292626] mb-1">
                  Layanan Kurir Simulasi
                </label>
                <select
                  id="chk-service"
                  value={form.shippingService}
                  onChange={(e) => setField('shippingService', e.target.value as ShippingService)}
                  className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm"
                >
                  <option value="reguler">Reguler (1-3 Hari)</option>
                  {form.shippingZone === 'jabodetabek' && (
                    <option value="sameday">Same Day Jabodetabek (Rp 22.000)</option>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="m-0 text-sm font-medium text-[#292626]">Pilih Pembayaran Demo</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'va-bank', label: 'Bank Transfer VA' },
                  { id: 'qris', label: 'E-Wallet / QRIS' },
                  { id: 'cod', label: 'COD (Bayar di Tempat)' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`min-h-[48px] px-3 rounded-[var(--r-sm)] border flex items-center gap-2 text-sm cursor-pointer ${
                      paymentMethod === opt.id
                        ? 'border-[#7A3D49] bg-[#F6E8E9] font-medium'
                        : 'border-[var(--border-hairline)] bg-[#FAF8F5]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id as PaymentMethod)}
                      className="accent-[#7A3D49]"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
              <p className="m-0 text-xs text-[#5E5857]">
                Disclaimer: Seluruh transaksi hanya simulasi prototype akademik dan tidak memproses
                pembayaran keuangan nyata.
              </p>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-5 bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-6 space-y-5">
          <h2 className="font-display text-2xl text-[#292626] m-0">Ringkasan Pesanan</h2>

          <ul className="m-0 p-0 list-none divide-y divide-[var(--border-hairline)]">
            {summary.lines.map((line) => (
              <li
                key={`${line.product.id}-${line.variant.id}`}
                className="py-3 flex items-center justify-between gap-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="m-0 font-medium text-[#292626] truncate">{line.product.name}</p>
                  <p className="m-0 text-xs text-[#5E5857]">
                    {line.variant.label} x {line.quantity}
                  </p>
                </div>
                <span className="tabular-nums font-medium text-[#292626]">
                  {formatIDR(line.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-[var(--border-hairline)] flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Kode promo (MEIKA10)"
              aria-label="Kode promo checkout"
              className="flex-1 min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm"
            />
            <button
              type="button"
              onClick={() => {
                const res = applyPromoCode(promoInput);
                setPromoMsg(res.ok ? null : res.message);
              }}
              className="min-h-[44px] px-4 rounded-[var(--r-sm)] bg-[#292626] text-white text-xs font-medium cursor-pointer"
            >
              Pakai
            </button>
          </div>
          {summary.hasStockAdjustment && (
            <p className="m-0 rounded-[var(--r-sm)] bg-[#F6E8E9]/60 border border-[#7A3D49]/30 px-3 py-2 text-xs text-[#292626]">
              Sebagian item atau jumlah pesanan disesuaikan dengan stok terbaru.
            </p>
          )}
          {(promoMsg || appliedPromoCode) && (
            <div className="flex items-start justify-between gap-2 text-xs">
              {promoMsg && !appliedPromoCode ? (
                <span role="alert" className="text-[#94232D] font-medium">
                  {promoMsg}
                </span>
              ) : activePromoObject ? (
                summary.promoDiscount > 0 ? (
                  <span className="text-[#245C3F] font-medium">
                    Kode promo {activePromoObject.code} berhasil diterapkan (-
                    {formatIDR(summary.promoDiscount)}).
                  </span>
                ) : (
                  <span role="alert" className="text-[#94232D] font-medium">
                    {summary.promoMessage ?? 'Promo belum memenuhi ketentuan minimum pembelian.'}
                  </span>
                )
              ) : (
                <span className="text-[#94232D] font-medium">
                  {promoMsg ?? `${appliedPromoCode} tidak aktif`}
                </span>
              )}
              {appliedPromoCode && (
                <button
                  type="button"
                  onClick={() => {
                    clearPromoCode();
                    setPromoInput('');
                    setPromoMsg(null);
                  }}
                  className="text-[#7A3D49] underline bg-transparent border-0 p-0 cursor-pointer shrink-0"
                >
                  Hapus
                </button>
              )}
            </div>
          )}

          <dl className="m-0 space-y-2 pt-3 border-t border-[var(--border-hairline)] text-sm">
            <div className="flex justify-between">
              <dt className="text-[#5E5857]">Subtotal</dt>
              <dd className="m-0 tabular-nums font-medium">{formatIDR(summary.subtotal)}</dd>
            </div>
            {summary.promoDiscount > 0 && (
              <div className="flex justify-between text-[#245C3F]">
                <dt>Diskon Promo</dt>
                <dd className="m-0 tabular-nums">-{formatIDR(summary.promoDiscount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[#5E5857]">Ongkos Kirim</dt>
              <dd className="m-0 tabular-nums">
                {summary.isFreeShipping ? 'Gratis (Rp 0)' : formatIDR(summary.shippingCost)}
              </dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-[var(--border-hairline)] text-lg font-medium">
              <dt className="text-[#292626]">Grand Total</dt>
              <dd className="m-0 tabular-nums text-[#292626]">{formatIDR(summary.grandTotal)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={summary.lines.length === 0}
            className="meika-btn w-full min-h-[48px] rounded-[var(--r-md)] bg-[#7A3D49] hover:bg-[#642F39] disabled:bg-[#5E5857]/40 text-white text-sm font-medium cursor-pointer disabled:cursor-not-allowed"
          >
            Konfirmasi Pesanan Demo
          </button>
        </aside>
      </form>
    </div>
  );
}

