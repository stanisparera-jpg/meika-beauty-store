# Spesifikasi Desain & Perencanaan Proyek: MEIKA Beauty Store

Tanggal: 11 November 2026  
Status: Phase 1 & Phase 2 Selesai Disusun (Siap untuk Review Sebelum Implementasi Phase 4)  
Tagline Brand: *Your Beauty, Your Choice.*  
Integrasi Skill: Superpowers (`7.0.2`), Taste Skill (`2.5.1`), Anti-Slop (`3.2.28`)

---

## PHASE 1: Verifikasi Skill & Analisis Kebutuhan

### 1.1 Hasil Verifikasi Lingkungan & Tiga Skill
Seluruh komponen verifikasi diperiksa aktual di workspace sebelum penyusunan perencanaan:
- **Superpowers (`7.0.2`):** Terpasang utuh (`15` skill, `80/80` file). Bertanggung jawab atas `brainstorming`, analisis kebutuhan, `writing-plans`, arsitektur, `test-driven-development`, `systematic-debugging`, `requesting-code-review`, dan `verification-before-completion`.
- **Taste Skill (`2.5.1`):** Terpasang utuh (`design-taste-frontend`, `1631/1631` file, `10/10` skrip `.mjs` lolos `node -c`, `type.json` dan `palettes.json` valid, `Node v24.21.0 >= 22`, `Microsoft Edge` tersedia). Bertanggung jawab atas arah visual butik kecantikan editorial, tipografi, grid equal-edge, motion terkendali (`150ms/120ms/90ms`), pemeriksaan visual browser, dan audit `perf`/`copy-lint`.
- **Anti-Slop (`3.2.28`):** Terpasang utuh (`6` skill, `15/15` file) dengan `rules\AGENTS.md` mode `during` aktif serta `contrast-check.py` aktif berjalan via `Python 3.11.9`. Bertanggung jawab atas aturan mutu UI, copywriting Indonesia alami tanpa filler, aksesibilitas WCAG AA, target sentuh mobile `>= 44x44px`, liveliness dials, dan Delivery Gate 4 Blok (`PASS/FAIL`).
- **FigCraft Desktop (`0.17.0`):** Terpasang di `C:\Program Files\ArtCraft\FigCraft` dan terverifikasi terhubung live di `127.0.0.1:7979` via `figcraft-cli.exe mcp --attach 7979` untuk pengerjaan Phase 3 (Wireframe & High-Fidelity UI Design langsung di aplikasi).
- **Kondisi Workspace:** Bersih dari source code lama (hanya berisi [`PPT Digital-Entrepreneurship 8.pptx`](../../PPT%20Digital-Entrepreneurship%208.pptx) dan [`CONTOH Praktik Promosi Digital.pptx`](../../CONTOH%20Praktik%20Promosi%20Digital.pptx)), bebas sisa proyek sebelumnya sesuai ketentuan mulai dari awal.

### 1.2 Identitas Brand & Analisis Masalah Bisnis
- **Nama Brand / Toko:** **MEIKA Beauty Store** (*"Your Beauty, Your Choice."*)
- **Model Bisnis:** Multi-Brand Beauty Retail E-Commerce (*"A modern, accessible, curated beauty retail destination"*).
- **Target Pasar:** Perempuan dan laki-laki usia 18-35 tahun (mahasiswa dan pekerja muda) yang aktif di media sosial, menyukai makeup & skincare, terbiasa belanja daring, berdomisili di Jabodetabek serta kota besar Indonesia.
- **5 Masalah -> Solusi -> Manfaat:**
  1. Konsumen harus berpindah banyak toko untuk merek berbeda -> MEIKA menghimpun 10 merek kecantikan dalam satu katalog terkurasi (`/brands` & `/shop`).
  2. Info produk, harga, shade, dan kategori tersebar -> Struktur detail seragam (SKU, volume/isi, deskripsi jujur, shade interaktif khusus produk berwarna).
  3. Sulit mencari sesuai kebutuhan & anggaran -> Search cepat + filter multi-dimensi (kategori, brand, rentang harga Rp, rating demo, ketersediaan stok) + sorting.
  4. Pemesanan lewat DM media sosial tidak terstruktur -> Alur keranjang otomatis hingga checkout tervalidasi dan konfirmasi bernomor pesanan unik.
  5. Status pesanan sulit dipantau -> Riwayat pesanan + tracker progres `Pending -> Processing -> Shipped -> Delivered` (serta `Cancelled`) yang tersinkron langsung dengan panel Admin.

