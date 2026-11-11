import { ClipboardCheck, Printer, RotateCcw, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PROTOTYPE_EIGHT_STAGES,
  USABILITY_TEST_TASKS,
} from '../data/prototypeDocs';
import { useMeikaStore } from '../hooks/useMeikaStore';
import type { UsabilityTestEntry } from '../types/marketing';
import { resolveAssetUrl } from '../utils/assetUrl';

function TesterSlotCard({
  index,
  entry,
  onSave,
}: {
  index: number;
  entry: UsabilityTestEntry;
  onSave: (idx: number, updated: UsabilityTestEntry) => void;
}) {
  const [draft, setDraft] = useState<UsabilityTestEntry>(entry);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setDraft(entry);
  }, [entry]);

  const handleSave = () => {
    onSave(index, draft);
    setSavedNotice(true);
  };

  return (
    <div className="bg-white border border-black/10 rounded-[var(--r-md)] p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3">
        <div>
          <h3 className="font-display text-xl text-[#292626]">{entry.testerSlot}</h3>
          <p className="text-xs text-[#575252]">
            {entry.respondentName.trim()
              ? `Responden tercatat: ${entry.respondentName}`
              : 'Status: Slot kosong (siap diisi saat sesi observasi nyata)'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="meika-btn min-h-[40px] px-4 inline-flex items-center gap-1.5 rounded-[var(--r-sm)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-xs font-medium cursor-pointer"
        >
          <Save size={14} strokeWidth={1.5} aria-hidden="true" />
          <span>Simpan Catatan {entry.testerSlot}</span>
        </button>
      </div>

      {savedNotice && (
        <p
          role="status"
          className="text-xs text-[#15803D] bg-[#DCFCE7] border border-[#15803D]/30 rounded-[var(--r-sm)] px-3 py-2"
        >
          Catatan {entry.testerSlot} tersimpan lokal.
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label
            htmlFor={`ut-name-${index}`}
            className="block text-xs font-medium text-[#292626] mb-1"
          >
            Nama {entry.testerSlot}
          </label>
          <input
            id={`ut-name-${index}`}
            type="text"
            value={draft.respondentName}
            onChange={(e) => {
              setSavedNotice(false);
              setDraft((prev) => ({ ...prev, respondentName: e.target.value }));
            }}
            placeholder="Contoh: Rina Wijaya"
            className="w-full min-h-[40px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
          />
        </div>

        <div>
          <label
            htmlFor={`ut-tasks-${index}`}
            className="block text-xs font-medium text-[#292626] mb-1"
          >
            Tugas Selesai (0-8)
          </label>
          <input
            id={`ut-tasks-${index}`}
            type="text"
            value={draft.completedTasks}
            onChange={(e) => {
              setSavedNotice(false);
              setDraft((prev) => ({ ...prev, completedTasks: e.target.value }));
            }}
            placeholder="cth: 8 / 8"
            className="w-full min-h-[40px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
          />
        </div>

        <div>
          <label
            htmlFor={`ut-duration-${index}`}
            className="block text-xs font-medium text-[#292626] mb-1"
          >
            Total Durasi (Menit)
          </label>
          <input
            id={`ut-duration-${index}`}
            type="text"
            value={draft.durationMinutes}
            onChange={(e) => {
              setSavedNotice(false);
              setDraft((prev) => ({ ...prev, durationMinutes: e.target.value }));
            }}
            placeholder="cth: 6 menit"
            className="w-full min-h-[40px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
          />
        </div>

        <div>
          <label
            htmlFor={`ut-errors-${index}`}
            className="block text-xs font-medium text-[#292626] mb-1"
          >
            Jumlah Salah Klik
          </label>
          <input
            id={`ut-errors-${index}`}
            type="text"
            value={draft.errorCount}
            onChange={(e) => {
              setSavedNotice(false);
              setDraft((prev) => ({ ...prev, errorCount: e.target.value }));
            }}
            placeholder="cth: 1"
            className="w-full min-h-[40px] px-3 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label
            htmlFor={`ut-nav-${index}`}
            className="block text-xs font-medium text-[#292626] mb-1"
          >
            Kendala / Kebingungan Navigasi
          </label>
          <textarea
            id={`ut-nav-${index}`}
            rows={2}
            value={draft.navigationIssues}
            onChange={(e) => {
              setSavedNotice(false);
              setDraft((prev) => ({ ...prev, navigationIssues: e.target.value }));
            }}
            placeholder="Catat titik ragu pengguna..."
            className="w-full p-2.5 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
          />
        </div>

        <div>
          <label
            htmlFor={`ut-feedback-${index}`}
            className="block text-xs font-medium text-[#292626] mb-1"
          >
            Komentar Think-Aloud
          </label>
          <textarea
            id={`ut-feedback-${index}`}
            rows={2}
            value={draft.feedbackNotes}
            onChange={(e) => {
              setSavedNotice(false);
              setDraft((prev) => ({ ...prev, feedbackNotes: e.target.value }));
            }}
            placeholder="Kutipan langsung responden..."
            className="w-full p-2.5 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
          />
        </div>

        <div>
          <label
            htmlFor={`ut-priority-${index}`}
            className="block text-xs font-medium text-[#292626] mb-1"
          >
            Prioritas Perbaikan Desain
          </label>
          <textarea
            id={`ut-priority-${index}`}
            rows={2}
            value={draft.improvementPriority}
            onChange={(e) => {
              setSavedNotice(false);
              setDraft((prev) => ({ ...prev, improvementPriority: e.target.value }));
            }}
            placeholder="High / Medium / Low + usulan aksi..."
            className="w-full p-2.5 rounded-[var(--r-sm)] border border-black/20 bg-[#FAF8F5] text-sm"
          />
        </div>
      </div>
    </div>
  );
}

export function AboutPage() {
  const { utEntries, saveUtEntry, resetUtEntries, resetAllDemoData } = useMeikaStore();
  const [globalStatus, setGlobalStatus] = useState<string | null>(null);

  return (
    <div className="wrap py-10 sm:py-14 space-y-14">
      {/* 1. Brand Profile & Positioning */}
      <section className="grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
            Profil Bisnis & Dokumentasi Prototype
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#292626] leading-tight">
            MEIKA Beauty Store: Satu Destinasi untuk Pilihan Kecantikanmu
          </h1>
          <p className="text-base text-[#575252] leading-relaxed">
            <strong>Your Beauty, Your Choice.</strong> MEIKA adalah platform e-commerce ritel
            kecantikan multi-merek yang dirancang untuk memudahkan konsumen usia 18-35 tahun di
            Jabodetabek dan kota besar Indonesia dalam mencari, membandingkan shade maupun manfaat,
            dan memesan produk makeup, skincare, serta beauty essentials dari 10 merek terkurasi
            dalam satu pengalaman belanja terstruktur.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-white border border-black/10 rounded-[var(--r-md)] p-4 space-y-1.5">
              <h2 className="font-display text-xl text-[#292626]">Masalah yang Diselesaikan</h2>
              <p className="text-xs text-[#575252] leading-relaxed">
                Konsumen sering berpindah banyak toko untuk membandingkan merek, detail shade
                tersebar, sulit menyaring anggaran, dan pemesanan via chat tidak memiliki riwayat
                status pesanan yang rapi.
              </p>
            </div>
            <div className="bg-white border border-black/10 rounded-[var(--r-md)] p-4 space-y-1.5">
              <h2 className="font-display text-xl text-[#292626]">Kontak & Layanan Demo</h2>
              <p className="text-xs text-[#575252] leading-relaxed">
                Email CS: <strong>cs@meika.id</strong> | Studio Kurasi Demo: Kemang Timur,
                Jakarta Selatan | Jam Operasional: Senin-Sabtu 09.00-18.00 WIB.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-[#F6E8E9] border border-[#E8A5AD] rounded-[var(--r-lg)] p-4">
            <img
              src={resolveAssetUrl('/images/hero/brand-atelier.svg')}
              alt="Ilustrasi meja kurasi studio MEIKA Beauty Store"
              width={640}
              height={540}
              className="w-full h-auto rounded-[var(--r-md)] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Notice regarding prototype integrity */}
      <section className="bg-[#F6E8E9]/70 border border-[#E8A5AD] rounded-[var(--r-md)] p-5 text-sm text-[#292626] space-y-1">
        <p className="font-medium">Catatan Transparansi Akademik & Aset Visual Prototype</p>
        <p className="text-xs text-[#575252] leading-relaxed">
          Seluruh katalog 32 SKU, ilustrasi kemasan vektor studio (Opsi A non-resmi), data transaksi,
          serta laporan analitik pada halaman pemasaran disusun khusus sebagai prototype interaktif
          mata kuliah Digital Entrepreneurship tanpa klaim distributor resmi merek, klaim medis,
          maupun nomor sertifikasi BPOM fiktif.
        </p>
      </section>

      {/* 2. Eight Stages of Prototype Development */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
              Metodologi Digital Entrepreneurship
            </p>
            <h2 className="font-display text-3xl text-[#292626] mt-1">
              8 Tahapan Pengembangan Prototype
            </h2>
          </div>
          <Link
            to="/marketing"
            className="text-sm font-medium text-[#7A3D49] hover:underline no-underline"
          >
            Lihat Strategi Promosi Digital
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROTOTYPE_EIGHT_STAGES.map((stage) => (
            <article
              key={stage.step}
              className="bg-white border border-black/10 rounded-[var(--r-md)] p-5 space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[var(--r-sm)] bg-[#FAF8F5] border border-black/10 text-xs font-medium text-[#7A3D49]">
                  Tahap {stage.step}
                </span>
                <h3 className="font-display text-xl text-[#292626] leading-snug">{stage.title}</h3>
                <p className="text-xs text-[#575252] leading-relaxed">{stage.summary}</p>
              </div>
              <p className="text-xs text-[#292626] bg-[#FAF8F5] rounded-[var(--r-sm)] p-2.5 border border-black/5 leading-relaxed">
                <strong>Implementasi MEIKA:</strong> {stage.meikaImplementation}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Usability Testing Guide + 8 Tasks */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
              Tahap 7 & 8: Pengujian Pengguna Langsung
            </p>
            <h2 className="font-display text-3xl text-[#292626] mt-1">
              Skenario Tugas Usability Testing (UT-01 s.d. UT-08)
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--r-sm)] bg-white border border-black/15 text-xs text-[#292626]">
            <ClipboardCheck size={15} strokeWidth={1.5} className="text-[#7A3D49]" aria-hidden="true" />
            <span>Metode: Observasi, Think-Aloud, Tugas Terarah, Survei Singkat</span>
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-[var(--r-md)] overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-[#FAF8F5] border-b border-black/10 text-xs uppercase tracking-wider text-[#575252]">
              <tr>
                <th className="py-3 px-4 font-medium">Kode</th>
                <th className="py-3 px-4 font-medium">Judul Tugas</th>
                <th className="py-3 px-4 font-medium">Skenario Uji</th>
                <th className="py-3 px-4 font-medium">Kriteria Berhasil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {USABILITY_TEST_TASKS.map((task) => (
                <tr key={task.code}>
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-[#7A3D49]">
                    {task.code}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#292626]">{task.title}</td>
                  <td className="py-3 px-4 text-xs text-[#575252]">{task.scenario}</td>
                  <td className="py-3 px-4 text-xs text-[#292626]">{task.expectedOutcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Interactive Empty-Slot Recorder (5 testers) */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-[#292626]">
              Lembar Pencatatan 5 Responden (Template Kosong Siap Isi)
            </h2>
            <p className="text-sm text-[#575252] mt-1">
              Tidak ada data wawancara fiktif yang diisikan sebelumnya. Catat hasil pengujian nyata
              secara objektif untuk 5 penguji dan simpan langsung di peramban Anda.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[42px] px-4 inline-flex items-center gap-1.5 rounded-[var(--r-sm)] border border-black/15 bg-white text-xs font-medium text-[#292626] hover:bg-[#F6E8E9] cursor-pointer"
            >
              <Printer size={15} strokeWidth={1.5} aria-hidden="true" />
              <span>Cetak Lembar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                resetUtEntries();
                setGlobalStatus('Seluruh slot Penguji #1 s.d. #5 dikosongkan kembali.');
              }}
              className="min-h-[42px] px-4 inline-flex items-center gap-1.5 rounded-[var(--r-sm)] border border-[#B87883] bg-white text-xs font-medium text-[#7A3D49] hover:bg-[#F6E8E9] cursor-pointer"
            >
              <RotateCcw size={15} strokeWidth={1.5} aria-hidden="true" />
              <span>Reset Template Kosong</span>
            </button>

            <button
              type="button"
              onClick={() => {
                resetAllDemoData();
                setGlobalStatus('Seluruh state demo (keranjang, pesanan, admin, dan UT) diatur ulang.');
              }}
              className="min-h-[42px] px-4 inline-flex items-center gap-1.5 rounded-[var(--r-sm)] bg-[#292626] text-[#FAF8F5] text-xs font-medium hover:bg-black cursor-pointer"
            >
              <span>Reset Semua Data Demo</span>
            </button>
          </div>
        </div>

        {globalStatus && (
          <p
            role="status"
            className="text-xs text-[#292626] bg-[#F6E8E9] border border-[#E8A5AD] rounded-[var(--r-sm)] px-4 py-2.5"
          >
            {globalStatus}
          </p>
        )}

        <div className="space-y-4">
          {utEntries.map((entry, idx) => (
            <TesterSlotCard
              key={entry.testerSlot}
              index={idx}
              entry={entry}
              onSave={saveUtEntry}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

