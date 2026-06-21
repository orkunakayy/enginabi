"use client";

import { useLiveContent } from '../../hooks/useLiveContent';
import LiveEditable from '../../components/LiveEditable';
import LiveEditToolbar from '../../components/LiveEditToolbar';
import { Suspense } from 'react';

export default function AboutPageClient() {
  const { get } = useLiveContent();

  const members = [
    {
      key: '0',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      defaultName: "Engin Usta",
      defaultRole: "Kurucu & Baş Mekanisyen",
      defaultDesc: "15 yılı aşkın süredir motor sektöründe. Özellikle Honda, Yamaha ve İtalyan Vespa modellerinin mekanik motor revizyonlarında uzmandır."
    },
    {
      key: '1',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      defaultName: "Yusuf Usta",
      defaultRole: "Elektrik & Diagnostik Uzmanı",
      defaultDesc: "Çözülemeyen elektrik tesisat arızaları, beyin (ECU) okuma ve statör/konjektör ölçümlerinde dükkanımızın dijital teşhis uzmanıdır."
    },
    {
      key: '2',
      img: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=300',
      defaultName: "Sinan Usta",
      defaultRole: "Şasi & Metal Kaynak Uzmanı",
      defaultDesc: "Argon (TIG) alüminyum kaynağı, gazaltı şasi düzeltmeleri, koruma/çanta demiri güçlendirme ve hidrolik pres jant doğrultma ustasıdır."
    }
  ];

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
            {get('about.banner.desc', '15 yılı aşkın birikimimiz, modern donanımlı dükkanımız ve ödün vermediğimiz şeffaflık ilkemizle motosikletleriniz emin ellerde.')}
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
            {members.map((member, idx) => (
              <div key={member.key} className="card" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', textAlign: 'center', padding: 'var(--space-xl)', cursor: 'default' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto var(--space-md)', border: '2px solid var(--color-primary)' }}>
                  <img src={member.img} alt={get(`about.team.members.${idx}.name`, member.defaultName)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <LiveEditable path={`about.team.members.${idx}.name`} tagName="h3" style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '4px' }}>
                  {get(`about.team.members.${idx}.name`, member.defaultName)}
                </LiveEditable>
                <LiveEditable path={`about.team.members.${idx}.role`} tagName="div" style={{ color: 'var(--color-secondary)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 'var(--space-sm)' }}>
                  {get(`about.team.members.${idx}.role`, member.defaultRole)}
                </LiveEditable>
                <LiveEditable path={`about.team.members.${idx}.desc`} tagName="p" className="text-muted" style={{ fontSize: '0.85rem' }}>
                  {get(`about.team.members.${idx}.desc`, member.defaultDesc)}
                </LiveEditable>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