### 1.3 Keselarasan dengan Kedua PPT Perkuliahan Digital Entrepreneurship
- **Acuan `PPT Digital-Entrepreneurship 8.pptx`:**
  - Status produk adalah **High-Fidelity Interactive Prototype** (perpaduan fungsional + evolusioner), **bukan** produk final atau MVP dengan transaksi pembayaran riil (Slide 6, 9, 10, 16, 17).
  - Mengimplementasikan lengkap **8 Tahapan Prototype (Slide 11)** sebagai halaman dokumentasi terstruktur di `/about`.
  - Menyediakan rancangan **4 Metode Evaluasi (Slide 22)** dan skenario uji **>= 5 calon pengguna (Section 10 Brief)** berformat **template pencatatan kosong siap isi** (Task completion, Time on task, User errors, Navigation problems, User feedback, Improvement recommendations) tanpa data hasil uji palsu.
- **Acuan `CONTOH Praktik Promosi Digital.pptx`:**
  - Halaman `/marketing` memuat rancangan siap demonstrasi:
    1. Minimal 3 konsep **Instagram Organic Content** (*Product Spotlight*, *Beauty Recommendation*, *Promotional Campaign*) lengkap dengan arahan visual, caption alami untuk audiens Indonesia 18-35, tagar relevan, dan CTA.
    2. Konsep **Instagram / Facebook Ads** (Single Image Ad, Headline, Primary Text, CTA `"Shop Now"`, Target Audience Jabodetabek/kota besar, Objective: Traffic & Conversion).
    3. Konsep **WhatsApp Broadcast** yang personal, singkat, dan tidak bersifat spam.
    4. Konsep **Email Marketing** (Subject, Email Body, Product Recommendation, Offer, CTA).
    5. **Promotion Analytics Dashboard** (Impressions, Reach, Engagement, CTR, Conversion Rate) dengan penanda wajib **`Data Simulasi (Prototype)`** di seluruh kartu/grafik sehingga tidak mengklaim kampanye sudah berjalan nyata.

---

## PHASE 2: Arsitektur Sistem, Resolusi Tiga Skill & Spesifikasi Fitur

### 2.1 Resolusi Tumpang Tindih Tiga Skill (Sesuai Section 8 Integration Rules)
1. **Palet Pink/Rose vs Kontras Aksesibilitas (`R-25` & Taste Skill):**
   - Hasil uji `contrast-check.py` membuktikan `#E8A5AD` dengan teks putih (`#FFFFFF`) hanya mencapai `2.02:1` (GAGAL) dan `#B87883` di atas `#FAF8F5` hanya `3.27:1` (GAGAL teks normal).
   - **Keputusan:** Permukaan kanvas didominasi `#FAF8F5` Warm Ivory (`>=60%`) dan `#FFFFFF` (hindari dominasi pink di seluruh halaman). Warna `#E8A5AD` dipakai untuk blok aksen/tombol sekunder **selalu berpasangan dengan teks `#292626` (`7.44:1` PASS AA/AAA)**; `#B87883` dibatasi pada border/garis/ikon UI `>= 3.0:1` atau headline besar `>= 24px`; dan tombol aksi utama teks putih (`#FFFFFF`) memakai turunan rose tua **`#7A3D49` (`8.10:1` PASS AA/AAA)**.
