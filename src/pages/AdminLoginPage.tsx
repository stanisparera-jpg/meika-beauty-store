import { KeyRound, ShieldAlert } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMeikaStore } from '../hooks/useMeikaStore';
import { DEMO_ADMIN_CREDENTIALS, getAdminGateState } from '../services/authService';

export function AdminLoginPage() {
  const { adminSession, customerSession, signInAdmin } = useMeikaStore();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string; forbidden?: boolean } | null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const gateState = getAdminGateState(adminSession, customerSession);

  if (gateState === 'authorized') {
    return (
      <section className="wrap py-12 max-w-xl">
        <div className="bg-white border border-black/10 rounded-[var(--r-lg)] p-6 space-y-4">
          <h1 className="font-display text-3xl text-[#292626]">Sesi Admin Sudah Aktif</h1>
          <p className="text-sm text-[#575252]">
            Anda masuk sebagai <strong>{adminSession?.email}</strong>. Lanjutkan ke konsol
            manajemen produk, stok, promo, dan status pesanan.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="meika-btn min-h-[44px] px-6 rounded-[var(--r-sm)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-sm font-medium cursor-pointer"
            >
              Buka MEIKA Admin Console
            </button>
            <Link
              to="/"
              className="min-h-[44px] px-5 inline-flex items-center rounded-[var(--r-sm)] border border-black/15 text-sm text-[#292626] hover:bg-[#F6E8E9] no-underline"
            >
              Kembali ke Toko
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = signInAdmin(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setError(null);
    navigate(state?.from && state.from.startsWith('/admin') ? state.from : '/admin', {
      replace: true,
    });
  };

  const handleFillDemo = () => {
    setEmail(DEMO_ADMIN_CREDENTIALS.email);
    setPassword(DEMO_ADMIN_CREDENTIALS.password);
    setError(null);
  };

  return (
    <section className="wrap py-12 max-w-xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
          Portal Internal Prototype
        </p>
        <h1 className="font-display text-4xl text-[#292626] mt-1">Masuk MEIKA Admin Console</h1>
        <p className="text-sm text-[#575252] mt-2">
          Akses khusus pengelolaan katalog 32 SKU, stok varian, kode promo, serta pembaruan status
          pesanan simulasi.
        </p>
      </div>

      {(state?.forbidden || gateState === 'forbidden-customer') && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-[var(--r-md)] bg-[#FEF3C7] border border-[#D97706]/40 text-sm text-[#292626]"
        >
          <ShieldAlert size={18} strokeWidth={1.5} className="shrink-0 mt-0.5 text-[#B45309]" aria-hidden="true" />
          <div>
            <p className="font-medium">Otorisasi Terpisah antara Pelanggan dan Administrator</p>
            <p className="text-xs text-[#575252] mt-1">
              Akun pelanggan ({customerSession?.email ?? 'portal pelanggan'}) tidak memiliki hak
              akses admin. Silakan masuk menggunakan kredensial Administrator demo di bawah ini.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-black/10 rounded-[var(--r-lg)] p-6 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-[#292626] mb-1.5">
              Email Administrator
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@meika.id"
              autoComplete="username"
              className="w-full min-h-[44px] px-3.5 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm text-[#292626] focus:outline-none focus:border-[#7A3D49]"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-[#292626] mb-1.5"
            >
              Kata Sandi
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi demo admin"
              autoComplete="current-password"
              className="w-full min-h-[44px] px-3.5 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm text-[#292626] focus:outline-none focus:border-[#7A3D49]"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="text-sm text-[#B91C1C] bg-[#FEE2E2] border border-[#B91C1C]/30 rounded-[var(--r-sm)] px-3.5 py-2.5"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="meika-btn w-full min-h-[46px] px-6 rounded-[var(--r-sm)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-sm font-medium cursor-pointer"
          >
            Masuk Admin Panel
          </button>
        </form>

        <div className="pt-4 border-t border-black/10 space-y-3">
          <div className="flex items-start gap-2.5 text-xs text-[#575252]">
            <KeyRound size={16} strokeWidth={1.5} className="shrink-0 mt-0.5 text-[#7A3D49]" aria-hidden="true" />
            <div>
              <p className="font-medium text-[#292626]">Kredensial Demo Administrator (Prototype)</p>
              <p className="mt-0.5">
                Email: <code>{DEMO_ADMIN_CREDENTIALS.email}</code> | Kata Sandi:{' '}
                <code>{DEMO_ADMIN_CREDENTIALS.password}</code>
              </p>
              <p className="mt-1">
                Catatan Keamanan Prototype: Autentikasi berjalan di sisi klien dengan penyimpanan
                sesi lokal (<code>meika_v1_admin_session</code>) untuk kebutuhan pengujian akademik,
                bukan otorisasi produksi berbasis server.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFillDemo}
            className="min-h-[40px] px-4 rounded-[var(--r-sm)] border border-[#B87883] text-xs font-medium text-[#7A3D49] hover:bg-[#F6E8E9] cursor-pointer"
          >
            Isi Kredensial Demo Admin
          </button>
        </div>
      </div>
    </section>
  );
}

