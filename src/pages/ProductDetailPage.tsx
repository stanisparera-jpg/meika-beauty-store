import { Heart, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ShadeSwatches } from '../components/ShadeSwatches';
import { ProductStatusBadge } from '../components/StatusBadge';
import { useMeikaStore } from '../hooks/useMeikaStore';
import { resolveAssetUrl } from '../utils/assetUrl';
import {
  calculateDiscountPercent,
  formatIDR,
  getEffectivePrice,
} from '../utils/formatters';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, addToCart, wishlist, toggleWishlist } = useMeikaStore();
  const navigate = useNavigate();

  const product = useMemo(
    () => products.find((p) => p.slug === slug || p.id === slug),
    [products, slug],
  );

  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [activeAngleIdx, setActiveAngleIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartNotice, setCartNotice] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedVariantId(product.variants[0]?.id ?? '');
      setActiveAngleIdx(0);
      setQuantity(1);
      setCartNotice(false);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="wrap py-16 text-center">
        <h1 className="font-display text-4xl text-[#292626] m-0">Produk tidak ditemukan</h1>
        <p className="mt-3 text-sm text-[#5E5857]">
          Tautan produk yang Anda cari tidak tersedia atau telah dihapus oleh Admin.
        </p>
        <Link
          to="/shop"
          className="meika-btn mt-5 min-h-[44px] px-6 inline-flex items-center justify-center rounded-[var(--r-md)] bg-[#7A3D49] text-white text-sm font-medium no-underline"
        >
          Kembali ke Katalog Shop
        </Link>
      </div>
    );
  }

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
  const variantStock = activeVariant?.stock ?? 0;
  const effectivePrice = getEffectivePrice(product, activeVariant);
  const discountPct = calculateDiscountPercent(product.price, product.discountPrice);
  const wishlisted = wishlist.includes(product.id);

  const gallery = [
    resolveAssetUrl(activeVariant?.previewImage ?? product.primaryImage),
    ...product.galleryImages.slice(1).map((img) => resolveAssetUrl(img)),
  ];
  const mainImage = gallery[activeAngleIdx] ?? gallery[0];

  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleSelectVariant = (variantId: string) => {
    setSelectedVariantId(variantId);
    setActiveAngleIdx(0);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!activeVariant || variantStock <= 0) return;
    addToCart(product.id, activeVariant.id, quantity);
    setCartNotice(true);
    window.setTimeout(() => setCartNotice(false), 1800);
  };

  const handleBuyNow = () => {
    if (!activeVariant || variantStock <= 0) return;
    addToCart(product.id, activeVariant.id, quantity);
    navigate('/checkout');
  };

  return (
    <div className="wrap py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="text-[13px] text-[#5E5857] mb-6 flex flex-wrap gap-2">
        <Link to="/" className="hover:text-[#7A3D49] no-underline text-[#5E5857]">
          Home
        </Link>
        <span>/</span>
        <Link
          to={`/shop?category=${product.categoryId}`}
          className="hover:text-[#7A3D49] no-underline text-[#5E5857]"
        >
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-[#292626] font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-6 space-y-3">
          <div className="aspect-square rounded-[var(--r-md)] bg-white border border-[var(--border-hairline)] overflow-hidden">
            <img
              src={mainImage}
              alt={`Ilustrasi ${product.name} (${activeVariant?.label ?? ''})`}
              width={600}
              height={600}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {gallery.map((imgUrl, idx) => (
              <button
                key={`${imgUrl}-${idx}`}
                type="button"
                onClick={() => setActiveAngleIdx(idx)}
                className={`aspect-square rounded-[var(--r-md)] bg-white border overflow-hidden cursor-pointer ${
                  activeAngleIdx === idx
                    ? 'border-[#7A3D49] ring-2 ring-[#7A3D49]/30'
                    : 'border-[var(--border-hairline)]'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Tampilan ${idx + 1} untuk ${product.name}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>

          <p className="m-0 text-[13px] text-[#5E5857]">
            Ilustrasi kemasan vektor studio presisi untuk demonstrasi katalog dan simulasi varian
            produk (bukan aset kemasan resmi pihak ketiga).
          </p>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to={`/brands?selected=${product.brandId}`}
                className="text-sm font-medium uppercase tracking-wider text-[#7A3D49] no-underline hover:underline"
              >
                {product.brandName}
              </Link>
              <span className="text-[#5E5857]">·</span>
              <span className="text-sm text-[#5E5857]">SKU: {product.sku}</span>
              <ProductStatusBadge status={product.status} />
            </div>

            <h1 className="font-display text-4xl text-[#292626] m-0 mt-2 leading-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#5E5857]">
              <span className="inline-flex items-center gap-1.5 text-[#292626] font-medium tabular-nums">
                <Star size={16} className="fill-[#B87883] text-[#B87883]" aria-hidden="true" />
                {product.ratingDemo.toFixed(1)} ({product.reviewCountDemo} ulasan demo)
              </span>
              <span>Isi/Format: {product.sizeLabel}</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-medium tabular-nums text-[#292626]">
                {formatIDR(effectivePrice)}
              </span>
              {discountPct > 0 && !activeVariant?.priceOverride && (
                <>
                  <span className="text-base line-through tabular-nums text-[#5E5857]">
                    {formatIDR(product.price)}
                  </span>
                  <span className="px-2 py-0.5 rounded-[var(--r-sm)] bg-[#E8A5AD] text-[#292626] text-[13px] font-medium">
                    Hemat {discountPct}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Conditional Shade Picker vs Unit Size Selector */}
          <div className="p-4 rounded-[var(--r-md)] bg-white border border-[var(--border-hairline)] space-y-3">
            {product.hasShades ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-[#292626]">
                    Pilih Shade
                  </span>
                  <span className="text-sm text-[#7A3D49] font-medium">
                    Shade Terpilih: {activeVariant?.label}
                  </span>
                </div>
                <ShadeSwatches
                  hasShades
                  variants={product.variants}
                  selectedVariantId={activeVariant?.id}
                  onSelect={handleSelectVariant}
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleSelectVariant(v.id)}
                      className={`min-h-[44px] px-3 rounded-[var(--r-sm)] text-xs font-medium border cursor-pointer ${
                        v.id === activeVariant?.id
                          ? 'bg-[#292626] text-white border-[#292626]'
                          : 'bg-[#FAF8F5] text-[#292626] border-[var(--border-hairline)] hover:border-[#7A3D49]'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="m-0 text-sm font-medium text-[#292626]">
                  Pilih Varian Ukuran / Kemasan
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleSelectVariant(v.id)}
                      className={`min-h-[44px] px-4 rounded-[var(--r-sm)] text-sm font-medium border cursor-pointer ${
                        v.id === activeVariant?.id
                          ? 'bg-[#292626] text-white border-[#292626]'
                          : 'bg-[#FAF8F5] text-[#292626] border-[var(--border-hairline)] hover:border-[#7A3D49]'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p className="m-0 pt-2 border-t border-[var(--border-hairline)] text-sm text-[#5E5857] tabular-nums">
              Stok varian tersedia:{' '}
              <strong className="text-[#292626]">
                {variantStock > 0 ? `${variantStock} unit` : 'Habis'}
              </strong>
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center border border-[var(--border-strong)] rounded-[var(--r-md)] bg-white">
                <button
                  type="button"
                  aria-label="Kurangi jumlah"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="tap-target w-11 h-11 inline-flex items-center justify-center text-[#292626] disabled:opacity-40 cursor-pointer"
                >
                  <Minus size={16} strokeWidth={1.5} aria-hidden="true" />
                </button>
                <span className="w-10 text-center text-sm font-medium tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Tambah jumlah"
                  disabled={quantity >= variantStock}
                  onClick={() => setQuantity((q) => Math.min(variantStock, q + 1))}
                  className="tap-target w-11 h-11 inline-flex items-center justify-center text-[#292626] disabled:opacity-40 cursor-pointer"
                >
                  <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                disabled={variantStock <= 0}
                onClick={handleAddToCart}
                className="meika-btn flex-1 min-w-[180px] min-h-[48px] px-6 rounded-[var(--r-md)] bg-[#7A3D49] hover:bg-[#642F39] disabled:bg-[#5E5857]/40 text-white text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={17} strokeWidth={1.5} aria-hidden="true" />
                <span>
                  {variantStock <= 0
                    ? 'Stok Habis'
                    : cartNotice
                      ? 'Masuk ke Keranjang'
                      : 'Add to Cart'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={wishlisted ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
                className="tap-target w-12 h-12 rounded-[var(--r-md)] border border-[var(--border-strong)] bg-white inline-flex items-center justify-center cursor-pointer"
              >
                <Heart
                  size={18}
                  strokeWidth={1.5}
                  className={wishlisted ? 'fill-[#7A3D49] text-[#7A3D49]' : 'text-[#292626]'}
                  aria-hidden="true"
                />
              </button>
            </div>

            <button
              type="button"
              disabled={variantStock <= 0}
              onClick={handleBuyNow}
              className="meika-btn w-full min-h-[48px] rounded-[var(--r-md)] bg-[#E8A5AD] hover:bg-[#df949d] disabled:opacity-45 text-[#292626] text-sm font-medium cursor-pointer"
            >
              Buy Now (Lanjut Checkout Simulasi)
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--border-hairline)]">
            <div>
              <h2 className="text-base font-medium text-[#292626] m-0">Deskripsi Produk</h2>
              <p className="m-0 mt-1.5 text-sm text-[#5E5857] leading-relaxed">
                {product.description}
              </p>
            </div>
            <div>
              <h2 className="text-base font-medium text-[#292626] m-0">Cara Pemakaian</h2>
              <p className="m-0 mt-1.5 text-sm text-[#5E5857] leading-relaxed">
                {product.howToUse}
              </p>
            </div>
            <div>
              <h2 className="text-base font-medium text-[#292626] m-0">Ulasan Pelanggan (Demo)</h2>
              <div className="mt-2 space-y-2">
                {product.reviewsDemo.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-[var(--r-sm)] bg-white border border-[var(--border-hairline)]"
                  >
                    <div className="flex items-center justify-between text-xs text-[#5E5857]">
                      <span className="font-medium text-[#292626]">{rev.reviewerName}</span>
                      <span>
                        {rev.verifiedVariant} · {rev.rating.toFixed(1)}/5 ({rev.dateLabel})
                      </span>
                    </div>
                    <p className="m-0 mt-1 text-sm text-[#292626]">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="heading-related-products" className="mt-16 pt-10 border-t border-[var(--border-hairline)]">
          <h2 id="heading-related-products" className="h2-section m-0 mb-6 text-[#292626]">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

