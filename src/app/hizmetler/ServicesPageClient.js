"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import LiveEditable from '../../components/LiveEditable';
import LiveEditToolbar from '../../components/LiveEditToolbar';
import LiveListControls from '../../components/LiveListControls';
import { useLiveContent } from '../../hooks/useLiveContent';

function getServiceIcon(icon) {
  switch (icon) {
    case 'maintenance':
      return <svg className="card-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>;
    case 'gear':
      return <svg className="card-icon" viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.3C.5 6.7.9 9.7 2.9 11.7c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.4-2.4c.4-.4.4-1.1 0-1.4z"/></svg>;
    case 'engine':
      return <svg className="card-icon" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>;
    case 'welding':
      return <svg className="card-icon" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.07 19.59 10.48 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-8h2v4h-2zm0-3h2v2h-2z"/></svg>;
    case 'brake':
      return <svg className="card-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>;
    case 'wire':
      return <svg className="card-icon" viewBox="0 0 24 24"><path d="M7 2v 11h3v9l7-12h-4l4-8z"/></svg>;
    case 'wheel':
      return <svg className="card-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>;
    default:
      return <svg className="card-icon" viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.3C.5 6.7.9 9.7 2.9 11.7c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.4-2.4c.4-.4.4-1.1 0-1.4z"/></svg>;
  }
}

