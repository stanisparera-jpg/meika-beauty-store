import { X } from 'lucide-react';
import { useMeikaStore } from '../hooks/useMeikaStore';

export function AnnouncementBar() {
  const { announcementDismissed, dismissAnnouncement } = useMeikaStore();

  if (announcementDismissed) {
    return null;
  }

  return (
    <div
      className="bg-[#292626] text-[#FAF8F5] text-sm border-b border-white/10"
      role="region"
      aria-label="Pengumuman toko"
    >
      <div className="wrap flex items-center justify-between gap-3 py-1.5 min-h-[40px]">
        <p className="m-0 text-[13px] leading-snug text-[#FAF8F5]">
          Kurasi Multi-Brand Kecantikan Harian | Gratis Ongkir Jabodetabek min. Rp 250.000 | Kode
          Promo Demo: <span className="font-medium underline">MEIKA10</span>
        </p>
        <button
          type="button"
          onClick={dismissAnnouncement}
          aria-label="Tutup pengumuman"
          className="meika-btn shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-[var(--r-sm)] text-[#FAF8F5] hover:bg-white/15 cursor-pointer"
        >
          <X size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

