import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { AdminProductModal } from '../components/AdminProductModal';
import { useMeikaStore } from '../hooks/useMeikaStore';
import { AdminLayout } from '../layouts/AdminLayout';
import { computeSimulatedRevenue } from '../services/orderLifecycleService';
import type { OrderStatus } from '../types/order';
import type { Product } from '../types/product';
import { resolveAssetUrl } from '../utils/assetUrl';
import { formatIDR, getEffectivePrice, getProductTotalStock } from '../utils/formatters';

type AdminTab = 'products' | 'inventory-promo' | 'orders';

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  Pending: 'bg-[#F6E8E9] text-[#292626] border-[#E8A5AD]',
  Processing: 'bg-[#FEF3C7] text-[#292626] border-[#D97706]/40',
  Shipped: 'bg-[#E0F2FE] text-[#292626] border-[#0284C7]/35',
  Delivered: 'bg-[#DCFCE7] text-[#15803D] border-[#15803D]/35',
  Cancelled: 'bg-[#FEE2E2] text-[#B91C1C] border-[#B91C1C]/35',
};

export function AdminDashboardPage() {
  const {
    products,
    brands,
    promoCodes,
    homeBanners,
    orders,
    adminSaveProduct,
    adminDeleteProduct,
    adminUpdateVariantStock,
    adminSavePromoCode,
    adminTogglePromoActive,
    adminToggleBannerActive,
    adminUpdateOrderStatus,
  } = useMeikaStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [productQuery, setProductQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoPercent, setNewPromoPercent] = useState('15');
  const [newPromoMinSpend, setNewPromoMinSpend] = useState('100000');
  const [newPromoDesc, setNewPromoDesc] = useState('');

  const simulatedRevenue = useMemo(() => computeSimulatedRevenue(orders), [orders]);

  const lowStockItems = useMemo(() => {
    const entries: Array<{ product: Product; variantLabel: string; variantId: string; stock: number }> =
      [];
    for (const product of products) {
      for (const variant of product.variants) {
        if (variant.stock <= 5) {
          entries.push({
            product,
            variantLabel: variant.label,
            variantId: variant.id,
            stock: variant.stock,
          });
        }
      }
    }
    return entries;
  }, [products]);

  const brandSummary = useMemo(() => {
    return brands.map((brand) => {
      const brandProducts = products.filter((p) => p.brandId === brand.id);
      const totalStock = brandProducts.reduce((sum, p) => sum + getProductTotalStock(p), 0);
      return {
        brand,
        skuCount: brandProducts.length,
        totalStock,
      };
    });
  }, [brands, products]);

  const categorySummary = useMemo(() => {
    const map = new Map<string, { label: string; skuCount: number; totalStock: number }>();
    for (const product of products) {
      const current = map.get(product.categoryId) ?? {
        label: product.categoryName,
        skuCount: 0,
        totalStock: 0,
      };
      current.skuCount += 1;
      current.totalStock += getProductTotalStock(product);
      map.set(product.categoryId, current);
    }
    return Array.from(map.entries()).map(([id, data]) => ({ id, ...data }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q),
    );
  }, [products, productQuery]);

  const handleSaveProduct = (payload: Product) => {
    adminSaveProduct(payload);
    setNotice(`Produk ${payload.sku} (${payload.name}) berhasil disimpan ke katalog.`);
  };

  const handleDeleteProduct = (product: Product) => {
    adminDeleteProduct(product.id);
    setNotice(`Produk ${product.sku} (${product.name}) dihapus dari daftar katalog sesi ini.`);
  };

  const handleCreatePromo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = newPromoCode.trim().toUpperCase();
    const pct = Number(newPromoPercent);
    const minSpend = Number(newPromoMinSpend);
    if (!cleaned || pct <= 0 || pct > 90) {
      setNotice('Kode promo dan persentase diskon (1-90%) harus valid.');
      return;
    }
    adminSavePromoCode({
      code: cleaned,
      label: newPromoDesc.trim() || `Potongan simulasi ${Math.round(pct)}% untuk kode ${cleaned}`,
      type: 'percent',
      value: Math.round(pct),
      minSubtotal: Math.max(0, Math.round(minSpend)),
      active: true,
    });
    setNewPromoCode('');
    setNewPromoDesc('');
    setNotice(`Kode promo ${cleaned} berhasil ditambahkan dan aktif.`);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
              Dashboard Operasional Retail Kecantikan
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-[#292626] mt-1">
              Ringkasan & Kontrol Katalog
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
            className="meika-btn min-h-[44px] px-5 inline-flex items-center gap-2 rounded-[var(--r-sm)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-sm font-medium cursor-pointer"
          >
            <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>Tambah Produk</span>
          </button>
        </div>

        {/* Overview KPI Row (<=4 balanced cards, explicit Data Simulasi label on revenue) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-black/10 rounded-[var(--r-md)] p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#575252]">
              <span>Total Katalog Aktif</span>
              <Package size={16} strokeWidth={1.5} className="text-[#7A3D49]" aria-hidden="true" />
            </div>
            <p className="font-display text-3xl text-[#292626] tabular-nums">
              {products.length} SKU
            </p>
            <p className="text-xs text-[#575252]">{brands.length} Merek Terkurasi</p>
          </div>

          <div className="bg-white border border-black/10 rounded-[var(--r-md)] p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#575252]">
              <span>Pesanan Tercatat</span>
              <ShoppingBag size={16} strokeWidth={1.5} className="text-[#7A3D49]" aria-hidden="true" />
            </div>
            <p className="font-display text-3xl text-[#292626] tabular-nums">
              {orders.length} Pesanan
            </p>
            <p className="text-xs text-[#575252]">
              {orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length} Perlu
              Diproses
            </p>
          </div>

          <div className="bg-white border border-black/10 rounded-[var(--r-md)] p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#575252]">
              <span>Estimasi Omzet (Data Simulasi)</span>
              <TrendingUp size={16} strokeWidth={1.5} className="text-[#7A3D49]" aria-hidden="true" />
            </div>
            <p className="font-display text-2xl sm:text-3xl text-[#292626] tabular-nums">
              {formatIDR(simulatedRevenue)}
            </p>
            <p className="text-xs text-[#575252]">Pesanan berstatus Cancelled dikecualikan</p>
          </div>

          <div className="bg-white border border-black/10 rounded-[var(--r-md)] p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#575252]">
              <span>Peringatan Stok Rendah</span>
              <AlertTriangle size={16} strokeWidth={1.5} className="text-[#B45309]" aria-hidden="true" />
            </div>
            <p className="font-display text-3xl text-[#292626] tabular-nums">
              {lowStockItems.length} Varian
            </p>
            <p className="text-xs text-[#575252]">Stok varian &le; 5 unit perlu pengisian</p>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--r-md)] bg-[#F6E8E9] border border-[#E8A5AD] text-sm text-[#292626]"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="text-xs font-medium text-[#7A3D49] hover:underline cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Section Tabs */}
        <div role="tablist" aria-label="Panel Kontrol Admin MEIKA" className="flex flex-wrap gap-2 border-b border-black/10 pb-3">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'products'}
            onClick={() => setActiveTab('products')}
            className={`min-h-[44px] px-4 inline-flex items-center gap-2 rounded-[var(--r-sm)] text-sm font-medium cursor-pointer transition-colors ${
              activeTab === 'products'
                ? 'bg-[#292626] text-[#FAF8F5]'
                : 'bg-white border border-black/15 text-[#292626] hover:bg-[#F6E8E9]'
            }`}
          >
            <Boxes size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>Manajemen Produk ({products.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'inventory-promo'}
            onClick={() => setActiveTab('inventory-promo')}
            className={`min-h-[44px] px-4 inline-flex items-center gap-2 rounded-[var(--r-sm)] text-sm font-medium cursor-pointer transition-colors ${
              activeTab === 'inventory-promo'
                ? 'bg-[#292626] text-[#FAF8F5]'
                : 'bg-white border border-black/15 text-[#292626] hover:bg-[#F6E8E9]'
            }`}
          >
            <Tag size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>Stok & Promosi</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
            className={`min-h-[44px] px-4 inline-flex items-center gap-2 rounded-[var(--r-sm)] text-sm font-medium cursor-pointer transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#292626] text-[#FAF8F5]'
                : 'bg-white border border-black/15 text-[#292626] hover:bg-[#F6E8E9]'
            }`}
          >
            <ClipboardList size={16} strokeWidth={1.5} aria-hidden="true" />
            <span>Manajemen Pesanan ({orders.length})</span>
          </button>
        </div>

        {/* Tab 1: Products CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label htmlFor="admin-search-sku" className="sr-only">
                Cari SKU atau merek di tabel
              </label>
              <input
                id="admin-search-sku"
                type="search"
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                placeholder="Cari SKU, nama produk, atau merek..."
                className="w-full sm:w-80 min-h-[42px] px-3.5 rounded-[var(--r-sm)] border border-black/20 bg-white text-sm"
              />
              <span className="text-xs text-[#575252]">
                Menampilkan {filteredProducts.length} dari {products.length} produk
              </span>
            </div>

            <div className="bg-white border border-black/10 rounded-[var(--r-md)] overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-[#FAF8F5] border-b border-black/10 text-xs uppercase tracking-wider text-[#575252]">
                  <tr>
                    <th className="py-3 px-4 font-medium">SKU</th>
                    <th className="py-3 px-4 font-medium">Produk & Merek</th>
                    <th className="py-3 px-4 font-medium">Kategori</th>
                    <th className="py-3 px-4 font-medium">Harga Efektif</th>
                    <th className="py-3 px-4 font-medium">Stok Total</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {filteredProducts.map((product) => {
                    const totalStock = getProductTotalStock(product);
                    return (
                      <tr key={product.id} className="hover:bg-[#FAF8F5]/70">
                        <td className="py-3 px-4 font-mono text-xs text-[#575252]">{product.sku}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={resolveAssetUrl(product.primaryImage)}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-[var(--r-sm)] bg-[#FAF8F5] border border-black/10 object-contain p-1 shrink-0"
                            />
                            <div>
                              <p className="font-medium text-[#292626]">{product.name}</p>
                              <p className="text-xs text-[#575252]">
                                {product.brandName} ({product.variants.length}{' '}
                                {product.hasShades ? 'shade' : 'varian'})
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-[#575252]">
                          {product.categoryName} / {product.subcategory}
                        </td>
                        <td className="py-3 px-4 tabular-nums font-medium text-[#292626]">
                          {formatIDR(getEffectivePrice(product))}
                        </td>
                        <td className="py-3 px-4 tabular-nums">
                          <span
                            className={`px-2 py-0.5 rounded-[var(--r-sm)] text-xs font-medium ${
                              totalStock <= 10
                                ? 'bg-[#FEF3C7] text-[#B45309]'
                                : 'bg-[#FAF8F5] text-[#292626]'
                            }`}
                          >
                            {totalStock} unit
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs capitalize text-[#575252]">
                          {product.status.replace('-', ' ')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              aria-label={`Edit ${product.sku}`}
                              onClick={() => {
                                setEditingProduct(product);
                                setModalOpen(true);
                              }}
                              className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-[var(--r-sm)] border border-black/15 text-[#292626] hover:bg-[#F6E8E9] cursor-pointer"
                            >
                              <Pencil size={14} strokeWidth={1.5} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Hapus ${product.sku}`}
                              onClick={() => handleDeleteProduct(product)}
                              className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-[var(--r-sm)] border border-black/15 text-[#B91C1C] hover:bg-[#FEE2E2] cursor-pointer"
                            >
                              <Trash2 size={14} strokeWidth={1.5} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Inventory, Brand/Category Summary & Promo Banners */}
        {activeTab === 'inventory-promo' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-black/10 rounded-[var(--r-md)] p-5 space-y-3">
                <h2 className="font-display text-2xl text-[#292626]">Ringkasan per Kategori</h2>
                <div className="divide-y divide-black/10 text-sm">
                  {categorySummary.map((cat) => (
                    <div key={cat.id} className="py-2.5 flex items-center justify-between">
                      <span className="font-medium text-[#292626]">{cat.label}</span>
                      <span className="text-xs text-[#575252] tabular-nums">
                        {cat.skuCount} SKU | {cat.totalStock} unit
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-black/10 rounded-[var(--r-md)] p-5 space-y-3">
                <h2 className="font-display text-2xl text-[#292626]">Ringkasan 10 Brand</h2>
                <div className="grid sm:grid-cols-2 gap-2.5 text-sm">
                  {brandSummary.map((entry) => (
                    <div
                      key={entry.brand.id}
                      className="flex items-center justify-between p-2.5 rounded-[var(--r-sm)] bg-[#FAF8F5] border border-black/10"
                    >
                      <span className="font-medium text-[#292626]">{entry.brand.name}</span>
                      <span className="text-xs text-[#575252] tabular-nums">
                        {entry.skuCount} SKU ({entry.totalStock})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Promo Codes + Banner Toggles */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-black/10 rounded-[var(--r-md)] p-5 space-y-4">
                <h2 className="font-display text-2xl text-[#292626]">Kelola Kode Promo Simulasi</h2>
                <div className="space-y-2.5">
                  {promoCodes.map((promo) => (
                    <div
                      key={promo.code}
                      className="flex items-center justify-between gap-3 p-3 rounded-[var(--r-sm)] bg-[#FAF8F5] border border-black/10"
                    >
                      <div>
                        <p className="font-mono text-sm font-semibold text-[#292626]">{promo.code}</p>
                        <p className="text-xs text-[#575252]">{promo.label}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => adminTogglePromoActive(promo.code)}
                        className={`min-h-[36px] px-3 rounded-[var(--r-sm)] text-xs font-medium cursor-pointer ${
                          promo.active
                            ? 'bg-[#DCFCE7] text-[#15803D] border border-[#15803D]/30'
                            : 'bg-white text-[#575252] border border-black/15'
                        }`}
                      >
                        {promo.active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCreatePromo} className="pt-3 border-t border-black/10 space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#575252]">
                    Tambah Kode Promo Baru
                  </p>
                  <div className="grid sm:grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      aria-label="Kode promo baru"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value)}
                      placeholder="Kode (cth: GLOW20)"
                      className="min-h-[40px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
                    />
                    <input
                      type="number"
                      aria-label="Persentase diskon"
                      value={newPromoPercent}
                      onChange={(e) => setNewPromoPercent(e.target.value)}
                      placeholder="Diskon (%)"
                      className="min-h-[40px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
                    />
                    <input
                      type="number"
                      aria-label="Minimal belanja promo"
                      value={newPromoMinSpend}
                      onChange={(e) => setNewPromoMinSpend(e.target.value)}
                      placeholder="Min. Belanja"
                      className="min-h-[40px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      aria-label="Deskripsi promo baru"
                      value={newPromoDesc}
                      onChange={(e) => setNewPromoDesc(e.target.value)}
                      placeholder="Keterangan singkat promo..."
                      className="flex-1 min-h-[40px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
                    />
                    <button
                      type="submit"
                      className="meika-btn min-h-[40px] px-4 rounded-[var(--r-sm)] bg-[#7A3D49] text-white text-xs font-medium cursor-pointer"
                    >
                      Tambah Promo
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white border border-black/10 rounded-[var(--r-md)] p-5 space-y-4">
                <h2 className="font-display text-2xl text-[#292626]">Banner Promosi Beranda</h2>
                <div className="space-y-2.5">
                  {homeBanners.map((banner) => (
                    <div
                      key={banner.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-[var(--r-sm)] bg-[#FAF8F5] border border-black/10"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#292626]">{banner.title}</p>
                        <p className="text-xs text-[#575252]">{banner.subtitle}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => adminToggleBannerActive(banner.id)}
                        className={`min-h-[36px] px-3 rounded-[var(--r-sm)] text-xs font-medium cursor-pointer shrink-0 ${
                          banner.active
                            ? 'bg-[#DCFCE7] text-[#15803D] border border-[#15803D]/30'
                            : 'bg-white text-[#575252] border border-black/15'
                        }`}
                      >
                        {banner.active ? 'Tampil di Home' : 'Disembunyikan'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Variant Stock Editor */}
            <div className="bg-white border border-black/10 rounded-[var(--r-md)] p-5 space-y-4">
              <h2 className="font-display text-2xl text-[#292626]">
                Penyesuaian Cepat Stok per Varian
              </h2>
              <div className="max-h-96 overflow-y-auto divide-y divide-black/10">
                {products.map((product) => (
                  <div key={product.id} className="py-3 space-y-2">
                    <p className="text-sm font-medium text-[#292626]">
                      {product.sku} - {product.name} ({product.brandName})
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((variant) => (
                        <label
                          key={variant.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--r-sm)] bg-[#FAF8F5] border border-black/10 text-xs"
                        >
                          <span>{variant.label}:</span>
                          <input
                            type="number"
                            min={0}
                            value={variant.stock}
                            onChange={(e) =>
                              adminUpdateVariantStock(
                                product.id,
                                variant.id,
                                Number(e.target.value) || 0,
                              )
                            }
                            className="w-16 min-h-[32px] px-2 rounded-[var(--r-sm)] border border-black/20 bg-white text-xs tabular-nums"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Order Status Management */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <p className="text-sm text-[#575252]">
              Perubahan status pesanan tersinkronisasi langsung dengan halaman{' '}
              <code>/orders</code> dan otomatis memulihkan stok apabila pesanan diubah ke{' '}
              <strong>Cancelled</strong>.
            </p>

            <div className="space-y-3">
              {orders.map((order) => (
                <article
                  key={order.orderId}
                  className="bg-white border border-black/10 rounded-[var(--r-md)] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-sm font-semibold text-[#292626]">
                        {order.orderId}
                      </span>
                      <span
                        data-testid={`order-status-${order.orderId}`}
                        className={`px-2.5 py-0.5 rounded-[var(--r-sm)] border text-xs font-medium ${STATUS_BADGE_CLASS[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#292626]">
                      {order.customer.fullName} ({order.customer.city}, {order.customer.shippingZone})
                    </p>
                    <p className="text-xs text-[#575252]">
                      {order.items.length} item | Total:{' '}
                      <strong className="text-[#292626]">{formatIDR(order.grandTotal)}</strong> |{' '}
                      {order.paymentStatusLabel}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label
                      htmlFor={`status-select-${order.orderId}`}
                      className="text-xs font-medium text-[#575252]"
                    >
                      Status Pesanan:
                    </label>
                    <select
                      id={`status-select-${order.orderId}`}
                      aria-label={`Ubah status pesanan ${order.orderId}`}
                      value={order.status}
                      onChange={(e) => {
                        const next = e.target.value as OrderStatus;
                        adminUpdateOrderStatus(order.orderId, next);
                        setNotice(
                          `Status pesanan ${order.orderId} diperbarui ke ${next}.`,
                        );
                      }}
                      className="min-h-[42px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm text-[#292626]"
                    >
                      {ORDER_STATUS_OPTIONS.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      <AdminProductModal
        open={modalOpen}
        editingProduct={editingProduct}
        brands={brands}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </AdminLayout>
  );
}
