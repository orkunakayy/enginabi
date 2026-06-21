"use client";

import { Suspense } from 'react';
import LiveEditable from '../../components/LiveEditable';
import LiveEditToolbar from '../../components/LiveEditToolbar';
import { useLiveContent } from '../../hooks/useLiveContent';
import MaintenanceCalculator from '../../components/MaintenanceCalculator';

export default function CalculatorPage() {
  const { get } = useLiveContent();

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
        <div className="container">
          <MaintenanceCalculator />
        </div>
      </section>
    </>
  );
}
