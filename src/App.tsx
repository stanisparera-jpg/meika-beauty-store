import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';
import { MeikaStoreProvider } from './hooks/useMeikaStore';
import { StorefrontLayout } from './layouts/StorefrontLayout';
import { HomePage } from './pages/HomePage';

const ShopPage = lazy(() => import('./pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const BrandsPage = lazy(() => import('./pages/BrandsPage').then((m) => ({ default: m.BrandsPage })));
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })),
);
const CartPage = lazy(() => import('./pages/CartPage').then((m) => ({ default: m.CartPage })));
const WishlistPage = lazy(() =>
  import('./pages/WishlistPage').then((m) => ({ default: m.WishlistPage })),
);
const AccountPage = lazy(() =>
  import('./pages/AccountPage').then((m) => ({ default: m.AccountPage })),
);
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })),
);
const OrderConfirmationPage = lazy(() =>
  import('./pages/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })),
);
const OrderHistoryPage = lazy(() =>
  import('./pages/OrderHistoryPage').then((m) => ({ default: m.OrderHistoryPage })),
);
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const MarketingPage = lazy(() =>
  import('./pages/MarketingPage').then((m) => ({ default: m.MarketingPage })),
);
const AdminLoginPage = lazy(() =>
  import('./pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
);
const AdminDashboardPage = lazy(() =>
  import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function RouteLoadingFallback() {
  return (
    <div className="wrap py-16 text-center text-sm text-[#5E5857]">
      Memuat halaman MEIKA Beauty Store...
    </div>
  );
}

function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  const rawBase = import.meta.env.BASE_URL || '/';
  const routerBasename = rawBase === '/' ? '/' : rawBase.replace(/\/+$/, '');

  return (
    <BrowserRouter basename={routerBasename}>
      <MeikaStoreProvider>
        <ScrollToTopOnNavigate />
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route element={<StorefrontLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/marketing" element={<MarketingPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardPage />
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </Suspense>
      </MeikaStoreProvider>
    </BrowserRouter>
  );
}

export default App;
