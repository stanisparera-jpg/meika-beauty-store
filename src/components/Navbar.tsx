import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useMeikaStore } from '../hooks/useMeikaStore';
import { MobileDrawer } from './MobileDrawer';
import { SearchOverlay } from './SearchOverlay';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/brands', label: 'Brands' },
  { to: '/about', label: 'About' },
  { to: '/marketing', label: 'Marketing' },
];

export function Navbar() {
  const { cartCount, wishlistCount, customerSession } = useMeikaStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const navigate = useNavigate();

  const handleDesktopSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = quickQuery.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xs border-b border-[var(--border-hairline)]">
        <div className="wrap flex items-center justify-between gap-3 h-[72px]">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="font-display text-[32px] leading-none tracking-[-0.02em] text-[#292626] no-underline shrink-0"
              aria-label="MEIKA Beauty Store Beranda"
            >
              MEIKA
            </Link>

            <nav aria-label="Menu utama" className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-[var(--r-sm)] text-sm font-medium no-underline transition-colors ${
                      isActive
                        ? 'text-[#7A3D49] bg-[#F6E8E9]'
                        : 'text-[#292626] hover:bg-[#F6E8E9]/60'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <form
            onSubmit={handleDesktopSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm relative"
            role="search"
            aria-label="Pencarian cepat"
          >
            <Search
              size={16}
              strokeWidth={1.5}
              className="absolute left-3 text-[#5E5857] pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder="Cari Cushion, Lip Cream, Skintific..."
              aria-label="Cari produk kecantikan"
              className="w-full h-10 pl-9 pr-3 rounded-[var(--r-sm)] border border-[var(--border-hairline)] bg-white text-sm text-[#292626] placeholder:text-[#5E5857]"
            />
          </form>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Buka pencarian"
              className="md:hidden tap-target inline-flex items-center justify-center rounded-[var(--r-sm)] text-[#292626] hover:bg-[#F6E8E9] cursor-pointer"
            >
              <Search size={19} strokeWidth={1.5} aria-hidden="true" />
            </button>

            <Link
              to="/account"
              aria-label={customerSession ? `Akun ${customerSession.name}` : 'Akun Pelanggan'}
              className="tap-target inline-flex items-center justify-center gap-1.5 px-2.5 rounded-[var(--r-sm)] text-[#292626] hover:bg-[#F6E8E9] no-underline text-sm"
            >
              <User size={18} strokeWidth={1.5} aria-hidden="true" />
              <span className="hidden xl:inline text-xs font-medium">
                {customerSession ? customerSession.name.split(' ')[0] : 'Akun'}
              </span>
            </Link>

            <Link
              to="/wishlist"
              aria-label={`Wishlist (${wishlistCount})`}
              className="tap-target relative inline-flex items-center justify-center px-2.5 rounded-[var(--r-sm)] text-[#292626] hover:bg-[#F6E8E9] no-underline"
            >
              <Heart size={18} strokeWidth={1.5} aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="ml-1 text-xs font-medium tabular-nums text-[#7A3D49]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              aria-label={`Keranjang Belanja (${cartCount})`}
              className="meika-btn min-h-[44px] px-3.5 inline-flex items-center gap-2 rounded-[var(--r-md)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-sm font-medium no-underline"
            >
              <ShoppingBag size={17} strokeWidth={1.5} aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              <span className="tabular-nums">({cartCount})</span>
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Menu"
              className="lg:hidden tap-target inline-flex items-center justify-center rounded-[var(--r-sm)] border border-[var(--border-hairline)] text-[#292626] hover:bg-[#F6E8E9] cursor-pointer"
            >
              <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        wishlistCount={wishlistCount}
        cartCount={cartCount}
      />
    </>
  );
}

