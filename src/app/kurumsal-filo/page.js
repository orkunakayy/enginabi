"use client";

import { useState, Suspense } from 'react';
import LiveEditable from '../../components/LiveEditable';
import LiveEditToolbar from '../../components/LiveEditToolbar';
import { useLiveContent } from '../../hooks/useLiveContent';

export default function FleetPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    tel: '',
    email: '',
    size: '1-5',
    type: '',
    notes: ''
  });

  const { get } = useLiveContent();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const key = id.replace('b2b-', '');
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.contact,
          phone: formData.tel,
          email: formData.email,
          requestType: 'filo-teklif',
          message: `[Firma: ${formData.company}, Filo Boyutu: ${formData.size}, Tip: ${formData.type}] - Notlar: ${formData.notes}`
        })
      });
      if (res.ok) {
        setFormSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Talep gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      alert('Bir ağ hatası oluştu. Lütfen tekrar deneyin.');
    }
  };

  const benefits = [
    {
      key: '0',
      defaultTitle: "Öncelikli Servis & Hızlı Dönüş",
      defaultDesc: "Filonuzdaki motorlar boşta kalmasın diye kurumsal müşterilerimize öncelikli tamir sırası sağlıyor, en hızlı sürede iş teslimi taahhüt ediyoruz."
    },
    {
      key: '1',
      defaultTitle: "CRM & Kilometre Raporlama",
      defaultDesc: "Motosikletlerinize yapılan tüm masraf ve km kayıtları veritabanımızda tutulur. Hangi motora ne kadar harcama yaptığınızı şeffafça görebilirsiniz."
    },
    {
      key: '2',
      defaultTitle: "Faturalı Kurumsal Ödeme",
      defaultDesc: "Toplu kurye filolarına özel anlaşmalı fiyatlar, aylık toplu faturalandırma ve resmi ödeme kanalları ile muhasebeniz kolaylaşır."
    }
  ];

  return (
    <>
      <Suspense fallback={null}>
        <LiveEditToolbar />
      </Suspense>
      {/* B2B SUBHEADER BANNER */}
      <section className="section-padding" style={{ marginTop: '80px', background: 'linear-gradient(135deg, #090A0D 0%, #16181E 100%)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container text-center">

          <LiveEditable path="fleet.banner.title" tagName="h1" style={{ fontSize: '2.75rem', fontWeight: 900 }} className="mb-md">
            {get('fleet.banner.title', 'Kurumsal Motosiklet Filo Çözümleri')}
          </LiveEditable>
          <LiveEditable path="fleet.banner.desc" tagName="p" className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.15rem' }}>
            {get('fleet.banner.desc', 'Kurye şirketleri, dağıtım ağları ve kurumsal filolar için operasyonel duraksamaları sıfıra indiren, şeffaf maliyetli profesyonel bakım ve onarım desteği.')}
          </LiveEditable>
        </div>
      </section>

      {/* B2B DETAILS / BENEFITS */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-xl">
            <LiveEditable path="fleet.benefits.title" tagName="h2" style={{ fontSize: '2rem' }}>
              {get('fleet.benefits.title', 'Neden Emira Motors Filo Yönetimi?')}
            </LiveEditable>
            <LiveEditable path="fleet.benefits.desc" tagName="p" className="text-muted mt-sm">
              {get('fleet.benefits.desc', 'İş ortaklarımıza sunduğumuz avantajlarla operasyonel süreçlerinizi hızlandırıyoruz.')}
            </LiveEditable>
          </div>

          <div className="card-grid">
            {/* Benefit 1 */}
            <div className="card" style={{ cursor: 'default' }}>
              <svg className="card-icon" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.3 14.79L11 13V7h1.5v5.2l3.7 2.2-.71.79c-.19.29-.39.49-.5.59z"/></svg>
              <LiveEditable path="fleet.benefits.items.0.title" tagName="h3" className="card-title">
                {get('fleet.benefits.items.0.title', benefits[0].defaultTitle)}
              </LiveEditable>
              <LiveEditable path="fleet.benefits.items.0.desc" tagName="p" className="card-desc">
                {get('fleet.benefits.items.0.desc', benefits[0].defaultDesc)}
              </LiveEditable>
            </div>

            {/* Benefit 2 */}
            <div className="card" style={{ cursor: 'default' }}>
              <svg className="card-icon" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2z"/></svg>
              <LiveEditable path="fleet.benefits.items.1.title" tagName="h3" className="card-title">
                {get('fleet.benefits.items.1.title', benefits[1].defaultTitle)}
              </LiveEditable>
              <LiveEditable path="fleet.benefits.items.1.desc" tagName="p" className="card-desc">
                {get('fleet.benefits.items.1.desc', benefits[1].defaultDesc)}
              </LiveEditable>
            </div>

            {/* Benefit 3 */}
            <div className="card" style={{ cursor: 'default' }}>
              <svg className="card-icon" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.44-1.7-3.48-4.7-4.4z"/></svg>
              <LiveEditable path="fleet.benefits.items.2.title" tagName="h3" className="card-title">
                {get('fleet.benefits.items.2.title', benefits[2].defaultTitle)}
              </LiveEditable>
              <LiveEditable path="fleet.benefits.items.2.desc" tagName="p" className="card-desc">
                {get('fleet.benefits.items.2.desc', benefits[2].defaultDesc)}
              </LiveEditable>
            </div>
          </div>
        </div>
      </section>

      {/* B2B CASE STUDY / METRICS SECTION */}
      <section className="section-padding" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container grid-2">
          <div>
            <h2 style={{ fontSize: '2.25rem', marginBottom: 'var(--space-md)' }}>Sayılarla Kurumsal Çözümler</h2>
            <p className="text-muted mb-md">Emira Motors olarak, İstanbul genelinde dağıtım ağına sahip 10'dan fazla kurye firmasının toplamda 150+ motosikletine düzenli bakım desteği sunmaktayız. İş ortaklarımıza sağladığımız km takipleri sayesinde yedek parça maliyetlerinde yıllık %25'e varan tasarruf sağlıyoruz.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-headings)', fontWeight: 800, color: 'var(--color-secondary)' }}>%25</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Yedek Parça Tasarrufu</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-headings)', fontWeight: 800, color: 'var(--color-secondary)' }}>4 Saat</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Maksimum Teslimat Süresi</div>
              </div>
            </div>
          </div>
          
          <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', textAlign: 'center' }}>
            <h3 style={{ marginBottom: 'var(--space-sm)', fontSize: '1.5rem' }}>Filo Rapor Örneği</h3>
            <p className="text-muted mb-lg" style={{ fontSize: '0.9rem' }}>Hangi plakalı motora ne harcama yapıldığını detaylarıyla listeleyin.</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--color-secondary)' }}>
                  <th style={{ padding: '8px 0' }}>Plaka</th>
                  <th style={{ padding: '8px 0' }}>İşlem</th>
                  <th style={{ padding: '8px 0' }}>Tarih</th>
                  <th style={{ padding: '8px 0', textAlign: 'right' }}>Masraf</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 0' }}>34 MTR 21</td>
                  <td>Periyodik (Varyatör)</td>
                  <td>12.06.2026</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>2.400 TL</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 0' }}>34 ABC 450</td>
                  <td>Ağır Bakım + Debriyaj</td>
                  <td>08.06.2026</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>6.250 TL</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 0' }}>34 XYZ 92</td>
                  <td>Ön Amortisör Keçesi</td>
                  <td>02.06.2026</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>1.850 TL</td>
                </tr>
              </tbody>
            </table>
            
            <a href="http://crm.emiramotors.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm mt-lg" style={{ width: '100%' }}>Tüm Plaka Raporlarını Göster</a>
          </div>
        </div>
      </section>

      {/* B2B REQUEST QUOTE FORM */}
      <section className="section-padding" id="B2Bform">
        <div className="container">
          <div className="text-center mb-xl">
            <h2 style={{ fontSize: '2rem' }}>Motosiklet Filonuz İçin Teklif Alın</h2>
            <p className="text-muted mt-sm">Dağıtım veya kurye filonuzun büyüklüğünü belirtin, size özel avantajlı fiyat paketleri hazırlayalım.</p>
          </div>

          <div className="form-container">
            {formSubmitted ? (
              <div className="form-success-banner" style={{ textAlign: 'center', padding: 'var(--space-xl) var(--space-lg)', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--color-secondary)', borderRadius: 'var(--radius-lg)' }}>
                <svg style={{ width: '48px', height: '48px', fill: 'var(--color-secondary)', marginBottom: 'var(--space-md)' }} viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <h3 style={{ marginBottom: 'var(--space-sm)' }}>Teklif Talebiniz Alındı!</h3>
                <p className="text-muted" style={{ marginBottom: 'var(--space-md)' }}>Firma bilgileriniz ve talebiniz başarıyla kaydedilmiştir. Portföy yöneticimiz en kısa sürede teklifimiz ile sizinle iletişime geçecektir.</p>
                <button 
                  onClick={() => { 
                    setFormSubmitted(false); 
                    setFormData({ company: '', contact: '', tel: '', email: '', size: '1-5', type: '', notes: '' }); 
                  }} 
                  className="btn btn-secondary btn-sm"
                >
                  Yeni Teklif Talebi Oluştur
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="b2b-company">Firma Adı *</label>
                  <input 
                    type="text" 
                    id="b2b-company" 
                    className="form-control" 
                    placeholder="Örn: Hızlı Kurye Dağıtım A.Ş." 
                    value={formData.company}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="b2b-contact">Yetkili Adı Soyadı *</label>
                  <input 
                    type="text" 
                    id="b2b-contact" 
                    className="form-control" 
                    placeholder="Örn: Hasan Yılmaz" 
                    value={formData.contact}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="grid-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)', marginBottom: 0 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="b2b-tel">Telefon *</label>
                    <input 
                      type="tel" 
                      id="b2b-tel" 
                      className="form-control" 
                      placeholder="0555 123 4567" 
                      value={formData.tel}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="b2b-email">E-posta *</label>
                    <input 
                      type="email" 
                      id="b2b-email" 
                      className="form-control" 
                      placeholder="hasan@firma.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)', marginBottom: 0 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="b2b-size">Filo Büyüklüğü (Motosiklet Sayısı) *</label>
                    <select 
                      id="b2b-size" 
                      className="form-control" 
                      value={formData.size}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="1-5">1 - 5 Adet</option>
                      <option value="5-15">5 - 15 Adet</option>
                      <option value="15-50">15 - 50 Adet</option>
                      <option value="50+">50+ Adet</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="b2b-type">Motosiklet Modelleri *</label>
                    <input 
                      type="text" 
                      id="b2b-type" 
                      className="form-control" 
                      placeholder="Örn: Honda Activa, Yamaha NMAX" 
                      value={formData.type}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="b2b-notes">Ekstra Talepler / Notlar</label>
                  <textarea 
                    id="b2b-notes" 
                    className="form-control" 
                    placeholder="Öncelikli servis veya km takip entegrasyonu gibi ek taleplerinizi buraya yazabilirsiniz..."
                    value={formData.notes}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }}>
                  Teklif Talebini Gönder
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