2. **Multi-Page E-Commerce vs Aturan Single-Page Taste Skill:**
   - Taste Skill dirancang utamanya untuk landing page 1-layar-per-section; MEIKA mewajibkan alur belanja multi-halaman utuh (14 halaman aplikasi + 404).
   - **Keputusan:** Halaman Home (`/`) mengikuti disiplin editorial Taste Skill dan memuat **seluruh 18 komponen Brief Section 4.A berurutan** (1. Announcement bar, 2. Navigation bar, 3. Logo MEIKA, 4. Search bar, 5. Account icon, 6. Wishlist icon, 7. Shopping cart, 8. Hero section, 9. Featured brands, 10. Shop by category, 11. Best sellers, 12. New arrivals, 13. Trending products, 14. Special promotions, 15. Beauty recommendations, 16. Brand introduction, 17. Newsletter subscription, 18. Footer), dengan 1 *dealt scroll moment* tenang serta tepi sejajar `.wrap`. Catatan: artboard `HiFi-01 Home` di FigCraft menampilkan cuplikan utama sistem visual atas dan pola kartu representatif, sedangkan `HomePage.tsx` merender lengkap ke-18 blok dengan token yang sama.
3. **Autentikasi Admin di Lingkungan SPA Prototype (`Section 4.J`):**
   - Brief mensyaratkan *"autentikasi dan otorisasi role admin yang benar untuk lingkungan implementasi. Jangan mengandalkan sekadar menyembunyikan tombol admin di frontend."*
   - **Keputusan:** `AuthService` memisahkan dua kunci sesi agar pengujian Admin tidak menimpa sesi keranjang/riwayat belanja pelanggan:
     - `meika_v1_customer_session` untuk akun pelanggan demo (`/account`, default demo `customer@meika.id` / `meika123`). Checkout juga mendukung **Guest Checkout** maupun auto-fill profil saat pelanggan sudah login.
     - `meika_v1_admin_session` untuk administrator (`/admin/login`, kredensial demo terdokumentasi di layar login `admin@meika.id` / `meika-admin-2026`).
   - **Perilaku `ProtectedAdminRoute` di `/admin`:**
     - Jika `adminSession` valid -> render `AdminLayout` + `AdminDashboardPage`.
     - Jika belum ada sesi aktif sama sekali (`adminSession === null && customerSession === null`) -> redirect `<Navigate to="/admin/login" replace />`.
     - Jika sedang login sebagai pelanggan (`customerSession !== null && adminSession === null`) -> **blokir eksplisit dengan layar `403 Akses Ditolak`** (*"Akun pelanggan tidak berhak membuka panel Administrator"*) beserta tombol kembali ke `/` atau masuk lewat `/admin/login`.
   - Batas keamanan sisi klien (memerlukan verifikasi JWT/API server sebelum peluncuran produksi nyata) didokumentasikan jujur di Spec dan `README.md`.

