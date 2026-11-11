# MEIKA Beauty Store Implementation Plan (Phases 4 to 10)

**Goal:** Membangun website e-commerce multi-brand kecantikan **MEIKA Beauty Store** (*Your Beauty, Your Choice.*) secara bertahap dari awal (mulai Phase 4 setelah Phase 1-3 perencanaan dan wireframe FigCraft disetujui), memenuhi 32+ SKU produk lintas 5 kategori dan 10 merek, seluruh 21 fitur interaktif, autentikasi role Admin & Pelanggan terpisah, materi Digital Marketing simulasi, dokumentasi 8 tahap Digital Entrepreneurship, serta template Usability Testing >=5 pengguna.

**Architecture:** Aplikasi SPA React 19 + TypeScript (strict) + Vite + Tailwind CSS v4 dengan pemisahan bersih antar-lapisan (`types/`, `data/`, `utils/`, `services/` murni yang diuji TDD Vitest -> `hooks/` -> `components/` -> `layouts/` -> `pages/`). Persistensi demo memakai `localStorage` berversi (`meika_v1_*`) dengan pemisahan kunci sesi akun pelanggan vs administrator (`ProtectedAdminRoute` guard).

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, React Router v7, Lucide React (`strokeWidth={1.5}`), Vitest, `@testing-library/react`, `jsdom`, plus Microsoft Edge headless & Taste Skill visual/copy scripts.

**Spec:** [`docs/superpowers/specs/2026-11-11-meika-beauty-design.md`](../../specs/2026-11-11-meika-beauty-design.md) & [`DESIGN.md`](../../../DESIGN.md).

**Global Constraints:**
- Eksekusi kode (`Phase 4+`) hanya dimulai setelah persetujuan Phase 1-3 (Spec, `DESIGN.md`, Implementation Plan, dan desain di FigCraft).
- Dilarang memakai konsep NOVAÉ / tas fashion dari iterasi lama.
- Mode Anti-Slop `during` wajib dijalankan di seluruh file: nol em-dash (`U+2014`), nol placeholder/lorem ipsum, nol sertifikasi/BPOM/klaim medis palsu, tombol sentuh mobile minimal `44x44px`, `#E8A5AD` wajib berpasangan dengan `#292626` (`7.44:1`) dan CTA teks putih wajib `#7A3D49` (`8.10:1`).
- Seluruh layanan perhitungan, filter, keranjang, checkout, autentikasi, dan CRUD Admin mengikuti siklus TDD Red-Green-Refactor (`superpowers:test-driven-development`).

**Review Focus:**
- Shade picker hanya tampil untuk produk berwarna (`hasShades: true`), tidak muncul di produk Skincare/Beauty Tools non-warna.
- Akses `/admin` menolak pengguna tanpa role `'admin'` yang valid (termasuk menolak role `'customer'`).
- Kepatuhan visual, performa gambar, konsol browser bersih, serta zero horizontal overflow di 1440px, 768px/820px, dan 390px.

---

### Task 1 (Phase 4.1): Inisialisasi Proyek Vite + React + TypeScript + Token `DESIGN.md`

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `index.html`, `src/test/setup.ts`
- Create: `src/styles/tokens.css`, `src/styles/motion.css`, `src/index.css`

**Interfaces:**
- Produces: Build toolchain (`npm run dev`, `npm run build`, `npm test`), font Google `Instrument Serif` (400) & `Instrument Sans` (400, 500), CSS variables warna & tipografi dari `DESIGN.md`.

**Steps:**
1. Konfirmasi metode penyediaan aset gambar kategori/produk sesuai `specs/2026-11-11-meika-beauty-design.md` (sebelum mengunduh/menghasilkan berkas visual).
2. Inisialisasi `package.json` dan verifikasi kompatibilitas versi `react`, `react-dom`, `react-router-dom`, `lucide-react`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `vitest`, `@testing-library/react`, `jsdom` lalu jalankan instalasi paket.
3. Buat konfigurasi `tsconfig.json` strict, `vite.config.ts`, `vitest.config.ts`, `index.html`, serta `src/styles/tokens.css` + `src/styles/motion.css` (mendukung `prefers-reduced-motion`).
4. Verifikasi `npx tsc --noEmit` dan smoke test Vitest berhasil.

---

