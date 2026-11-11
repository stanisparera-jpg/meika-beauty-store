# DESIGN.md: Sistem Desain & Arah Visual MEIKA Beauty Store

Dokumen ini menjadi sumber kebenaran tunggal (**Single Source of Truth**) untuk seluruh keputusan visual, tipografi, warna, jarak, mikro-interaksi, aksesibilitas, dan keselarasan antara **Brief MEIKA**, **Taste Skill (`design-taste-frontend`)**, dan **Anti-Slop (`R-01` s.d. `R-40`)**.

---

## 1. Identitas & Design Read (`copy-voice.md` & `antislop`)

- **Tujuan Visual:** Toko ritel multi-brand kecantikan Indonesia sekelas kurasi butik modern (presisi editorial ala butik kosmetik yang lapang namun tetap mudah dipindai seperti ritel kecantikan Watsons/Sephora), bukan template SaaS generik dan **bukan** halaman serba merah muda berlebihan.
- **Proporsi Dominasi Kanvas:** Minimal **60-70% layar** tetap berada pada **Warm Ivory (`#FAF8F5`)** dan **White (`#FFFFFF`)** agar warna shade lipstik, blush, cushion, dan kemasan skincare tampil netral akurat. Aksen pink (`#E8A5AD` & `#F6E8E9`) digunakan terarah pada Announcement/chip pilihan, sorotan penawaran, serta titik penekanan editorial.
- **Tiga Dials Antislop:**
  - **ENERGY = 2:** Bersih, feminin-dewasa yang terukur, kontras tinggi antara Charcoal `#292626` dan gading hangat `#FAF8F5`.
  - **RHYTHM = 2:** Beranda memadukan Hero kampanye 1 layar yang tenang, jalur 10 Brand unggulan, grid kategori 5 pilar, jajaran kartu produk 4 kolom ber-swatch shade, split cerita MEIKA ber-whitespace lapang, hingga blok promo jujur.
  - **MOTION = 2:** Hanya tiga lapis gerak (`motion.md`): (1) Hero entrance 1 kali saat load (`700ms` + `520ms`), (2) 1 *Dealt Scroll Moment* (`picture-develops` / `word-highlight` pada bagian Brand Introduction), dan (3) hover/press micro-interaction (`150ms` in, `120ms` out, `90ms` press, skala foto `1.03`, lift kartu `2px`). Mendukung penuh `prefers-reduced-motion: reduce`.
- **Voice Card Copywriting (`antislop-copywriting`):**
  - **Bahasa:** Bahasa Indonesia alami dicampur istilah kecantikan yang lazim di pasar Indonesia (*Shade, Matte, Sunscreen, Serum, Cushion, Best Seller*) secara konsisten.
  - **Aturan Ketat:** Nol karakter em-dash (`U+2014`) di UI maupun dokumentasi; nol klaim medis/BPOM buatan (*"terbukti menyembuhkan jerawat"*, *"100% original resmi"*); nol filler AI (*"revolusioner"*, *"rahasia tampil memukau"*, *"temukan definisi baru"*); setiap tombol memiliki aksi konkret (*"Shop Now"*, *"Explore Brands"*, *"Add to Cart"*, *"Beli Sekarang"*, *"Simpan ke Wishlist"*, *"Proses Checkout"*).

---

## 2. Sistem Warna & Verifikasi Kontras Nyata (`contrast-check.py`)

Semua pasangan teks dan latar belakang diuji menggunakan `contrast-check.py` (minimal `4.5:1` teks normal, `3.0:1` teks besar >=24px / komponen UI):

| Token | Hex | Peran Visual | Rasio Terukur (`contrast-check.py`) | Status |
|---|---|---|---|---|
| `--bg-ivory` | `#FAF8F5` | Latar kanvas utama Warm Ivory (minimal 60% halaman) | Permukaan netral terang | Valid |
| `--bg-surface` | `#FFFFFF` | Latar kartu produk, panel form checkout, modal detail | Permukaan netral putih | Valid |
| `--bg-soft-pink` | `#F6E8E9` | Latar panel pengenalan merek, chip kategori aktif, sorotan promo halus | Permukaan aksen sekunder | Valid |
| `--ink` | `#292626` | Charcoal utama: heading, teks produk, harga, ikon, announcement bar gelap | `14.16:1` di `#FAF8F5` / `15.01:1` di `#FFFFFF` / `12.60:1` di `#F6E8E9` / `7.44:1` di `#E8A5AD` | PASS AAA |
| `--ink-inverse` | `#FAF8F5` | Teks & ikon di atas latar Charcoal (`#292626`) | `14.16:1` di `#292626` | PASS AAA |
| `--primary-pink` | `#E8A5AD` | Aksen utama: tombol aksi sekunder, lencana promo & tag sorotan **khusus teks Charcoal `#292626`** | **`7.44:1` dengan teks `#292626` (PASS)** / `2.02:1` dengan `#FFFFFF` (DILARANG keras menaruh teks putih di atas `#E8A5AD`) | Wajib Teks Gelap |
| `--muted-rose` | `#B87883` | Garis tepi aktif, divider aksen, ikon aksen, angka besar/display `>= 24px` | `3.27:1` di `#FAF8F5` / `3.47:1` di `#FFFFFF` (LULUS `3.0:1` non-teks/besar; GAGAL teks normal `4.5:1`) | Terbatas Non-Teks/Besar |
| `--action-rose` | `#7A3D49` | Turunan deep berry dari `#B87883` untuk tombol utama teks putih, tautan aktif, fokus ring 2px | `7.65:1` di `#FAF8F5` / `6.81:1` di `#F6E8E9` / `8.10:1` di `#FFFFFF` / `#FFFFFF` di atasnya = **`8.10:1`** | PASS AA/AAA |
| `--muted-ink` | `#5E5857` | Teks sekunder (SKU, ukuran ml/g, jumlah review, label breadcrumb) | `6.58:1` di `#FAF8F5` / `6.98:1` di `#FFFFFF` / `5.86:1` di `#F6E8E9` | PASS AA |
| `--border-hairline` | `rgba(41, 38, 38, 0.12)` | Garis tepi kartu/tabel 1px bersih tanpa shadow berat saat diam | Halus & jelas | Valid |

