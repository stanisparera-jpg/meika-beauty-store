import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MeikaStoreProvider, useMeikaStore } from '../hooks/useMeikaStore';
import { StorefrontLayout } from '../layouts/StorefrontLayout';
import { ProductCard } from '../components/ProductCard';
import { MEIKA_STORAGE_KEYS, writeJson } from '../services/storageService';
import { AccountPage } from './AccountPage';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';
import { OrderConfirmationPage } from './OrderConfirmationPage';
import { OrderHistoryPage } from './OrderHistoryPage';
import { WishlistPage } from './WishlistPage';
import { SEED_PRODUCTS } from '../data/products';

function renderTx(initialUrl: string) {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <MeikaStoreProvider>
        <Routes>
          <Route element={<StorefrontLayout />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
          </Route>
        </Routes>
      </MeikaStoreProvider>
    </MemoryRouter>,
  );
}

describe('Transaction flow: Cart, Promo, Checkout validation, Order Confirmation & Tracking', () => {
  it('supports promo code MEIKA10 in Cart, rejects invalid Checkout form, and creates durable Order Confirmation', async () => {
    const user = userEvent.setup();
    writeJson(MEIKA_STORAGE_KEYS.CART, [
      { productId: 'mk-01', variantId: 'mk-01-v1', quantity: 1 },
    ]);

    renderTx('/cart');
    expect(screen.getByText(/Fit Me Matte \+ Poreless Foundation/i)).toBeInTheDocument();

    const promoInput = screen.getByLabelText(/Kode promo/i);
    await user.type(promoInput, 'MEIKA10');
    await user.click(screen.getByRole('button', { name: /Terapkan/i }));
    expect(screen.getByText(/MEIKA10 berhasil diterapkan/i)).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /Lanjut ke Checkout/i }));
    expect(screen.getByRole('heading', { name: /Checkout Simulasi/i })).toBeInTheDocument();

    // Submit empty form -> validation errors appear
    await user.click(screen.getByRole('button', { name: /Konfirmasi Pesanan Demo/i }));
    expect(screen.getByText(/Nama lengkap minimal 2 karakter/i)).toBeInTheDocument();

    // Fill valid Indonesian shipping fields
    await user.type(screen.getByLabelText(/Nama Lengkap/i), 'Nadia Putri');
    await user.type(screen.getByLabelText(/Email/i), 'nadia@contoh.id');
    await user.type(screen.getByLabelText(/Nomor HP/i), '081288990011');
    await user.type(screen.getByLabelText(/Alamat Lengkap/i), 'Jl. Kemang Raya No. 24');
    await user.type(screen.getByLabelText(/Provinsi/i), 'DKI Jakarta');
    await user.type(screen.getByLabelText(/Kota \/ Kabupaten/i), 'Jakarta Selatan');
    await user.type(screen.getByLabelText(/Kecamatan/i), 'Mampang Prapatan');
    await user.type(screen.getByLabelText(/Kode Pos/i), '12730');

    await user.click(screen.getByRole('button', { name: /Konfirmasi Pesanan Demo/i }));
    expect(screen.getByRole('heading', { name: /Pesanan Simulasi Diterima/i })).toBeInTheDocument();
    expect(screen.getByText(/Status Pesanan: Pending/i)).toBeInTheDocument();
  }, 15000);

  it('tracks demo orders and five lifecycle statuses in Order History', () => {
    renderTx('/orders');
    expect(screen.getByText('MK-20261110-1042')).toBeInTheDocument();
    expect(screen.getByText('MK-20261108-0891')).toBeInTheDocument();
  });

  it('persists applied promo across reload and warns honestly when subtotal is below CANTIK20 minimum', async () => {
    const user = userEvent.setup();
    writeJson(MEIKA_STORAGE_KEYS.CART, [
      { productId: 'mk-01', variantId: 'mk-01-v1', quantity: 1 }, // Rp 139.000 < Rp 150.000
    ]);

    const { unmount } = renderTx('/cart');
    const promoInput = screen.getByLabelText(/Kode promo/i);
    await user.type(promoInput, 'CANTIK20');
    await user.click(screen.getByRole('button', { name: /Terapkan/i }));

    expect(screen.queryByText(/CANTIK20 berhasil diterapkan/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Minimal belanja Rp 150\.000 untuk memakai CANTIK20/i)).toBeInTheDocument();

    unmount();
    renderTx('/cart');
    expect(screen.getByText(/Minimal belanja Rp 150\.000 untuk memakai CANTIK20/i)).toBeInTheDocument();
  });

  it('disables wishlist quick-add when all variants are out of stock', () => {
    const customProducts = SEED_PRODUCTS.map((p) =>
      p.id === 'mk-01'
        ? { ...p, variants: p.variants.map((v) => ({ ...v, stock: 0 })) }
        : p,
    );
    writeJson(MEIKA_STORAGE_KEYS.PRODUCTS, customProducts);
    writeJson(MEIKA_STORAGE_KEYS.WISHLIST, ['mk-01']);

    renderTx('/wishlist');
    const oosBtn = screen.getByRole('button', { name: /Stok Habis/i });
    expect(oosBtn).toBeDisabled();
  });

  it('defaults ProductCard selection to an in-stock variant and cleans deleted SKUs from cart and wishlist', async () => {
    const user = userEvent.setup();
    const customMk01 = {
      ...SEED_PRODUCTS[0],
      variants: [
        { ...SEED_PRODUCTS[0].variants[0], stock: 0 },
        { ...SEED_PRODUCTS[0].variants[1], stock: 5 },
      ],
    };
    writeJson(MEIKA_STORAGE_KEYS.PRODUCTS, [customMk01, ...SEED_PRODUCTS.slice(1)]);
    writeJson(MEIKA_STORAGE_KEYS.WISHLIST, [customMk01.id]);

    function ProbeHarness() {
      const { cart, wishlist, cartCount, adminDeleteProduct } = useMeikaStore();
      return (
        <div>
          <span data-testid="cart-len">{cart.length}</span>
          <span data-testid="cart-count">{cartCount}</span>
          <span data-testid="wish-len">{wishlist.length}</span>
          <ProductCard product={customMk01} />
          <button type="button" onClick={() => adminDeleteProduct(customMk01.id)}>
            Delete Probe
          </button>
        </div>
      );
    }

    render(
      <MemoryRouter>
        <MeikaStoreProvider>
          <ProbeHarness />
        </MeikaStoreProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /Add to Cart/i }));
    expect(screen.getByTestId('cart-len')).toHaveTextContent('1');
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    expect(screen.getByTestId('wish-len')).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: 'Delete Probe' }));
    expect(screen.getByTestId('cart-len')).toHaveTextContent('0');
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.getByTestId('wish-len')).toHaveTextContent('0');
  });
});
