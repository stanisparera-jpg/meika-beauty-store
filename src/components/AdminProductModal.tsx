import { Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type { Brand } from '../types/brand';
import type {
  MainCategoryId,
  MainCategoryLabel,
  Product,
  ProductStatus,
  ProductVariant,
} from '../types/product';

interface AdminProductModalProps {
  open: boolean;
  editingProduct: Product | null;
  brands: Brand[];
  onClose: () => void;
  onSave: (product: Product) => void;
}

const CATEGORY_OPTIONS: Array<{
  id: MainCategoryId;
  label: MainCategoryLabel;
  defaultSubcategory: string;
  defaultImage: string;
}> = [
  {
    id: 'face-makeup',
    label: 'Face Makeup',
    defaultSubcategory: 'Foundation',
    defaultImage: '/images/products/mk-01.svg',
  },
  {
    id: 'lip-makeup',
    label: 'Lip Makeup',
    defaultSubcategory: 'Lip Cream',
    defaultImage: '/images/products/mk-10.svg',
  },
  {
    id: 'eye-makeup',
    label: 'Eye Makeup',
    defaultSubcategory: 'Mascara',
    defaultImage: '/images/products/mk-15.svg',
  },
  {
    id: 'skincare',
    label: 'Skincare',
    defaultSubcategory: 'Serum',
    defaultImage: '/images/products/mk-22.svg',
  },
  {
    id: 'beauty-essentials',
    label: 'Beauty Essentials',
    defaultSubcategory: 'Makeup Brush',
    defaultImage: '/images/products/mk-29.svg',
  },
];

function slugifyName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'meika-product';
}

