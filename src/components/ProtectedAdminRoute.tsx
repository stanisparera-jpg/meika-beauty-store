import { ShieldAlert } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useMeikaStore } from '../hooks/useMeikaStore';
import { getAdminGateState } from '../services/authService';

export function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { adminSession, customerSession } = useMeikaStore();
  const state = getAdminGateState(adminSession, customerSession);

  if (state === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }

  if (state === 'forbidden-customer') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#F6E8E9] text-[#7A3D49] flex items-center justify-center mx-auto">
            <ShieldAlert size={22} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl text-[#292626] mt-4 mb-2">
            403 Akses Ditolak
          </h1>
          <p className="text-sm text-[#5E5857] leading-relaxed">
            Anda saat ini masuk dengan akun pelanggan ({customerSession?.email}). Halaman panel
            administrator hanya dapat dibuka setelah terautentikasi dengan akun ber-role Admin.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/admin/login"
              className="meika-btn min-h-[44px] px-5 inline-flex items-center justify-center rounded-[var(--r-md)] bg-[#7A3D49] text-white text-sm font-medium no-underline"
            >
              Masuk sebagai Admin
            </Link>
            <Link
              to="/"
              className="meika-btn min-h-[44px] px-5 inline-flex items-center justify-center rounded-[var(--r-md)] border border-[var(--border-strong)] text-[#292626] text-sm font-medium no-underline"
            >
              Kembali ke Toko
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