### 2.2 Peta Rute Resmi (14 Halaman + 404) & Arsitektur Folder (`src/`)
| Rute URL | Komponen Halaman | Akses & Perilaku Utama |
|---|---|---|
| `/` | `HomePage` | Publik; merender lengkap 18 blok Home Brief Section 4.A |
| `/shop` | `ShopPage` | Publik; URL query `?q=&category=&subcategory=&brand=&price=&minRating=&inStock=&sort=&page=` |
| `/brands` | `BrandsPage` | Publik; direktori 10 merek kecantikan + pilihan `?selected=<slug>` |
| `/product/:slug` | `ProductDetailPage` | Publik; galeri, varian/shade kondisional, Add to Cart, Buy Now, Related; produk invalid -> 404 bersih |
| `/wishlist` | `WishlistPage` | Publik (tersimpan di `localStorage`); pindahkan ke keranjang atau hapus |
| `/cart` | `CartPage` | Publik; daftar item `(productId, variantId)`, batas stok, input kode promo, estimasi ongkos kirim |
| `/checkout` | `CheckoutPage` | Publik (`Guest Checkout` maupun auto-fill akun pelanggan); validasi alamat ID, kode promo, bayar simulasi; keranjang kosong -> Empty State ke `/shop` |
| `/order-confirmation/:orderId` | `OrderConfirmationPage` | Publik; membaca pesanan langsung dari `localStorage` via `:orderId` (aman saat browser di-refresh F5) |
| `/orders` | `OrderHistoryPage` | Publik; daftar & pencari Order ID + pelacakan status 5 tahap (`Pending`..`Cancelled`) tersinkron dengan Admin |
| `/account` | `AccountPage` | Akun Demo Pelanggan: login/logout demo `customer`, profil singkat, tautan Wishlist & Riwayat Pesanan |
| `/about` | `AboutPage` | Publik; Profil MEIKA, Visi/Misi, CS, 8 Tahapan Prototype PPT 8, Template Kosong Usability Testing `>= 5` pengguna |
| `/marketing` | `MarketingPage` | Publik; 3+ konsep IG Organic, FB/IG Ads, WA Broadcast, Email Marketing, Analytics `Data Simulasi` |
| `/admin/login` | `AdminLoginPage` | Form login Administrator dengan kredensial demo terdokumentasi + catatan prototype frontend |
| `/admin` | `AdminDashboardPage` | Dilindungi `ProtectedAdminRoute` (hanya `role === 'admin'`); Overview KPI, CRUD Produk & Varian, Brand/Kategori, Stok, Promo & Kode Promo, Status Pesanan |
| `*` | `NotFoundPage` | Fallback 404 rapi dengan tautan ke `/` dan `/shop` |
```text
src/
├── assets/       # Gambar produk terverifikasi & fallback visual kategori
├── components/   # Komponen UI reusable (Navbar, AnnouncementBar, SearchModal, ProductCard, ShadeSwatches, Footer, EmptyState, StatusBadge, Pagination, AuthGuard)
├── data/         # Seed >= 30 produk multi-brand (29+ subkategori), 10 brand directory, promo banners, data promosi digital simulasi, 8 tahap prototype & template UT
├── hooks/        # useMeikaStore (mengorkestrasi auth, catalog, cart, wishlist, orders, promo, & UT template state), useScrollMoment
├── layouts/      # StorefrontLayout (Announcement + Nav + MobileDrawer + Main + Footer) & AdminLayout (shell terpisah berotorisasi admin)
├── pages/        # HomePage, ShopPage, BrandsPage, ProductDetailPage, CartPage, WishlistPage, CheckoutPage, OrderConfirmationPage, OrderHistoryPage, AccountPage, AboutPage, MarketingPage, AdminLoginPage, AdminDashboardPage
├── services/     # storageService, authService, catalogQueryService, cartPricingService, checkoutValidator, adminMutationService (seluruhnya diuji TDD Vitest)
├── styles/       # tokens.css (DESIGN.md CSS variables), motion.css, index.css
├── types/        # Kontrak TS strict: Product, Brand, CartItem, Order, OrderStatus, UserSession, PromotionItem, MarketingCampaign
└── utils/        # formatIDR (Rp tabular-nums), generateOrderId, sanitizeImageFallback
```

### 2.3 Matriks Katalog Produk (32 SKU Nyata Lintas 5 Kategori, Seluruh 29 Subkategori Brief & 10 Brand)
Seluruh produk memakai nama realistis yang berbeda, **tanpa klaim medis, BPOM palsu, atau sertifikasi yang dikarang**. Aturan kontrak domain produk & stok:
- **Pemilih Shade Kondisional:** `hasShades: true` hanya untuk kosmetik berwarna (`Foundation`, `Cushion`, `Concealer`, `Powder`, `Blush On`, `Contour`, `Highlighter`, `Lipstick`, `Lip Cream`, `Lip Tint`, `Lip Gloss`, `Lip Balm`, `Mascara`, `Eyeliner`, `Eyeshadow`, `Eyebrow Pencil`, `Eyebrow Gel`). Produk `Setting Spray`, semua subkategori `Skincare`, dan semua `Beauty Essentials` memakai `hasShades: false` dan hanya merender pemilih ukuran/tipe unit, bukan shade warna.
- **Sumber Tunggal Stok & Keranjang:** Setiap produk memiliki `variants: ProductVariant[]` (`id`, `label`, `skuSuffix`, `stock`, `colorHex?`, `priceOverride?`). Total stok produk diturunkan dari `sum(variant.stock)`. Identitas unik item keranjang adalah pasangan `(productId, variantId)`. Saat checkout berhasil, `variant.stock` berkurang otomatis; jika Admin mengubah status pesanan menjadi `'Cancelled'` dari status aktif sebelumnya, stok varian tersebut dikembalikan otomatis.

