import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MeikaStoreProvider } from '../hooks/useMeikaStore';
import { StorefrontLayout } from '../layouts/StorefrontLayout';
import { MEIKA_STORAGE_KEYS, writeJson } from '../services/storageService';
import { AccountPage } from './AccountPage';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';
import { OrderConfirmationPage } from './OrderConfirmationPage';
import { OrderHistoryPage } from './OrderHistoryPage';
import { WishlistPage } from './WishlistPage';

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
});
