import { SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CatalogFilters } from '../components/CatalogFilters';
import { PaginationControls } from '../components/PaginationControls';
import { ProductCard } from '../components/ProductCard';
import { useMeikaStore } from '../hooks/useMeikaStore';
import {
  paginateItems,
  queryCatalog,
  type CatalogFilterParams,
  type CatalogSortBy,
  type PricePreset,
} from '../services/catalogQueryService';

const PER_PAGE = 12;

export function ShopPage() {
  const { products, brands } = useMeikaStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filters: CatalogFilterParams = useMemo(() => {
    const brandRaw = searchParams.get('brand') ?? '';
    return {
      q: searchParams.get('q') ?? '',
      category: searchParams.get('category') ?? '',
      subcategory: searchParams.get('subcategory') ?? '',
      brands: brandRaw ? brandRaw.split(',').filter(Boolean) : [],
      pricePreset: (searchParams.get('price') as PricePreset) || 'all',
      minRating: Number(searchParams.get('minRating') ?? 0),
      inStockOnly: searchParams.get('inStock') === 'true',
      sortBy: (searchParams.get('sort') as CatalogSortBy) || 'latest',
    };
  }, [searchParams]);

  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1);

  const subcategories = useMemo(() => {
    const pool = filters.category
      ? products.filter((p) => p.categoryId === filters.category)
      : products;
    return Array.from(new Set(pool.map((p) => p.subcategory))).sort();
  }, [filters.category, products]);

  const filtered = useMemo(() => queryCatalog(products, filters), [products, filters]);
  const paginated = useMemo(() => paginateItems(filtered, page, PER_PAGE), [filtered, page]);

  const updateFilters = (patch: Partial<CatalogFilterParams>, resetPage = true) => {
    const merged: CatalogFilterParams = { ...filters, ...patch };
    const next = new URLSearchParams();
    if (merged.q) next.set('q', merged.q);
    if (merged.category) next.set('category', merged.category);
    if (merged.subcategory) next.set('subcategory', merged.subcategory);
    if (merged.brands && merged.brands.length > 0) next.set('brand', merged.brands.join(','));
    if (merged.pricePreset && merged.pricePreset !== 'all') next.set('price', merged.pricePreset);
    if (merged.minRating && merged.minRating > 0) next.set('minRating', String(merged.minRating));
    if (merged.inStockOnly) next.set('inStock', 'true');
    if (merged.sortBy && merged.sortBy !== 'latest') next.set('sort', merged.sortBy);
    if (!resetPage && page > 1) next.set('page', String(page));
    setSearchParams(next);
  };

  const resetAll = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="wrap py-8 lg:py-12">
      <div className="border-b border-[var(--border-hairline)] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[13px] uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
            Multi-Brand Beauty Catalog
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#292626] m-0 mt-1">
            Shop All Products
          </h1>
          <p className="m-0 mt-2 text-sm text-[#5E5857] tabular-nums">
            Menampilkan {filtered.length} produk dari {brands.length} merek pilihan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen((prev) => !prev)}
            className="lg:hidden meika-btn min-h-[44px] px-4 rounded-[var(--r-md)] border border-[var(--border-strong)] bg-white text-sm font-medium text-[#292626] inline-flex items-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>{mobileFilterOpen ? 'Tutup Filter' : 'Filter Produk'}</span>
          </button>

          <label className="flex items-center gap-2 text-sm text-[#292626]">
            <span className="text-[#5E5857]">Urutkan:</span>
            <select
              aria-label="Urutkan katalog"
              value={filters.sortBy ?? 'latest'}
              onChange={(e) => updateFilters({ sortBy: e.target.value as CatalogSortBy })}
              className="min-h-[44px] px-3 rounded-[var(--r-sm)] border border-[var(--border-strong)] bg-white text-sm text-[#292626]"
            >
              <option value="latest">Terbaru</option>
              <option value="popular">Terpopuler / Rating Tertinggi</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className={`lg:col-span-3 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <CatalogFilters
            filters={filters}
            brands={brands}
            subcategories={subcategories}
            onChange={(patch) => updateFilters(patch, true)}
            onReset={resetAll}
          />
        </div>

        <div className="lg:col-span-9">
          {paginated.items.length === 0 ? (
            <div className="bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-10 text-center">
              <h2 className="font-display text-2xl text-[#292626] m-0">
                Tidak ada produk yang cocok dengan filter Anda
              </h2>
              <p className="m-0 mt-2 text-sm text-[#5E5857]">
                Ubah kata kunci pencarian, pilih kategori lain, atau reset seluruh penyaring.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="meika-btn mt-5 min-h-[44px] px-6 rounded-[var(--r-md)] bg-[#7A3D49] text-white text-sm font-medium cursor-pointer"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginated.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <PaginationControls
                page={paginated.page}
                totalPages={paginated.totalPages}
                onPageChange={(nextPage) => {
                  const next = new URLSearchParams(searchParams);
                  next.set('page', String(nextPage));
                  setSearchParams(next);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