| Kategori Utama | Subkategori Brief Terwakili & 32 SKU Multi-Brand Demo | Varian / Shade |
|---|---|---|
| **A. Face Makeup (10 SKU, seluruh 9 subkategori)** | `MK-01` (`Foundation`) **Maybelline** Fit Me Matte + Poreless Foundation (Rp 169.000 -> Rp 139.000, Best Seller)<br>`MK-02` (`Cushion`) **Skintific** Cover All Perfect Cushion (Rp 199.000 -> Rp 165.000, Trending)<br>`MK-03` (`Concealer`) **Make Over** Powerstay Total Cover Liquid Concealer (Rp 135.000)<br>`MK-04` (`Loose Powder`) **Emina** Daily Matte Loose Powder (Rp 42.000)<br>`MK-05` (`Compact Powder`) **Wardah** Colorfit Velvet Powder Foundation (Rp 82.000 -> Rp 74.000)<br>`MK-06` (`Blush On`) **Make Over** Blush On Single (Rp 108.000)<br>`MK-07` (`Contour`) **Somethinc** Eggo 3D Contour/Bronzer (Rp 99.000)<br>`MK-08` (`Highlighter`) **Implora** Seamless Liquid Highlighter (Rp 38.000, New Arrival)<br>`MK-09` (`Setting Spray`) **YOU Beauty** NoutriWear+ Makeup Stay Lock Mist (Rp 68.000)<br>`MK-10` (`Loose Powder`) **Hanasui** Perfect Fit Setting Powder (Rp 45.000 -> Rp 39.000) | `hasShades: true` untuk `MK-01`..`MK-08` & `MK-10`; `hasShades: false` (varian `55ml / 100ml`) untuk `MK-09` Setting Spray |
| **B. Lip Makeup (6 SKU, seluruh 5 subkategori)** | `MK-11` (`Lip Cream`) **Hanasui** Mattedorable Lip Cream (Rp 35.000 -> Rp 28.500, Best Seller)<br>`MK-12` (`Lipstick`) **Maybelline** Color Sensational Ultimatte Lipstick (Rp 145.000 -> Rp 119.000, Trending)<br>`MK-13` (`Lip Tint`) **Implora** Cheek & Liptint (Rp 24.000, Best Seller)<br>`MK-14` (`Lip Cream`) **Wardah** Glasting Liquid Lip (Rp 92.000, New Arrival)<br>`MK-15` (`Lip Gloss`) **Emina** Watercolor Lip Serum Gloss (Rp 46.000)<br>`MK-16` (`Lip Balm`) **YOU Beauty** Simplicity Glowy Lip Balm (Rp 39.000) | `hasShades: true`, minimal 3-4 shade per produk lengkap dengan hex akurat dan nama shade |
| **C. Eye Makeup (5 SKU, seluruh 5 subkategori)** | `MK-17` (`Mascara`) **Maybelline** Lash Sensational Sky High Mascara (Rp 149.000 -> Rp 125.000, Best Seller)<br>`MK-18` (`Eyeliner`) **Somethinc** Forever Stay Waterproof Liquid Eyeliner (Rp 65.000)<br>`MK-19` (`Eyeshadow`) **Make Over** Powerstay Eye Palette Uptown Bae (Rp 285.000 -> Rp 249.000, New Arrival)<br>`MK-20` (`Eyebrow Pencil`) **Implora** Soft Brow Eyebrow Pencil (Rp 12.500)<br>`MK-21` (`Eyebrow Gel`) **YOU Beauty** Stay All Day Brow Sculpt Gel (Rp 59.000) | `hasShades: true` (`Jet Black / Brown` / shade palet & alis) |
| **D. Skincare (7 SKU, seluruh 6 subkategori)** | `MK-22` (`Facial Wash`) **Wardah** Crystal Secret Foaming Cleanser (Rp 45.000)<br>`MK-23` (`Toner`) **The Originote** Ceraluronic Essence Toner (Rp 48.000 -> Rp 38.000, Best Seller)<br>`MK-24` (`Serum`) **Somethinc** 5% Niacinamide + Moisture Sabi Beet Serum (Rp 89.000, Trending)<br>`MK-25` (`Moisturizer`) **Skintific** 5X Ceramide Barrier Moisture Gel (Rp 149.000 -> Rp 129.000, Best Seller)<br>`MK-26` (`Sunscreen`) **The Originote** Ceramella Sunscreen SPF 50 (Rp 49.000 -> Rp 42.000)<br>`MK-27` (`Micellar Water`) **Emina** Bright Stuff Micellar Water (Rp 34.000)<br>`MK-28` (`Moisturizer`) **The Originote** Hyalucera Soothing Moisturizer Gel (Rp 46.000, New Arrival) | **Non-Shade (`hasShades: false`)!** Varian ukuran kemasan (`20ml / 40ml`, `30g / 50g`, `100ml / 240ml`) tanpa swatch warna kosmetik |
| **E. Beauty Essentials (4 SKU, seluruh 4 subkategori)** | `MK-29` (`Makeup Brush`) **Make Over** Precision Kabuki & Blending Brush Set (Rp 195.000)<br>`MK-30` (`Beauty Blender`) **Somethinc** Teardrop Latex-Free Beauty Blender Sponge (Rp 55.000, Best Seller)<br>`MK-31` (`Makeup Remover`) **Maybelline** Eye & Lip Makeup Remover (Rp 79.000)<br>`MK-32` (`Eyelash Curler`) **Emina** Precision Eyelash Curler (Rp 38.000) | **Non-Shade (`hasShades: false`)!** Varian ukuran/tipe unit (*Single / Duo Pack*, *70ml / 150ml*) |

