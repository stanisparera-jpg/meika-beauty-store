import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeikaStore } from '../hooks/useMeikaStore';
import { queryCatalog } from '../services/catalogQueryService';
import { resolveAssetUrl } from '../utils/assetUrl';
import { formatIDR, getEffectivePrice } from '../utils/formatters';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const { products } = useMeikaStore();
  const [term, setTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const matches = useMemo(() => {
    if (!term.trim()) {
      return products.slice(0, 5);
    }
    return queryCatalog(products, { q: term }).slice(0, 6);
  }, [products, term]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = term.trim();
    onClose();
    navigate(cleaned ? `/shop?q=${encodeURIComponent(cleaned)}` : '/shop');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#292626]/45 flex items-start justify-center pt-16 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pencarian produk MEIKA"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-[var(--r-md)] border border-[var(--border-hairline)] p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--border-hairline)]">
          <p className="m-0 text-sm font-medium text-[#292626]">Cari Produk, Brand, atau SKU</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pencarian"
            className="meika-btn tap-target inline-flex items-center justify-center rounded-[var(--r-sm)] text-[#292626] hover:bg-[#FAF8F5] cursor-pointer"
          >
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search
              size={18}
              strokeWidth={1.5}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E5857]"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Contoh: Lip Cream, Cushion, Skintific, MK-01..."
              aria-label="Kata kunci pencarian"
              className="w-full min-h-[44px] pl-10 pr-4 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-[#292626] text-base"
            />
          </div>
          <button
            type="submit"
            className="meika-btn min-h-[44px] px-5 rounded-[var(--r-md)] bg-[#7A3D49] hover:bg-[#642F39] text-white font-medium text-sm cursor-pointer"
          >
            Lihat Semua Hasil
          </button>
        </form>

        <div className="mt-4">
          <p className="m-0 mb-2 text-xs uppercase tracking-wider text-[#5E5857]">
            {term.trim() ? 'Hasil Cocok Teratas' : 'Saran Produk Populer'}
          </p>
          {matches.length === 0 ? (
            <div className="py-6 text-center rounded-[var(--r-sm)] bg-[#FAF8F5]">
              <p className="m-0 text-sm text-[#5E5857]">
                Tidak ada produk cocok untuk &ldquo;{term}&rdquo;. Coba nama merek lain.
              </p>
            </div>
          ) : (
            <ul className="m-0 p-0 list-none divide-y divide-[var(--border-hairline)]">
              {matches.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(`/product/${product.slug}`);
                    }}
                    className="w-full min-h-[52px] py-2 px-2 flex items-center justify-between gap-3 text-left hover:bg-[#FAF8F5] rounded-[var(--r-sm)] cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={resolveAssetUrl(product.primaryImage)}
                        alt={product.name}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-[var(--r-sm)] border border-[var(--border-hairline)] bg-[#FAF8F5] object-contain shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="m-0 text-xs text-[#5E5857]">
                          {product.brandName} · {product.subcategory}
                        </p>
                        <p className="m-0 text-sm font-medium text-[#292626] truncate">
                          {product.name}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-medium tabular-nums text-[#292626]">
                      {formatIDR(getEffectivePrice(product))}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

