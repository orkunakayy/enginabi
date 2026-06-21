"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogReaderClient({ currentSlug, post, otherPosts = [] }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headings, setHeadings] = useState([]);
  const [modifiedHtml, setModifiedHtml] = useState(post.contentHtml);

  // Sidebar Form State
  const [sidebarName, setSidebarName] = useState('');
  const [sidebarPhone, setSidebarPhone] = useState('');
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [sidebarSuccess, setSidebarSuccess] = useState(false);
  const [sidebarError, setSidebarError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse H2 tags dynamically for TOC and inject IDs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.contentHtml, 'text/html');
      const h2Elements = doc.querySelectorAll('h2');
      const headingsData = [];

      h2Elements.forEach((el, idx) => {
        const id = `toc-heading-${idx}`;
        el.id = id;
        headingsData.push({ id, text: el.textContent });
      });

      setHeadings(headingsData);
      setModifiedHtml(doc.body.innerHTML);
    }
  }, [post.contentHtml]);

  const handleSidebarSubmit = async (e) => {
    e.preventDefault();
    setSidebarError('');
    setSidebarLoading(true);

    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: sidebarName,
          phone: sidebarPhone,
          email: '',
          requestType: 'BAKIM TALEBİ',
          message: 'Blog sayfasından hızlı servis kaydı: ' + post.title
        })
      });

      if (res.ok) {
        setSidebarSuccess(true);
      } else {
        const data = await res.json();
        setSidebarError(data.error || 'Talep iletilemedi. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      setSidebarError('Bağlantı hatası oluştu.');
    } finally {
      setSidebarLoading(false);
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '4px',
        background: 'var(--color-secondary)',
        zIndex: 9999,
        transition: 'width 0.1s ease'
      }} />

      <section className="section-padding">
        <div className="container blog-reader-grid">
          
          {/* LEFT: ARTICLE CONTENT */}
          <div className="blog-main-content">
            {/* Featured Image */}
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: 'var(--space-md)' }}>
              <img 
                src={post.image} 
                alt={post.title} 
                style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }}
              />
            </div>

            {/* Social Share Buttons */}
            <div className="share-row">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Paylaş:</span>
              <div className="share-buttons">
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="share-btn share-x"
                  title="Twitter / X'te Paylaş"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="share-btn share-wa"
                  title="WhatsApp'ta Paylaş"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.588 1.977 14.12 .953 11.503.953c-5.448 0-9.873 4.373-9.877 9.803-.001 1.777.467 3.51 1.358 5.05L1.971 20l4.676-1.218c1.558.85 3.328 1.372 4.962 1.372z"/>
                  </svg>
                </a>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Yazı linki kopyalandı!");
                  }} 
                  className="share-btn share-copy"
                  title="Linki Kopyala"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Table of Contents Menüsü */}
            {headings.length > 0 && (
              <div className="table-of-contents">
                <h4 className="toc-title">📖 İçindekiler</h4>
                <ul className="toc-list">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a 
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const target = document.getElementById(h.id);
                          if (target) {
                            // Account for possible sticky headers
                            const elementPosition = target.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - 100;
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: "smooth"
                            });
                          }
                        }}
                        className="toc-link"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Post Content */}
            <article 
              style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-primary)' }}
              dangerouslySetInnerHTML={{ __html: modifiedHtml }}
            />

            {/* VLOG VIDEO EMBED */}
            {post.youtubeId && (
              <div style={{ marginTop: 'var(--space-2xl)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-xl)' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)', marginBottom: 'var(--space-md)', fontFamily: 'var(--font-headings)' }}>
                  Engin Usta'dan Video Anlatım
                </h3>
                <p className="text-secondary mb-lg" style={{ fontSize: '0.95rem' }}>
                  Bu konunun detaylı arıza tespit ve onarım adımlarını videomuzu izleyerek öğrenebilirsiniz.
                </p>
                
                <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
                  <iframe 
                    src={`https://www.youtube.com/embed/${post.youtubeId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  ></iframe>
                </div>
              </div>
            )}

            {/* FOOTER CTA */}
            <div className="blog-footer-cta">
              <h3 style={{ fontSize: '1.5rem', color: '#FFF', marginBottom: 'var(--space-sm)', fontFamily: 'var(--font-headings)' }}>
                Motosikletinizde Benzer Bir Arıza mı Var?
              </h3>
              <p className="text-secondary" style={{ fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                Motosikletinizle ilgili tüm arıza teşhisleri, periyodik bakımlar veya mekanik onarımlar için hemen randevu alıp dükkanımıza gelebilirsiniz.
              </p>
              <div className="cta-button-group">
                <Link href="/iletisim" className="cta-btn cta-btn-primary">Randevu Al</Link>
                <a href="https://wa.me/905331301448" target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn-secondary">WhatsApp Soru Sor</a>
              </div>
            </div>
          </div>

          {/* RIGHT: SIDEBAR */}
          <aside className="blog-sidebar">
            {/* Author Widget */}
            <div className="sidebar-widget">
              <h4 className="widget-title">Yazar</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150" 
                  alt="Engin Usta"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--color-secondary)', objectFit: 'cover' }}
                />
                <div>
                  <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#FFF' }}>Engin Usta</h5>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: '600' }}>Baş Mekanik & Kurucu</span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                15 yılı aşkın tecrübesiyle Emira Motors kurucusu. Vespa, Honda, Yamaha ve tüm scooter segmentlerinde uzman motor mekaniği ve diagnostik uzmanı.
              </p>
            </div>

            {/* Quick Booking Widget with Micro Form */}
            <div className="sidebar-widget promo-widget">
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#FFF', fontWeight: '700' }}>Hızlı Servis Kaydı</h4>
              
              {sidebarSuccess ? (
                <div style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 600, padding: '10px 0', textAlign: 'center' }}>
                  ✓ Randevu talebiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4', marginBottom: '12px' }}>
                    Motosikletinizin bakım zamanı geldiyse adınızı ve telefonunuzu bırakın, hemen arayalım.
                  </p>
                  <form onSubmit={handleSidebarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Adınız Soyadınız" 
                      value={sidebarName}
                      onChange={(e) => setSidebarName(e.target.value)}
                      required
                      style={{
                        padding: '10px 12px',
                        background: 'rgba(9, 10, 13, 0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: '#FFF',
                        fontSize: '0.85rem',
                        outline: 'none',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    />
                    <input 
                      type="tel" 
                      placeholder="Telefon Numaranız" 
                      value={sidebarPhone}
                      onChange={(e) => setSidebarPhone(e.target.value)}
                      required
                      style={{
                        padding: '10px 12px',
                        background: 'rgba(9, 10, 13, 0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        color: '#FFF',
                        fontSize: '0.85rem',
                        outline: 'none',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    />
                    {sidebarError && (
                      <span style={{ color: '#EF4444', fontSize: '0.75rem', fontWeight: 600 }}>{sidebarError}</span>
                    )}
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-sm" 
                      disabled={sidebarLoading}
                      style={{ width: '100%', justifyContent: 'center', cursor: sidebarLoading ? 'not-allowed' : 'pointer', minHeight: '40px' }}
                    >
                      {sidebarLoading ? 'Gönderiliyor...' : 'Randevu Talebi Oluştur'}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Other Guides Widget */}
            {otherPosts.length > 0 && (
              <div className="sidebar-widget">
                <h4 className="widget-title">Diğer Usta Tavsiyeleri</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {otherPosts.map((otherPost) => (
                    <Link href={`/blog/${otherPost.slug}`} key={otherPost.slug} style={{ display: 'flex', gap: '12px', textDecoration: 'none', group: 'true' }}>
                      <img 
                        src={otherPost.image} 
                        alt={otherPost.title} 
                        style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-color)', flexShrink: 0 }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '2px' }}>
                          {otherPost.brand}
                        </span>
                        <h5 style={{ margin: 0, fontSize: '0.82rem', fontWeight: '600', color: '#FFF', lineHeight: '1.3', transition: 'color var(--transition-fast)' }} className="sidebar-post-title">
                          {otherPost.title}
                        </h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

        </div>
      </section>

      <style jsx global>{`
        .blog-reader-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
          align-items: start;
        }

        @media (min-width: 992px) {
          .blog-reader-grid {
            grid-template-columns: 1fr 300px;
          }
        }

        .blog-main-content {
          min-width: 0;
        }

        .blog-sidebar {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .sidebar-widget {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: var(--space-lg);
        }

        .promo-widget {
          background: linear-gradient(135deg, rgba(0, 122, 255, 0.15) 0%, rgba(9, 10, 13, 0.5) 100%);
          border-color: rgba(0, 122, 255, 0.25);
        }

        .widget-title {
          font-family: var(--font-headings);
          font-size: 1rem;
          font-weight: 700;
          color: #FFF;
          margin: 0 0 var(--space-md) 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid var(--color-secondary);
          padding-bottom: 6px;
          display: inline-block;
        }

        .sidebar-post-title:hover {
          color: var(--color-secondary) !important;
        }

        /* SOCIAL SHARE ROW */
        .share-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
        }

        .share-buttons {
          display: flex;
          gap: 8px;
        }

        .share-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: rgba(255,255,255,0.03);
          color: #94A3B8;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .share-btn:hover {
          transform: translateY(-2px);
          color: #FFF;
        }

        .share-x:hover {
          background: #000;
          border-color: #333;
        }

        .share-wa:hover {
          background: #25D366;
          border-color: #25D366;
        }

        .share-copy:hover {
          background: var(--color-secondary);
          border-color: var(--color-secondary);
        }

        /* TABLE OF CONTENTS */
        .table-of-contents {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 20px;
          margin-bottom: 32px;
        }

        .toc-title {
          font-size: 0.95rem;
          color: #FFF;
          margin: 0 0 12px 0;
          fontWeight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .toc-link {
          color: var(--color-secondary);
          font-size: 0.9rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .toc-link:hover {
          color: #FFF !important;
          text-decoration: underline !important;
        }

        /* FOOTER CTA */
        .blog-footer-cta {
          margin-top: var(--space-2xl);
          background: linear-gradient(135deg, #1A1D24 0%, #111317 100%);
          border: 1px solid rgba(0, 122, 255, 0.25);
          border-radius: var(--radius-lg);
          padding: 32px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 122, 255, 0.05);
        }

        .cta-button-group {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
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
          .cta-button-group {
            flex-direction: column;
            gap: 12px;
          }
          .cta-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
