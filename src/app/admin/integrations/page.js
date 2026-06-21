"use client";

import { useState, useEffect } from 'react';

export default function IntegrationsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    googleAnalyticsId: '',
    googleSearchConsoleId: '',
    bingWebmasterId: '',
    clarityId: '',
    facebookPixelId: '',
    customHeaderScripts: '',
    customFooterScripts: ''
  });

  useEffect(() => {
    fetch('/api/admin/integrations')
      .then(res => {
        if (!res.ok) throw new Error('Entegrasyonlar yüklenemedi.');
        return res.json();
      })
      .then(data => {
        setFormData({
          googleAnalyticsId: data.googleAnalyticsId || '',
          googleSearchConsoleId: data.googleSearchConsoleId || '',
          bingWebmasterId: data.bingWebmasterId || '',
          clarityId: data.clarityId || '',
          facebookPixelId: data.facebookPixelId || '',
          customHeaderScripts: data.customHeaderScripts || '',
          customFooterScripts: data.customFooterScripts || ''
        });
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/admin/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ayarlar kaydedilemedi.');
      }

      setSuccess('Entegrasyon ayarları başarıyla kaydedildi! Değişiklikler tüm sitede aktif edildi.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-title-row">
        <div>
          <h1>3. Parti Entegrasyonlar ve Takip Kodları</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '0.88rem' }}>
            Google Analytics, Search Console, Facebook Pixel, Microsoft Clarity ve özel script kodlarınızı buradan yönetin.
          </p>
        </div>
      </div>

      {success && <div className="success-banner mb-md">{success}</div>}
      {error && <div className="error-box mb-md">{error}</div>}

      <div className="admin-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="settings-section">
            <h3 className="section-title">📊 Google & Arama Motoru Servisleri</h3>
            <div className="form-grid">
              <div className="form-item">
                <label>Google Analytics (GA4) Ölçüm Kimliği</label>
                <input 
                  type="text" 
                  name="googleAnalyticsId"
                  className="admin-input"
                  value={formData.googleAnalyticsId}
                  onChange={handleInputChange}
                  placeholder="G-XXXXXXXXXX"
                />
                <span className="input-help">Site ziyaret trafiğini ölçmek için kullanılan GA4 kimliği.</span>
              </div>

              <div className="form-item">
                <label>Google Search Console Doğrulama Kodu</label>
                <input 
                  type="text" 
                  name="googleSearchConsoleId"
                  className="admin-input"
                  value={formData.googleSearchConsoleId}
                  onChange={handleInputChange}
                  placeholder="Arama konsolu doğrulama meta-tag içeriği veya kimliği"
                />
                <span className="input-help">Yalnızca içerik değerini giriniz (meta tag içindeki content değeri).</span>
              </div>
            </div>

            <div className="form-grid" style={{ marginTop: '16px' }}>
              <div className="form-item">
                <label>Bing Webmaster Tools Doğrulama Kodu</label>
                <input 
                  type="text" 
                  name="bingWebmasterId"
                  className="admin-input"
                  value={formData.bingWebmasterId}
                  onChange={handleInputChange}
                  placeholder="Bing doğrulama meta-tag içeriği"
                />
                <span className="input-help">Bing arama dizinine kayıt doğrulama kodu.</span>
              </div>
              <div className="form-item-empty"></div>
            </div>
          </div>

          <hr className="divider" />

          <div className="settings-section">
            <h3 className="section-title">👥 İzleme, Isı Haritası & Sosyal Medya</h3>
            <div className="form-grid">
              <div className="form-item">
                <label>Microsoft Clarity Proje Kodu</label>
                <input 
                  type="text" 
                  name="clarityId"
                  className="admin-input"
                  value={formData.clarityId}
                  onChange={handleInputChange}
                  placeholder="Clarity proje benzersiz kimliği"
                />
                <span className="input-help">Isı haritası ve ekran kaydı takibi için Clarity kimliği.</span>
              </div>

              <div className="form-item">
                <label>Facebook Pixel Kimliği (ID)</label>
                <input 
                  type="text" 
                  name="facebookPixelId"
                  className="admin-input"
                  value={formData.facebookPixelId}
                  onChange={handleInputChange}
                  placeholder="Pixel ID (Örn: 123456789012345)"
                />
                <span className="input-help">Meta/Facebook reklamları dönüşüm takibi için Pixel ID'niz.</span>
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="settings-section">
            <h3 className="section-title">💻 Özel HTML / JavaScript Kodları</h3>
            <div className="form-grid">
              <div className="form-item">
                <label>Özel Header Kodları (HEAD Etiketleri Arası)</label>
                <textarea 
                  name="customHeaderScripts"
                  className="admin-textarea"
                  value={formData.customHeaderScripts}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="<!-- Buraya eklenen kodlar </head> etiketinin hemen öncesine yerleştirilir -->"
                ></textarea>
                <span className="input-help">CSS stil dosyaları, özel meta etiketleri veya head kısmına yerleştirilmesi gereken scriptler.</span>
              </div>

              <div className="form-item">
                <label>Özel Footer Kodları (BODY Kapatılmadan Önce)</label>
                <textarea 
                  name="customFooterScripts"
                  className="admin-textarea"
                  value={formData.customFooterScripts}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="<!-- Buraya eklenen kodlar </body> etiketinin hemen öncesine yerleştirilir -->"
                ></textarea>
                <span className="input-help">Canlı destek widgetları, chatbotlar veya sayfa yüklendikten sonra çalışacak takip scriptleri.</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Entegrasyonları Kaydet'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .settings-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #FFF;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          border-left: 3px solid #007AFF;
          padding-left: 10px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .form-item-empty {
          display: block;
        }

        .form-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-item label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #E2E8F0;
        }

        .input-help {
          font-size: 0.75rem;
          color: #64748B;
          margin-top: 2px;
        }

        .divider {
          border: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          margin: 8px 0;
        }

        .success-banner {
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.2);
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 500;
        }

        .error-box {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 500;
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(0, 122, 255, 0.2);
          border-radius: 50%;
          border-top-color: #007AFF;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
