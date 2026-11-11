import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMeikaStore } from '../hooks/useMeikaStore';
import type { Product } from '../types/product';
import { resolveAssetUrl } from '../utils/assetUrl';
import {
  calculateDiscountPercent,
  formatIDR,
  getEffectivePrice,
  getProductTotalStock,
} from '../utils/formatters';
import { ShadeSwatches } from './ShadeSwatches';
import { ProductStatusBadge } from './StatusBadge';

interface ProductCardProps {
  product: Product;
  eagerImage?: boolean;
}

export function ProductCard({ product, eagerImage = false }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist } = useMeikaStore();
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? '');
  const [imgFailed, setImgFailed] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
  const displayImage = resolveAssetUrl(selectedVariant?.previewImage ?? product.primaryImage);
  const effectivePrice = getEffectivePrice(product, selectedVariant);
  const discountPct = calculateDiscountPercent(product.price, product.discountPrice);
  const totalStock = getProductTotalStock(product);
  const wishlisted = wishlist.includes(product.id);

  const handleQuickAdd = () => {
    addToCart(product.id, selectedVariant?.id, 1);
    setAddedNotice(true);
    window.setTimeout(() => setAddedNotice(false), 1400);
  };

  return (
    <article className="meika-card bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-[#FAF8F5] overflow-hidden">
        <Link
          to={`/product/${product.slug}`}
          className="block w-full h-full no-underline"
          aria-label={`Lihat detail ${product.name}`}
        >
          {imgFailed ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#F6E8E9]">
              <span className="font-display text-xl text-[#292626]">{product.brandName}</span>
              <span className="text-[13px] text-[#5E5857] mt-1">{product.sku}</span>
            </div>
          ) : (
            <img
              src={displayImage}
              alt={`Ilustrasi ${product.brandName} ${product.name}`}
              width={600}
              height={600}
              loading={eagerImage ? 'eager' : 'lazy'}
              onError={() => setImgFailed(true)}
              className="meika-card-media w-full h-full object-contain"
            />
          )}
        </Link>

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto">
            {product.status !== 'regular' ? (
              <ProductStatusBadge status={product.status} />
            ) : discountPct > 0 ? (
              <span className="inline-block px-2.5 py-1 rounded-[var(--r-sm)] bg-[#E8A5AD] text-[#292626] text-[13px] leading-none font-medium">
                Hemat {discountPct}%
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={
              wishlisted
                ? `Hapus ${product.name} dari wishlist`
                : `Simpan ${product.name} ke wishlist`
            }
            aria-pressed={wishlisted}
            className="pointer-events-auto tap-target w-11 h-11 rounded-full bg-white/95 border border-[var(--border-hairline)] inline-flex items-center justify-center text-[#292626] hover:border-[#7A3D49] cursor-pointer"
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className={wishlisted ? 'fill-[#7A3D49] text-[#7A3D49]' : 'text-[#292626]'}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <p className="m-0 text-[13px] font-medium uppercase tracking-wider text-[#5E5857]">
            {product.brandName}
          </p>
          <h3 className="m-0 mt-1 text-base font-medium leading-snug text-[#292626]">
            <Link
              to={`/product/${product.slug}`}
              className="text-[#292626] hover:text-[#7A3D49] no-underline"
            >
              {product.name}
            </Link>
          </h3>
          <div className="mt-2.5">
            <ShadeSwatches
              hasShades={product.hasShades}
              variants={product.variants}
              selectedVariantId={selectedVariant?.id}
              onSelect={product.hasShades ? setSelectedVariantId : undefined}
              compact
            />
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--border-hairline)]">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg font-medium tabular-nums text-[#292626]">
                {formatIDR(effectivePrice)}
              </span>
              {discountPct > 0 && (
                <span className="text-[13px] line-through tabular-nums text-[#5E5857]">
                  {formatIDR(product.price)}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-[13px] text-[#5E5857] tabular-nums">
              <Star size={13} className="fill-[#B87883] text-[#B87883]" aria-hidden="true" />
              {product.ratingDemo.toFixed(1)}
            </span>
          </div>

          <button
            type="button"
            disabled={totalStock <= 0}
            onClick={handleQuickAdd}
            className="meika-btn mt-3 w-full min-h-[44px] px-3 rounded-[var(--r-md)] bg-[#7A3D49] hover:bg-[#642F39] disabled:bg-[#5E5857]/40 text-white text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag size={15} strokeWidth={1.5} aria-hidden="true" />
            <span>
              {totalStock <= 0
                ? 'Stok Habis'
                : addedNotice
                  ? 'Ditambahkan ke Cart'
                  : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