### Task 2 (Phase 4.2): Tipe Domain, Format Rupiah & Seed 32+ Produk Multi-Brand (`TDD`)

**Files:**
- Create: `src/types/product.ts`, `src/types/brand.ts`, `src/types/cart.ts`, `src/types/order.ts`, `src/types/auth.ts`, `src/types/marketing.ts`
- Create: `src/utils/formatters.ts`, `src/utils/formatters.test.ts`
- Create: `src/data/brands.ts`, `src/data/products.ts`, `src/data/products.test.ts`

**Interfaces:**
- Consumes: Skema produk Brief Section 2 (5 kategori utama, 29 subkategori, 10 merek, `hasShades` flag, rating/review demo).
- Produces: Katalog awal `>= 32` SKU unik bebas duplikasi & klaim medis, fungsi `formatIDR`, `calculateDiscountPercent`, `getEffectivePrice`.

**Steps:**
1. **(RED):** Tulis `src/utils/formatters.test.ts` dan `src/data/products.test.ts` yang memvalidasi `>= 32` SKU, semua 5 kategori utama, semua 29 subkategori brief, dan semua 10 brand terwakili, nol duplikasi ID/SKU/nama, Setting Spray + Skincare + Beauty Tools memiliki `hasShades === false`, total stok diturunkan dari `variants`, serta harga diskon selalu `< price`.
2. Jalankan Vitest dan pastikan gagal.
3. **(GREEN):** Implementasikan `src/types/*.ts`, `src/utils/formatters.ts`, `src/data/brands.ts`, dan `src/data/products.ts` (32 produk realistis lintas Face/Lip/Eye/Skincare/Beauty Essentials).
4. Jalankan test dan pastikan 100% lulus.

---

### Task 3 (Phase 5.1): Services Domain Murni: Storage, Auth RBAC, Query Katalog, Cart & Checkout Validator (`TDD`)

**Files:**
- Create: `src/services/storageService.ts`, `src/services/storageService.test.ts`
- Create: `src/services/authService.ts`, `src/services/authService.test.ts`
- Create: `src/services/catalogQueryService.ts`, `src/services/catalogQueryService.test.ts`
- Create: `src/services/cartPricingService.ts`, `src/services/cartPricingService.test.ts`
- Create: `src/services/checkoutValidator.ts`, `src/services/checkoutValidator.test.ts`
- Create: `src/hooks/useMeikaStore.tsx`

**Interfaces:**
- Consumes: Input filter (q, category, subcategory, brands[], priceRange, minRating, inStockOnly, sortBy), payload login role `'customer' | 'admin'`, form alamat checkout, aksi keranjang/pesanan/CRUD.
- Produces: Fungsi murni query & sorting, kalkulasi subtotal + diskon produk + ongkos kirim simulasi + grand total, validasi alamat Indonesia lengkap, autentikasi role (`canAccessAdmin`), serta Context provider `useMeikaStore()`.

**Steps:**
1. **(RED):** Tulis tes gagal di kelima file `*.test.ts` (menguji JSON korup `localStorage`, penolakan role `'customer'` oleh `canAccessAdmin`, filter gabungan brand + kategori + harga + rating + sorting, batas kuantitas vs stok varian, dan validator alamat/telepon/kode pos Indonesia).
2. Jalankan Vitest dan verifikasi gagal sesuai ekspektasi.
3. **(GREEN):** Implementasikan seluruh service murni dan hook Context `useMeikaStore.tsx` (beserta sinkronisasi mutasi stok saat order demo dibuat dan pengubahan status pesanan dari Admin).
4. Jalankan seluruh unit test service dan pastikan lulus tanpa warning.

---

### Task 4 (Phase 4.3): Layout Global, Announcement Bar, Navbar + Search Modal, Drawer Mobile & Footer

**Files:**
- Create: `src/components/AnnouncementBar.tsx`, `src/components/Navbar.tsx`, `src/components/SearchOverlay.tsx`, `src/components/MobileDrawer.tsx`, `src/components/Footer.tsx`
- Create: `src/components/ProtectedAdminRoute.tsx`
- Create: `src/layouts/StorefrontLayout.tsx`, `src/layouts/AdminLayout.tsx`
- Create: `src/components/NavbarAndGuard.test.tsx`

