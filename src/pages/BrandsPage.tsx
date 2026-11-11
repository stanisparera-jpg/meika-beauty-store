import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useMeikaStore } from '../hooks/useMeikaStore';

export function BrandsPage() {
  const { brands, products } = useMeikaStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSlug = searchParams.get('selected') ?? brands[0]?.slug ?? '';

  const activeBrand = useMemo(
    () => brands.find((b) => b.slug === selectedSlug) ?? brands[0],
    [brands, selectedSlug],
  );

  const brandProducts = useMemo(
    () => products.filter((p) => p.brandId === activeBrand?.id),
    [activeBrand?.id, products],
  );

  return (
    <div className="wrap py-8 lg:py-12">
      <div className="border-b border-[var(--border-hairline)] pb-6 mb-8">
        <p className="m-0 text-[13px] uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
          Multi-Brand Retail Directory
        </p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#292626] m-0 mt-1">
          Direktori 10 Brand Kecantikan
        </h1>
        <p className="m-0 mt-2 text-sm text-[#5E5857] max-w-2xl">
          Pilih salah satu merek di bawah untuk meninjau profil kurasi singkat, jumlah SKU aktif,
          serta koleksi lengkap produk yang tersedia di MEIKA.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {brands.map((brand) => {
          const count = products.filter((p) => p.brandId === brand.id).length;
          const active = brand.slug === activeBrand?.slug;
          return (
            <button
              key={brand.id}
              type="button"
              onClick={() => setSearchParams({ selected: brand.slug })}
              aria-pressed={active}
              className={`meika-btn min-h-[76px] p-4 rounded-[var(--r-md)] border text-left cursor-pointer ${
                active
                  ? 'bg-[#292626] border-[#292626] text-[#FAF8F5]'
                  : 'bg-white border-[var(--border-hairline)] text-[#292626] hover:bg-[#F6E8E9]'
              }`}
            >
              <span className="font-display text-xl block leading-tight">{brand.name}</span>
              <span
                className={`text-[13px] mt-1 block tabular-nums ${
                  active ? 'text-[#E8A5AD]' : 'text-[#5E5857]'
                }`}
              >
                {count} produk kurasi
              </span>
            </button>
          );
        })}
      </div>

      {activeBrand && (
        <section aria-labelledby="active-brand-title">
          <div className="rounded-[var(--r-md)] bg-[#F6E8E9] border border-[#B87883]/30 p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="m-0 text-[13px] uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
                {activeBrand.originLabel}
              </p>
              <h2 id="active-brand-title" className="h2-section m-0 mt-1 text-[#292626]">
                {activeBrand.name}
              </h2>
              <p className="m-0 mt-2 text-sm text-[#292626]/85 max-w-2xl leading-relaxed">
                {activeBrand.description}
              </p>
            </div>
            <Link
              to={`/shop?brand=${activeBrand.id}`}
              className="meika-btn min-h-[44px] px-5 shrink-0 inline-flex items-center justify-center rounded-[var(--r-md)] bg-[#7A3D49] text-white text-sm font-medium no-underline"
            >
              Buka di Filter Shop
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {brandProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

