"use client";

import { useState, Suspense } from 'react';
import LiveEditable from '../../components/LiveEditable';
import LiveEditToolbar from '../../components/LiveEditToolbar';
import { useLiveContent } from '../../hooks/useLiveContent';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mapActive, setMapActive] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    subject: 'BAKIM TALEBİ',
    message: '',
  });

  const { get } = useLiveContent();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const key = id.replace('contact-', '');
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu en fazla 5MB olabilir.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu en fazla 5MB olabilir.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalMessage = formData.message;
    if (selectedFile && formData.subject === 'HASAR BİLDİRİMİ') {
      finalMessage += `\n\n[Ekli Hasar Görseli: ${selectedFile.name}]`;
    }

    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.name,
          phone: formData.tel,
          email: formData.email,
          requestType: formData.subject,
          message: finalMessage
        })
      });
      if (res.ok) {
        setFormSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Randevu talebi gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      alert('Bir ağ hatası oluştu. Lütfen tekrar deneyin.');
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

          <LiveEditable path="contact.banner.title" tagName="h1" style={{ fontSize: '2.75rem', fontWeight: 900 }} className="mb-md">
            {get('contact.banner.title', 'İletişim & Randevu')}
          </LiveEditable>
          <LiveEditable path="contact.banner.desc" tagName="p" className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.15rem' }}>
            {get('contact.banner.desc', 'Motosikletinizi dükkanımıza getirmek veya hasar onarım kaydı oluşturmak için bizimle irtibata geçin.')}
          </LiveEditable>
        </div>
      </section>

      {/* MAP & CONTACT INFO */}
      <section className="section-padding">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          
          {/* Contact Details & Map */}
          <div>
            <LiveEditable path="contact.info.title" tagName="h2" style={{ fontSize: '1.75rem' }} className="mb-md">
              {get('contact.info.title', 'İletişim Bilgileri')}
            </LiveEditable>
            
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <svg style={{ width: '24px', height: '24px', fill: 'var(--color-secondary)', flexShrink: 0 }} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <div>
                  <LiveEditable path="contact.info.addressLabel" tagName="strong" style={{ color: '#FFF', display: 'block' }}>{get('contact.info.addressLabel', 'Dükkan Adresi')}</LiveEditable>
                  <LiveEditable path="contact.info.addressVal" tagName="span">{get('contact.info.addressVal', 'Beylikdüzü / İSTANBUL (Motosikletiniz için çekici desteği mevcuttur)')}</LiveEditable>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <svg style={{ width: '24px', height: '24px', fill: 'var(--color-secondary)', flexShrink: 0 }} viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.57c-2.83-1.44-5.15-3.75-6.59-6.59l1.57-1.57c.27-.27.35-.65.24-1-.36-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                <div>
                  <LiveEditable path="contact.info.phoneLabel" tagName="strong" style={{ color: '#FFF', display: 'block' }}>{get('contact.info.phoneLabel', 'Gsm (Telefon)')}</LiveEditable>
                  <LiveEditable path="contact.info.phoneVal" tagName="span">{get('contact.info.phoneVal', '(0212) 879 07 55')}</LiveEditable>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <svg style={{ width: '24px', height: '24px', fill: 'var(--color-secondary)', flexShrink: 0 }} viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <div>
                  <LiveEditable path="contact.info.emailLabel" tagName="strong" style={{ color: '#FFF', display: 'block' }}>{get('contact.info.emailLabel', 'E-posta')}</LiveEditable>
                  <LiveEditable path="contact.info.emailVal" tagName="span">{get('contact.info.emailVal', 'servis@emiramotors.com')}</LiveEditable>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <svg style={{ width: '24px', height: '24px', fill: 'var(--color-secondary)', flexShrink: 0 }} viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.3 14.79L11 13V7h1.5v5.2l3.7 2.2-.71.79c-.19.29-.39.49-.5.59z"/></svg>
                <div>
                  <LiveEditable path="contact.info.hoursLabel" tagName="strong" style={{ color: '#FFF', display: 'block' }}>{get('contact.info.hoursLabel', 'Çalışma Saatleri')}</LiveEditable>
                  <LiveEditable path="contact.info.hoursVal" tagName="span">{get('contact.info.hoursVal', 'Pazartesi - Cumartesi: 09:00 - 19:30 (Pazar Günü Kapalıdır)')}</LiveEditable>
                </div>
              </div>
            </div>

            {/* Quick Action Phone & WhatsApp Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: 'var(--space-lg)' }}>
              <a 
                href="https://wa.me/905331301448" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="quick-action-btn wa-btn"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.588 1.977 14.12 .953 11.503.953c-5.448 0-9.873 4.373-9.877 9.803-.001 1.777.467 3.51 1.358 5.05L1.971 20l4.676-1.218c1.558.85 3.328 1.372 4.962 1.372z"/>
                </svg>
                WhatsApp ile Sor
              </a>
              <a 
                href="tel:02128790755" 
                className="quick-action-btn call-btn"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.57c-2.83-1.44-5.15-3.75-6.59-6.59l1.57-1.57c.27-.27.35-.65.24-1-.36-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
                Hemen Ara
              </a>
            </div>

            {/* Google Maps Embed Map with Pointer Events Control */}
            <div 
              onClick={() => setMapActive(true)}
              onMouseLeave={() => setMapActive(false)}
              style={{ width: '100%', height: '390px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', filter: 'grayscale(1) invert(0.9) contrast(1.2)', marginBottom: 'var(--space-md)' }}
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48175.76567340026!2d28.67602302497886483526978644!3d40.9884825853146314705574345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa110d74268e7%3A0xe54b9f2c81fb3df!2zQmV5bGlrZMO8XrUvSXPsubBhbmJ1bA!5e0!3m2!1str!2str!4v1718820000000!5m2!1str!2str" 
                width="100%" 
                height="100%" 
                style={{ border: 0, pointerEvents: mapActive ? 'auto' : 'none' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>

            {/* Navigation Directions App Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginBottom: 'var(--space-lg)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Yol Tarifi Al:</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=40.98848258531463,28.676023024978864" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px', fontSize: '0.85rem', padding: '10px' }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--color-secondary)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  Google Maps
                </a>
                <a 
                  href="https://maps.apple.com/maps?daddr=40.98848258531463,28.676023024978864" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px', fontSize: '0.85rem', padding: '10px' }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--color-secondary)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  Apple Maps
                </a>
                <a 
                  href="https://yandex.com/maps/?rtext=~40.98848258531463,28.676023024978864" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px', fontSize: '0.85rem', padding: '10px' }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--color-secondary)"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/></svg>
                  Yandex Harita
                </a>
              </div>
            </div>
          </div>

          {/* General Appointment Form */}
          <div className="form-container">
            <LiveEditable path="contact.form.title" tagName="h3" style={{ fontSize: '1.5rem' }} className="mb-md">
              {get('contact.form.title', 'Dükkan Randevu & Hasar Formu')}
            </LiveEditable>
            <LiveEditable path="contact.form.desc" tagName="p" className="text-muted mb-lg" style={{ fontSize: '0.9rem' }}>
              {get('contact.form.desc', 'Formu doldurun, talebinize en geç 30 dakika içerisinde telefonla dönüş sağlayalım.')}
            </LiveEditable>
            
            {formSubmitted ? (
              <div className="form-success-banner" style={{ textAlign: 'center', padding: 'var(--space-xl) var(--space-lg)', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid #25D366', borderRadius: 'var(--radius-lg)' }}>
                <svg style={{ width: '48px', height: '48px', fill: '#25D366', marginBottom: 'var(--space-md)' }} viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h3 style={{ marginBottom: 'var(--space-sm)' }}>Talebiniz Başarıyla Alındı!</h3>
                <p className="text-muted" style={{ marginBottom: 'var(--space-md)' }}>Bilgileriniz Engin Usta'ya iletilmiştir. En kısa sürede sizinle irtibata geçilecektir.</p>
                <button 
                  onClick={() => { 
                    setFormSubmitted(false); 
                    setSelectedFile(null);
                    setFormData({ name: '', email: '', tel: '', subject: 'BAKIM TALEBİ', message: '' }); 
                  }} 
                  className="btn btn-secondary btn-sm"
                >
                  Yeni Talep Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Adınız Soyadınız / Firma İsmi *</label>
                  <input 
                    type="text" 
                    id="contact-name" 
                    className="form-control" 
                    placeholder="Örn: Serkan Yılmaz" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">E-posta Adresiniz</label>
                  <input 
                    type="email" 
                    id="contact-email" 
                    className="form-control" 
                    placeholder="serkan@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)', marginBottom: 0 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-tel">Telefon Numaranız *</label>
                    <input 
                      type="tel" 
                      id="contact-tel" 
                      className="form-control" 
                      placeholder="0555 123 4567" 
                      value={formData.tel}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-subject">Talep Türü *</label>
                    <select 
                      id="contact-subject" 
                      className="form-control" 
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="BAKIM TALEBİ">Periyodik Bakım</option>
                      <option value="ARIZA TALEBİ">Arıza / Mekanik Tamir</option>
                      <option value="HASAR BİLDİRİMİ">Sigorta / Kasko Hasar Onarımı</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Mesajınız *</label>
                  <textarea 
                    id="contact-message" 
                    className="form-control" 
                    placeholder="Motosikletinizin marka, modelini ve yapmak istediğiniz işlemi yazın..." 
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                {/* Conditional custom file upload dropzone */}
                {formData.subject === 'HASAR BİLDİRİMİ' && (
                  <div className="form-group">
                    <label className="form-label">Hasar Görseli Yükleyin *</label>
                    <div 
                      className={`dropzone-area ${dragActive ? 'drag-active' : ''}`}
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('contact-file').click()}
                    >
                      <input 
                        type="file" 
                        id="contact-file" 
                        style={{ display: 'none' }}
                        accept="image/png, image/jpeg" 
                        onChange={handleFileChange} 
                      />
                      <div className="dropzone-label">
                        <svg className="dropzone-icon" viewBox="0 0 24 24">
                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                        </svg>
                        {selectedFile ? (
                          <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>✓ {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</span>
                        ) : (
                          <>
                            <span>Görseli buraya sürükleyin veya dosya seçin</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Max 5MB, PNG veya JPEG)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Talebi Gönder</button>
              </form>
            )}
          </div>

        </div>
      </section>

      <style jsx>{`
        .quick-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
          cursor: pointer;
        }

        .wa-btn {
          background: #25D366;
          color: #FFF;
          border: 1px solid transparent;
        }

        .wa-btn:hover {
          background: #20BA5A;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.25);
        }

        .call-btn {
          background: var(--color-primary);
          color: #FFF;
          border: 1px solid transparent;
        }

        .call-btn:hover {
          background: #0056B3;
          box-shadow: 0 4px 15px rgba(0, 122, 255, 0.25);
        }

        .dropzone-area {
          border: 2px dashed rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.02);
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .dropzone-area.drag-active {
          border-color: var(--color-primary);
          background: rgba(0, 122, 255, 0.05);
        }

        .dropzone-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          cursor: pointer;
        }

        .dropzone-icon {
          width: 32px;
          height: 32px;
          fill: var(--text-muted);
          transition: fill 0.2s ease;
        }

        .dropzone-area:hover .dropzone-icon {
          fill: var(--color-secondary);
        }

        :global(.form-control) {
          min-height: 48px;
        }

        :global(textarea.form-control) {
          min-height: 100px;
        }

        @media (max-width: 576px) {
          .dropzone-area {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
}
