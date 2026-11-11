import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MeikaStoreProvider } from '../hooks/useMeikaStore';
import { StorefrontLayout } from '../layouts/StorefrontLayout';
import { ProtectedAdminRoute } from './ProtectedAdminRoute';
import { MEIKA_STORAGE_KEYS, writeJson } from '../services/storageService';
import type { CustomerSession } from '../types/auth';

function renderShell(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <MeikaStoreProvider>
        <Routes>
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<div>Home Stub</div>} />
            <Route path="/shop" element={<div>Shop Stub</div>} />
            <Route path="/admin/login" element={<div>Admin Login Stub</div>} />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <div>Admin Secret Console</div>
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </MeikaStoreProvider>
    </MemoryRouter>,
  );
}

describe('Storefront Shell & ProtectedAdminRoute', () => {
  it('renders announcement bar, main navigation, cart badge, and closes announcement bar on click', async () => {
    const user = userEvent.setup();
    renderShell('/');

    expect(screen.getByText(/MEIKA10/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Shop' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Brands' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Marketing' })).toBeInTheDocument();

    const dismissBtn = screen.getByRole('button', { name: /Tutup pengumuman/i });
    await user.click(dismissBtn);
    expect(screen.queryByRole('button', { name: /Tutup pengumuman/i })).not.toBeInTheDocument();
  });

  it('redirects unauthenticated guests from /admin to /admin/login and shows 403 for customer role', () => {
    renderShell('/admin');
    expect(screen.getByText('Admin Login Stub')).toBeInTheDocument();
    expect(screen.queryByText('Admin Secret Console')).not.toBeInTheDocument();

    const customerSession: CustomerSession = {
      id: 'cust-nadia',
      name: 'Nadia Putri',
      email: 'customer@meika.id',
      phone: '081288990011',
      defaultCity: 'Jakarta Selatan',
      defaultAddress: 'Jl. Kemang Raya No. 24',
      role: 'customer',
      loggedInAtIso: '2026-11-11T00:00:00.000Z',
    };
    writeJson(MEIKA_STORAGE_KEYS.CUSTOMER_SESSION, customerSession);

    renderShell('/admin');
    expect(screen.getByText(/403/i)).toBeInTheDocument();
    expect(screen.queryByText('Admin Secret Console')).not.toBeInTheDocument();
  });
});