**Alasan Satu Baris (`R-31`):** Mempertahankan seluruh 6 warna brief dengan membatasi `#E8A5AD` hanya berpasangan dengan teks Charcoal `#292626` (`7.44:1`) dan memperkenalkan `#7A3D49` untuk teks putih (`8.10:1`) agar estetika rose-pink tetap setia sekaligus aman secara WCAG AA.

---

## 3. Tipografi & Hierarki Skala

Dipilih langsung dari katalog resmi `taste-skill/library/type.json` (`instrument-serif` pairing), tanpa font klise (`Inter`, `Poppins`, `Montserrat`, `Plus Jakarta Sans`, `Roboto`, `Lato`, `Open Sans`):

- **Display Heading (`--font-display`):** `"Instrument Serif", Georgia, serif` (bobot konsisten `400`, tracking ketat `-0.016em` hero, `-0.012em` H2). *(Catatan FigCraft Desktop: karena paket FigCraft membundel `Source Serif 4` + `Playfair Display` + `Source Sans 3`, mockup di FigCraft memakai padanan `Playfair Display` / `Instrument Serif` untuk pratinjau lokal bebas distorsi).*
- **UI, Kartu Produk, Harga & Isi (`--font-text`):** `"Instrument Sans", system-ui, sans-serif` (bobot `400` dan `500`, `600` hanya untuk badge/mark kecil; angka harga memakai `font-variant-numeric: tabular-nums`).
- **Alasan Satu Baris (`R-31`):** `Instrument Serif` berbobot tipis memberi nuansa editorial kosmetik tanpa kesan kaku, sementara `Instrument Sans` menjaga keterbacaan nama produk multi-brand, SKU, dan harga Rupiah yang rapat di ponsel.

| Peran | Desktop (`1440px`) | Mobile (`390px`) | CSS `clamp()` |
|---|---|---|---|
| Hero Headline (`H1`) | `64px` / `1.04` | `38px` / `1.08` | `clamp(2.375rem, 1.8rem + 2.4vw, 4rem)` |
| Section Headline (`H2`) | `40px` / `1.12` | `28px` / `1.16` | `clamp(1.75rem, 1.4rem + 1.3vw, 2.5rem)` |
| Card / Brand Heading (`H3`) | `20px` / `1.3` | `18px` / `1.3` | `clamp(1.125rem, 1.06rem + 0.25vw, 1.25rem)` |
| Harga Utama Produk | `18px` (`500`, tabular) | `16px` (`500`, tabular) | `clamp(1rem, 0.95rem + 0.2vw, 1.125rem)` |
| Body / Deskripsi / Form Input | `16px` / `1.58` | `16px` / `1.55` | `1rem` (mencegah auto-zoom mobile) |
| SKU, Shade Label, Breadcrumb | `14px` / `1.4` | `14px` / `1.4` | `0.875rem` |
| Tag Badge (Best Seller / New) | `13px` (`500`) | `13px` (`500`) | `0.8125rem` (tidak ada label di bawah 13px) |

---

## 4. Tata Letak, Grid & Responsivitas Tiga Titik (`1440px`, `768px/820px`, `390px`)

