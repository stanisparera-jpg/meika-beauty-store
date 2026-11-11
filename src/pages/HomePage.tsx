import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BrandStrip } from '../components/BrandStrip';
import { NewsletterSection } from '../components/NewsletterSection';
import { ProductCard } from '../components/ProductCard';
import { MAIN_CATEGORIES } from '../data/products';
import { useMeikaStore } from '../hooks/useMeikaStore';
import { useScrollMoment } from '../hooks/useScrollMoment';
import type { Product } from '../types/product';
import { resolveAssetUrl } from '../utils/assetUrl';

interface ShowcaseSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  items: Product[];
}

function ProductShowcaseRow({
  id,
  eyebrow,
  title,
  ctaLabel,
  ctaHref,
  items,
}: ShowcaseSectionProps) {
  return (
    <section aria-labelledby={id} className="wrap py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <p className="m-0 text-[13px] uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
            {eyebrow}
          </p>
          <h2 id={id} className="h2-section m-0 mt-1 text-[#292626]">
            {title}
          </h2>
        </div>
        <Link
          to={ctaHref}
          className="text-sm font-medium text-[#7A3D49] hover:underline no-underline"
        >
          {ctaLabel}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function HomePage() {
  const { products, homeBanners } = useMeikaStore();
  const { ref: introRef, visible: introVisible } = useScrollMoment();

  const { bestSellers, newArrivals, trendingProducts, recommendations } = useMemo(() => {
    const used = new Set<string>();
    const pickFour = (predicate: (p: Product) => boolean): Product[] => {
      const matched = products.filter((p) => !used.has(p.id) && predicate(p)).slice(0, 4);
      const fallback = products.filter((p) => !used.has(p.id) && !matched.includes(p));
      const combined = [...matched, ...fallback].slice(0, 4);
      for (const item of combined) used.add(item.id);
      return combined;
    };

    return {
      bestSellers: pickFour((p) => p.status === 'best-seller'),
      newArrivals: pickFour((p) => p.status === 'new-arrival'),
      trendingProducts: pickFour((p) => p.status === 'trending'),
      recommendations: pickFour((p) => Boolean(p.isRecommended)),
    };
  }, [products]);

  const activeBanners = homeBanners.filter((b) => b.active);

  return (
    <div>
      {/* 8. Hero Section */}
      <section aria-labelledby="hero-headline" className="bg-[#FAF8F5] border-b border-[var(--border-hairline)]">
        <div className="wrap py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 hero-enter-copy">
            <p className="m-0 text-[13px] font-medium uppercase tracking-[0.14em] text-[#7A3D49]">
              Multi-Brand Curated Beauty Destination
            </p>
            <h1 id="hero-headline" className="h1-hero m-0 mt-3 text-[#292626]">
              Discover Your Beauty Essentials
            </h1>
            <p className="m-0 mt-4 text-base text-[#5E5857] max-w-lg leading-relaxed">
              Jelajahi pilihan makeup, skincare, dan beauty essentials dari 10 merek kecantikan
              dalam satu etalase rapi. Bandingkan harga, cek varian shade, dan selesaikan pesanan
              simulasi dengan alur terstruktur.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="meika-btn min-h-[48px] px-7 inline-flex items-center justify-center rounded-[var(--r-md)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-sm font-medium no-underline"
              >
                Shop Now
              </Link>
              <Link
                to="/brands"
                className="meika-btn min-h-[48px] px-7 inline-flex items-center justify-center rounded-[var(--r-md)] border border-[#292626] bg-white hover:bg-[#F6E8E9] text-[#292626] text-sm font-medium no-underline"
              >
                Explore Brands
              </Link>
            </div>

            <p className="m-0 mt-7 pt-5 border-t border-[var(--border-hairline)] text-[13px] text-[#5E5857] tabular-nums">
              {products.length} Produk Kurasi · 10 Brand Pilihan · Layanan Pengiriman Simulasi Jabodetabek &amp; Nasional
            </p>
          </div>

          <div className="lg:col-span-6 hero-enter-visual">
            <div className="rounded-[var(--r-md)] bg-[#F6E8E9] border border-[#B87883]/25 overflow-hidden">
              <img
                src={resolveAssetUrl('/images/hero/hero-beauty-studio.svg')}
                alt="Komposisi studio produk kurasi MEIKA Beauty Store"
                width={720}
                height={620}
                fetchPriority="high"
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Featured Brands */}
      <BrandStrip />

      {/* 10. Shop by Category */}
      <section aria-labelledby="heading-shop-category" className="wrap py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <p className="m-0 text-[13px] uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
              Kategori Utama
            </p>
            <h2 id="heading-shop-category" className="h2-section m-0 mt-1 text-[#292626]">
              Shop by Category
            </h2>
          </div>
          <p className="m-0 text-sm text-[#5E5857]">
            Saring langsung berdasar langkah rutinitas wajah, bibir, mata, kulit, hingga alat rias.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {MAIN_CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="meika-card group bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] overflow-hidden flex flex-col no-underline text-[#292626]"
              >
                <div className="aspect-square bg-[#FAF8F5] overflow-hidden">
                  <img
                    src={resolveAssetUrl(cat.image)}
                    alt={`Ilustrasi kategori ${cat.label}`}
                    width={600}
                    height={600}
                    loading="lazy"
                    className="meika-card-media w-full h-full object-contain"
                  />
                </div>
                <div className="p-3.5 border-t border-[var(--border-hairline)]">
                  <h3 className="m-0 text-base font-medium text-[#292626] group-hover:text-[#7A3D49]">
                    {cat.label}
                  </h3>
                  <p className="m-0 mt-1 text-[13px] text-[#5E5857] tabular-nums">
                    {count} Produk
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 11. Best Sellers */}
      <ProductShowcaseRow
        id="heading-best-sellers"
        eyebrow="Paling Sering Dicari"
        title="Best Sellers"
        ctaLabel="Lihat Semua Katalog"
        ctaHref="/shop?sort=popular"
        items={bestSellers}
      />

      {/* 14. Special Promotions */}
      {activeBanners.length > 0 && (
        <section aria-labelledby="heading-promotions" className="wrap py-10">
          <div className="mb-5">
            <p className="m-0 text-[13px] uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
              Penawaran Simulasi
            </p>
            <h2 id="heading-promotions" className="h2-section m-0 mt-1 text-[#292626]">
              Special Promotions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeBanners.map((banner, idx) => (
              <div
                key={banner.id}
                className={`rounded-[var(--r-md)] border p-6 sm:p-8 flex flex-col justify-between gap-4 ${
                  idx % 2 === 0
                    ? 'bg-[#E8A5AD] border-[#B87883] text-[#292626]'
                    : 'bg-white border-[var(--border-hairline)] text-[#292626]'
                }`}
              >
                <div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-[var(--r-sm)] text-[13px] font-medium ${
                      idx % 2 === 0
                        ? 'bg-[#292626] text-[#FAF8F5]'
                        : 'bg-[#F6E8E9] text-[#292626]'
                    }`}
                  >
                    {banner.badgeText}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl m-0 mt-3 text-[#292626]">
                    {banner.title}
                  </h3>
                  <p className="m-0 mt-2 text-sm text-[#292626]/85 leading-relaxed">
                    {banner.subtitle}
                  </p>
                </div>
                <div>
                  <Link
                    to={banner.ctaHref}
                    className="meika-btn min-h-[44px] px-5 inline-flex items-center justify-center rounded-[var(--r-md)] bg-[#292626] hover:bg-black text-[#FAF8F5] text-sm font-medium no-underline"
                  >
                    {banner.ctaLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 12. New Arrivals */}
      <ProductShowcaseRow
        id="heading-new-arrivals"
        eyebrow="Rilisan Katalog Terbaru"
        title="New Arrivals"
        ctaLabel="Jelajahi Produk Baru"
        ctaHref="/shop?sort=latest"
        items={newArrivals}
      />

      {/* 13. Trending Products */}
      <ProductShowcaseRow
        id="heading-trending"
        eyebrow="Sedang Naik Daun"
        title="Trending Products"
        ctaLabel="Lihat Koleksi Trending"
        ctaHref="/shop?sort=popular"
        items={trendingProducts}
      />

      {/* 15. Beauty Recommendations */}
      <ProductShowcaseRow
        id="heading-recommendations"
        eyebrow="Padu Padan Pilihan Editor MEIKA"
        title="Beauty Recommendations"
        ctaLabel="Buka Semua Rekomendasi"
        ctaHref="/shop"
        items={recommendations}
      />

      {/* 16. Brand Introduction (1 Dealt Scroll Moment) */}
      <section aria-labelledby="heading-brand-intro" className="wrap py-12">
        <div
          ref={introRef}
          data-reveal={introVisible ? 'visible' : undefined}
          className="rounded-[var(--r-md)] bg-white border border-[var(--border-hairline)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center"
        >
          <div className="lg:col-span-5 bg-[#FAF8F5] border-b lg:border-b-0 lg:border-r border-[var(--border-hairline)]">
            <img
              src={resolveAssetUrl('/images/hero/brand-atelier.svg')}
              alt="Ilustrasi kurasi multi-brand MEIKA Beauty Store"
              width={640}
              height={540}
              loading="lazy"
              className="w-full h-auto block"
            />
          </div>
          <div className="lg:col-span-7 p-6 sm:p-10">
            <p className="m-0 text-[13px] uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
              Your Beauty, Your Choice
            </p>
            <h2 id="heading-brand-intro" className="h2-section m-0 mt-1.5 text-[#292626]">
              Tentang Kurasi MEIKA
            </h2>
            <p className="m-0 mt-3 text-sm sm:text-base text-[#5E5857] leading-relaxed">
              Konsumen tidak semestinya membuka banyak toko terpisah hanya untuk mencari foundation,
              sunscreen, dan beauty sponge. MEIKA menyatukan informasi varian shade, harga
              transparan, dan alur pemesanan terstruktur dalam satu pengalaman ritel kecantikan.
            </p>
            <ul className="mt-4 mb-0 pl-5 text-sm text-[#292626] space-y-1.5">
              <li>Perbandingan lintas 10 brand dalam satu halaman filter multi-dimensi.</li>
              <li>Pemilih warna shade hanya tampil pada kosmetik berwarna, bukan produk non-shade.</li>
              <li>Pelacakan status pesanan 5 tahap terhubung langsung dengan Admin Console.</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/about"
                className="meika-btn min-h-[44px] px-5 inline-flex items-center justify-center rounded-[var(--r-md)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-sm font-medium no-underline"
              >
                Pelajari Profil &amp; Prototype MEIKA
              </Link>
              <Link
                to="/marketing"
                className="meika-btn min-h-[44px] px-5 inline-flex items-center justify-center rounded-[var(--r-md)] border border-[var(--border-strong)] text-[#292626] hover:bg-[#FAF8F5] text-sm font-medium no-underline"
              >
                Strategi Promosi Digital
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 17. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  );
}

