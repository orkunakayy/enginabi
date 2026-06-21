"use client";

import { useState, useEffect, Suspense } from 'react';
import BeforeAfterSlider from '../../components/BeforeAfterSlider';
import LiveEditable from '../../components/LiveEditable';
import LiveEditToolbar from '../../components/LiveEditToolbar';
import { useLiveContent } from '../../hooks/useLiveContent';

export default function GalleryClient() {
  const [galleryData, setGalleryData] = useState({
    reels: [],
    horizontal_videos: [],
    before_after: [],
    workshop_images: []
  });
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null); // Holds { beforeImage, afterImage, title, beforeLabel, afterLabel } or { image, title }

  const { get } = useLiveContent();

  useEffect(() => {
    fetch('/api/reels')
      .then(res => res.json())
      .then(data => {
        setGalleryData({
          reels: Array.isArray(data.reels) ? data.reels : [],
          horizontal_videos: Array.isArray(data.horizontal_videos) ? data.horizontal_videos : [],
          before_after: Array.isArray(data.before_after) ? data.before_after : [],
          workshop_images: Array.isArray(data.workshop_images) ? data.workshop_images : []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load gallery content:", err);
        setLoading(false);
      });
  }, []);

  const openVideo = (video) => {
    setActiveVideo(video);
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'watch_video', {
        video_title: video.title,
        video_id: video.youtubeId
      });
    }
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  return (
    <>
      <Suspense fallback={null}>
        <LiveEditToolbar />
      </Suspense>

      {/* TITLE BANNER */}
      <section className="section-padding" style={{ marginTop: '80px', background: 'linear-gradient(135deg, #090A0D 0%, #16181E 100%)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container text-center">
          <LiveEditable path="gallery.banner.title" tagName="h1" style={{ fontSize: '2.75rem', fontWeight: 900 }} className="mb-md">
            {get('gallery.banner.title', 'Yapılan İşler & Galeri')}
          </LiveEditable>
          <LiveEditable path="gallery.banner.desc" tagName="p" className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.15rem' }}>
            {get('gallery.banner.desc', "Engin Usta'nın dükkanında hayata döndürdüğü motosikletlerin, şasi düzeltmelerinin ve ağır varyatör onarımlarının görsel arşivi.")}
          </LiveEditable>
        </div>
      </section>

      {/* INTERACTIVE BEFORE/AFTER SLIDER - PLACED FIRST AS REQUESTED */}
      <section className="section-padding" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="text-center mb-xl">
            <h2 style={{ fontSize: '2rem' }}>Öncesi / Sonrası Karşılaştırmaları</h2>
            <p className="text-muted mt-sm">Mavi sürgüyü sağa sola sürükleyerek Engin Usta'nın usta işçiliğini görebilirsiniz. Büyütmek için kartın altındaki butona tıklayın.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-lg)' }}>
            {galleryData.before_after.map((slider) => (
              <div key={slider.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-dark)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-headings)', color: 'var(--color-secondary)', margin: 0, height: '2.5rem', display: 'flex', alignItems: 'center', lineHeight: '1.4' }}>
                  {slider.title}
                </h3>
                <BeforeAfterSlider 
                  beforeImage={slider.beforeImage}
                  afterImage={slider.afterImage}
                  beforeLabel={slider.beforeLabel || "Öncesi"}
                  afterLabel={slider.afterLabel || "Sonrası"}
                />
                <button 
                  onClick={() => setActiveLightboxImg({
                    beforeImage: slider.beforeImage,
                    afterImage: slider.afterImage,
                    title: slider.title,
                    beforeLabel: slider.beforeLabel,
                    afterLabel: slider.afterLabel
                  })}
                  style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: 'rgba(0, 102, 255, 0.15)',
                    border: '1px solid rgba(0, 102, 255, 0.3)',
                    color: 'var(--color-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all var(--transition-fast)'
                  }}
                  className="zoom-btn"
                >
                  🔍 Detaylı Görselleri Büyüt
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO GRID */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-xl">
            <h2 style={{ fontSize: '2rem' }}>Atölye Görselleri</h2>
            <p className="text-muted mt-sm">Dükkanımızdan ve devam eden onarımlardan anlık kareler. Büyütmek için fotoğrafların üzerine tıklayabilirsiniz.</p>
          </div>

          <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {galleryData.workshop_images.map((item) => (
              <div 
                key={item.id} 
                className="gallery-item"
                onClick={() => setActiveLightboxImg({ image: item.image, title: item.title })}
              >
                <div className="gallery-img-wrapper">
                  <img className="gallery-img" src={item.image} alt={item.title} />
                </div>
                <div className="gallery-overlay">
                  <div className="gallery-title">{item.title}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-xl">
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>* Bu galeri dükkanımızda yapılan gerçek çalışmaları yansıtır. Atölyemizde çektiğimiz yeni fotoğrafları yakında eklemeye devam edeceğiz.</p>
          </div>
        </div>
      </section>

      {/* REELS / SHORTS VIDEO GALLERY */}
      <section className="section-padding" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="text-center mb-xl">
            <h2 style={{ fontSize: '2rem' }}>Dükkandan Canlı Kesitler (Reels / Shorts)</h2>
            <p className="text-muted mt-sm">Atölyemizde devam eden tamirleri ve usta işçiliğini kısa dikey videolarla izleyin.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-lg)', justifyItems: 'center', width: '100%' }}>
            {loading ? (
              <div style={{ color: 'var(--text-secondary)', padding: '2rem 0', gridColumn: '1 / -1', textAlign: 'center' }}>Videolar yükleniyor...</div>
            ) : galleryData.reels.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', padding: '2rem 0', gridColumn: '1 / -1', textAlign: 'center' }}>Dikey video bulunmuyor.</div>
            ) : galleryData.reels.map((reel) => (
              <div 
                key={reel.id} 
                onClick={() => openVideo(reel)}
                style={{ 
                  position: 'relative', 
                  width: '100%',
                  maxWidth: '240px', 
                  height: '420px', 
                  borderRadius: 'var(--radius-md)', 
                  overflow: 'hidden', 
                  border: '1px solid var(--border-color)', 
                  cursor: 'pointer', 
                  boxShadow: 'var(--shadow-md)',
                  transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
                }}
                className="reels-card"
              >
                <img 
                  src={reel.thumbnail || `https://img.youtube.com/vi/${reel.youtubeId}/mqdefault.jpg`} 
                  alt={reel.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(13,14,18,0.95) 100%)',
                  zIndex: 1
                }} />

                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#FFF', zIndex: 2 }}>
                  {reel.duration}
                </div>

                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0, 102, 255, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0, 102, 255, 0.5)', zIndex: 2 }}>
                  <svg style={{ width: '24px', height: '24px', fill: '#FFF', marginLeft: '3px' }} viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>

                <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', zIndex: 2 }}>
                  <h3 style={{ fontSize: '0.85rem', color: '#FFF', lineHeight: '1.4', fontWeight: '700', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {reel.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HORIZONTAL VIDEOS GALLERY */}
      <section className="section-padding" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="text-center mb-xl">
            <h2 style={{ fontSize: '2rem' }}>Detaylı İnceleme Videolarımız (Yatay)</h2>
            <p className="text-muted mt-sm">Komple motor revizyonları ve detaylı mekanik tamir videolarımızı geniş ekranda izleyin.</p>
          </div>

          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {loading ? (
              <div style={{ color: 'var(--text-secondary)', padding: '2rem 0', gridColumn: '1 / -1', textAlign: 'center' }}>Videolar yükleniyor...</div>
            ) : galleryData.horizontal_videos.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', padding: '2rem 0', gridColumn: '1 / -1', textAlign: 'center' }}>Yatay video bulunmuyor.</div>
            ) : galleryData.horizontal_videos.map((video) => (
              <div 
                key={video.id}
                onClick={() => openVideo(video)}
                className="card"
                style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
                  <img 
                    src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} 
                    alt={video.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0, 0, 0, 0.7)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', color: '#FFF', fontWeight: 'bold' }}>
                    {video.duration}
                  </div>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0, 102, 255, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                    <svg style={{ width: '20px', height: '20px', fill: '#FFF', marginLeft: '3px' }} viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div style={{ padding: 'var(--space-md)', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#FFF', lineHeight: '1.4', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {activeLightboxImg && (
        <div 
          onClick={() => setActiveLightboxImg(null)}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            background: 'rgba(9, 10, 13, 0.96)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999, 
            backdropFilter: 'blur(10px)',
            cursor: 'zoom-out'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              position: 'relative', 
              width: '95%', 
              maxWidth: activeLightboxImg.beforeImage ? '1000px' : '900px', 
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            {/* Close button */}
            <button 
              onClick={() => setActiveLightboxImg(null)}
              style={{ 
                position: 'absolute', 
                top: '-45px', 
                right: '0px', 
                background: 'none', 
                border: 'none', 
                color: '#FFF', 
                fontSize: '1.5rem', 
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              ✕ Kapat
            </button>

            {activeLightboxImg.beforeImage ? (
              // Dual side-by-side display for Before/After
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                    <img src={activeLightboxImg.beforeImage} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ color: '#EF4444', fontWeight: 'bold', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.9rem' }}>
                    ⬅️ {activeLightboxImg.beforeLabel || 'Öncesi'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                    <img src={activeLightboxImg.afterImage} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ color: '#10B981', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.9rem' }}>
                    ➡️ {activeLightboxImg.afterLabel || 'Sonrası'}
                  </span>
                </div>
              </div>
            ) : (
              // Standard single image display
              <img 
                src={activeLightboxImg.image} 
                alt={activeLightboxImg.title} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '75vh', 
                  objectFit: 'contain', 
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              />
            )}

            <div style={{ color: '#FFF', fontSize: '1.2rem', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.8)', textAlign: 'center' }}>
              {activeLightboxImg.title}
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PLAYER OVERLAY */}
      {activeVideo && (
        <div 
          onClick={closeVideo}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            background: 'rgba(9, 10, 13, 0.95)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999, 
            backdropFilter: 'blur(10px)' 
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              position: 'relative', 
              width: '90%', 
              maxWidth: activeVideo.duration.includes(':') && Number(activeVideo.duration.split(':')[0]) > 2 ? '800px' : '360px', 
              aspectRatio: activeVideo.duration.includes(':') && Number(activeVideo.duration.split(':')[0]) > 2 ? '16/9' : '9/16',
              maxHeight: '85vh',
              background: '#000', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <button 
              onClick={closeVideo}
              style={{ 
                position: 'absolute', 
                top: '12px', 
                right: '12px', 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'rgba(22, 24, 30, 0.8)', 
                border: '1px solid var(--border-color)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                color: '#FFF',
                zIndex: 10000,
                fontSize: '1.2rem',
                lineHeight: 1
              }}
            >
              ✕
            </button>

            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ width: '100%', height: '100%' }}
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
