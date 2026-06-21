"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogReaderClient({ currentSlug, post, otherPosts = [] }) {
  const [scrollProgress, setScrollProgress] = useState(0);

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
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: 'var(--space-xl)' }}>
              <img 
                src={post.image} 
                alt={post.title} 
                style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }}
              />
            </div>

            {/* Post Content */}
            <article 
              style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-primary)' }}
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
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
            <div style={{ marginTop: 'var(--space-2xl)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: 'var(--space-sm)', fontFamily: 'var(--font-headings)' }}>
                Motosikletinizde Benzer Bir Arıza mı Var?
              </h3>
              <p className="text-secondary mb-lg" style={{ fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto var(--space-lg)' }}>
                Motosikletinizle ilgili tüm arıza teşhisleri, periyodik bakımlar veya mekanik onarımlar için hemen randevu alıp dükkanımıza gelebilirsiniz.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/iletisim" className="btn btn-primary">Randevu Al</Link>
                <a href="https://wa.me/902128790755" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">WhatsApp Soru Sor</a>
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

            {/* Quick Booking Widget */}
            <div className="sidebar-widget promo-widget">
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#FFF', fontWeight: '700' }}>Hızlı Servis Kaydı</h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4', marginBottom: 'var(--space-md)' }}>
                Motosikletinizin bakım zamanı geldiyse veya bir arızası varsa hemen randevunuzu ayırtın.
              </p>
              <Link href="/iletisim" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                Randevu Sayfasına Git
              </Link>
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
      `}</style>
    </>
  );
}
