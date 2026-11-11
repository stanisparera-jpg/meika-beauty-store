import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="wrap py-20 text-center max-w-lg mx-auto space-y-5">
      <p className="text-xs uppercase tracking-[0.16em] text-[#7A3D49] font-medium">Halaman 404</p>
      <h1 className="font-display text-4xl sm:text-5xl text-[#292626]">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-sm text-[#575252] leading-relaxed">
        Tautan yang Anda tuju tidak tersedia di MEIKA Beauty Store. Jelajahi seluruh katalog
        multi-merek atau kembali ke halaman utama kami.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="meika-btn min-h-[44px] px-6 inline-flex items-center rounded-[var(--r-sm)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-sm font-medium no-underline"
        >
          Kembali ke Beranda
        </Link>
        <Link
          to="/shop"
          className="min-h-[44px] px-6 inline-flex items-center rounded-[var(--r-sm)] border border-black/15 text-sm text-[#292626] hover:bg-[#F6E8E9] no-underline"
        >
          Lihat Katalog
        </Link>
      </div>
    </section>
  );
}

