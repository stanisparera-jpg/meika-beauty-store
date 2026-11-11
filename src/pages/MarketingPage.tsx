import { ArrowRight, BarChart3, Mail, Megaphone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  EMAIL_CAMPAIGN_CONCEPT,
  IG_ORGANIC_CONCEPTS,
  PAID_AD_CONCEPT,
  SIMULATED_CHANNEL_METRICS,
  WA_BROADCAST_CONCEPT,
} from '../data/marketingData';
import { useMeikaStore } from '../hooks/useMeikaStore';
import { resolveAssetUrl } from '../utils/assetUrl';

export function MarketingPage() {
  const { products } = useMeikaStore();

  const findProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
  const featuredEmailProducts = EMAIL_CAMPAIGN_CONCEPT.featuredSkus
    .map((sku) => products.find((p) => p.sku === sku))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const maxClicks = Math.max(...SIMULATED_CHANNEL_METRICS.map((m) => m.clicks), 1);

  return (
    <div className="wrap py-10 sm:py-14 space-y-14">
      {/* Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-black/10 pb-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-sm)] bg-[#F6E8E9] border border-[#E8A5AD] text-xs font-medium text-[#292626]">
            <span>Hub Promosi Digital & Katalog | Data Simulasi</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#292626] leading-tight">
            Strategi Promosi Digital MEIKA Beauty Store
          </h1>
          <p className="text-base text-[#575252] leading-relaxed">
            Dokumentasi konsep konten organik, iklan berbayar, siaran WhatsApp, dan email pemasaran
            yang terhubung langsung ke alur belanja interaktif katalog 32 SKU. Seluruh metrik
            analitik di halaman ini ditandai sebagai Data Simulasi akademik.
          </p>
        </div>

        <Link
          to="/shop"
          className="meika-btn min-h-[46px] px-6 inline-flex items-center gap-2 rounded-[var(--r-sm)] bg-[#7A3D49] hover:bg-[#642F39] text-white text-sm font-medium no-underline shrink-0"
        >
          <span>Jelajahi Halaman Tujuan /shop</span>
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </section>

      {/* 1. Instagram Organic (3 Pillars) */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
            Saluran 01: Konten Media Sosial
          </p>
          <h2 className="font-display text-3xl text-[#292626]">
            Instagram Organic Content (3 Pilar Utama)
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {IG_ORGANIC_CONCEPTS.map((concept) => {
            const product = findProductBySlug(concept.featuredProductSlug);
            return (
              <article
                key={concept.id}
                className="bg-white border border-black/10 rounded-[var(--r-lg)] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="bg-[#FAF8F5] border-b border-black/10 p-5 flex items-center justify-between gap-4">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-[var(--r-sm)] bg-[#E8A5AD] text-[#292626] text-xs font-medium">
                        {concept.type}
                      </span>
                      <p className="text-xs text-[#575252] mt-1.5">Mockup Feed 4:5 (Data Simulasi)</p>
                    </div>
                    {product && (
                      <img
                        src={resolveAssetUrl(product.primaryImage)}
                        alt={product.name}
                        width={84}
                        height={84}
                        className="w-20 h-20 object-contain rounded-[var(--r-sm)] bg-white border border-black/10 p-1.5 shrink-0"
                      />
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-display text-2xl text-[#292626] leading-snug">
                      {concept.title}
                    </h3>
                    <p className="text-xs text-[#575252] bg-[#FAF8F5] border border-black/10 rounded-[var(--r-sm)] p-3 leading-relaxed">
                      <strong>Arahan Visual:</strong> {concept.visualDirection}
                    </p>
                    <p className="text-sm text-[#292626] leading-relaxed">{concept.caption}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {concept.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-[#7A3D49] bg-[#F6E8E9]/70 px-2 py-0.5 rounded-[var(--r-sm)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={product ? `/product/${product.slug}` : '/shop'}
                    className="min-h-[42px] px-4 w-full inline-flex items-center justify-center gap-2 rounded-[var(--r-sm)] border border-[#B87883] text-sm font-medium text-[#7A3D49] hover:bg-[#F6E8E9] no-underline"
                  >
                    <span>{concept.cta}</span>
                    <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 2. Paid Ad Concept */}
      <section className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.14em] text-[#7A3D49] font-medium">
            Saluran 02: Iklan Berbayar
          </p>
          <h2 className="font-display text-3xl text-[#292626]">
            {PAID_AD_CONCEPT.platform}
          </h2>
        </div>

        <div className="bg-white border border-black/10 rounded-[var(--r-lg)] p-6 grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--r-sm)] bg-[#FAF8F5] border border-black/10 text-xs font-medium text-[#292626]">
                <Megaphone size={14} strokeWidth={1.5} className="text-[#7A3D49]" aria-hidden="true" />
                <span>Objektif: {PAID_AD_CONCEPT.objective}</span>
              </span>
              <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[#F6E8E9] text-xs font-medium text-[#292626]">
                Data Simulasi
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-[#292626]">
              {PAID_AD_CONCEPT.headline}
            </h3>
            <p className="text-sm text-[#292626] leading-relaxed">{PAID_AD_CONCEPT.primaryText}</p>
            <p className="text-xs text-[#575252] bg-[#FAF8F5] border border-black/10 rounded-[var(--r-sm)] p-3 leading-relaxed">
              <strong>Segmen Target:</strong> {PAID_AD_CONCEPT.targetAudience}
            </p>
          </div>

          <div className="lg:col-span-5 bg-[#FAF8F5] border border-black/10 rounded-[var(--r-md)] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#575252]">
              <span className="font-medium text-[#292626]">MEIKA Beauty Store</span>
              <span>Sponsored Preview</span>
            </div>
            <img
              src={resolveAssetUrl('/images/hero/hero-beauty-studio.svg')}
              alt="Preview kreatif iklan tunggal MEIKA Beauty Store"
              width={720}
              height={620}
              className="w-full h-44 object-contain bg-white rounded-[var(--r-sm)] border border-black/10 p-2"
            />
            <div className="flex items-center justify-between gap-3 pt-1">
              <div>
                <p className="text-xs text-[#575252]">meika.id/shop</p>
                <p className="text-sm font-medium text-[#292626]">10 Brand Kecantikan Terkurasi</p>
              </div>
              <Link
                to={PAID_AD_CONCEPT.destinationPath}
                className="meika-btn min-h-[40px] px-4 inline-flex items-center rounded-[var(--r-sm)] bg-[#7A3D49] text-white text-xs font-medium no-underline shrink-0"
              >
                {PAID_AD_CONCEPT.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WhatsApp Broadcast & Email Marketing */}
      <section className="grid lg:grid-cols-2 gap-6">
        <article className="bg-white border border-black/10 rounded-[var(--r-lg)] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <MessageSquare size={18} strokeWidth={1.5} className="text-[#7A3D49]" aria-hidden="true" />
                <h2 className="font-display text-2xl text-[#292626]">WhatsApp Broadcast</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-[var(--r-sm)] bg-[#F6E8E9] text-xs font-medium text-[#292626]">
                Data Simulasi
              </span>
            </div>

            <div className="text-xs text-[#575252] space-y-1">
              <p>
                <strong>Segmen:</strong> {WA_BROADCAST_CONCEPT.segment}
              </p>
              <p>
                <strong>Jadwal Kirim:</strong> {WA_BROADCAST_CONCEPT.timing}
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-black/10 rounded-[var(--r-md)] p-4 text-sm text-[#292626] leading-relaxed">
              {WA_BROADCAST_CONCEPT.messageBody}
            </div>
          </div>

          <Link
            to={WA_BROADCAST_CONCEPT.targetPath}
            className="min-h-[42px] px-4 inline-flex items-center justify-center gap-2 rounded-[var(--r-sm)] border border-[#B87883] text-sm font-medium text-[#7A3D49] hover:bg-[#F6E8E9] no-underline"
          >
            <span>{WA_BROADCAST_CONCEPT.ctaLabel}</span>
            <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </article>

        <article className="bg-white border border-black/10 rounded-[var(--r-lg)] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2">
                <Mail size={18} strokeWidth={1.5} className="text-[#7A3D49]" aria-hidden="true" />
                <h2 className="font-display text-2xl text-[#292626]">Email Marketing</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-[var(--r-sm)] bg-[#F6E8E9] text-xs font-medium text-[#292626]">
                Data Simulasi
              </span>
            </div>

            <div className="text-xs text-[#575252] bg-[#FAF8F5] border border-black/10 rounded-[var(--r-sm)] p-3 space-y-1">
              <p>
                <strong>Subjek:</strong> {EMAIL_CAMPAIGN_CONCEPT.subjectLine}
              </p>
              <p>
                <strong>Preheader:</strong> {EMAIL_CAMPAIGN_CONCEPT.preheader}
              </p>
            </div>

            <div className="text-sm text-[#292626] space-y-2 leading-relaxed">
              <p className="font-medium">{EMAIL_CAMPAIGN_CONCEPT.greeting}</p>
              <p>{EMAIL_CAMPAIGN_CONCEPT.bodyParagraph}</p>
              <p className="text-xs font-medium text-[#7A3D49]">{EMAIL_CAMPAIGN_CONCEPT.offerLabel}</p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {featuredEmailProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.slug}`}
                  className="bg-[#FAF8F5] border border-black/10 rounded-[var(--r-sm)] p-2 text-center hover:border-[#B87883] no-underline"
                >
                  <img
                    src={resolveAssetUrl(item.primaryImage)}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-12 h-12 mx-auto object-contain"
                  />
                  <p className="text-[11px] font-medium text-[#292626] mt-1 line-clamp-1">
                    {item.brandName}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/shop"
            className="meika-btn min-h-[42px] px-4 inline-flex items-center justify-center gap-2 rounded-[var(--r-sm)] bg-[#7A3D49] text-white text-sm font-medium no-underline"
          >
            <span>{EMAIL_CAMPAIGN_CONCEPT.ctaLabel}</span>
            <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </article>
      </section>

      {/* 4. Simulated Analytics Matrix */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BarChart3 size={20} strokeWidth={1.5} className="text-[#7A3D49]" aria-hidden="true" />
            <h2 className="font-display text-3xl text-[#292626]">
              Matriks Evaluasi Kinerja Saluran (Data Simulasi)
            </h2>
          </div>
          <span className="px-3 py-1 rounded-[var(--r-sm)] bg-[#FEF3C7] border border-[#D97706]/35 text-xs font-medium text-[#292626]">
            Seluruh angka di bawah adalah Data Simulasi Ilustratif
          </span>
        </div>

        <div className="bg-white border border-black/10 rounded-[var(--r-md)] overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-[#FAF8F5] border-b border-black/10 text-xs uppercase tracking-wider text-[#575252]">
              <tr>
                <th className="py-3 px-4 font-medium">Saluran Promosi</th>
                <th className="py-3 px-4 font-medium">Impressions</th>
                <th className="py-3 px-4 font-medium">Reach</th>
                <th className="py-3 px-4 font-medium">Klik Tautan</th>
                <th className="py-3 px-4 font-medium">CTR</th>
                <th className="py-3 px-4 font-medium">Konversi Demo</th>
                <th className="py-3 px-4 font-medium">Proporsi Klik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 tabular-nums">
              {SIMULATED_CHANNEL_METRICS.map((row) => {
                const widthPercent = Math.round((row.clicks / maxClicks) * 100);
                return (
                  <tr key={row.channel}>
                    <td className="py-3 px-4 font-medium text-[#292626]">
                      <div>{row.channel}</div>
                      <span className="text-xs font-normal text-[#575252]">Data Simulasi</span>
                    </td>
                    <td className="py-3 px-4">{row.impressions.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4">{row.reach.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4 font-medium">{row.clicks.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-4">{row.ctrPercent.toFixed(2)}%</td>
                    <td className="py-3 px-4">
                      {row.conversions} ({row.conversionRatePercent.toFixed(1)}%)
                    </td>
                    <td className="py-3 px-4 min-w-[140px]">
                      <div className="w-full h-2.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-black/10">
                        <div
                          className="h-full bg-[#7A3D49]"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