**Interfaces:**
- Consumes: `useMeikaStore()` (`cartCount`, `wishlistCount`, `customerSession`, `adminSession`, `products`), keyboard `Esc` / fokus trap modal.
- Produces: Shell toko konsisten (Announcement bar dapat ditutup, Navbar `MEIKA`, menu `Home` / `Shop` / `Brands` / `About` / `Marketing`, pencarian instan dropdown + modal mobile `SearchOverlay`, tombol `Account` / `Wishlist` / `Cart`, tombol menu mobile `>= 44x44px`), dan `ProtectedAdminRoute` (mengembalikan error `403 Akses Ditolak` bila sesi aktif hanya `'customer'`, atau mengarahkan ke `/admin/login` bila belum ada sesi).

**Steps:**
1. **(RED):** Tulis `src/components/NavbarAndGuard.test.tsx` untuk menguji badge keranjang/wishlist, overlay pencarian langsung, penolakan `ProtectedAdminRoute` atas role non-admin, dan rendering tautan footer ke jalur masuk Admin yang terautentikasi.
2. Jalankan tes -> gagal.
3. **(GREEN):** Bangun seluruh komponen shell dan layout sesuai `DESIGN.md`.
4. Jalankan tes hingga hijau dan cek `npx tsc --noEmit`.

---

### Task 5 (Phase 4.4): Halaman Home Editorial (18 Komponen Brief Section 4.A)

**Files:**
- Create: `src/components/ProductCard.tsx`, `src/components/NewsletterSection.tsx`, `src/components/BrandStrip.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/hooks/useScrollMoment.ts`
- Create: `src/pages/HomePage.test.tsx`

**Interfaces:**
- Consumes: Data `products`, `brands`, `promotions`, handler `addToCart`, `toggleWishlist`, `subscribeNewsletter`.
- Produces: Hero kampanye *"Discover Your Beauty Essentials"* (animasi hero entrance 1 kali, foto `fetchpriority="high"`, CTA *"Shop Now"* `#7A3D49` & *"Explore Brands"* outline), Featured Brands (10 merek), Shop by Category (5 kategori utama), Best Sellers (produk tanpa duplikasi lintas blok di Home), New Arrivals, Trending Products, Special Promotions, Beauty Recommendations, Brand Introduction (dengan 1 dealt moment gulir tenang), Newsletter bervalidasi.

**Steps:**
1. **(RED):** Tulis `src/pages/HomePage.test.tsx` memverifikasi 18 blok utama muncul berurutan, CTA bekerja, produk terlaris/terbaru/trending memformat `Rp`, serta Newsletter memvalidasi email dan menyimpan ke `localStorage`.
2. Jalankan tes -> gagal.
3. **(GREEN):** Implementasikan `HomePage.tsx`, `ProductCard.tsx` (swatch shade kondisional hanya untuk makeup berwarna), dan `NewsletterSection.tsx`.
4. Jalankan tes hingga lulus.

---

### Task 6 (Phase 5.2): Halaman Shop Catalog (/shop) & Brand Directory (/brands)

**Files:**
- Create: `src/components/CatalogFilters.tsx`, `src/components/PaginationControls.tsx`
- Create: `src/pages/ShopPage.tsx`, `src/pages/BrandsPage.tsx`
- Create: `src/pages/ShopAndBrands.test.tsx`

**Interfaces:**
- Consumes: Query URL (`?category=...&brand=...&q=...&sort=...`), seluruh produk & merek dari store.
- Produces: Katalog interaktif dengan Search, Filter Kategori & Subkategori, Filter Brand, Filter Harga, Filter Rating Demo, Filter Ketersediaan Stok, Sorting (Terbaru, Termurah, Termahal, Terpopuler), Pagination/Load More, Empty state + Reset Filter, serta Brand Directory menampilkan logo tipografis/visual, deskripsi brand, jumlah produk real-time, dan koleksi produk merek terpilih.

**Steps:**
1. **(RED):** Tulis `src/pages/ShopAndBrands.test.tsx` menguji kombinasi multi-filter (misalnya Category + Brand + Rating + Price), sorting, pagination, serta pemilihan merek di `/brands`.
2. Jalankan tes -> gagal.
3. **(GREEN):** Implementasikan `ShopPage.tsx`, `CatalogFilters.tsx`, `PaginationControls.tsx`, dan `BrandsPage.tsx`.
4. Jalankan tes hingga hijau.

---

