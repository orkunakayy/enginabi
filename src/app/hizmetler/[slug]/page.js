import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDB } from '../../../lib/db';
import LiveEditable from '../../../components/LiveEditable';
import LiveEditToolbar from '../../../components/LiveEditToolbar';
import { Suspense } from 'react';

export async function generateStaticParams() {
  const db = readDB();
  const items = db.content?.services?.items || [];
  return items.map(service => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const db = readDB();
  const items = db.content?.services?.items || [];
  const data = items.find(s => s.slug === slug);
  if (!data) return {};

  return {
    title: `${data.detailTitle || data.title} | Emira Motors`,
    description: data.detailDesc || data.desc
  };
}

export default async function ServiceSubPage({ params }) {
  const { slug } = await params;
  const db = readDB();
  const items = db.content?.services?.items || [];
  const brandsList = db.content?.services?.brands || [];
  const serviceIndex = items.findIndex(s => s.slug === slug);
  const data = items[serviceIndex];

  if (!data) {
    notFound();
  }

  const isReverse = data.ctaStyleReverse;

  return (
    <>
      <Suspense fallback={null}>
        <LiveEditToolbar />
      </Suspense>

      {/* TITLE BANNER */}
      <section className="section-padding" style={{ marginTop: '80px', background: 'linear-gradient(135deg, #090A0D 0%, #16181E 100%)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <Link href="/hizmetler" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)', fontWeight: '600', fontSize: '0.9rem' }}>
              <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              Tüm Hizmetlerimize Dön
            </Link>
          </div>
          <LiveEditable path={`services.items.${serviceIndex}.detailTitle`} tagName="h1" style={{ fontSize: '2.5rem', fontWeight: 900 }} className="mb-sm">
            {data.detailTitle || data.title}
          </LiveEditable>
          <LiveEditable path={`services.items.${serviceIndex}.detailDesc`} tagName="p" className="text-muted" style={{ maxWidth: '700px', fontSize: '1.1rem' }}>
            {data.detailDesc || data.desc}
          </LiveEditable>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section-padding">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          
          {/* Left side detail */}
          <div>
            <LiveEditable path={`services.items.${serviceIndex}.leftTitle`} tagName="h2" style={{ fontSize: '1.75rem', marginBottom: 'var(--space-md)' }}>
              {data.leftTitle || "Yapılan İşlemler"}
            </LiveEditable>
            <LiveEditable path={`services.items.${serviceIndex}.leftDesc`} tagName="p" className="text-muted mb-lg">
              {data.leftDesc || "Bu hizmet kapsamında yapılan adımlar:"}
            </LiveEditable>
            
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
              {(data.items || []).map((item, idx) => (
                <li key={idx} style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <svg style={{ width: '20px', height: '20px', fill: 'var(--color-secondary)', flexShrink: 0 }} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  <div>
                    <LiveEditable path={`services.items.${serviceIndex}.items.${idx}.title`} tagName="strong" style={{ color: '#FFF', display: 'block' }}>
                      {item.title}
                    </LiveEditable>
                    <LiveEditable path={`services.items.${serviceIndex}.items.${idx}.desc`} tagName="span">
                      {item.desc}
                    </LiveEditable>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side sidebar */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
            <LiveEditable path={`services.items.${serviceIndex}.rightTitle`} tagName="h3" style={{ fontSize: '1.3rem', marginBottom: 'var(--space-md)', color: 'var(--color-secondary)' }}>
              {data.rightTitle || "Uzman Markalar"}
            </LiveEditable>
            <LiveEditable path={`services.items.${serviceIndex}.rightDesc`} tagName="p" className="text-muted mb-lg" style={{ fontSize: '0.9rem' }}>
              {data.rightDesc || ""}
            </LiveEditable>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--space-xl)' }}>
              {(data.badges || []).map((badge, idx) => (
                <LiveEditable key={idx} path={`services.items.${serviceIndex}.badges.${idx}`} tagName="span" style={{ fontSize: '0.8rem', background: 'var(--bg-dark)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'inline-block' }}>
                  {badge}
                </LiveEditable>
              ))}
            </div>

            <h3 style={{ fontSize: '1.3rem', marginBottom: 'var(--space-md)', color: '#FFF' }}>Bizimle İletişime Geçin</h3>
            <p className="text-muted mb-lg" style={{ fontSize: '0.9rem' }}>Motosikletinizi dükkanımıza getirerek en kaliteli usta desteğini hemen alabilirsiniz.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <LiveEditable 
                path={`services.items.${serviceIndex}.cta1Text`}
                linkPath={`services.items.${serviceIndex}.cta1Href`}
                tagName="link" 
                href={isReverse ? data.cta2Href : data.cta1Href} 
                className={`btn ${isReverse ? 'btn-accent' : 'btn-primary'}`} 
                style={{ width: '100%', justifyContent: 'center' }}
                target={isReverse ? "_blank" : undefined}
                rel={isReverse ? "noopener noreferrer" : undefined}
              >
                {isReverse ? data.cta2Text : data.cta1Text}
              </LiveEditable>
              <LiveEditable 
                path={`services.items.${serviceIndex}.cta2Text`}
                linkPath={`services.items.${serviceIndex}.cta2Href`}
                tagName="link" 
                href={isReverse ? data.cta1Href : data.cta2Href} 
                className="btn btn-secondary" 
                style={{ width: '100%', justifyContent: 'center' }}
                target={!isReverse ? "_blank" : undefined}
                rel={!isReverse ? "noopener noreferrer" : undefined}
              >
                {isReverse ? data.cta1Text : data.cta2Text}
              </LiveEditable>
            </div>
          </div>

        </div>
      </section>

      {/* BRANDS WE SPECIALIZE IN */}
      <section className="section-padding" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="text-center mb-xl">
            <h2 style={{ fontSize: '2rem' }}>Uzmanı Olduğumuz Markalar</h2>
            <p className="text-muted mt-sm">Aşağıdaki markaların tüm modellerinde orijinal parça ve fabrika standartlarında onarım yapıyoruz.</p>
          </div>

          <div className="brand-grid">
            {brandsList.map((brand, idx) => (
              <div key={idx} className="brand-logo-item">
                <span>{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
