import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { MeikaStoreProvider } from '../hooks/useMeikaStore';
import { StorefrontLayout } from '../layouts/StorefrontLayout';
import { AboutPage } from './AboutPage';
import { MarketingPage } from './MarketingPage';

function renderAcademicPage(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <MeikaStoreProvider>
        <Routes>
          <Route element={<StorefrontLayout />}>
            <Route path="/about" element={<AboutPage />} />
            <Route path="/marketing" element={<MarketingPage />} />
          </Route>
        </Routes>
      </MeikaStoreProvider>
    </MemoryRouter>,
  );
}

describe('AboutPage & MarketingPage academic requirements', () => {
  it('renders 8 prototype stages and empty-slot >=5 tester Usability Testing sheet on /about', async () => {
    const user = userEvent.setup();
    renderAcademicPage('/about');

    expect(screen.getByText(/8 Tahapan Pengembangan Prototype/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Penguji #5' })).toBeInTheDocument();
    expect(screen.getByText('UT-08')).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Nama Penguji #1/i);
    await user.type(nameInput, 'Citra Maharani');
    await user.click(screen.getByRole('button', { name: /Simpan Catatan Penguji #1/i }));
    expect(screen.getByText(/Catatan Penguji #1 tersimpan lokal/i)).toBeInTheDocument();
  });

  it('renders IG organic (3+), FB/IG Ad, WA broadcast, Email, and Data Simulasi labels on /marketing', () => {
    renderAcademicPage('/marketing');

    expect(screen.getByText(/Instagram Organic Content/i)).toBeInTheDocument();
    expect(screen.getByText(/Product Spotlight/i)).toBeInTheDocument();
    expect(screen.getByText(/Beauty Recommendation/i)).toBeInTheDocument();
    expect(screen.getByText(/Promotional Campaign/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Instagram & Facebook Feed \(Single Image Ad\)/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'WhatsApp Broadcast' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Email Marketing' })).toBeInTheDocument();
    expect(screen.getAllByText(/Data Simulasi/i).length).toBeGreaterThanOrEqual(2);
  });
});