### Task 7 (Phase 5.3): Halaman Product Detail (/product/:slug) dengan Conditional Shade Picker

**Files:**
- Create: `src/pages/ProductDetailPage.tsx`
- Create: `src/pages/ProductDetailPage.test.tsx`

**Interfaces:**
- Consumes: Slug/ID produk, array varian/shade, stok per varian/total, handler keranjang & wishlist.
- Produces: Galeri foto multi-sudut yang merespons pilihan varian/shade, nama produk, brand, SKU, harga & persentase diskon, rating & ulasan demo, deskripsi jujur & info isi/cara pakai (nol klaim medis), **pemilih Shade HANYA pada produk `hasShades: true`**, pemilih ukuran/varian pada skincare/essentials, ketersediaan stok, quantity selector, **Add to Cart**, **Buy Now** (langsung ke `/checkout`), **Wishlist**, dan **Related Products**.

**Steps:**
1. **(RED):** Tulis `src/pages/ProductDetailPage.test.tsx` memverifikasi: (a) produk lip/foundation merender shade picker & mengganti label/gambar varian saat diklik, (b) produk facial wash / beauty blender TIDAK merender shade picker sama sekali, (c) kuantitas dibatasi oleh stok aktual, (d) halaman 404 produk tidak ditemukan menyediakan tautan balik ke `/shop`.
2. Jalankan tes -> gagal.
3. **(GREEN):** Bangun `ProductDetailPage.tsx`.
4. Jalankan tes hingga lulus.

---

### Task 8 (Phase 5.4): Shopping Cart, Wishlist, Account Demo, Checkout Validation & Order Tracking

**Files:**
- Create: `src/pages/CartPage.tsx`, `src/pages/WishlistPage.tsx`, `src/pages/AccountPage.tsx`
- Create: `src/pages/CheckoutPage.tsx`, `src/pages/OrderConfirmationPage.tsx`, `src/pages/OrderHistoryPage.tsx`
- Create: `src/pages/TransactionFlow.test.tsx`

**Interfaces:**
- Consumes: `cart`, `orders`, `session`, `checkoutValidator`, 3 metode pembayaran simulasi (Bank Transfer VA, E-Wallet QRIS, COD).
- Produces: Alur lengkap Cart -> Checkout (validasi kolom lengkap + pesan error terarah per input) -> Konfirmasi Pesanan (`Order ID`, tanggal, detail customer, daftar barang & shade terpilih, metode bayar, info kirim, grand total, status `Pending`, tombol **View Order** & **Continue Shopping**, disclaimer simulasi tegas) -> Order History & Tracking 5 status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).

**Steps:**
1. **(RED):** Tulis `src/pages/TransactionFlow.test.tsx` menguji edit kuantitas/hapus di Cart, pasang & lepas kode promo (`MEIKA10`), kalkulasi ongkos kirim Jabodetabek/Luar Jawa/gratis ongkir, penolakan submit Checkout saat field tidak valid, keberhasilan pembuatan pesanan baru (baik Guest Checkout maupun logged-in customer) lengkap dengan pengurangan stok varian & pembacaan ulang `/order-confirmation/:orderId` dari `localStorage` (tahan refresh) + pemulihan stok jika pesanan dibatalkan dari Admin.
2. Jalankan tes -> gagal.
3. **(GREEN):** Implementasikan ke-6 halaman transaksi & akun demo.
4. Jalankan tes hingga lulus.

---

### Task 9 (Phase 6): Protected Admin Dashboard (/admin/login & /admin)

**Files:**
- Create: `src/pages/AdminLoginPage.tsx`, `src/pages/AdminDashboardPage.tsx`
- Create: `src/components/AdminProductModal.tsx`, `src/components/AdminOrdersPanel.tsx`, `src/components/AdminTaxonomyPromoPanel.tsx`
- Create: `src/pages/AdminDashboardPage.test.tsx`

**Interfaces:**
- Consumes: `authService` (login & role `'admin'`), mutasi produk CRUD, manajemen brand/kategori, update stok inventori, manajemen banner/kode promo, dan pembaruan status pesanan.
- Produces: Login khusus Admin (`/admin/login` menampilkan petunjuk kredensial demo + pesan transparan batasan frontend prototype), Overview KPI bersih (Total Products, Total Orders, Simulated Revenue), CRUD Produk (termasuk pengelolaan `hasShades` & shade list), kelola kategori/merek/stok/promosi, dan update status pesanan (`Pending`..`Cancelled`) yang langsung sinkron ke halaman pelanggan `/orders`.

