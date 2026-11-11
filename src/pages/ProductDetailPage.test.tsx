import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MeikaStoreProvider } from '../hooks/useMeikaStore';
import { StorefrontLayout } from '../layouts/StorefrontLayout';
import { ProductDetailPage } from './ProductDetailPage';

function renderPdp(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/product/${slug}`]}>
      <MeikaStoreProvider>
        <Routes>
          <Route element={<StorefrontLayout />}>
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<div>Checkout Page Destination</div>} />
          </Route>
        </Routes>
      </MeikaStoreProvider>
    </MemoryRouter>,
  );
}

describe('ProductDetailPage conditional shades & cart actions', () => {
  it('renders interactive shade swatches for pigmented lip cream and updates active shade label', async () => {
    const user = userEvent.setup();
    renderPdp('hanasui-mattedorable-lip-cream');

    expect(screen.getByText(/Pilih Shade/i)).toBeInTheDocument();
    const chicBtn = screen.getByRole('button', { name: /Pilih shade 04 Chic/i });
    await user.click(chicBtn);
    expect(screen.getByText(/Shade Terpilih: 04 Chic/i)).toBeInTheDocument();

    const [primaryAddBtn] = screen.getAllByRole('button', { name: /Add to Cart/i });
    await user.click(primaryAddBtn);
    expect(screen.getByLabelText(/Keranjang Belanja \(1\)/i)).toBeInTheDocument();
  });

  it('does NOT render color shade swatches for skincare moisturizers (non-shade product)', () => {
    renderPdp('skintific-5x-ceramide-barrier-moisture-gel');

    expect(screen.queryByText(/Pilih Shade/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Pilih Varian Ukuran \/ Kemasan/i)).toBeInTheDocument();
  });

  it('shows clean 404 product state when slug does not exist', () => {
    renderPdp('produk-fiktif-999');
    expect(screen.getByText(/Produk tidak ditemukan/i)).toBeInTheDocument();
  });
});
