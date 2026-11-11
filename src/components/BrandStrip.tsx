import { Link } from 'react-router-dom';
import { useMeikaStore } from '../hooks/useMeikaStore';

export function BrandStrip() {
  const { brands, products } = useMeikaStore();

  return (
    <section aria-labelledby="heading-featured-brands" className="wrap py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <p className="m-0 text-[13px] uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
            Curated Multi-Brand Partners
          </p>
          <h2 id="heading-featured-brands" className="h2-section m-0 mt-1 text-[#292626]">
            Featured Brands
          </h2>
        </div>
        <Link
          to="/brands"
          className="text-sm font-medium text-[#7A3D49] hover:underline no-underline"
        >
          Lihat Semua 10 Brand
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {brands.map((brand) => {
          const skuCount = products.filter((p) => p.brandId === brand.id).length;
          return (
            <Link
              key={brand.id}
              to={`/brands?selected=${brand.slug}`}
              className="meika-card min-h-[72px] p-4 rounded-[var(--r-md)] bg-white border border-[var(--border-hairline)] flex flex-col justify-between no-underline text-[#292626]"
            >
              <span className="font-display text-xl leading-tight text-[#292626]">
                {brand.name}
              </span>
              <span className="text-[13px] text-[#5E5857] mt-1 tabular-nums">
                {skuCount} produk
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