- **Container & Equal Edges:** Maksimum `1280px` (`.wrap`), padding tepi `clamp(20px, 5vw, 72px)`. Garis kiri Navbar, Hero, Koleksi, Grid Katalog, dan Footer selalu lurus sejajar vertikal (`layout-v4.md`).
- **Breakdown Layar:**
  - **Desktop (`>= 1024px`):** Announcement bar ringkas di atas Header (dapat ditutup); Header 1 baris memuat logo `MEIKA`, 5 menu utama (`Home`, `Shop`, `Brands`, `About`, `Marketing`), search bar/tombol, ikon Account, Wishlist (+ counter), Cart (+ counter). Grid katalog 4 kolom pada Home dan 3 kolom berdampingan dengan panel Filter 280px di `/shop`.
  - **Tablet (`640px - 1023px`, diuji di `768px` & `820px`):** Filter Shop menjadi bar ringkas atau drawer atas yang bisa dibuka tutup sehingga grid produk tampil lega 2-3 kolom; Checkout menata form dan ringkasan pesanan agar tidak saling menjepit input.
  - **Mobile (`<= 639px`, diuji di `390px`):** Hamburger / Menu berlabel *"Menu"* (`44x44px`) membuka drawer penuh yang aksesibel (`Esc` menutup); Search terpisah rapi agar tidak memadatkan logo; grid produk 2 kolom rapi atau 1 kolom di Checkout/Admin; setiap tombol kuantitas (`-`/`+`), swatch shade (`44px` hit-area meski titik warna visual `22px` di dalam kotak/lingkaran padded), ikon Wishlist, dan tautan navigasi memiliki area sentuh minimal **`44x44px`** dengan jarak >= `8px`.

---

## 5. Aturan Komponen Anti-Slop (`R-04`, `R-14`, `R-27`, `cards.md`)

1. **Variasi Pola Antarbagian (Menolak Monotoni Kartu):**
   - **Featured Brands:** Strip horizontal grid tipografi/monogram bersih 5x2 kolom berbingkai hairline 1px dan jumlah SKU aktif, bukan 10 kotak putih berat bershadow.
   - **Shop by Category:** 5 ubin vertikal (`Face Makeup`, `Lip Makeup`, `Eye Makeup`, `Skincare`, `Beauty Essentials`) berfoto 4:5 dengan label tertambat bersih di bawah bingkai.
   - **Product Card:** Rasio `1:1`, foto produk bersih di atas `#FAF8F5`/`#FFFFFF`, maksimal 1 badge status (`Best Seller`, `New`, `Promo`), nama brand (muted `13px`), nama produk (`16px`), deret **titik swatch shade HANYA muncul jika `hasShades: true`** (maks 4 swatch + `+N`), rating demo, dan harga Rp coret bila diskon. Hover kartu mengangkat `2px` dan gambar zoom `1.03`.
   - **Admin Dashboard:** Tata letak tabel inventaris bersih berlatar `#FAF8F5`/`#FFFFFF` dengan 3 metrik angka tabular tanpa card dashboard berwarna-warni. Di layar mobile, tabel otomatis berubah menjadi daftar susun vertikal tanpa scroll samping.
2. **Ikon & Radius:** Seluruh ikon UI menggunakan **`lucide-react`** (`strokeWidth={1.5}`), nol emoji pada elemen antarmuka dan nol emoji pada teks contoh promosi (seluruh ikon memakai vektor Lucide, bukan karakter emoji). Sudut bingkai memakai radius terukur `8px` (`--r-md`) pada foto/kartu/tombol dan `4px` (`--r-sm`) pada badge/input, tanpa `pill` berlebihan di luar chip filter & swatch.
3. **Semua State Lengkap (`R-27` & `R-39`):** Setiap pencarian/filter nol hasil, keranjang kosong, wishlist kosong, produk tidak ditemukan, serta kegagalan gambar (`onError`) menyediakan fallback bersih dan aksi pemulihan yang jelas.

---

## 6. Log Pengecualian Multi-Halaman & Aset

1. **Pengecualian Single-Page Taste Skill:** Rute katalog multi-brand `/shop`, `/brands`, `/product/:slug`, transaksi `/cart` -> `/checkout` -> `/orders`, `/marketing`, `/about`, serta `/admin` dikecualikan dari batas panjang halaman tunggal demi menjaga fungsionalitas e-commerce multi-halaman penuh, sementara tetap patuh pada token warna, tipografi, fokus ring `#7A3D49`, nol overflow-x, dan aksesibilitas keyboard.
2. **Keamanan & Kejujuran Prototype:** Semua form pembayaran (VA Bank, QRIS, COD), grafik Campaign Analytics (`/marketing`), Rating/Review produk demo, serta Role Auth Admin di `localStorage` bertanda jelas sebagai **Prototype / Simulasi**.
3. **Otoritas Single Source of Truth:** Apabila terdapat perbedaan detail kecil antara ekspor mockup FigCraft awal (`01-design-system.png` yang menampilkan berat kartu 600 atau input pencarian inline navbar) dan `DESIGN.md`, maka aturan **`DESIGN.md` selalu menang** untuk bobot tipografi (`400`/`500`, `600` khusus badge `>= 13px`) dan minimal ukuran teks `13px`. Untuk bilah pencarian desktop di Navbar, dipakai **input pencarian inline dengan panel hasil instan + shortcut `SearchOverlay` (Esc untuk tutup)** agar seragam dengan struktur Navbar beranda sekaligus mendukung pencarian instan lintas halaman.
