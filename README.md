# MEIKA Beauty Store

**Your Beauty, Your Choice.**

Prototype high-fidelity e-commerce ritel kecantikan multi-merek (*Multi-Brand Beauty Retail E-Commerce*) untuk mata kuliah Digital Entrepreneurship. Platform ini menghimpun 32 SKU produk makeup, skincare, dan beauty essentials dari 10 merek ke dalam satu pengalaman belanja terstruktur, lengkap dengan pencarian cepat, filter multi-dimensi, pemilih shade warna vs ukuran non-shade, keranjang belanja, simulasi kode promo, checkout bervalidasi, pelacakan status pesanan 5 tahap, panel administrasi terproteksi, dokumentasi 8 tahapan prototype + lembar observasi Usability Testing kosong, serta hub strategi promosi digital.

---

## 1. Project Overview & Identitas Brand

- **Nama Brand:** MEIKA
- **Nama Website:** MEIKA Beauty Store
- **Tagline:** Your Beauty, Your Choice.
- **Model Bisnis:** Multi-Brand Beauty Retail E-Commerce
- **Positioning:** A modern, accessible, curated beauty retail destination.
- **Stack Teknologi:** React 19, TypeScript 5.8, React Router DOM 7.6, Tailwind CSS v4, Lucide Icons (`strokeWidth={1.5}`), Vite 7.3, dan Vitest 3.1 + React Testing Library.

---

## 2. Latar Belakang & Identifikasi Masalah

1. Konsumen harus mengunjungi banyak toko daring terpisah untuk mencari merek makeup dan skincare yang berbeda.
2. Informasi produk, rentang harga, variasi warna shade, dan kategori sering tersebar di banyak kanal.
3. Konsumen kesulitan menyaring produk kecantikan berdasarkan kebutuhan kategori maupun batasan anggaran.
4. Proses pemesanan melalui media sosial atau pesan instan tidak selalu terstruktur dalam pencatatan item dan total biaya.
5. Konsumen membutuhkan visibilitas status pesanan yang jelas setelah transaksi selesai dilakukan.

---

## 3. Target Pengguna & Solusi Nilai Platform

### Target Pasar
- Perempuan dan laki-laki usia 18-35 tahun di Indonesia (khususnya wilayah Jabodetabek dan kota besar).
- Mahasiswa, pekerja muda, dan konsumen pengguna aktif media sosial yang terbiasa berbelanja daring.

### Solusi & Manfaat MEIKA
- **Satu Etalase Multi-Merek:** Menyatukan 10 merek kecantikan dan 32 SKU dalam struktur informasi yang seragam.
- **Pembandingan Cepat & Akurat:** Menampilkan harga normal, harga promo, persentase penghematan, ulasan demo, serta pemilih shade interaktif.
- **Alur Transaksi Terstruktur:** Mendukung pengelolaan jumlah keranjang, potongan kode promo, estimasi ongkos kirim berdasarkan zona (`Jabodetabek`, `Pulau Jawa`, `Luar Pulau Jawa`), validasi formulir pengiriman Indonesia, nomor pesanan unik (`MK-YYYYMMDD-XXXX`), serta riwayat pesanan persisten di peramban (`localStorage`).

---

## 4. Struktur Lengkap Halaman & Rute (14 View + 404)

