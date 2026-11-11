import type {
  PrototypeStage,
  UsabilityTestEntry,
  UsabilityTestTask,
} from '../types/marketing';

export const PROTOTYPE_EIGHT_STAGES: PrototypeStage[] = [
  {
    step: 1,
    title: 'Identifikasi Masalah & Kebutuhan Pengguna',
    summary:
      'Memetakan kendala konsumen saat harus berpindah banyak toko dan sulit membandingkan shade atau harga kecantikan.',
    meikaImplementation:
      'Menghimpun 10 merek dan 32 SKU ke dalam satu etalase terpadu MEIKA Beauty Store dengan label informasi seragam.',
  },
  {
    step: 2,
    title: 'Menentukan Tujuan Prototype',
    summary:
      'Menentukan pertanyaan yang ingin dibuktikan bersama pengguna sebelum membangun sistem produksi penuh.',
    meikaImplementation:
      'Menguji kejelasan pencarian, filter multi-merek, pemilihan shade makeup vs ukuran skincare, hingga kejelasan status pesanan.',
  },
  {
    step: 3,
    title: 'Pembuatan Sketsa Awal & User Flow',
    summary:
      'Menyusun aliran antarhalaman secara bertahap agar pengguna tidak tersesat saat berbelanja.',
    meikaImplementation:
      'Memetakan 6 layar utama wireframe alur belanja dan panel admin pada dokumen design FigCraft.',
  },
  {
    step: 4,
    title: 'Penyusunan Wireframe Digital',
    summary:
      'Mengunci struktur tata letak, hierarki tombol CTA, dan kelengkapan blok fungsional tanpa distraksi dekoratif.',
    meikaImplementation:
      'Menghasilkan 6 artboard wireframe terhubung dari Home -> Shop -> Product Detail -> Checkout -> Tracking -> Admin.',
  },
  {
    step: 5,
    title: 'Perancangan Desain Visual High-Fidelity',
    summary:
      'Menerapkan identitas merek, sistem warna yang lolos uji kontras, tipografi konsisten, dan ilustrasi produk presisi.',
    meikaImplementation:
      'Disusun dalam DESIGN.md dan kanvas HiFi 1440px serta 390px di FigCraft menggunakan Warm Ivory #FAF8F5, Charcoal #292626, dan Action Rose #7A3D49.',
  },
  {
    step: 6,
    title: 'Implementasi Prototype Interaktif (Fungsional)',
    summary:
      'Membangun antarmuka yang merespons input pengguna secara nyata, termasuk persistensi state dan validasi.',
    meikaImplementation:
      'Dikembangkan dengan React 19, TypeScript, Tailwind CSS, serta unit test TDD dan penyimpanan localStorage berversi.',
  },
  {
    step: 7,
    title: 'Skenario Uji Pengguna (Usability Testing)',
    summary:
      'Menjalankan skenario tugas terukur bersama minimal 5 calon pengguna (Observasi, Think-Aloud, Tugas Terarah, Survei Singkat).',
    meikaImplementation:
      'Disiapkan melalui 8 skenario terstandar dan formulir pencatatan kosong di bawah agar hasil observasi dicatat objektif tanpa rekayasa.',
  },
  {
    step: 8,
    title: 'Evaluasi Hambatan & Perbaikan Iteratif',
    summary:
      'Mencatat waktu tugas, salah klik, kebingungan navigasi, serta menetapkan prioritas perbaikan desain.',
    meikaImplementation:
      'Catatan tiap penguji disimpan lokal atau dicetak sebagai bahan revisi iterasi prototype berikutnya.',
  },
];

export const USABILITY_TEST_TASKS: UsabilityTestTask[] = [
  {
    code: 'UT-01',
    title: 'Pencarian Produk Cepat',
    scenario: 'Temukan produk "Lip Cream" melalui bar pencarian di navigasi atas.',
    expectedOutcome: 'Pengguna berhasil membuka hasil pencarian dan masuk ke produk tujuan.',
  },
  {
    code: 'UT-02',
    title: 'Filter Multi-Brand & Harga di /shop',
    scenario: 'Saring katalog untuk merek Skintific atau Wardah pada rentang Rp 50rb - Rp 150rb.',
    expectedOutcome: 'Daftar produk berubah sesuai filter dan dapat direset bila hasil kosong.',
  },
  {
    code: 'UT-03',
    title: 'Eksplorasi Brand Directory',
    scenario: 'Buka menu Brands lalu pilih satu merek untuk melihat jumlah dan daftar SKU aktif.',
    expectedOutcome: 'Menampilkan deskripsi merek dan produk terkait secara tepat.',
  },
  {
    code: 'UT-04',
    title: 'Pemilihan Shade Kosmetik',
    scenario: 'Buka produk Foundation atau Lip Cream lalu ganti warna shade sebelum menambahkan ke keranjang.',
    expectedOutcome: 'Gambar, label shade, dan tombol Add to Cart mengikuti shade terpilih.',
  },
  {
    code: 'UT-05',
    title: 'Produk Skincare Non-Shade',
    scenario: 'Buka salah satu produk Skincare atau Beauty Essentials lalu pilih ukuran kemasan.',
    expectedOutcome: 'Pengguna memahami pemilih ukuran (tanpa dot shade warna makeup).',
  },
  {
    code: 'UT-06',
    title: 'Kelola Keranjang & Kode Promo',
    scenario: 'Buka /cart, ubah jumlah item, dan masukkan kode promo MEIKA10.',
    expectedOutcome: 'Subtotal, diskon promo, dan estimasi total diperbarui seketika.',
  },
  {
    code: 'UT-07',
    title: 'Validasi & Konfirmasi Checkout',
    scenario: 'Lanjutkan ke /checkout, uji pesan error saat form kosong, lalu selesaikan pesanan simulasi.',
    expectedOutcome: 'Nomor pesanan MK-... muncul dan status awal tercatat sebagai Pending.',
  },
  {
    code: 'UT-08',
    title: 'Pemantauan Status Pesanan',
    scenario: 'Buka Riwayat Pesanan /orders untuk melacak pesanan yang baru dibuat.',
    expectedOutcome: 'Pengguna melihat rincian pesanan beserta posisi status pada tracker 5 tahap.',
  },
];

export const EMPTY_UT_SLOTS: UsabilityTestEntry[] = Array.from({ length: 5 }, (_, idx) => ({
  testerSlot: `Penguji #${idx + 1}`,
  respondentName: '',
  completedTasks: '',
  durationMinutes: '',
  errorCount: '',
  navigationIssues: '',
  feedbackNotes: '',
  improvementPriority: '',
}));