**Steps:**
1. **(RED):** Tulis `src/pages/AdminDashboardPage.test.tsx` menguji autentikasi gagal jika password salah / akun customer mencoba masuk `/admin`, berhasil masuk sebagai Admin, melakukan Create + Update + Delete produk yang tampak langsung di katalog, mengedit stok/promo, serta mengubah status pesanan.
2. Jalankan tes -> gagal.
3. **(GREEN):** Implementasikan halaman & modal Admin dengan tata letak studio inventaris editorial (bebas template dashboard klise).
4. Jalankan tes hingga hijau.

---

### Task 10 (Phase 7): About MEIKA, Dokumentasi 8 Tahapan Prototype, Template Usability Testing & Digital Marketing Hub

**Files:**
- Create: `src/data/prototypeDocs.ts`, `src/data/marketingData.ts`
- Create: `src/pages/AboutPage.tsx`, `src/pages/MarketingPage.tsx`
- Create: `src/pages/AboutAndMarketing.test.tsx`

**Interfaces:**
- Consumes: Konten Profil MEIKA, Visi/Misi, Nilai Brand, Customer Service info, 8 tahapan PPT Digital Entrepreneurship, skenario & format tabel kosong >=5 penguji Usability Testing, 3 konsep IG Organic, FB/IG Ads Single Image, WA Broadcast, Email Marketing, dan panel Analytics bertanda `Data Simulasi`.
- Produces: Halaman `/about` dan `/marketing` terintegrasi penuh ke menu utama tanpa klaim palsu.

**Steps:**
1. **(RED):** Tulis `src/pages/AboutAndMarketing.test.tsx` memastikan semua konten minimal akademis ter-render akurat, tabel UT kosong siap isi memiliki >=5 slot penguji & 8 langkah skenario, dan setiap metrik analitik kampanye memiliki penanda `Data Simulasi`.
2. Jalankan tes -> gagal.
3. **(GREEN):** Bangun `AboutPage.tsx` dan `MarketingPage.tsx`.
4. Jalankan tes hingga lulus.

---

### Task 11 (Phase 8, 9 & 10): Quality Assurance, Visual Audit Browser di Edge, Dokumentasi Final & Delivery Gate

**Files:**
- Create: `README.md` (seluruh 14 butir dokumentasi Brief Section 12 + gambar hasil prototype dari FigCraft & preview browser)
- Final verification against: `http://localhost:4173` (`vite preview`), seluruh berkas `src/`

**Steps:**
1. Jalankan full verification suite:
   - `npx tsc --noEmit` (nol error)
   - `npm test` (seluruh test suite TDD lulus 100%)
   - `npm run build` (`dist/` bersih tanpa warning fatal)
   - Audit `antislop-code` & pencarian nol em-dash (`U+2014`) di seluruh `src/`, `DESIGN.md`, `README.md`.
2. Jalankan server preview lokal (`vite preview`) dan lakukan **inspeksi browser aktual di Microsoft Edge** pada `1440x900` (Desktop), `768x1024` & `820x1180` (Tablet), dan `390x844` (Mobile):
   - Verifikasi nol console error, nol failed request, nol broken `<img>`, nol horizontal overflow, tap target mobile `>= 44x44px`, dan kontras warna di layar nyata.
   - Uji klik E2E utuh di browser: Search -> Filter & Sort `/shop` -> Buka Brand `/brands` -> Detail Produk (tes shade produk makeup vs non-shade skincare) -> Add to Cart -> Ubah qty di `/cart` -> Tes error & sukses Checkout -> Konfirmasi & Order Tracking -> Login `/admin/login` (tes gagal role customer vs sukses admin) -> CRUD Produk & Ubah Status Pesanan -> Verifikasi update status di `/orders`.
3. Perbaiki setiap bug/cacat visual yang ditemukan dan jalankan kembali verifikasi penuh setelah perbaikan terakhir.
4. Susun `README.md` lengkap (termasuk hasil uji aktual, tangkapan desain FigCraft, serta template Usability Testing & rencana evaluasi).
5. Tutup dengan laporan **Anti-Slop Delivery Gate 4 Blok (`PASS/FAIL`)** berbasis bukti uji nyata.
