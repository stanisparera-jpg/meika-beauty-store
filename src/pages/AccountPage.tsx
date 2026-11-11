import { LogOut, UserCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMeikaStore } from '../hooks/useMeikaStore';
import { DEMO_CUSTOMER_CREDENTIALS } from '../services/authService';

export function AccountPage() {
  const { customerSession, signInCustomer, signOutCustomer, wishlistCount, orders } =
    useMeikaStore();
  const [email, setEmail] = useState<string>(DEMO_CUSTOMER_CREDENTIALS.email);
  const [password, setPassword] = useState<string>(DEMO_CUSTOMER_CREDENTIALS.password);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = signInCustomer(email, password);
    if (!res.ok) {
      setError(res.error);
    } else {
      setError(null);
    }
  };

  if (customerSession) {
    return (
      <div className="wrap py-10 max-w-3xl">
        <div className="bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#F6E8E9] text-[#7A3D49] flex items-center justify-center">
                <UserCheck size={20} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div>
                <h1 className="font-display text-3xl text-[#292626] m-0">{customerSession.name}</h1>
                <p className="m-0 text-sm text-[#5E5857]">
                  {customerSession.email} · Role: Customer (Demo)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={signOutCustomer}
              className="meika-btn min-h-[44px] px-4 rounded-[var(--r-md)] border border-[var(--border-strong)] text-sm font-medium text-[#292626] inline-flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={15} strokeWidth={1.5} aria-hidden="true" />
              <span>Keluar Akun Pelanggan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-[var(--r-sm)] bg-[#FAF8F5] border border-[var(--border-hairline)]">
              <p className="m-0 text-xs uppercase tracking-wider text-[#5E5857]">Alamat Tersimpan</p>
              <p className="m-0 mt-1 font-medium text-[#292626]">{customerSession.defaultAddress}</p>
              <p className="m-0 text-[#5E5857]">
                {customerSession.defaultCity} · {customerSession.phone}
              </p>
            </div>
            <div className="p-4 rounded-[var(--r-sm)] bg-[#FAF8F5] border border-[var(--border-hairline)] space-y-2">
              <p className="m-0 text-xs uppercase tracking-wider text-[#5E5857]">Pintasan Aktivitas</p>
              <p className="m-0 text-[#292626] tabular-nums">
                Wishlist: <strong>{wishlistCount}</strong> produk · Total Pesanan Tersimpan:{' '}
                <strong>{orders.length}</strong>
              </p>
              <div className="flex gap-3 pt-1">
                <Link to="/orders" className="text-sm font-medium text-[#7A3D49] hover:underline">
                  Lihat Riwayat Pesanan
                </Link>
                <Link to="/shop" className="text-sm font-medium text-[#292626] hover:underline">
                  Lanjut Belanja
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-12 max-w-md mx-auto">
      <div className="bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-6 sm:p-8 space-y-5">
        <div>
          <p className="m-0 text-[13px] uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
            Akun Pelanggan Demo
          </p>
          <h1 className="font-display text-4xl text-[#292626] m-0 mt-1">Masuk ke Akun MEIKA</h1>
          <p className="m-0 mt-2 text-sm text-[#5E5857]">
            Masuk untuk mengisi alamat checkout otomatis, atau tetap belanja langsung melalui Guest
            Checkout.
          </p>
        </div>

        <div className="p-3.5 rounded-[var(--r-sm)] bg-[#F6E8E9] text-xs text-[#292626]">
          <strong>Kredensial Customer Demo:</strong> Email{' '}
          <code>{DEMO_CUSTOMER_CREDENTIALS.email}</code> / Sandi{' '}
          <code>{DEMO_CUSTOMER_CREDENTIALS.password}</code>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cust-email" className="block text-sm font-medium text-[#292626] mb-1">
              Email Pelanggan
            </label>
            <input
              id="cust-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm text-[#292626]"
            />
          </div>
          <div>
            <label htmlFor="cust-pass" className="block text-sm font-medium text-[#292626] mb-1">
              Kata Sandi
            </label>
            <input
              id="cust-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm text-[#292626]"
            />
          </div>
          {error && (
            <p role="alert" className="m-0 text-sm text-[#94232D] font-medium">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="meika-btn w-full min-h-[46px] rounded-[var(--r-md)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-sm font-medium cursor-pointer"
          >
            Masuk Akun Pelanggan
          </button>
        </form>

        <div className="pt-3 border-t border-[var(--border-hairline)] text-xs text-[#5E5857] flex justify-between">
          <Link to="/orders" className="text-[#7A3D49] hover:underline no-underline">
            Lacak Pesanan Tamu
          </Link>
          <Link to="/admin/login" className="text-[#292626] hover:underline no-underline">
            Login Administrator
          </Link>
        </div>
      </div>
    </div>
  );
}
