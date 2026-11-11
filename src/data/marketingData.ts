import type {
  EmailCampaignConcept,
  InstagramPostConcept,
  PaidAdConcept,
  SimulatedChannelMetric,
  WhatsAppBroadcastConcept,
} from '../types/marketing';

export const IG_ORGANIC_CONCEPTS: InstagramPostConcept[] = [
  {
    id: 'ig-1',
    type: 'Product Spotlight',
    title: 'Spotlight: Pilihan Shade Netral untuk Kulit Kuning Langsat',
    visualDirection:
      'Foto katalog rasio 4:5 di atas meja batu gading hangat menampilkan botol Fit Me Foundation dan kartu perbandingan 4 shade berlabel jelas tanpa teks menutupi botol.',
    caption:
      'Bingung menentukan shade sebelum belanja daring? Bandingkan 4 pilihan warna Fit Me Matte + Poreless langsung di satu halaman MEIKA Beauty Store lengkap dengan informasi stok dan tekstur.',
    hashtags: ['#MEIKABeautyStore', '#YourBeautyYourChoice', '#FoundationHarian', '#KurasiMakeup'],
    cta: 'Bandingkan Shade di Katalog',
    featuredProductSlug: 'maybelline-fit-me-matte-poreless-foundation',
  },
  {
    id: 'ig-2',
    type: 'Beauty Recommendation',
    title: 'Rutinitas Pagi 3 Langkah: Toner, Gel Pelembap, dan Sunscreen',
    visualDirection:
      'Susunan editorial datar menampilkan The Originote Ceraluronic Toner, Skintific 5X Ceramide Gel, dan Ceramella Sunscreen SPF 50 berlatar Warm Ivory #FAF8F5.',
    caption:
      'Menyiapkan permukaan kulit sebelum memakai cushion tidak harus rumit. Kumpulkan produk dari berbagai merek pilihan dalam satu keranjang tanpa perlu berpindah toko.',
    hashtags: ['#SkincareRoutineID', '#MEIKAKurasi', '#CushionReady', '#SunscreenHarian'],
    cta: 'Lihat Rekomendasi Skincare',
    featuredProductSlug: 'skintific-5x-ceramide-barrier-moisture-gel',
  },
  {
    id: 'ig-3',
    type: 'Promotional Campaign',
    title: 'Kurasi Akhir Pekan: Hemat Paket Lip Cream & Cushion Harian',
    visualDirection:
      'Komposisi studio dua produk best seller (Skintific Cushion + Hanasui Mattedorable Lip Cream) disertai lencana promo MEIKA10 bernuansa Charcoal & Dusty Pink.',
    caption:
      'Belanja kebutuhan makeup kampus maupun kantor lebih terstruktur lewat MEIKA. Masukkan kode MEIKA10 pada halaman keranjang untuk potongan simulasi 10% (min. belanja Rp 100.000).',
    hashtags: ['#PromoMEIKA', '#LipCreamHarian', '#BelanjaKecantikan', '#MEIKA10'],
    cta: 'Order Sekarang via Web',
    featuredProductSlug: 'hanasui-mattedorable-lip-cream',
  },
];

export const PAID_AD_CONCEPT: PaidAdConcept = {
  id: 'ad-1',
  platform: 'Instagram & Facebook Feed (Single Image Ad)',
  objective: 'Traffic & Purchase Conversion menuju halaman katalog /shop',
  targetAudience:
    'Perempuan & laki-laki usia 18-35 tahun di Jabodetabek dan kota besar Indonesia yang memiliki minat Skincare, Kosmetik Harian, serta Belanja Daring.',
  headline: 'Semua Merek Favoritmu dalam Satu Katalog Rapi',
  primaryText:
    'Temukan Maybelline, Wardah, Skintific, Somethinc, hingga The Originote tanpa berpindah-pindah toko. Filter cepat berdasar kategori, merek, shade, serta anggaran Anda.',
  ctaLabel: 'Shop Now',
  destinationPath: '/shop',
};

export const WA_BROADCAST_CONCEPT: WhatsAppBroadcastConcept = {
  id: 'wa-1',
  segment: 'Pelanggan Demo Jabodetabek yang Pernah Menyimpan Wishlist',
  timing: 'Jumat, pukul 16.30 WIB (jam pulang kerja / kuliah)',
  messageBody:
    'Halo Kak, beberapa pilihan produk kecantikan favorit minggu ini kembali tersedia di katalog MEIKA Beauty Store. Jika Kakak ingin membandingkan shade atau mencoba alur checkout dengan kode MEIKA10 (potongan 10% min. Rp 100.000), silakan cek tautan katalog kami.',
  ctaLabel: 'Belanja Sekarang',
  targetPath: '/shop?sort=popular',
};

export const EMAIL_CAMPAIGN_CONCEPT: EmailCampaignConcept = {
  id: 'em-1',
  subjectLine: 'Kurasi Baru Minggu Ini di MEIKA: Bandingkan 10 Brand dalam Satu Keranjang',
  preheader: 'Cek perbandingan harga, varian shade, serta estimasi ongkir Jabodetabek & Nasional.',
  greeting: 'Halo Nadia,',
  bodyParagraph:
    'Terima kasih telah menjelajahi MEIKA Beauty Store. Kami merangkum tiga item yang paling sering dicari minggu ini agar Anda lebih cepat menentukan rutinitas wajah, bibir, dan skincare harian.',
  featuredSkus: ['MK-02', 'MK-11', 'MK-25'],
  offerLabel: 'Kode MEIKA10: Potongan 10% untuk minimal subtotal Rp 100.000 (Simulasi)',
  ctaLabel: 'Belanja Sekarang',
};

export const SIMULATED_CHANNEL_METRICS: SimulatedChannelMetric[] = [
  {
    channel: 'Instagram Organic (3 Post Kurasi)',
    impressions: 3600,
    reach: 2450,
    engagementCount: 288,
    clicks: 144,
    ctrPercent: 4.0,
    conversions: 14,
    conversionRatePercent: 9.72,
    isSimulated: true,
  },
  {
    channel: 'Instagram & Facebook Single Image Ad',
    impressions: 12000,
    reach: 8900,
    engagementCount: 540,
    clicks: 360,
    ctrPercent: 3.0,
    conversions: 27,
    conversionRatePercent: 7.5,
    isSimulated: true,
  },
  {
    channel: 'WhatsApp Broadcast Segmen Wishlist',
    impressions: 420,
    reach: 395,
    engagementCount: 168,
    clicks: 92,
    ctrPercent: 21.9,
    conversions: 15,
    conversionRatePercent: 16.3,
    isSimulated: true,
  },
  {
    channel: 'Email Marketing Newsletter',
    impressions: 680,
    reach: 540,
    engagementCount: 122,
    clicks: 48,
    ctrPercent: 7.06,
    conversions: 6,
    conversionRatePercent: 12.5,
    isSimulated: true,
  },
];

