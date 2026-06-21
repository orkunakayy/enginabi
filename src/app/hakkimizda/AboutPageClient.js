"use client";

import { useLiveContent } from '../../hooks/useLiveContent';
import LiveEditable from '../../components/LiveEditable';
import LiveEditToolbar from '../../components/LiveEditToolbar';
import { Suspense, useState, useEffect } from 'react';

export default function AboutPageClient() {
  const { get } = useLiveContent();
  const [videos, setVideos] = useState([]);
  const [videoLoading, setVideoLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetch('/api/reels')
      .then(res => res.json())
      .then(data => {
        setVideos(data.horizontal_videos || []);
        setVideoLoading(false);
      })
      .catch(err => {
        console.error("Failed to load videos:", err);
        setVideoLoading(false);
      });
  }, []);

  const defaultMembers = [
    {
      id: '1',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      name: "Engin Usta",
      role: "Kurucu & Baş Mekanisyen",
      desc: "15 yılı aşkın süredir motor sektöründe. Özellikle Honda, Yamaha ve İtalyan Vespa modellerinin mekanik motor revizyonlarında uzmandır."
    },
    {
      id: '2',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      name: "Yusuf Usta",
      role: "Elektrik & Diagnostik Uzmanı",
      desc: "Çözülemeyen elektrik tesisat arızaları, beyin (ECU) okuma ve statör/konjektör ölçümlerinde dükkanımızın dijital teşhis uzmanıdır."
    },
    {
      id: '3',
      img: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=300',
      name: "Sinan Usta",
      role: "Şasi & Metal Kaynak Uzmanı",
      desc: "Argon (TIG) alüminyum kaynağı, gazaltı şasi düzeltmeleri, koruma/çanta demiri güçlendirme ve hidrolik pres jant doğrultma ustasıdır."
    }
  ];

  const teamMembers = get('about.team.members', defaultMembers);

  return (
    <>
      <Suspense fallback={null}>
        <LiveEditToolbar />
      </Suspense>

      {/* TITLE BANNER */}
      <section className="section-padding" style={{ marginTop: '80px', background: 'linear-gradient(135deg, #090A0D 0%, #16181E 100%)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container text-center">

          <LiveEditable path="about.banner.title" tagName="h1" style={{ fontSize: '2.75rem', fontWeight: 900 }} className="mb-md">
            {get('about.banner.title', 'Engin Usta ve Emira Motors')}
          </LiveEditable>
          <LiveEditable path="about.banner.desc" tagName="p" className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.15rem' }}>
            {get('about.banner.desc', 'İstanbul Beylikdüzü\'ndeki modern donanımlı atölyemizde, 15 yılı aşkın birikimimiz ve şeffaf hizmet anlayışımızla motosikletiniz emin ellerde.')}
          </LiveEditable>
        </div>
      </section>

      {/* BIOGRAPHY & STORY */}
      <section className="section-padding">
        <div className="container grid-2">
          <div>
            <LiveEditable path="about.story.badgeText" tagName="div" className="about-badge" style={{ display: 'inline-flex', gap: '5px' }}>
              {get('about.story.badgeText', '15+ Yıllık Tecrübe')}
            </LiveEditable>
            <LiveEditable path="about.story.title" tagName="h2" className="mt-md mb-md" style={{ fontSize: '1.8rem' }}>
              {get('about.story.title', 'Dükkanımızın Hikayesi')}
            </LiveEditable>
            <LiveEditable path="about.story.p1" tagName="p" className="text-muted mb-md">
              {get('about.story.p1', "Emira Motors, kurucumuz Engin Usta'nın motosiklet mekaniği alanındaki çekirdekten yetişme tecrübesiyle kurulmuştur. İlk yıllarda yoğun çalışma temposuna sahip kuryeler ve motorcular için yerinde servis modeli ile yola çıkmış olsak da, günümüz ihtiyaçları doğrultusunda hizmet kalitemizi artırmak için tam donanımlı dükkan modelimize geçiş yaptık.")}
            </LiveEditable>
            <LiveEditable path="about.story.p2" tagName="p" className="text-muted">
              {get('about.story.p2', "Artık Beylikdüzü'ndeki atölyemizde, en karmaşık elektrik arıza teşhis cihazlarından hassas jant pres makinelerine kadar tüm teknik ekipmanı barındırarak, motosikletinizi fabrika standartlarında onarıyoruz. Getirdiğiniz her motorun bakım geçmişini dijital CRM panelimizde saklayarak size kurumsal bir güvence sunuyoruz.")}
            </LiveEditable>
            
            <div className="about-features">
              <div className="about-feature-item">
                <svg className="about-feature-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <LiveEditable path="about.story.f1" tagName="span">{get('about.story.f1', 'Şeffaf Hizmet Anlayışı')}</LiveEditable>
              </div>
              <div className="about-feature-item">
                <svg className="about-feature-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <LiveEditable path="about.story.f2" tagName="span">{get('about.story.f2', 'Orijinal Yedek Parça')}</LiveEditable>
              </div>
              <div className="about-feature-item">
                <svg className="about-feature-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <LiveEditable path="about.story.f3" tagName="span">{get('about.story.f3', 'Garantili İşçilik')}</LiveEditable>
              </div>
              <div className="about-feature-item">
                <svg className="about-feature-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <LiveEditable path="about.story.f4" tagName="span">{get('about.story.f4', 'CRM Raporlama')}</LiveEditable>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=700" alt="Emira Motors Atölye" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }} />
            <div style={{ position: 'absolute', bottom: 'var(--space-md)', left: 'var(--space-md)', right: 'var(--space-md)', background: 'rgba(22,24,30,0.9)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
              <LiveEditable path="about.story.imgQuote" tagName="span" style={{ fontFamily: 'var(--font-headings)', fontWeight: 700, color: 'var(--color-secondary)', display: 'block' }}>
                {get('about.story.imgQuote', '"Önce Güven ve Şeffaflık"')}
              </LiveEditable>
              <LiveEditable path="about.story.imgAuthor" tagName="span" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {get('about.story.imgAuthor', '- Engin Usta, Kurucu')}
              </LiveEditable>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM ROSTER */}
      <section id="ekibimiz" className="section-padding" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="text-center mb-xl">
            <LiveEditable path="about.team.title" tagName="h2" style={{ fontSize: '2.25rem' }}>
              {get('about.team.title', 'Uzman Kadromuz')}
            </LiveEditable>
            <LiveEditable path="about.team.desc" tagName="p" className="text-muted mt-sm">
              {get('about.team.desc', 'Motosikletinizi güvenle teslim edebileceğiniz, her biri kendi alanında uzman ustalarımız.')}
            </LiveEditable>
          </div>

          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
            {teamMembers.map((member, idx) => (
              <div key={member.id || idx} className="card" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', textAlign: 'center', padding: 'var(--space-xl)', cursor: 'default' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto var(--space-md)', border: '2px solid var(--color-primary)' }}>
                  <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '4px' }}>
                  {member.name}
                </h3>
                <div style={{ color: 'var(--color-secondary)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 'var(--space-sm)' }}>
                  {member.role}
                </div>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOUTUBE COMMUNITY SECTION */}
      <section className="section-padding" style={{ borderTop: '1px solid var(--border-color)', background: 'linear-gradient(180deg, #16181E 0%, #090A0D 100%)' }}>
        <div className="container">
          <div className="text-center mb-xl">
            <span className="slide-badge mb-sm" style={{ display: 'inline-block' }}>
              🎥 YouTube Topluluğumuz
            </span>
            <h2 style={{ fontSize: '2.25rem', color: '#FFF' }}>10.000+ Motorcuyla Birlikteyiz</h2>
            <p className="text-muted mt-sm" style={{ maxWidth: '650px', margin: '8px auto 0' }}>
              YouTube'da bizi takip eden ve arızalarını bizimle çözen binlerce motor severin güveniyle, en zor arıza çözümlerimizi ve atölye süreçlerimizi şeffafça paylaşıyoruz.
            </p>
          </div>

          {videoLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="video-grid">
              {videos.slice(0, 15).map((vid) => (
                <div key={vid.id || vid.youtubeId} className="video-card" onClick={() => setSelectedVideo(vid.youtubeId)}>
                  <div className="video-thumb-container">
                    <img 
                      src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`} 
                      alt={vid.title} 
                      className="video-thumb"
                    />
                    <div className="video-play-overlay">
                      <svg className="play-icon" viewBox="0 0 24 24" width="32" height="32">
                        <path d="M8 5v14l11-7z" fill="#FFF"/>
                      </svg>
                    </div>
                    {vid.duration && <span className="video-duration">{vid.duration}</span>}
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{vid.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setSelectedVideo(null)}>×</button>
            <div className="video-modal-iframe-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 32px;
        }

        .video-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .video-card:hover {
          transform: translateY(-6px);
          border-color: var(--color-primary);
          box-shadow: 0 12px 24px rgba(0, 122, 255, 0.15);
        }

        .video-thumb-container {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: #000;
        }

        .video-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .video-card:hover .video-thumb {
          transform: scale(1.05);
        }

        .video-play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
          transition: all 0.3s ease;
        }

        .video-card:hover .video-play-overlay {
          opacity: 1;
          background: rgba(0, 122, 255, 0.2);
        }

        .play-icon {
          filter: drop-shadow(0 0 8px rgba(0,0,0,0.5));
          transition: transform 0.3s ease;
        }

        .video-card:hover .play-icon {
          transform: scale(1.2);
        }

        .video-duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.85);
          color: #FFF;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .video-info {
          padding: 16px;
        }

        .video-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #FFF;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* MODAL STYLES */
        .video-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(9, 10, 13, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(8px);
          padding: 16px;
        }

        .video-modal-content {
          position: relative;
          width: 100%;
          max-width: 960px;
          background: #000;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .video-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0,0,0,0.7);
          color: #FFF;
          border: 1px solid rgba(255,255,255,0.15);
          width: 36px;
          height: 36px;
          font-size: 1.5rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.2s ease;
        }

        .video-modal-close:hover {
          background: #EF4444;
          border-color: transparent;
        }

        .video-modal-iframe-wrapper {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
        }

        .video-modal-iframe-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .mb-sm { margin-bottom: 8px; }
      `}</style>
    </>
  );
}