### 2.4 Aturan Harga, Kode Promo, Ongkos Kirim, Galeri, & Matriks 21 Interaksi
- **Harga Efektif & Subtotal:** Setiap varian memakai `variant.priceOverride ?? productEffectivePrice` (dengan produk diskon memakai `discountPrice < price`). `subtotal` keranjang = `sum(unitPrice * qty)` (bukan harga coret), sementara `productSavings` (*Total Hemat Produk*) bersifat informatif agar tidak terjadi pemotongan ganda.
- **Kode Promo Terintegrasi (Admin -> Cart & Checkout):** Tipe `PromoCode { code, type: 'percent' | 'fixed', value, minSubtotal, active, label }`. Seed awal: `MEIKA10` (`10%`, min `Rp 100.000`) dan `CANTIK20` (`Rp 20.000`, min `Rp 150.000`). Input & lepas promo tersedia di `/cart` dan `/checkout`, dan dikelola live dari `/admin`.
- **Tarif Pengiriman Simulasi Deterministik (Indonesia):**
  - Zona `Jabodetabek` (Jakarta Pusat/Barat/Selatan/Timur/Utara, Bogor, Depok, Tangerang, Bekasi): `Reguler = Rp 12.000` (otomatis `Rp 0 / Gratis Ongkir` bila `subtotalAfterPromo >= Rp 250.000`), `Same Day = Rp 22.000`.
  - Zona `Pulau Jawa`: `Reguler = Rp 18.000`.
  - Zona `Luar Jawa`: `Reguler = Rp 28.000`.
  - Formula final: `grandTotal = Math.max(0, subtotal - promoDiscount) + shippingCost`.
