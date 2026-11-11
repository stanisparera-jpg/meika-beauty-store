import { ArrowLeft, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useMeikaStore } from '../hooks/useMeikaStore';

export function AdminLayout({ children }: { children: ReactNode }) {
  const { adminSession, signOutAdmin } = useMeikaStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#292626] flex flex-col">
      <header className="bg-[#292626] text-[#FAF8F5] border-b border-white/10">
        <div className="wrap min-h-[64px] flex flex-wrap items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-4">
            <span className="font-display text-2xl text-[#FAF8F5]">MEIKA Admin Console</span>
            <span className="px-2.5 py-0.5 rounded-[var(--r-sm)] bg-[#E8A5AD] text-[#292626] text-xs font-medium">
              Role: Admin (Prototype Auth)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {adminSession && (
              <span className="hidden sm:inline text-xs text-[#FAF8F5]/80">
                {adminSession.email}
              </span>
            )}
            <Link
              to="/"
              className="min-h-[40px] px-3 inline-flex items-center gap-1.5 rounded-[var(--r-sm)] border border-white/25 text-xs text-[#FAF8F5] hover:bg-white/10 no-underline"
            >
              <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
              <span>Lihat Storefront</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="meika-btn min-h-[40px] px-3 inline-flex items-center gap-1.5 rounded-[var(--r-sm)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-xs font-medium cursor-pointer"
            >
              <LogOut size={14} strokeWidth={1.5} aria-hidden="true" />
              <span>Logout Admin</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 wrap py-8">{children}</main>
    </div>
  );
}

