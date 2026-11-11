import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#292626] text-[#FAF8F5] border-t border-white/10 mt-20">
      <div className="wrap py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <p className="font-display text-3xl text-[#FAF8F5] m-0">MEIKA Beauty Store</p>
          <p className="mt-2 text-sm text-[#E8A5AD]">Your Beauty, Your Choice.</p>
          <p className="mt-3 text-sm text-[#FAF8F5]/80 max-w-md leading-relaxed">
            Platform ritel kecantikan multi-brand yang mengumpulkan pilihan makeup, skincare, dan
            beauty essentials dalam satu pengalaman kurasi terstruktur. Disusun sebagai High-Fidelity
            Interactive Prototype mata kuliah Digital Entrepreneurship.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-[#E8A5AD] m-0 mb-3">
            Belanja & Informasi
          </h3>
          <ul className="m-0 p-0 list-none flex flex-col gap-2 text-sm">
            <li>
              <Link to="/shop" className="text-[#FAF8F5]/90 hover:text-white no-underline">
                Semua Produk (32+ SKU)
              </Link>
            </li>
            <li>
              <Link to="/brands" className="text-[#FAF8F5]/90 hover:text-white no-underline">
                Direktori 10 Brand
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-[#FAF8F5]/90 hover:text-white no-underline">
                Tentang MEIKA & Usability Testing
              </Link>
            </li>
            <li>
              <Link to="/marketing" className="text-[#FAF8F5]/90 hover:text-white no-underline">
                Digital Marketing Hub
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-[#E8A5AD] m-0 mb-3">
            Layanan & Pengelolaan
          </h3>
          <ul className="m-0 p-0 list-none flex flex-col gap-2 text-sm">
            <li>
              <Link to="/orders" className="text-[#FAF8F5]/90 hover:text-white no-underline">
                Lacak & Riwayat Pesanan
              </Link>
            </li>
            <li>
              <Link to="/account" className="text-[#FAF8F5]/90 hover:text-white no-underline">
                Akun Demo Pelanggan
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="text-[#FAF8F5]/90 hover:text-white no-underline">
                Wishlist Tersimpan
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="text-[#FAF8F5]/90 hover:text-white no-underline">
                Admin Console Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#FAF8F5]/75">
          <p className="m-0">
            MEIKA Beauty Store Prototype | Data harga, stok, pembayaran, dan ulasan merupakan
            simulasi akademik.
          </p>
          <p className="m-0">CS Demo: cs@meika.id (Senin-Sabtu 09.00-17.00 WIB)</p>
        </div>
      </div>
    </footer>
  );
}