| Rute | Halaman | Peran Utama |
| :--- | :--- | :--- |
| `/` | HomePage | 18 blok etalase toko utama: Announcement Bar, Navbar, Quick Search, Hero Editorial, Featured Brands, Shop by Category, Best Sellers, Promo Strip, New Arrivals, Trending, Beauty Recommendations, Brand Story, Newsletter, Footer. |
| `/shop` | ShopPage | Katalog 32 SKU dengan filter multi-merek, kategori, subkategori, rentang harga, pencarian kata kunci, pengurutan (`featured`, `newest`, `popular`, `price-asc`, `price-desc`), paginasi, dan tombol reset saat hasil kosong. |
| `/brands` | BrandsPage | Direktori 10 brand terkurasi dengan jumlah SKU per merek serta pratinjau produk per merek pilihan. |
| `/product/:slug` | ProductDetailPage | Galeri 3 sudut gambar studio (termasuk swatch shade & info format), harga & diskon, pemilih shade warna kondisional (hanya produk kosmetik berwarna) vs pemilih ukuran non-shade, tombol `+ Add to Cart`, `Buy Now`, wishlist, ulasan demo, dan produk terkait. |
| `/cart` | CartPage | Kontrol kuantitas berbasis batas stok varian, hapus item, penerapan kode promo (`MEIKA10`, `CANTIK20`), simulator ongkos kirim, serta gratis ongkir Jabodetabek Reguler untuk total >= Rp 250.000 pasca-promo. |
| `/wishlist` | WishlistPage | Daftar produk tersimpan untuk diakses kembali maupun dipindahkan ke keranjang. |
| `/account` | AccountPage | Portal masuk akun pelanggan demo (`customer@meika.id`), ringkasan alamat tersimpan, wishlist, dan pintasan pesanan. |
| `/checkout` | CheckoutPage | Formulir pengiriman Indonesia tervalidasi (Nama >= 2 karakter, email, format HP `08`/`628`, alamat >= 10 karakter, kode pos 5 digit), pemilihan zona pengiriman, metode pembayaran simulasi (VA Bank, QRIS, COD), dan konfirmasi pesanan. |
| `/order-confirmation/:orderId` | OrderConfirmationPage | Bukti transaksi simulasi dengan nomor pesanan unik `MK-...` yang bertahan saat peramban dimuat ulang (`F5`), lengkap dengan rincian item dan tombol pelacakan. |
| `/orders` | OrderHistoryPage | Riwayat transaksi pelanggan lengkap dengan pelacakan siklus 5 tahap (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`). |
| `/about` | AboutPage | Profil MEIKA, matriks masalah-solusi, 8 Tahapan Pengembangan Prototype, 8 skenario `UT-01` s.d. `UT-08`, serta formulir kosong observasi 5 responden (`Penguji #1` s.d. `Penguji #5`) dan tombol reset data demo. |
| `/marketing` | MarketingPage | Hub konsep Promosi Digital: 3 pilar Instagram Organic Content, Instagram & Facebook Feed Single Image Ad, WhatsApp Broadcast, Email Marketing, dan Matriks Evaluasi Saluran (`Data Simulasi`). |
| `/admin/login` | AdminLoginPage | Portal masuk khusus Administrator yang memisahkan sesi admin dan sesi pelanggan. |
| `/admin` | AdminDashboardPage | Konsol operasional terproteksi `ProtectedAdminRoute` untuk KPI ringkas, CRUD SKU & varian, pembaruan stok cepat, kelola kode promo & banner beranda, serta manajemen status pesanan yang tersinkron langsung ke `/orders`. |
| `*` | NotFoundPage | Halaman fallback 404 ramah pengguna menuju Home dan Shop. |

---

## 5. Fitur Utama E-Commerce & Interaktivitas

- **Pencarian Global Instan (`SearchOverlay` & Quick Filter):** Mencari berdasarkan nama produk, SKU (`MK-01`), merek, atau nama shade.
- **Filter Multi-Dimensi & URL Query Sync:** Filter di `/shop` tersinkron dengan query parameter URL sehingga dapat dibagikan atau diakses langsung dari kartu kategori/promosi di Beranda.
- **Logika Pemilih Varian Kondisional:** Produk makeup berpigmen (`hasShades: true`) menampilkan dot warna interaktif (`ShadeSwatches`) dan memperbarui gambar kemasan per shade. Produk perawatan kulit & alat (`Skincare`, `Beauty Essentials`, serta `Setting Spray`, `hasShades: false`) menampilkan pemilih ukuran/format kemasan tanpa dot shade warna kosmetik.
- **Perhitungan Harga & Gratis Ongkir Deterministik (`cartPricingService.ts`):** Diskon promo dihitung terhadap subtotal efektif produk, kemudian ongkos kirim Reguler Jabodetabek otomatis Rp 0 apabila subtotal bersih setelah promo >= Rp 250.000.
- **Sinkronisasi Siklus Pesanan & Stok (`orderLifecycleService.ts`):** Checkout mengurangi stok varian terpilih, dan perubahan status ke `Cancelled` di Admin Console memulihkan stok secara otomatis.

---

## 6. Katalog Demo (32 SKU, 10 Brand) & Transparansi Aset Opsi A

Seluruh gambar katalog dan sudut galeri diproduksi melalui `scripts/generate_studio_assets.py` (total **187 file SVG** di `public/images/`) dengan gaya **Opsi A: Ilustrasi Kemasan Vektor Studio Presisi** per bentuk kemasan (botol pump foundation, compact cushion, tube doe-foot lip cream, bullet lipstick, palette eyeshadow, botol serum dropper, jar moisturizer, sunscreen tube, micellar water, brush set, latex-free sponge, dan eyelash curler) tanpa meniru kemasan resmi merek pihak ketiga maupun mengklaim nomor sertifikasi BPOM atau manfaat medis.

### Ringkasan 10 Merek Kurasi
`Maybelline`, `Wardah`, `Emina`, `Make Over`, `Somethinc`, `Skintific`, `Hanasui`, `YOU Beauty`, `Implora`, `The Originote`.

### Daftar Lengkap 32 SKU Katalog Demo

| SKU | Nama Produk | Brand | Kategori | Subkategori | Harga Normal | Pemilih Shade |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| MK-01 | Fit Me Matte + Poreless Foundation 30ml | Maybelline | Face Makeup | Foundation | Rp 169.000 | Ya |
| MK-02 | Cover All Perfect Cushion 11g | Skintific | Face Makeup | Cushion | Rp 199.000 | Ya |
| MK-03 | Powerstay Total Cover Liquid Concealer | Make Over | Face Makeup | Concealer | Rp 135.000 | Ya |
| MK-04 | Daily Matte Loose Powder 20g | Emina | Face Makeup | Loose Powder | Rp 42.000 | Ya |
| MK-05 | Colorfit Velvet Powder Foundation 11g | Wardah | Face Makeup | Compact Powder | Rp 82.000 | Ya |
| MK-06 | Blush On Single Velvety Matte 6g | Make Over | Face Makeup | Blush On | Rp 108.000 | Ya |
| MK-07 | Eggo 3D Contour & Bronzer Duo | Somethinc | Face Makeup | Contour | Rp 99.000 | Ya |
| MK-08 | Seamless Liquid Highlighter Drops | Implora | Face Makeup | Highlighter | Rp 38.000 | Ya |
| MK-09 | NoutriWear+ Makeup Stay Lock Mist | YOU Beauty | Face Makeup | Setting Spray | Rp 68.000 | Tidak (Ukuran) |
| MK-10 | Perfect Fit Setting Powder 12g | Hanasui | Face Makeup | Loose Powder | Rp 45.000 | Ya |
| MK-11 | Mattedorable Lip Cream 4g | Hanasui | Lip Makeup | Lip Cream | Rp 35.000 | Ya |
| MK-12 | Color Sensational Ultimatte Lipstick | Maybelline | Lip Makeup | Lipstick | Rp 145.000 | Ya |
| MK-13 | Cheek & Liptint Watery Stain | Implora | Lip Makeup | Lip Tint | Rp 24.000 | Ya |
| MK-14 | Glasting Liquid Lip Shine Coat | Wardah | Lip Makeup | Lip Cream | Rp 92.000 | Ya |
| MK-15 | Watercolor Lip Serum Gloss | Emina | Lip Makeup | Lip Gloss | Rp 46.000 | Ya |
| MK-16 | Simplicity Glowy Tinted Lip Balm | YOU Beauty | Lip Makeup | Lip Balm | Rp 39.000 | Ya |
| MK-17 | Lash Sensational Sky High Mascara | Maybelline | Eye Makeup | Mascara | Rp 149.000 | Ya |
| MK-18 | Forever Stay Waterproof Liquid Eyeliner | Somethinc | Eye Makeup | Eyeliner | Rp 65.000 | Ya |
| MK-19 | Powerstay Eye Palette Uptown Collection | Make Over | Eye Makeup | Eyeshadow | Rp 285.000 | Ya |
| MK-20 | Soft Brow Eyebrow Pencil & Spoolie | Implora | Eye Makeup | Eyebrow Pencil | Rp 12.500 | Ya |
| MK-21 | Stay All Day Brow Sculpt Gel | YOU Beauty | Eye Makeup | Eyebrow Gel | Rp 59.000 | Ya |
| MK-22 | Crystal Secret Foaming Cleanser | Wardah | Skincare | Facial Wash | Rp 45.000 | Tidak (Ukuran) |
| MK-23 | Ceraluronic Essence Toner | The Originote | Skincare | Toner | Rp 48.000 | Tidak (Ukuran) |
| MK-24 | 5% Niacinamide Moisture Sabi Serum | Somethinc | Skincare | Serum | Rp 89.000 | Tidak (Ukuran) |
| MK-25 | 5X Ceramide Barrier Moisture Gel 30g | Skintific | Skincare | Moisturizer | Rp 149.000 | Tidak (Ukuran) |
| MK-26 | Ceramella Sunscreen SPF 50 PA+++ 50g | The Originote | Skincare | Sunscreen | Rp 49.000 | Tidak (Ukuran) |
| MK-27 | Bright Stuff Micellar Water 100ml | Emina | Skincare | Micellar Water | Rp 34.000 | Tidak (Ukuran) |
| MK-28 | Hyalucera Soothing Moisturizer Gel 50ml | The Originote | Skincare | Moisturizer | Rp 46.000 | Tidak (Ukuran) |
| MK-29 | Precision Kabuki & Blending Brush Set | Make Over | Beauty Essentials | Makeup Brush | Rp 195.000 | Tidak (Paket) |
| MK-30 | Teardrop Latex-Free Beauty Blender | Somethinc | Beauty Essentials | Beauty Blender | Rp 55.000 | Tidak (Paket) |
| MK-31 | Eye & Lip Makeup Remover Bi-Phase 150ml | Maybelline | Beauty Essentials | Makeup Remover | Rp 79.000 | Tidak (Ukuran) |
| MK-32 | Precision Eyelash Curler + 2 Refill Pads | Emina | Beauty Essentials | Eyelash Curler | Rp 38.000 | Tidak (Paket) |

*(Catatan: sebagian SKU memiliki `discountPrice` khusus katalog demo seperti fit-me foundation Rp 139.000, cover all cushion Rp 165.000, mattedorable lip cream Rp 28.500, dan lain-lain yang didefinisikan pada `src/data/products.ts`.)*

---

## 7. Ringkasan Design System (`DESIGN.md`)

Seluruh antarmuka merujuk sumber kebenaran `DESIGN.md` dan `src/styles/tokens.css`:
- **Permukaan Netral Utama (>= 60-70% layar):** Warm Ivory `#FAF8F5` dan Putih Kartu `#FFFFFF`.
- **Palet Identitas Proporsional:** Dusty Pink `#E8A5AD` (selalu berpasangan dengan teks gelap Charcoal `#292626`, rasio kontras 7.44:1), Soft Pink `#F6E8E9` (kontainer aksen & banner), Muted Rose `#B87883` (border & bintang ulasan), serta Action Rose `#7A3D49` (tombol primer teks putih dengan rasio 8.10:1 memenuhi WCAG AA).
- **Tipografi Editorial:** `Instrument Serif` (weight 400) untuk heading & wordmark `MEIKA`, `Instrument Sans` (weight 400-600) untuk antarmuka & angka harga dengan `tabular-nums`, ukuran minimal teks UI 13px.

---

## 8. Integrasi Tiga Skill

| Skill | Peran Selama Pengembangan MEIKA Beauty Store |
| :--- | :--- |
| **Superpowers** | Analisis kebutuhan akademik, brainstorming konsep multi-merek, spesifikasi arsitektur & kontrak (`docs/superpowers/specs/2026-11-11-meika-beauty-design.md`), rencana bertahap 11 task (`docs/superpowers/plans/2026-11-11-meika-implementation-plan.md`), disiplin Red-Green-Refactor Vitest, dan verifikasi sebelum klaim selesai. |
| **Taste Skill** | Arah visual editorial beauty flagship, tata letak responsif 1440px/768px/390px, tipografi terukur, pemeriksaan performa & dimensi gambar lewat `perf.mjs`, serta pengecekan screenshot multi-viewport lewat `shoot.mjs`. |
| **Anti-Slop** | Larangan tata letak AI generik, menjaga kontras warna tombol dan teks di seluruh halaman, memastikan tidak ada klaim BPOM/medis palsu atau hasil Usability Testing rekayasa, serta membersihkan karakter em-dash (`U+2014`), en-dash (`U+2013`), dan emoji dari seluruh UI/dokumentasi. |

---

## 9. Integrasi FigCraft Design

Artefak perencanaan visual & wireframe dibuat bersama di FigCraft dan diekspor ke repositori:
- Sumber proyek FigCraft: `docs/design/meika-beauty-store.figcraft`
- Ekspor visual referensi:
  - `docs/design/exports/01-design-system.png`
  - `docs/design/exports/02-wireframes.png`
  - `docs/design/exports/03-hifi-ui.png`
  - `docs/design/exports/hifi-01-home.png`

---

## 10. Metodologi Digital Entrepreneurship (8 Tahapan & Usability Testing)

Halaman `/about` mendokumentasikan 8 tahapan pengembangan prototype mulai dari identifikasi masalah hingga evaluasi iteratif, dilengkapi:
- **8 Tugas Terstandar (`UT-01` s.d. `UT-08`):** Pencarian cepat, filter `/shop`, eksplorasi brand, pemilihan shade makeup, pengenalan produk non-shade skincare, keranjang + promo `MEIKA10`, validasi checkout, hingga pelacakan pesanan `/orders`.
- **Lembar Pencatatan 5 Penguji Kosong (`Penguji #1` s.d. `Penguji #5`):** Tidak berisi data responden karangan. Pengamat lapangan dapat langsung mengetik nama responden, tugas selesai, durasi, salah klik, kendala navigasi, komentar think-aloud, serta prioritas perbaikan lalu menyimpannya lokal (`meika_v1_ut_entries`) atau mencetak halaman.

---

## 11. Dokumentasi Praktik Promosi Digital (`/marketing`)

Halaman `/marketing` memetakan materi kuliah *Contoh Praktik Promosi Digital* ke dalam aset nyata MEIKA:
1. **Instagram Organic Content (3 Pilar):** `Product Spotlight` (Fit Me Foundation), `Beauty Recommendation` (rutinitas 3 langkah skincare), dan `Promotional Campaign` (`MEIKA10`).
2. **Instagram & Facebook Feed (Single Image Ad):** Kreatif tunggal beserta objektif *Traffic & Purchase Conversion* menuju `/shop`.
3. **WhatsApp Broadcast:** Pesan segmen pelanggan Jabodetabek dengan tautan langsung ke produk populer.
4. **Email Marketing:** Pratinjau buletin kurasi mingguan berisi 3 SKU pilihan (`MK-02`, `MK-11`, `MK-25`).
5. **Evaluasi Kinerja Saluran:** Seluruh metrik tabel & grafik rasio klik secara eksplisit bertanda **Data Simulasi**.

---

## 12. Panduan Demo, Kredensial & Catatan Keamanan Prototype

### Kode Promo Simulasi Aktif (`src/data/promotions.ts`)
- `MEIKA10` : Diskon 10% (min. subtotal Rp 100.000)
- `CANTIK20` : Potongan Rp 20.000 (min. subtotal Rp 150.000)

### Kredensial Akun Demo (`src/services/authService.ts`)
- **Akun Pelanggan Demo (`/account`):**
  - Email: `customer@meika.id`
  - Kata Sandi: `meika123`
- **Akun Administrator Demo (`/admin/login`):**
  - Email: `admin@meika.id`
  - Kata Sandi: `meika-admin-2026`

### Catatan Batasan Keamanan Prototype
Autentikasi pelanggan (`meika_v1_customer_session`) dan administrator (`meika_v1_admin_session`) dipisahkan secara ketat agar sesi pelanggan ditolak (403 state / diarahkan ulang) oleh `ProtectedAdminRoute` saat mengakses `/admin`. Namun, karena ini merupakan prototype sisi klien berbasis browser dan `localStorage` tanpa backend server maupun token terenkripsi, kredensial demo hanya ditujukan untuk demonstrasi fitur lokal dan bukan untuk lingkungan produksi nyata.

---

## 13. Cara Menjalankan Prototype Secara Lokal, Demo GitHub Pages & Hasil Verifikasi

### Demo Online (GitHub & GitHub Pages)
- **Repository GitHub:** https://github.com/stanisparera-jpg/meika-beauty-store
- **Live Demo Website (GitHub Pages):** https://stanisparera-jpg.github.io/meika-beauty-store/
- Deployment otomatis dikonfigurasi melalui `.github/workflows/deploy-pages.yml` (`Actions -> Deploy MEIKA Demo to GitHub Pages`) dengan `--base=/meika-beauty-store/` serta resolver aset `resolveAssetUrl` di `src/utils/assetUrl.ts` sehingga seluruh 187 ilustrasi SVG dan navigasi SPA (`BrowserRouter` + fallback `404.html`) berjalan konsisten di subpath GitHub Pages.

### Menjalankan Project Secara Lokal
```bash
npm install
npm run dev
```

### Perintah Pengujian & Build
```bash
npx tsc --noEmit
npm test
npm run build
npm run preview
```

### Ringkasan Verifikasi yang Dijalankan Setelah Edit Implementasi
- **Typecheck & Build:** `npx.cmd tsc --noEmit` (keluar kode `0`), `npm.cmd run build` (`tsc -b && vite build` sukses dengan pemisahan rute `React.lazy`, bundel entri `index` 357.11 kB / 112.39 kB gzip, CSS 38.58 kB / 7.79 kB gzip).
- **Unit & Integration Test Suite (`npm.cmd test`):** **16 file tes lulus (16), 36 kasus uji lulus (36)** mencakup `assetUrl.ts`, utilitas format harga, katalog 32 SKU, pricing & ongkir keranjang, validasi formulir Indonesia, siklus stok pesanan, autentikasi & guard admin, HomePage, ShopPage, BrandsPage, ProductDetailPage, Cart-Checkout-Orders, AdminDashboard CRUD, serta About/UT & Marketing.
- **Audit Performa Taste Skill (`perf.mjs` pada build `dist/`):** Di viewport `1440px` dan `390px`: **0 FAIL, 2 WARN** (satu-satunya `WARN` berasal dari `host CPU load 95/61 %` mesin saat pengujian berjalan); `oversized images: 0`, `images without width+height: 0`, `below-fold images not lazy: 0`, `broken requests: 0`, CLS `0.001` (desktop) dan `0.000` (mobile).
- **Verifikasi Browser Headless Microsoft Edge (`verify_browser.mjs` & `shoot.mjs`):**
  - Viewport `1440px`, `768px`, dan `390px` di rute `/`, `/shop`, `/brands`, `/about`, `/marketing` mencatat `overflowX: false` dan `brokenImgs: []` (`0` gambar gagal muat).
  - Seluruh alur E2E nyata di browser terverifikasi: filter Skincare (`Menampilkan 7 produk`), pemilihan shade PDP & penolakan dot shade pada skincare non-shade, gambar sudut swatch PDP (`E2E_PDP_BROKEN_IMGS: []`), kode promo `MEIKA10`, validasi form checkout kosong, pembuatan pesanan `MK-...` + reload F5 browser persisten, redirect guard `/admin` -> `/admin/login`, login admin & pembaruan status pesanan `Processing -> Shipped` tersinkron ke `/orders`, penyimpanan UT `Penguji #1` persisten setelah reload, `CONSOLE_ERRORS: []`, `PAGE_EXCEPTIONS: []`, dan `NETWORK_FAILURES: []`.

---

## 14. Struktur Folder Project

```text
.
|-- .github/workflows/deploy-pages.yml
|-- .gitignore
|-- DESIGN.md
|-- README.md
|-- index.html
|-- package.json
|-- tsconfig.json
|-- vite.config.ts
|-- vitest.config.ts
|-- docs/
|   |-- design/
|   |   |-- meika-beauty-store.figcraft
|   |   `-- exports/
|   |       |-- 01-design-system.png
|   |       |-- 02-wireframes.png
|   |       |-- 03-hifi-ui.png
|   |       `-- hifi-01-home.png
|   `-- superpowers/
|       |-- plans/2026-11-11-meika-implementation-plan.md
|       `-- specs/2026-11-11-meika-beauty-design.md
|-- public/
|   |-- favicon.svg
|   `-- images/
|       |-- hero/
|       |-- categories/
|       `-- products/ (termasuk variants/ dan angles/, total 187 SVG)
|-- scripts/
|   `-- generate_studio_assets.py
`-- src/
    |-- App.tsx
    |-- main.tsx
    |-- index.css
    |-- styles/ (tokens.css, motion.css)
    |-- types/ (auth, brand, cart, marketing, order, product)
    |-- data/ (brands, products, promotions, marketingData, prototypeDocs)
    |-- utils/ (formatters.ts, assetUrl.ts)
    |-- services/ (storageService, authService, catalogQueryService, cartPricingService, checkoutValidator, orderLifecycleService)
    |-- hooks/ (useMeikaStore.tsx, useScrollMoment.ts)
    |-- layouts/ (StorefrontLayout.tsx, AdminLayout.tsx)
    |-- components/ (Navbar, Footer, AnnouncementBar, SearchOverlay, MobileDrawer, ProductCard, ShadeSwatches, StatusBadge, BrandStrip, NewsletterSection, CatalogFilters, PaginationControls, ProtectedAdminRoute, AdminProductModal)
    `-- pages/ (HomePage, ShopPage, BrandsPage, ProductDetailPage, CartPage, WishlistPage, AccountPage, CheckoutPage, OrderConfirmationPage, OrderHistoryPage, AboutPage, MarketingPage, AdminLoginPage, AdminDashboardPage, NotFoundPage)
```

