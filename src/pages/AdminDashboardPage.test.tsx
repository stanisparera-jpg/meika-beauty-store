import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedAdminRoute } from '../components/ProtectedAdminRoute';
import { MeikaStoreProvider } from '../hooks/useMeikaStore';
import { StorefrontLayout } from '../layouts/StorefrontLayout';
import { DEMO_ADMIN_CREDENTIALS } from '../services/authService';
import { AdminDashboardPage } from './AdminDashboardPage';
import { AdminLoginPage } from './AdminLoginPage';
import { OrderHistoryPage } from './OrderHistoryPage';

function renderAdminApp(initialUrl: string) {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <MeikaStoreProvider>
        <Routes>
          <Route element={<StorefrontLayout />}>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
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
      </MeikaStoreProvider>
    </MemoryRouter>,
  );
}

describe('AdminLoginPage & Protected AdminDashboardPage CRUD', () => {
  it('authenticates Admin demo credentials, adds a product SKU, and syncs order status updates', async () => {
    const user = userEvent.setup();
    renderAdminApp('/admin/login');

    await user.type(screen.getByLabelText(/Email Administrator/i), DEMO_ADMIN_CREDENTIALS.email);
    await user.type(screen.getByLabelText(/Kata Sandi/i), 'salah-password');
    await user.click(screen.getByRole('button', { name: /Masuk Admin Panel/i }));
    expect(screen.getByText(/Kredensial administrator tidak valid/i)).toBeInTheDocument();

    const passInput = screen.getByLabelText(/Kata Sandi/i);
    await user.clear(passInput);
    await user.type(passInput, DEMO_ADMIN_CREDENTIALS.password);
    await user.click(screen.getByRole('button', { name: /Masuk Admin Panel/i }));

    expect(screen.getByText(/MEIKA Admin Console/i)).toBeInTheDocument();
    expect(screen.getByText(/32 SKU/i)).toBeInTheDocument();

    // Add a new SKU via modal
    await user.click(screen.getByRole('button', { name: /Tambah Produk/i }));
    await user.type(screen.getByLabelText(/^Nama Produk$/i), 'Velvet Satin Lip Cream Demo');
    await user.click(screen.getByRole('button', { name: /Simpan Produk/i }));
    expect(screen.getByText(/33 SKU/i)).toBeInTheDocument();

    // Update first order status from Processing -> Shipped
    await user.click(screen.getByRole('tab', { name: /Manajemen Pesanan/i }));
    const statusSelect = screen.getByLabelText(/Ubah status pesanan MK-20261110-1042/i);
    await user.selectOptions(statusSelect, 'Shipped');
    expect(statusSelect).toHaveValue('Shipped');
    expect(screen.getByTestId('order-status-MK-20261110-1042')).toHaveTextContent('Shipped');
  }, 15000);
});
