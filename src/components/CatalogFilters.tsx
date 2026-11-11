import { MAIN_CATEGORIES } from '../data/products';
import type { Brand } from '../types/brand';
import type { CatalogFilterParams, PricePreset } from '../services/catalogQueryService';

interface CatalogFiltersProps {
  filters: CatalogFilterParams;
  brands: Brand[];
  subcategories: string[];
  onChange: (patch: Partial<CatalogFilterParams>) => void;
  onReset: () => void;
}

const PRICE_OPTIONS: Array<{ value: PricePreset; label: string }> = [
  { value: 'all', label: 'Semua Rentang Harga' },
  { value: 'under-50', label: 'Di bawah Rp 50.000' },
  { value: '50-to-150', label: 'Rp 50.000 - Rp 150.000' },
  { value: 'above-150', label: 'Di atas Rp 150.000' },
];

export function CatalogFilters({
  filters,
  brands,
  subcategories,
  onChange,
  onReset,
}: CatalogFiltersProps) {
  const activeBrands = filters.brands ?? [];

  const toggleBrand = (brandId: string) => {
    const exists = activeBrands.includes(brandId);
    const next = exists
      ? activeBrands.filter((id) => id !== brandId)
      : [...activeBrands, brandId];
    onChange({ brands: next });
  };

  return (
    <aside
      aria-label="Filter katalog produk"
      className="bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-5 space-y-6"
    >
      <div>
        <label
          htmlFor="shop-filter-search"
          className="block text-xs font-medium uppercase tracking-wider text-[#5E5857] mb-2"
        >
          Kata Kunci
        </label>
        <input
          id="shop-filter-search"
          type="search"
          aria-label="Cari nama produk atau merek di katalog"
          value={filters.q ?? ''}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Cari produk, SKU, shade..."
          className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm text-[#292626]"
        />
      </div>

      <div>
        <p className="m-0 mb-2 text-xs font-medium uppercase tracking-wider text-[#5E5857]">
          Kategori Utama
        </p>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onChange({ category: '', subcategory: '' })}
            className={`w-full min-h-[40px] px-3 rounded-[var(--r-sm)] text-left text-sm cursor-pointer ${
              !filters.category
                ? 'bg-[#F6E8E9] text-[#7A3D49] font-medium'
                : 'text-[#292626] hover:bg-[#FAF8F5]'
            }`}
          >
            Semua Kategori
          </button>
          {MAIN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ category: cat.id, subcategory: '' })}
              className={`w-full min-h-[40px] px-3 rounded-[var(--r-sm)] text-left text-sm cursor-pointer ${
                filters.category === cat.id
                  ? 'bg-[#F6E8E9] text-[#7A3D49] font-medium'
                  : 'text-[#292626] hover:bg-[#FAF8F5]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="shop-filter-subcategory"
          className="block text-xs font-medium uppercase tracking-wider text-[#5E5857] mb-2"
        >
          Subkategori
        </label>
        <select
          id="shop-filter-subcategory"
          value={filters.subcategory ?? ''}
          onChange={(e) => onChange({ subcategory: e.target.value })}
          className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm text-[#292626]"
        >
          <option value="">Semua Subkategori</option>
          {subcategories.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="m-0 mb-2 text-xs font-medium uppercase tracking-wider text-[#5E5857]">
          Brand Pilihan ({brands.length})
        </p>
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {brands.map((brand) => {
            const checked = activeBrands.includes(brand.id);
            return (
              <label
                key={brand.id}
                className="flex items-center gap-2.5 min-h-[36px] text-sm text-[#292626] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleBrand(brand.id)}
                  className="w-4 h-4 accent-[#7A3D49]"
                />
                <span>{brand.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <p className="m-0 mb-2 text-xs font-medium uppercase tracking-wider text-[#5E5857]">
          Rentang Harga
        </p>
        <div className="space-y-1">
          {PRICE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 min-h-[36px] text-sm text-[#292626] cursor-pointer"
            >
              <input
                type="radio"
                name="pricePreset"
                checked={(filters.pricePreset ?? 'all') === opt.value}
                onChange={() => onChange({ pricePreset: opt.value })}
                className="w-4 h-4 accent-[#7A3D49]"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 pt-2 border-t border-[var(--border-hairline)]">
        <label
          htmlFor="shop-filter-rating"
          className="block text-xs font-medium uppercase tracking-wider text-[#5E5857]"
        >
          Minimal Rating Demo
        </label>
        <select
          id="shop-filter-rating"
          value={String(filters.minRating ?? 0)}
          onChange={(e) => onChange({ minRating: Number(e.target.value) })}
          className="w-full min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-[#FAF8F5] text-sm text-[#292626]"
        >
          <option value="0">Semua Rating</option>
          <option value="4.5">4.5 ke atas</option>
          <option value="4.8">4.8 ke atas</option>
        </select>

        <label className="flex items-center gap-2.5 min-h-[40px] text-sm text-[#292626] cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
            className="w-4 h-4 accent-[#7A3D49]"
          />
          <span>Hanya produk tersedia (Stok &gt; 0)</span>
        </label>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="meika-btn w-full min-h-[44px] rounded-[var(--r-md)] bg-[#F6E8E9] hover:bg-[#E8A5AD] text-[#292626] text-sm font-medium cursor-pointer"
      >
        Reset Semua Filter
      </button>
    </aside>
  );
}

