import { useState } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMeikaStore } from '../hooks/useMeikaStore';
import { resolveAssetUrl } from '../utils/assetUrl';
import { formatIDR, getEffectivePrice, getProductTotalStock } from '../utils/formatters';

export function WishlistPage() {
  const { wishlist, products, toggleWishlist, addToCart } = useMeikaStore();
  const [addedId, setAddedId] = useState<string | null>(null);
  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddToCart = (productId: string, variantId?: string) => {
    addToCart(productId, variantId, 1);
    setAddedId(productId);
    window.setTimeout(() => setAddedId((prev) => (prev === productId ? null : prev)), 1400);
  };

  return (
    <div className="wrap py-8 lg:py-12">
      <div className="border-b border-[var(--border-hairline)] pb-5 mb-8">
        <h1 className="font-display text-4xl sm:text-5xl text-[#292626] m-0">Wishlist Saya</h1>
        <p className="m-0 mt-1 text-sm text-[#5E5857] tabular-nums">
          {savedProducts.length} produk tersimpan di daftar keinginan Anda.
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] p-10 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#F6E8E9] text-[#7A3D49] flex items-center justify-center mx-auto">
            <Heart size={22} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl text-[#292626] m-0 mt-3">
            Belum ada produk di Wishlist
          </h2>
          <p className="m-0 mt-2 text-sm text-[#5E5857]">
            Klik ikon hati pada kartu atau halaman produk untuk menyimpan produk yang ingin Anda
            bandingkan nanti.
          </p>
          <Link
            to="/shop"
            className="meika-btn mt-5 min-h-[44px] px-6 inline-flex items-center justify-center rounded-[var(--r-md)] bg-[#7A3D49] text-white text-sm font-medium no-underline"
          >
            Jelajahi Katalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {savedProducts.map((product) => {
            const availableVariant =
              product.variants.find((v) => v.stock > 0) ?? product.variants[0];
            const hasStock =
              getProductTotalStock(product) > 0 &&
              Boolean(availableVariant && availableVariant.stock > 0);
            const justAdded = addedId === product.id;
            return (
              <div
                key={product.id}
                className="bg-white rounded-[var(--r-md)] border border-[var(--border-hairline)] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <Link to={`/product/${product.slug}`} className="block aspect-square bg-[#FAF8F5]">
                    <img
                      src={resolveAssetUrl(product.primaryImage)}
                      alt={product.name}
                      width={600}
                      height={600}
                      className="w-full h-full object-contain"
                    />
                  </Link>
                  <div className="p-4">
                    <p className="m-0 text-xs uppercase tracking-wider text-[#5E5857]">
                      {product.brandName}
                    </p>
                    <Link
                      to={`/product/${product.slug}`}
                      className="block mt-1 font-medium text-base text-[#292626] hover:text-[#7A3D49] no-underline"
                    >
                      {product.name}
                    </Link>
                    <p className="m-0 mt-2 text-base font-medium tabular-nums text-[#292626]">
                      {formatIDR(getEffectivePrice(product))}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex gap-2">
                  <button
                    type="button"
                    disabled={!hasStock}
                    onClick={() => hasStock && handleAddToCart(product.id, availableVariant?.id)}
                    className="meika-btn flex-1 min-h-[44px] px-3 rounded-[var(--r-md)] bg-[#7A3D49] hover:bg-[#642F39] disabled:bg-[#5E5857]/40 text-white text-xs font-medium inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ShoppingBag size={14} strokeWidth={1.5} aria-hidden="true" />
                    <span>
                      {!hasStock ? 'Stok Habis' : justAdded ? 'Masuk ke Cart' : 'Ke Keranjang'}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`Hapus ${product.name} dari wishlist`}
                    onClick={() => toggleWishlist(product.id)}
                    className="tap-target w-11 h-11 rounded-[var(--r-md)] border border-[var(--border-strong)] inline-flex items-center justify-center text-[#94232D] hover:bg-[#F6E8E9] cursor-pointer"
                  >
                    <Trash2 size={16} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

