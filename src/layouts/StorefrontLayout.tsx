import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#292626]">
      <AnnouncementBar />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

