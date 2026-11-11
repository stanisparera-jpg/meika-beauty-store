import { useState, type FormEvent } from 'react';
import { useMeikaStore } from '../hooks/useMeikaStore';

export function NewsletterSection() {
  const { subscribeNewsletter } = useMeikaStore();
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const res = subscribeNewsletter(email);
    if (res.ok) {
      setFeedback({
        ok: true,
        text: 'Terima kasih! Email Anda terdaftar untuk pembaruan katalog demo MEIKA.',
      });
      setEmail('');
    } else {
      setFeedback({ ok: false, text: res.error ?? 'Email tidak valid.' });
    }
  };

  return (
    <section
      aria-labelledby="heading-newsletter"
      className="wrap py-12"
    >
      <div className="rounded-[var(--r-md)] bg-[#F6E8E9] border border-[#B87883]/30 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7">
          <p className="m-0 text-[13px] uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
            Pembaruan Kurasi MEIKA
          </p>
          <h2 id="heading-newsletter" className="h2-section m-0 mt-1 text-[#292626]">
            Kabar Rilis Shade & Promo Terbaru
          </h2>
          <p className="m-0 mt-2 text-sm text-[#5E5857] max-w-xl leading-relaxed">
            Daftarkan alamat email Anda untuk informasi kode promo simulasi dan peluncuran koleksi
            pilihan di MEIKA Beauty Store.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-5" noValidate>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              aria-label="Alamat email newsletter"
              className="flex-1 min-h-[44px] px-4 rounded-[var(--r-sm)] bg-white border border-[var(--border-strong)] text-[#292626] text-base"
            />
            <button
              type="submit"
              className="meika-btn min-h-[44px] px-6 rounded-[var(--r-md)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-sm font-medium cursor-pointer shrink-0"
            >
              Subscribe
            </button>
          </div>
          {feedback && (
            <p
              role="status"
              className={`m-0 mt-2 text-sm font-medium ${
                feedback.ok ? 'text-[#245C3F]' : 'text-[#94232D]'
              }`}
            >
              {feedback.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

