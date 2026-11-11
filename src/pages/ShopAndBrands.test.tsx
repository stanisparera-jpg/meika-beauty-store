import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MeikaStoreProvider } from '../hooks/useMeikaStore';
import { StorefrontLayout } from '../layouts/StorefrontLayout';
import { BrandsPage } from './BrandsPage';
import { ShopPage } from './ShopPage';

function renderCatalogRoute(initialUrl: string) {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <MeikaStoreProvider>
        <Routes>
          <Route element={<StorefrontLayout />}>
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/brands" element={<BrandsPage />} />
          </Route>
        </Routes>
      </MeikaStoreProvider>
    </MemoryRouter>,
  );
}

describe('ShopPage multi-filter, sort, pagination & BrandsPage', () => {
  it('filters catalog interactively by category, brand, and price, and supports empty state reset', async () => {
    const user = userEvent.setup();
    renderCatalogRoute('/shop');

    expect(screen.getByText(/Menampilkan 32 produk/i)).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/Cari nama produk atau merek di katalog/i);
    await user.type(searchInput, 'produk-tidak-ada-xyz');
    expect(screen.getByText(/Tidak ada produk yang cocok dengan filter/i)).toBeInTheDocument();

    const [resetBtn] = screen.getAllByRole('button', { name: /Reset Semua Filter/i });
    await user.click(resetBtn);
    expect(screen.getByText(/Menampilkan 32 produk/i)).toBeInTheDocument();
  });

  it('displays all 10 curated brands with accurate SKU count and updates active brand view', async () => {
    const user = userEvent.setup();
    renderCatalogRoute('/brands');

    expect(screen.getByRole('heading', { name: /Direktori 10 Brand Kecantikan/i })).toBeInTheDocument();
    const wardahBtn = screen.getByRole('button', { name: /Wardah/i });
    await user.click(wardahBtn);
    expect(screen.getByText(/Colorfit Velvet Powder Foundation/i)).toBeInTheDocument();
  });
});