export function AdminProductModal({
  open,
  editingProduct,
  brands,
  onClose,
  onSave,
}: AdminProductModalProps) {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState(brands[0]?.id ?? 'maybelline');
  const [categoryId, setCategoryId] = useState<MainCategoryId>('lip-makeup');
  const [subcategory, setSubcategory] = useState('Lip Cream');
  const [sizeLabel, setSizeLabel] = useState('4 g');
  const [price, setPrice] = useState('99000');
  const [discountPrice, setDiscountPrice] = useState('');
  const [status, setStatus] = useState<ProductStatus>('new-arrival');
  const [hasShades, setHasShades] = useState(true);
  const [primaryImage, setPrimaryImage] = useState('/images/products/mk-10.svg');
  const [description, setDescription] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: 'v1', label: '01 Warm Nude', skuSuffix: 'V1', stock: 12, colorHex: '#C57B6D' },
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editingProduct) {
      setSku(editingProduct.sku);
      setName(editingProduct.name);
      setBrandId(editingProduct.brandId);
      setCategoryId(editingProduct.categoryId);
      setSubcategory(editingProduct.subcategory);
      setSizeLabel(editingProduct.sizeLabel);
      setPrice(String(editingProduct.price));
      setDiscountPrice(editingProduct.discountPrice ? String(editingProduct.discountPrice) : '');
      setStatus(editingProduct.status);
      setHasShades(editingProduct.hasShades);
      setPrimaryImage(editingProduct.primaryImage);
      setDescription(editingProduct.description);
      setHowToUse(editingProduct.howToUse);
      setVariants(editingProduct.variants.map((v) => ({ ...v })));
    } else {
      const randomNum = Math.floor(33 + Math.random() * 60);
      setSku(`MK-${randomNum}`);
      setName('');
      setBrandId(brands[0]?.id ?? 'maybelline');
      setCategoryId('lip-makeup');
      setSubcategory('Lip Cream');
      setSizeLabel('4 g');
      setPrice('99000');
      setDiscountPrice('');
      setStatus('new-arrival');
      setHasShades(true);
      setPrimaryImage('/images/products/mk-10.svg');
      setDescription('Produk kurasi tambahan MEIKA Beauty Store dengan kemasan studio demo.');
      setHowToUse('Aplikasikan sesuai kebutuhan harian dan simpan di tempat sejuk.');
      setVariants([
        {
          id: `v-${Date.now()}-1`,
          label: '01 Rose Clay',
          skuSuffix: 'V1',
          stock: 15,
          colorHex: '#C57B6D',
        },
      ]);
    }
    setFormError(null);
  }, [open, editingProduct, brands]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleCategoryChange = (nextCategory: MainCategoryId) => {
    setCategoryId(nextCategory);
    const matched = CATEGORY_OPTIONS.find((c) => c.id === nextCategory);
    if (matched && !editingProduct) {
      setSubcategory(matched.defaultSubcategory);
      setPrimaryImage(matched.defaultImage);
      const shouldUseShades = nextCategory !== 'skincare' && nextCategory !== 'beauty-essentials';
      setHasShades(shouldUseShades);
    }
  };

  const handleAddVariant = () => {
    const idx = variants.length + 1;
    setVariants((prev) => [
      ...prev,
      {
        id: `v-${Date.now()}-${idx}`,
        label: hasShades ? `Shade ${idx}` : `Ukuran ${idx}`,
        skuSuffix: `V${idx}`,
        stock: 10,
        ...(hasShades ? { colorHex: '#B87883' } : {}),
      },
    ]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numericPrice = Number(price);
    const numericDiscount = discountPrice.trim() ? Number(discountPrice) : undefined;

    if (!sku.trim() || !name.trim()) {
      setFormError('SKU dan Nama Produk wajib diisi.');
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setFormError('Harga normal harus lebih besar dari Rp 0.');
      return;
    }
    if (numericDiscount !== undefined && (numericDiscount <= 0 || numericDiscount >= numericPrice)) {
      setFormError('Harga diskon harus lebih kecil dari harga normal dan lebih besar dari 0.');
      return;
    }
    if (variants.length === 0 || variants.some((v) => !v.label.trim())) {
      setFormError('Minimal 1 varian dengan label yang valid wajib tersedia.');
      return;
    }

    const brand = brands.find((b) => b.id === brandId) ?? brands[0];
    const catMeta = CATEGORY_OPTIONS.find((c) => c.id === categoryId) ?? CATEGORY_OPTIONS[0];
    const productId = editingProduct?.id ?? `mk-custom-${Date.now()}`;
    const safeVariants: ProductVariant[] = variants.map((v, i) => ({
      ...v,
      id: v.id || `${productId}-v${i + 1}`,
      stock: Math.max(0, Number.isFinite(v.stock) ? Math.floor(v.stock) : 0),
      colorHex: hasShades ? v.colorHex || '#C57B6D' : undefined,
      previewImage: v.previewImage ?? primaryImage,
    }));

    const payload: Product = {
      id: productId,
      sku: sku.trim().toUpperCase(),
      slug: editingProduct?.slug ?? `${slugifyName(name)}-${sku.trim().toLowerCase()}`,
      name: name.trim(),
      brandId: brand?.id ?? 'maybelline',
      brandName: brand?.name ?? 'Maybelline',
      categoryId,
      categoryName: catMeta.label,
      subcategory: subcategory.trim() || catMeta.defaultSubcategory,
      description: description.trim() || 'Deskripsi produk katalog demo MEIKA Beauty Store.',
      howToUse: howToUse.trim() || 'Gunakan sesuai petunjuk pada label produk.',
      sizeLabel: sizeLabel.trim() || 'Standard',
      price: Math.round(numericPrice),
      discountPrice: numericDiscount ? Math.round(numericDiscount) : undefined,
      primaryImage: primaryImage.trim() || catMeta.defaultImage,
      galleryImages: editingProduct?.galleryImages?.length
        ? editingProduct.galleryImages
        : [primaryImage.trim() || catMeta.defaultImage],
      ratingDemo: editingProduct?.ratingDemo ?? 4.8,
      reviewCountDemo: editingProduct?.reviewCountDemo ?? 12,
      reviewsDemo: editingProduct?.reviewsDemo ?? [],
      hasShades,
      variants: safeVariants,
      status,
      isRecommended: editingProduct?.isRecommended,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-product-modal-title"
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-black/15 rounded-[var(--r-lg)] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
        <div className="flex items-center justify-between gap-4 border-b border-black/10 pb-3">
          <h2 id="admin-product-modal-title" className="font-display text-2xl text-[#292626]">
            {editingProduct ? `Edit Produk (${editingProduct.sku})` : 'Tambah Produk Katalog'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal produk"
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-[var(--r-sm)] border border-black/15 text-[#292626] hover:bg-[#F6E8E9] cursor-pointer"
          >
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-sku" className="block text-xs font-medium text-[#292626] mb-1">
                Kode SKU
              </label>
              <input
                id="modal-sku"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
              />
            </div>

            <div>
              <label htmlFor="modal-brand" className="block text-xs font-medium text-[#292626] mb-1">
                Merek (Brand)
              </label>
              <select
                id="modal-brand"
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
              >
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="modal-name" className="block text-xs font-medium text-[#292626] mb-1">
              Nama Produk
            </label>
            <input
              id="modal-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Velvet Satin Lip Cream"
              className="w-full min-h-[42px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="modal-cat" className="block text-xs font-medium text-[#292626] mb-1">
                Kategori Utama
              </label>
              <select
                id="modal-cat"
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value as MainCategoryId)}
                className="w-full min-h-[42px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="modal-sub" className="block text-xs font-medium text-[#292626] mb-1">
                Subkategori
              </label>
              <input
                id="modal-sub"
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
              />
            </div>

            <div>
              <label htmlFor="modal-size" className="block text-xs font-medium text-[#292626] mb-1">
                Ukuran / Netto
              </label>
              <input
                id="modal-size"
                type="text"
                value={sizeLabel}
                onChange={(e) => setSizeLabel(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="modal-price" className="block text-xs font-medium text-[#292626] mb-1">
                Harga Normal (IDR)
              </label>
              <input
                id="modal-price"
                type="number"
                min={1000}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full min-h-[42px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="modal-discount"
                className="block text-xs font-medium text-[#292626] mb-1"
              >
                Harga Diskon (Opsional)
              </label>
              <input
                id="modal-discount"
                type="number"
                min={0}
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Kosongkan jika normal"
                className="w-full min-h-[42px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
              />
            </div>

            <div>
              <label htmlFor="modal-status" className="block text-xs font-medium text-[#292626] mb-1">
                Status Lencana
              </label>
              <select
                id="modal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full min-h-[42px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
              >
                <option value="regular">Regular</option>
                <option value="best-seller">Best Seller</option>
                <option value="new-arrival">New Arrival</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="modal-hasshades"
              type="checkbox"
              checked={hasShades}
              onChange={(e) => setHasShades(e.target.checked)}
              className="w-4 h-4 accent-[#7A3D49]"
            />
            <label htmlFor="modal-hasshades" className="text-sm text-[#292626]">
              Produk memiliki variasi shade warna kosmetik
            </label>
          </div>

          <div>
            <label htmlFor="modal-desc" className="block text-xs font-medium text-[#292626] mb-1">
              Deskripsi Produk
            </label>
            <textarea
              id="modal-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
            />
          </div>

          <div className="space-y-2 border-t border-black/10 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#575252]">
                Daftar Varian ({variants.length})
              </span>
              <button
                type="button"
                onClick={handleAddVariant}
                className="min-h-[36px] px-3 inline-flex items-center gap-1 rounded-[var(--r-sm)] border border-[#B87883] text-xs text-[#7A3D49] hover:bg-[#F6E8E9] cursor-pointer"
              >
                <Plus size={14} strokeWidth={1.5} aria-hidden="true" />
                <span>Tambah Varian</span>
              </button>
            </div>

            {variants.map((variant, index) => (
              <div key={variant.id} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  aria-label={`Label varian ${index + 1}`}
                  value={variant.label}
                  onChange={(e) =>
                    setVariants((prev) =>
                      prev.map((item, i) => (i === index ? { ...item, label: e.target.value } : item)),
                    )
                  }
                  className="col-span-6 min-h-[40px] px-2.5 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-xs"
                />
                {hasShades ? (
                  <input
                    type="color"
                    aria-label={`Warna hex varian ${index + 1}`}
                    value={variant.colorHex || '#C57B6D'}
                    onChange={(e) =>
                      setVariants((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, colorHex: e.target.value } : item,
                        ),
                      )
                    }
                    className="col-span-2 h-[40px] w-full rounded-[var(--r-sm)] border border-black/20 bg-white cursor-pointer"
                  />
                ) : (
                  <span className="col-span-2 text-xs text-center text-[#575252]">Non-Shade</span>
                )}
                <input
                  type="number"
                  min={0}
                  aria-label={`Stok varian ${index + 1}`}
                  value={variant.stock}
                  onChange={(e) =>
                    setVariants((prev) =>
                      prev.map((item, i) =>
                        i === index ? { ...item, stock: Number(e.target.value) } : item,
                      ),
                    )
                  }
                  className="col-span-3 min-h-[40px] px-2.5 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-xs"
                />
                <button
                  type="button"
                  aria-label={`Hapus varian ${index + 1}`}
                  disabled={variants.length <= 1}
                  onClick={() =>
                    setVariants((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="col-span-1 min-h-[40px] inline-flex items-center justify-center rounded-[var(--r-sm)] text-[#575252] hover:text-[#B91C1C] disabled:opacity-40 cursor-pointer"
                >
                  <Trash2 size={15} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          {formError && (
            <p role="alert" className="text-xs text-[#B91C1C] bg-[#FEE2E2] px-3 py-2 rounded-[var(--r-sm)]">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-black/10">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] px-4 rounded-[var(--r-sm)] border border-black/15 text-sm text-[#292626] hover:bg-[#F6E8E9] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="meika-btn min-h-[42px] px-5 rounded-[var(--r-sm)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-sm font-medium cursor-pointer"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