- **Galeri Multi-Sudut & `Buy Now`:** Setiap produk memiliki `primaryImage` + `galleryImages[]` serta `variant.previewImage?` (atau komposisi visual terfokus shade/ukuran aktif). Memilih shade/varian pada `/product/:slug` memperbarui preview galeri, SKU varian, stok varian, dan harga efektif. Klik **Buy Now** menambahkan `(product, variant, qty)` ke keranjang aktif dan langsung mengarahkan pengguna ke `/checkout`.
- **Riwayat Pesanan, Pembatalan & KPI Admin:** Halaman `/orders` menampilkan seluruh pesanan tersimpan (termasuk 2 seeded order demo + checkout baru + fitur cari Order ID). Jika Admin mengubah status order ke `'Cancelled'` dari status aktif, stok masing-masing varian dikembalikan otomatis; KPI Admin `Total Penjualan Simulasi` hanya menjumlahkan pesanan non-`Cancelled`.
- **Usability Testing `/about` & Konsistensi `/marketing`:** Halaman `/about` menyertakan 8 tahapan prototype PPT 8 + 8 skenario tugas UT konkret (1. Cari produk lip makeup, 2. Filter brand di `/shop`, 3. Buka `/brands`, 4. Pilih shade di Detail Produk, 5. Cek non-shade di Skincare, 6. Add to Cart & edit qty, 7. Pakai kode `MEIKA10` & selesaikan Checkout validasi, 8. Lacak status di `/orders`) lengkap dengan form catatan kosong siap isi `>= 5` penguji tersimpan di `localStorage` + tombol *"Reset Data Demo"*. Halaman `/marketing` mematuhi larangan emoji di seluruh tampilan UI maupun contoh copy, memakai hitungan corong analitik konsisten (`Impressions -> Clicks/CTR -> Conversions`), dan seluruh angkanya berlabel **`Data Simulasi (Prototype)`**.

