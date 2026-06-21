"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import LiveEditable from '../../components/LiveEditable';
import LiveEditToolbar from '../../components/LiveEditToolbar';
import { useLiveContent } from '../../hooks/useLiveContent';

export default function CalculatorPage() {
  const [brands, setBrands] = useState(null);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedMileage, setSelectedMileage] = useState('');

  const { get } = useLiveContent();

  useEffect(() => {
    fetch('/api/calculator')
      .then(res => res.json())
      .then(data => {
        setBrands(data.brands || {});
        setLevels(data.levels || []);
        
        // Set initial values
        const initialBrand = Object.keys(data.brands || {})[0] || '';
        const initialModel = data.brands?.[initialBrand]?.models?.[0] || '';
        const initialLevel = data.levels?.[0]?.key || '';
        
        setSelectedBrand(initialBrand);
        setSelectedModel(initialModel);
        setSelectedMileage(initialLevel);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load calculator config:", err);
        setLoading(false);
      });
  }, []);

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedModel(brands[brand]?.models?.[0] || '');
  };

  if (loading || !brands || levels.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
        Hesaplama aracı yükleniyor...
      </div>
    );
  }

  const selectedMileageData = levels.find(m => m.key === selectedMileage) || levels[0];
  const coeff = brands[selectedBrand]?.basePriceCoeff || 1.0;
  
  // Calculate estimate pricing
  const minPrice = selectedMileageData ? Math.round((selectedMileageData.priceBase * coeff) / 50) * 50 : 0;
  const maxPrice = selectedMileageData ? Math.round((selectedMileageData.priceBase * 1.3 * coeff) / 50) * 50 : 0;

  // Event handler for analytics triggering
  const handleGAEvent = (type) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'calculator_click', {
        brand: selectedBrand,
        model: selectedModel,
        mileage: selectedMileage,
        cta_type: type
      });
    }
  };

  // Generate WhatsApp message template
  const waText = `Merhaba Engin Usta, web sitenizdeki Bakım Hesaplayıcı üzerinden bilgi aldım. ${selectedBrand} ${selectedModel} motorumun (${selectedMileageData.label}) periyodik bakımı için randevu almak istiyorum. Tahmini fiyat aralığı: ${minPrice} TL - ${maxPrice} TL. Uygun zamanları görüşebilir miyiz?`;
  const waUrl = `https://wa.me/902128790755?text=${encodeURIComponent(waText)}`;

  return (
    <>
      <Suspense fallback={null}>
        <LiveEditToolbar />
      </Suspense>

      {/* TITLE BANNER */}
      <section className="section-padding" style={{ marginTop: '80px', background: 'linear-gradient(135deg, #090A0D 0%, #16181E 100%)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container text-center">

          <LiveEditable path="calculator.banner.title" tagName="h1" style={{ fontSize: '2.75rem', fontWeight: 900 }} className="mb-md">
            {get('calculator.banner.title', 'İnteraktif Bakım Hesaplayıcı')}
          </LiveEditable>
          <LiveEditable path="calculator.banner.desc" tagName="p" className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.15rem' }}>
            {get('calculator.banner.desc', 'Motosikletinizin marka, model ve kilometresini seçerek yapılması gereken bakım işlemlerini listeleyin ve tahmini maliyet aralığını öğrenin.')}
          </LiveEditable>
        </div>
      </section>

      {/* CALCULATOR TOOL SECTION */}
      <section className="section-padding">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          
          {/* Inputs Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-lg)', color: '#FFF' }}>Motosiklet Bilgileri</h3>
            
            <div className="form-group">
              <label className="form-label" htmlFor="brand-select">Motosiklet Markası</label>
              <select 
                id="brand-select" 
                className="form-control"
                value={selectedBrand}
                onChange={handleBrandChange}
                style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
              >
                {Object.keys(brands).map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="model-select">Motosiklet Modeli</label>
              <select 
                id="model-select" 
                className="form-control"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
              >
                {(brands[selectedBrand]?.models || []).map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mileage-select">Güncel Kilometre Aralığı</label>
              <select 
                id="mileage-select" 
                className="form-control"
                value={selectedMileage}
                onChange={(e) => setSelectedMileage(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
              >
                {levels.map(level => (
                  <option key={level.key} value={level.key}>{level.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: 'var(--space-xl)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Tahmini Maliyet Aralığı:</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-secondary)', fontFamily: 'var(--font-headings)' }}>
                  {minPrice} TL - {maxPrice} TL
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: 'var(--space-lg)' }}>
                * Verilen fiyat aralığı orijinal/yüksek kaliteli yan sanayi sarf malzemeleri ve standart işçilik bedellerini kapsar. Ekstra mekanik arızalar veya parça ihtiyaçları bu fiyata dahil değildir.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <a 
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleGAEvent('whatsapp')}
                className="btn btn-accent" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor', marginRight: '8px' }}>
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.12 8.12 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.86-.38-4.12-1.11l-.3-.18-3.07.81.82-3.01-.2-.31a8.188 8.188 0 0 1-1.25-4.34c0-4.54 3.7-8.24 8.24-8.24h-.11z"/>
                </svg>
                WhatsApp ile Teklif Al
              </a>
              <Link 
                href="/iletisim"
                onClick={() => handleGAEvent('appointment')}
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Bakım Randevusu Oluştur
              </Link>
            </div>
          </div>

          {/* Results Checklist Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-lg)', color: 'var(--color-secondary)' }}>Bakım Kapsamı Listesi</h3>
            <p className="text-muted mb-lg" style={{ fontSize: '0.95rem' }}>
              {selectedBrand} {selectedModel} için {selectedMileageData.label} seviyesinde kontrol edilecek ve değişecek ana kalemler:
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedMileageData.items.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-sm)' }}>
                  <svg style={{ width: '20px', height: '20px', fill: 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }} viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-md)', background: 'rgba(0, 102, 255, 0.05)', borderLeft: '3px solid var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>
              <strong style={{ color: '#FFF', display: 'block', marginBottom: '4px', fontSize: '0.9rem' }}>Neden Engin Usta Güvencesi?</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Bakım sonrasında değişen tüm eski yedek parçalar size gösterilir. Tüm işlemler dijital CRM servis geçmişinize işlenir, motorunuzun kilometresi bazında sonraki bakımları takip edilir.
              </span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
