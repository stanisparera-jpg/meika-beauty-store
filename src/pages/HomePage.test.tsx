import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MeikaStoreProvider } from '../hooks/useMeikaStore';
import { StorefrontLayout } from '../layouts/StorefrontLayout';
import { HomePage } from './HomePage';

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <MeikaStoreProvider>
        <Routes>
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<div>Shop Destination</div>} />
            <Route path="/brands" element={<div>Brands Destination</div>} />
          </Route>
        </Routes>
      </MeikaStoreProvider>
    </MemoryRouter>,
  );
}

describe('HomePage 18 components & interactive blocks', () => {
  it('renders hero, featured brands, categories, best sellers, new arrivals, trending, promotions, recommendations, brand intro, and newsletter', () => {
    renderHome();

    expect(screen.getByRole('heading', { name: /Discover Your Beauty Essentials/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Shop Now' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore Brands' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Featured Brands/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Shop by Category/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Best Sellers/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /New Arrivals/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Trending Products/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Special Promotions/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Beauty Recommendations/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Tentang Kurasi MEIKA/i })).toBeInTheDocument();
  });

  it('validates and persists newsletter email subscription', async () => {
    const user = userEvent.setup();
    renderHome();

    const emailInput = screen.getByLabelText(/Alamat email newsletter/i);
    const submitBtn = screen.getByRole('button', { name: /Subscribe/i });

    await user.type(emailInput, 'salah-format');
    await user.click(submitBtn);
    expect(screen.getByText(/Format email belum valid/i)).toBeInTheDocument();

    await user.clear(emailInput);
    await user.type(emailInput, 'nadia.beauty@contoh.id');
    await user.click(submitBtn);
    expect(screen.getByText(/Terima kasih! Email Anda terdaftar/i)).toBeInTheDocument();
  });
});