**Daftar 21 Interaksi Terverifikasi & 14 Butir `README.md`:**
- **21 Interaksi:** (1) Tutup/buka Announcement bar, (2) Search instan Navbar + Mobile overlay, (3) Navigasi 5 menu + Quick Category tiles, (4) Filter multi-kategori & subkategori, (5) Filter multi-brand checkbox, (6) Filter rentang harga Rp preset/kustom, (7) Filter rating demo & stok tersedia, (8) Sorting 4 mode + URL query sync, (9) Pagination/Load More + Reset filter saat kosong, (10) Pilih brand directory `/brands`, (11) Detail galeri multi-sudut + pilih shade kondisional (`hasShades: true`) vs ukuran (`hasShades: false`), (12) Tambah ke Cart & Buy Now, (13) Ubah kuantitas dibatasi stok + hapus item di Cart, (14) Wishlist toggle + pindah ke Cart, (15) Terapkan/lepas kode promo `MEIKA10`, (16) Kalkulasi ongkos kirim berdasar zona/provinsi, (17) Validasi Checkout alamat ID + metode bayar simulasi, (18) Konfirmasi pesanan tahan refresh `/order-confirmation/:orderId` & lacak 5 status di `/orders`, (19) Akun demo pelanggan & Newsletter bervalidasi, (20) Admin Login + guard `403`/redirect, (21) Admin CRUD Produk/Stok/Promo/Update Status Pesanan sinkron langsung ke storefront.
- **14 Butir Dokumentasi Akhir `README.md`:** 1. Identitas & Deskripsi MEIKA, 2. Analisis Masalah & Solusi, 3. Target Pasar, 4. Arsitektur Aplikasi & Struktur Folder, 5. Panduan Instalasi & Menjalankan Lokal, 6. Struktur Katalog `>=32` Produk & Fitur E-Commerce, 7. Penjelasan Design System & Resolusi 3 Skill, 8. Alur Belanja & Pembayaran Simulasi, 9. Dokumentasi Admin Panel & Batasan Auth SPA, 10. Strategi Digital Marketing & Funnel Simulasi, 11. Catatan & Tangkapan Layar Proses Design di FigCraft (`docs/design/exports/`), 12. 8 Tahapan Prototype Digital Entrepreneurship, 13. Template Evaluasi & Skenario Usability Testing (`>=5` penguji), 14. Batasan Prototype & Rencana Pengembangan Tahap Berikutnya.
1. Navigasi antarrute + Announcement bar dapat ditutup/dibuka.
2. Search overlay & bar pencarian instan (berdasar nama produk, merek, subkategori, atau SKU).
3. Filter kategori (`Face Makeup`, `Lip Makeup`, `Eye Makeup`, `Skincare`, `Beauty Essentials` + subkategori) & Filter Brand multi-pilihan.
4. Filter harga (preset terjangkau `< Rp 50rb`, `Rp 50rb - Rp 150rb`, `> Rp 150rb` maupun rentang min-max), Filter rating demo (`>= 4.5`, `>= 4.0`), Filter ketersediaan (`Stok Tersedia`).
5. Sorting (`Terbaru`, `Harga Terendah`, `Harga Tertinggi`, `Terpopuler / Rating Tertinggi`).
6. Detail produk multi-galeri, perubahan gambar & info varian saat memilih **Shade / Ukuran**, stok real-time berkurang saat checkout berhasil.
7. Keranjang (`Add to Cart`, `Buy Now`, ubah qty dibatasi stok, hapus item, ringkasan subtotal + hemat diskon + simulasi ongkos kirim berdasar provinsi + Grand Total).
8. Wishlist permanen + pindah cepat ke Keranjang.
9. Checkout tervalidasi penuh (Email valid, HP `08...` min 10 digit, kode pos 5 digit, alamat lengkap, pilihan pengiriman Jabodetabek/Nasional, metode pembayaran demo Bank Transfer VA / E-Wallet QRIS / COD dengan label tegas *Simulasi Prototype*).
10. Konfirmasi pesanan unik (`MK-YYYYMMDD-XXXX`), Riwayat Pesanan & pelacakan status 5 tahap (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
11. Akun Demo Pelanggan (`/account`) + Newsletter bervalidasi.
12. **Admin Dashboard (`/admin`, dilindungi `ProtectedAdminRoute` dari `/admin/login`):** Ringkasan KPI (Total Produk, Total Pesanan, Total Penjualan Simulasi), Manajemen Produk (Create/Read/Update/Delete termasuk manajemen shade/varian), Manajemen Brand & Kategori ringkas, Manajemen Stok cepat (Inventory update + lencana stok menipis), Manajemen Promosi (aktifkan/edit kode promo & banner promo Home), dan Manajemen Pesanan (ubah status ke Pending/Processing/Shipped/Delivered/Cancelled yang langsung tercermin di halaman Customer Order History).

---

## Strategi Aset Visual (Sesuai Anti-Slop `R-23` & Kualitas Produk)

Karena kode belum memasuki Phase 4 (Implementasi) dan brief melarang gambar produk yang tidak relevan dengan nama atau mereknya (`Section 2`), kita menetapkan opsi sumber aset yang transparan untuk disetujui pengguna sebelum Phase 4 dimulai:
- **Opsi A (Direkomendasikan untuk konsistensi katalog prototype):** Menggunakan **ilustrasi kemasan vektor studio bersih (SVG/komponen presisi berdasar tipe produk: botol pump foundation, compact cushion, tube lip cream, dropper serum, pot jar, sponge)** yang menampilkan warna shade/formula nyata, merek, dan jenis produk secara akurat tanpa risiko foto merek pihak ketiga yang keliru; ATAU **Opsi B**: Foto editorial kecantikan berlisensi terbuka per subkategori (Wikimedia Commons / Unsplash via `photos.mjs search`, diberi catatan sumber ilustratif di `README.md`).
- **Opsi C:** Berkas gambar produk resmi yang disediakan langsung oleh pengguna ke `src/assets/products/` atau `public/images/products/`.

Pengguna akan dimintai konfirmasi pilihan aset ini pada akhir tahap perencanaan Phase 1-3 bersama persetujuan wireframe FigCraft.
