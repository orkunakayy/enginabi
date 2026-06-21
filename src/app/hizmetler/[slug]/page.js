import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDB } from '../../../lib/db';
import LiveEditable from '../../../components/LiveEditable';
import LiveEditToolbar from '../../../components/LiveEditToolbar';
import { Suspense } from 'react';
import MaintenanceCalculator from '../../../components/MaintenanceCalculator';

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

      {/* 2. BRANDS WE USE CAROUSEL */}
      {data.showBrandsCarousel && (
        <section className="section-padding" style={{ borderTop: '1px solid var(--border-color)', background: '#0D0E12', overflow: 'hidden' }}>
          <div className="container">
            <h4 style={{ textAlign: 'center', fontSize: '1rem', color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>
              {data.brandsCarouselTitle || "Bakımlarda Sadece Dünyanın En İyi Parça ve Yağ Markalarını Kullanıyoruz."}
            </h4>
            
            <div style={{ overflow: 'hidden', position: 'relative', width: '100%' }}>
              <div className="partner-marquee-track">
                {/* Render list twice for infinite animation effect */}
                {(data.brandsCarouselList && data.brandsCarouselList.length > 0 ? data.brandsCarouselList : ['Motul', 'Putoline', 'Liqui Moly', 'NGK', 'Bando', 'RK Zincir', 'Honda', 'Yamaha']).map((brand, idx) => (
                  <div key={idx} className="partner-marquee-item">{brand}</div>
                ))}
                {(data.brandsCarouselList && data.brandsCarouselList.length > 0 ? data.brandsCarouselList : ['Motul', 'Putoline', 'Liqui Moly', 'NGK', 'Bando', 'RK Zincir', 'Honda', 'Yamaha']).map((brand, idx) => (
                  <div key={`dup-${idx}`} className="partner-marquee-item">{brand}</div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. WHAT HAPPENS IF YOU DON'T MAINTAIN (RISK COMPARISON) */}
      {data.showPreventionSection && (
        <section className="section-padding" style={{ borderTop: '1px solid var(--border-color)', background: 'linear-gradient(180deg, #090A0D 0%, #111318 100%)' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <div className="text-center mb-xl">
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF' }}>
                {data.preventionTitle || "Bu Bakımı Zamanında Yaptırmazsanız Ne Olur?"}
              </h2>
              <p className="text-muted mt-sm">Bakımı aksatmanın getireceği riskleri ve zamanında yaptırmanın avantajlarını görün.</p>
            </div>
            
            <div className="grid-2" style={{ gap: '24px' }}>
              {/* Positive card */}
              <div style={{ background: 'rgba(16, 185, 129, 0.02)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  {data.preventionPositiveTitle || "Zamanında Bakım"}
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(data.preventionPositiveItems && data.preventionPositiveItems.length > 0 ? data.preventionPositiveItems : ['Yakıt tasarrufu', 'Maksimum performans', 'Sıfır yolda kalma riski']).map((item, idx) => (
                    <li key={idx} style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', display: 'flex', gap: '8px', alignItems: 'start' }}>
                      <span style={{ color: '#10B981', marginRight: '6px' }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Negative card */}
              <div style={{ background: 'rgba(239, 68, 68, 0.02)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  {data.preventionNegativeTitle || "İhmal Edilirse"}
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(data.preventionNegativeItems && data.preventionNegativeItems.length > 0 ? data.preventionNegativeItems : ['Varyatör kayışı kopması (büyük masraf)', 'Motorun yatak sarması', 'Çekişten düşme ve yüksek yakıt tüketimi']).map((item, idx) => (
                    <li key={idx} style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', display: 'flex', gap: '8px', alignItems: 'start' }}>
                      <span style={{ color: '#EF4444', marginRight: '6px' }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 1. INTERACTIVE CALCULATOR */}
      {data.showCalculator && (
        <section className="section-padding" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-dark)' }}>
          <div className="container">
            <div className="text-center mb-xl">
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF' }}>Hızlı Bakım Maliyeti Hesapla</h2>
              <p className="text-muted mt-sm">Motosikletinizin marka, model ve paket bilgisini seçerek tahmini maliyeti anında öğrenin.</p>
            </div>
            <MaintenanceCalculator />
          </div>
        </section>
      )}

      {/* 4. REAL CUSTOMER REVIEWS (SOCIAL PROOF) */}
      {data.showReviewsSection && (
        <section className="section-padding" style={{ borderTop: '1px solid var(--border-color)', background: '#0D0E12' }}>
          <div className="container">
            <div className="text-center mb-xl">
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF' }}>
                {data.reviewsTitle || "Müşteri Yorumları"}
              </h2>
              <p className="text-muted mt-sm">Dükkanımızdan bu hizmeti alan sürücülerin gerçek deneyimleri.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {(data.reviews && data.reviews.length > 0 ? data.reviews : [
                { author: "Ahmet Y.", comment: "Motorumu ağır bakım için getirdim, varyatör temizliği ve subap ayarından sonra motor sıfır gibi oldu. Teşekkürler Emira Motors.", rating: 5 },
                { author: "Mehmet K.", comment: "Periyodik bakımda Engin Usta her parçayı tek tek kontrol etti. Orijinal yağ ve filtre kullandı, çıkan eski parçaları da teslim etti. Güvenilir esnaf.", rating: 5 },
                { author: "Caner T.", comment: "İletişim ve işçilik kalitesi çok yüksek. Motorumu sabah bıraktım, öğleden sonra tam vaktinde tertemiz teslim aldım.", rating: 5 }
              ]).map((review, idx) => (
                <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ color: 'var(--color-secondary)', display: 'flex', gap: '2px' }}>
                    {Array.from({ length: review.rating || 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontStyle: 'italic', flexGrow: 1, lineHeight: '1.6' }}>
                    "{review.comment}"
                  </p>
                  <strong style={{ color: '#FFF', fontSize: '0.88rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '6px' }}>
                    — {review.author}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. FAQ SECTION */}
      {data.showFaqSection && (
        <section className="section-padding" style={{ borderTop: '1px solid var(--border-color)', background: 'linear-gradient(180deg, #090A0D 0%, #111318 100%)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="text-center mb-xl">
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFF' }}>
                {data.faqTitle || "Sıkça Sorulan Sorular"}
              </h2>
              <p className="text-muted mt-sm">Hizmetimiz hakkında en çok sorulan soruların yanıtları.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {(data.faqs && data.faqs.length > 0 ? data.faqs : [
                { question: "İşlem ne kadar sürer?", answer: "Yapılacak işlemlerin boyutuna göre periyodik bakımlar genellikle 1-2 saat, ağır mekanik işlemler ise 3-5 saat sürer. Motorunuzu aynı gün teslim alırsınız." },
                { question: "Değişen eski parçaları görebilir miyim?", answer: "Evet, şeffaflık ilkemiz gereği motorunuzdan sökülen tüm eski filtre, kayış, balata veya buji gibi yedek parçaları kutularıyla birlikte teslim alırken görebilir ve isterseniz yanınızda götürebilirsiniz." },
                { question: "Bakım garantili mi?", answer: "Yaptığımız tüm mekanik işçilikler Engin Usta garantisi kapsamındadır. Kullanılan orijinal yedek parçalar üretici garantisine sahiptir." }
              ]).map((faq, idx) => (
                <details className="faq-item" key={idx}>
                  <summary>{faq.question}</summary>
                  <div className="faq-content">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STYLES FOR MARQUEE AND FAQ */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partner-marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .partner-marquee-item {
          padding: 0 30px;
          font-size: 1.25rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        
        /* Accordion Details */
        details.faq-item {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          margin-bottom: 12px;
          padding: 16px;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        details.faq-item[open] {
          border-color: var(--color-secondary);
        }
        details.faq-item summary {
          font-weight: 600;
          color: #FFF;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        details.faq-item summary::-webkit-details-marker {
          display: none;
        }
        details.faq-item summary::after {
          content: '+';
          font-size: 1.25rem;
          color: var(--color-secondary);
          transition: transform 0.2s ease;
        }
        details.faq-item[open] summary::after {
          content: '−';
        }
        details.faq-item div.faq-content {
          margin-top: 12px;
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.95rem;
          cursor: default;
        }
      `}} />

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