export default function ServicesPageClient() {
  const { get, loading } = useLiveContent();
  const [servicesList, setServicesList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [brandQuery, setBrandQuery] = useState('');

  useEffect(() => {
    if (!loading) {
      setServicesList(get('services.items', []));
      setBrandsList(get('services.brands', []));
    }
  }, [loading]);

  const filteredBrands = brandsList.filter(b => b.toLowerCase().includes(brandQuery.toLowerCase()));

  const handleAddService = () => {
    const slug = prompt("Yeni hizmet için URL uzantısı (Slug) girin: (Örn: lastik-parlatma)");
    if (!slug) return;
    
    if (servicesList.some(s => s.slug === slug)) {
      alert("Bu slug zaten mevcut!");
      return;
    }

    const title = prompt("Hizmet başlığı:", "Yeni Hizmet");
    if (!title) return;

    const newService = {
      slug: slug,
      icon: "gear",
      title: title,
      desc: "Hizmet kısa açıklaması buraya gelecek.",
      detailTitle: title,
      detailDesc: "Hizmet detaylı açıklaması buraya gelecek.",
      leftTitle: "Yapılan İşlemler",
      leftDesc: "Bu hizmet kapsamında yapılan adımlar:",
      items: [
        { title: "İlk İşlem Adımı", desc: "Açıklama" }
      ],
      rightTitle: "Neden Tercih Etmelisiniz?",
      rightDesc: "Ustamızın kalitesi ve garantili işçilikle en iyi destek.",
      badges: ["Garantili Hizmet", "Hızlı Teslimat"],
      cta1Text: "Hemen Randevu Alın",
      cta1Href: "/iletisim",
      cta2Text: "WhatsApp'tan Bilgi Al",
      cta2Href: "https://wa.me/905331301448",
      ctaStyleReverse: false
    };

    const updated = [...servicesList, newService];
    setServicesList(updated);
    window.liveEditChanges = window.liveEditChanges || {};
    window.liveEditChanges['services.items'] = updated;
    window.dispatchEvent(new CustomEvent('live-edit-dirty'));
  };

  const handleDeleteService = (idx) => {
    if (confirm("Bu hizmeti silmek istediğinize emin misiniz? Alt sayfaları da silinecektir.")) {
      const updated = servicesList.filter((_, i) => i !== idx);
      setServicesList(updated);
      window.liveEditChanges = window.liveEditChanges || {};
      window.liveEditChanges['services.items'] = updated;
      window.dispatchEvent(new CustomEvent('live-edit-dirty'));
    }
  };

  const handleAddBrand = () => {
    const updated = [...brandsList, "Yeni Marka"];
    setBrandsList(updated);
    window.liveEditChanges = window.liveEditChanges || {};
    window.liveEditChanges['services.brands'] = updated;
    window.dispatchEvent(new CustomEvent('live-edit-dirty'));
  };

  const handleDeleteBrand = (brandName) => {
    const originalIdx = brandsList.indexOf(brandName);
    if (originalIdx !== -1) {
      const updated = brandsList.filter((_, i) => i !== originalIdx);
      setBrandsList(updated);
      window.liveEditChanges = window.liveEditChanges || {};
      window.liveEditChanges['services.brands'] = updated;
      window.dispatchEvent(new CustomEvent('live-edit-dirty'));
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <LiveEditToolbar />
      </Suspense>

      {/* TITLE BANNER */}
      <section className="section-padding" style={{ marginTop: '80px', background: 'linear-gradient(135deg, #090A0D 0%, #16181E 100%)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container text-center">

          <LiveEditable path="services.banner.title" tagName="h1" style={{ fontSize: '2.75rem', fontWeight: 900 }} className="mb-md">
            {get('services.banner.title', 'Uzmanlık Alanlarımız')}
          </LiveEditable>
          <LiveEditable path="services.banner.desc" tagName="p" className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.15rem' }}>
            {get('services.banner.desc', "Engin Usta'nın 15 yılı aşkın tecrübesiyle, her türlü mekanik, elektrik ve şasi problemini dükkanımızda en modern ekipmanlarla çözüyoruz.")}
          </LiveEditable>
        </div>
      </section>

      {/* DETAILED SERVICES LISTING */}
      <section className="section-padding">
        <div className="container">
          <div className="centered-flex-grid">
            {servicesList.map((service, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <Link href={`/hizmetler/${service.slug}`} className="card" style={{ height: '100%' }}>
                  {getServiceIcon(service.icon)}
                  <LiveEditable path={`services.items.${idx}.title`} tagName="h3" className="card-title">
                    {service.title}
                  </LiveEditable>
                  <LiveEditable path={`services.items.${idx}.desc`} tagName="p" className="card-desc">
                    {service.desc}
                  </LiveEditable>
                  <span className="card-link">
                    Detayları İncele 
                    <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                  </span>
                </Link>
                <LiveListControls 
                  onDelete={() => handleDeleteService(idx)} 
                  style={{ position: 'absolute', right: '12px', top: '12px', zIndex: 10 }}
                />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
            <LiveListControls onAdd={handleAddService} addLabel="Yeni Hizmet Ekle" />
          </div>
        </div>
      </section>

      {/* BRANDS WE SPECIALIZE IN */}
      <section className="section-padding" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="text-center mb-xl">
            <LiveEditable path="services.brands_title" tagName="h2" style={{ fontSize: '2rem' }}>
              {get('services.brands_title', 'Uzmanı Olduğumuz Markalar')}
            </LiveEditable>
            <LiveEditable path="services.brands_desc" tagName="p" className="text-muted mt-sm">
              {get('services.brands_desc', 'Aşağıdaki markaların tüm modellerinde orijinal parça ve fabrika standartlarında onarım yapıyoruz.')}
            </LiveEditable>
          </div>

          {/* Brand Search Bar */}
          <div style={{ maxWidth: '400px', margin: '0 auto 32px auto', position: 'relative' }}>
            <input 
              type="text" 
              className="brand-search-input" 
              placeholder="Marka Ara... (Örn: Vespa, Honda)" 
              value={brandQuery}
              onChange={(e) => setBrandQuery(e.target.value)}
            />
          </div>

          <div className="brand-grid">
            {filteredBrands.map((brand) => (
              <div key={brand} className="brand-logo-item" style={{ position: 'relative' }}>
                <LiveEditable path={`services.brands.${brandsList.indexOf(brand)}`} tagName="span">
                  {brand}
                </LiveEditable>
                <LiveListControls 
                  onDelete={() => handleDeleteBrand(brand)} 
                  style={{ position: 'absolute', right: '-4px', top: '-4px', scale: '0.85', zIndex: 10 }}
                />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
            <LiveListControls onAdd={handleAddBrand} addLabel="Yeni Marka Ekle" />
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CTA BANNER */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border-color)', background: 'linear-gradient(135deg, #16181E 0%, #090A0D 100%)' }}>
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.25rem', color: '#FFF', fontWeight: 900, marginBottom: 'var(--space-md)' }}>
            Motosikletinizin Bakım Zamanı Geldi mi?
          </h2>
          <p className="text-muted mt-sm" style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '28px' }}>
            Hemen randevunuzu oluşturun, Engin Usta ve ekibiyle motorunuzu fabrika standartlarına döndürelim.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/iletisim" className="cta-btn cta-btn-primary">Randevu Al</Link>
            <a href="https://wa.me/905331301448" target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn-secondary">WhatsApp Sor</a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .centered-flex-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--space-lg);
        }

        .centered-flex-grid > div {
          width: 100%;
        }

        @media (min-width: 768px) {
          .centered-flex-grid > div {
            width: calc(50% - 12px);
          }
        }

        @media (min-width: 1024px) {
          .centered-flex-grid > div {
            width: calc(33.333% - 16px);
          }
        }

        :global(.centered-flex-grid .card) {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }

        :global(.centered-flex-grid .card:hover) {
          transform: translateY(-6px) !important;
          border-color: var(--color-primary) !important;
          box-shadow: 0 12px 24px rgba(0, 122, 255, 0.18) !important;
        }

        .brand-search-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: #FFF;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .brand-search-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 10px rgba(0, 122, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 28px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
          cursor: pointer;
        }

        .cta-btn-primary {
          background: var(--color-primary);
          color: #FFF;
          border: 1px solid transparent;
        }

        .cta-btn-primary:hover {
          background: #0056B3;
          box-shadow: 0 0 15px rgba(0, 122, 255, 0.3);
        }

        .cta-btn-secondary {
          background: transparent;
          border: 1px solid var(--color-primary);
          color: #FFF;
        }

        .cta-btn-secondary:hover {
          background: rgba(0, 122, 255, 0.1);
          color: var(--color-secondary);
        }

        @media (max-width: 576px) {
          .cta-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
