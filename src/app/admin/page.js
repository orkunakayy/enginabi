"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Service CRUD form state
  const [editingService, setEditingService] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);

  // Form fields
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('gear');
  const [desc, setDesc] = useState('');
  const [detailTitle, setDetailTitle] = useState('');
  const [detailDesc, setDetailDesc] = useState('');
  const [leftTitle, setLeftTitle] = useState('Yapılan İşlemler');
  const [leftDesc, setLeftDesc] = useState('Bu hizmet kapsamında yapılan adımlar:');
  const [rightTitle, setRightTitle] = useState('Uzman Markalar');
  const [rightDesc, setRightDesc] = useState('');
  const [badgesInput, setBadgesInput] = useState('');
  const [cta1Text, setCta1Text] = useState('Randevu Al');
  const [cta1Href, setCta1Href] = useState('/iletisim');
  const [cta2Text, setCta2Text] = useState('WhatsApp Bilgi');
  const [cta2Href, setCta2Href] = useState('https://wa.me/902128790755');
  const [ctaStyleReverse, setCtaStyleReverse] = useState(false);
  const [serviceItems, setServiceItems] = useState([{ title: '', desc: '' }]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/overview');
      if (!res.ok) {
        throw new Error('İstatistikler yüklenemedi.');
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/appointments?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const openAddServiceForm = () => {
    setEditingService(null);
    setSlug('');
    setTitle('');
    setIcon('gear');
    setDesc('');
    setDetailTitle('');
    setDetailDesc('');
    setLeftTitle('Yapılan İşlemler');
    setLeftDesc('Bu hizmet kapsamında yapılan adımlar:');
    setRightTitle('Uzman Markalar');
    setRightDesc('');
    setBadgesInput('');
    setCta1Text('Randevu Al');
    setCta1Href('/iletisim');
    setCta2Text('WhatsApp Bilgi');
    setCta2Href('https://wa.me/902128790755');
    setCtaStyleReverse(false);
    setServiceItems([{ title: '', desc: '' }]);
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditServiceForm = (service) => {
    setEditingService(service);
    setSlug(service.slug);
    setTitle(service.title);
    setIcon(service.icon || 'gear');
    setDesc(service.desc || '');
    setDetailTitle(service.detailTitle || '');
    setDetailDesc(service.detailDesc || '');
    setLeftTitle(service.leftTitle || 'Yapılan İşlemler');
    setLeftDesc(service.leftDesc || 'Bu hizmet kapsamında yapılan adımlar:');
    setRightTitle(service.rightTitle || 'Uzman Markalar');
    setRightDesc(service.rightDesc || '');
    setBadgesInput((service.badges || []).join(', '));
    setCta1Text(service.cta1Text || 'Randevu Al');
    setCta1Href(service.cta1Href || '/iletisim');
    setCta2Text(service.cta2Text || 'WhatsApp Bilgi');
    setCta2Href(service.cta2Href || 'https://wa.me/902128790755');
    setCtaStyleReverse(!!service.ctaStyleReverse);
    setServiceItems(service.items && service.items.length > 0 ? service.items : [{ title: '', desc: '' }]);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!slug || !title) {
      setFormError('Slug ve Başlık alanları zorunludur.');
      return;
    }

    setFormSaving(true);
    setFormError('');

    const badges = badgesInput.split(',').map(b => b.trim()).filter(b => b.length > 0);

    const payload = {
      slug,
      title,
      icon,
      desc,
      detailTitle,
      detailDesc,
      leftTitle,
      leftDesc,
      rightTitle,
      rightDesc,
      badges,
      cta1Text,
      cta1Href,
      cta2Text,
      cta2Href,
      ctaStyleReverse,
      items: serviceItems.filter(item => item.title.trim().length > 0)
    };

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Hizmet kaydedilemedi.');
      }

      setIsFormOpen(false);
      fetchStats();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteService = async (serviceSlug) => {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz? Alt sayfaları ve tüm bilgileri silinecektir.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/services?slug=${serviceSlug}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Hizmet silinemedi.');
      }

      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...serviceItems];
    updated[index][field] = value;
    setServiceItems(updated);
  };

  const addServiceItemRow = () => {
    setServiceItems([...serviceItems, { title: '', desc: '' }]);
  };

  const removeServiceItemRow = (index) => {
    const updated = serviceItems.filter((_, idx) => idx !== index);
    setServiceItems(updated.length > 0 ? updated : [{ title: '', desc: '' }]);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-card" style={{ borderLeft: '4px solid #EF4444' }}>
        <h3 style={{ color: '#EF4444', margin: 0 }}>Hata Oluştu</h3>
        <p style={{ margin: '8px 0 0 0', color: '#94A3B8' }}>{error}</p>
      </div>
    );
  }

  const { stats, recentAppointments, services = [] } = data;

  const quickLinks = [
    { label: 'Sitede Canlı Düzenleme Yap', path: '/?edit=true', bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.2)', text: '#6366F1', target: '_blank' },
    { label: 'Blog Yazısı Yaz', path: '/admin/blog?action=new', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', text: '#3B82F6' },
    { label: 'Fiyat Katsayılarını Güncelle', path: '/admin/calculator', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', text: '#F59E0B' },
    { label: 'Reels Videosu Ekle', path: '/admin/reels?action=new', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)', text: '#10B981' }
  ];

  return (
    <div>
      <div className="admin-title-row">
        <div>
          <h1>Genel Bakış</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '0.88rem' }}>Engin Usta Motosiklet Servisi yönetim paneline hoş geldiniz.</p>
        </div>
        <button className="admin-btn admin-btn-secondary" onClick={fetchStats}>
          Yenile
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm3.3 14.79L11 13V7h1.5v5.2l3.7 2.2-.71.79c-.19.29-.39.49-.5.59z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Bekleyen Randevular</span>
            <span className="stat-value">{stats.pendingAppointments}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(0, 122, 255, 0.1)', color: '#007AFF' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Toplam Randevu</span>
            <span className="stat-value">{stats.totalAppointments}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Hizmet Sayısı</span>
            <span className="stat-value">{services.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-11 9V9l6 3-6 3z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Blog Yazıları</span>
            <span className="stat-value">{stats.totalPosts}</span>
          </div>
        </div>
      </div>

      {/* Services Catalog Dashboard Section */}
      <div className="admin-card" style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#FFF' }}>Hizmetlerimiz (Servis Katalogu)</h2>
            <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '0.8rem' }}>Müşterilerinize sunduğunuz servis kategorilerini ekleyin, silin veya alt içeriklerini güncelleyin.</p>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={openAddServiceForm} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
            + Yeni Hizmet Ekle
          </button>
        </div>

        {services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8' }}>
            Katalogda kayıtlı hizmet bulunmuyor. Eklemek için yukarıdaki butonu kullanın.
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>İkon</th>
                  <th>Hizmet Başlığı</th>
                  <th>Slug (URL)</th>
                  <th>Önizleme Açıklaması</th>
                  <th style={{ width: '130px', textAlign: 'right' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, idx) => (
                  <tr key={idx}>
                    <td>
                      <span style={{ fontSize: '1.2rem', textTransform: 'capitalize', color: 'var(--color-secondary)' }}>
                        {service.icon === 'maintenance' && '🔧'}
                        {service.icon === 'gear' && '⚙️'}
                        {service.icon === 'engine' && '🔩'}
                        {service.icon === 'welding' && '💥'}
                        {service.icon === 'brake' && '🛑'}
                        {service.icon === 'wire' && '⚡'}
                        {service.icon === 'wheel' && '⭕'}
                        {!['maintenance', 'gear', 'engine', 'welding', 'brake', 'wire', 'wheel'].includes(service.icon) && '🛠️'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#FFF' }}>{service.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{service.detailTitle || service.title}</div>
                    </td>
                    <td><code>/hizmetler/{service.slug}</code></td>
                    <td style={{ fontSize: '0.85rem', color: '#94A3B8', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {service.desc}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="admin-btn admin-btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }} 
                          onClick={() => openEditServiceForm(service)}
                        >
                          Düzenle
                        </button>
                        <button 
                          className="admin-btn" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)' }} 
                          onClick={() => handleDeleteService(service.slug)}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Services Edit/Add Modal Overlay */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <h2 style={{ color: '#FFF', margin: 0 }}>
                {editingService ? `Hizmeti Düzenle: ${editingService.title}` : 'Yeni Hizmet Ekle'}
              </h2>
              <button className="close-modal-btn" onClick={() => setIsFormOpen(false)}>×</button>
            </div>

            {formError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px', borderRadius: '6px', color: '#EF4444', marginBottom: '16px', fontSize: '0.9rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveService}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Hizmet Adı (Menü / Listeleme)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Örn: Varyatör Bakımı"
                    required 
                  />
                </div>
                <div>
                  <label className="form-label">Slug (URL Uzantısı - Benzersiz)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)} 
                    placeholder="Örn: varyator-bakimi"
                    disabled={!!editingService}
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Hizmet İkonu</label>
                  <select className="form-input" value={icon} onChange={(e) => setIcon(e.target.value)}>
                    <option value="maintenance">🔧 Bakım / Tamir (maintenance)</option>
                    <option value="gear">⚙️ Mekanik / Dişli (gear)</option>
                    <option value="engine">🔩 Motor Revizyonu (engine)</option>
                    <option value="welding">💥 Kaynak / Şasi (welding)</option>
                    <option value="brake">🛑 Fren / Güvenlik (brake)</option>
                    <option value="wire">⚡ Elektrik / Tesisat (wire)</option>
                    <option value="wheel">⭕ Lastik / Jant (wheel)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Marka Badgeleri (Virgülle Ayırın)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={badgesInput} 
                    onChange={(e) => setBadgesInput(e.target.value)} 
                    placeholder="Örn: Honda PCX, Yamaha NMAX, Vespa GTS" 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Hizmet Listeleme Kısa Açıklaması</label>
                <textarea 
                  className="form-input" 
                  style={{ height: '70px', resize: 'vertical' }}
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Katalog listelemesinde görünecek kısa kart açıklaması..."
                />
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '24px 0' }} />
              <h3 style={{ color: '#007AFF', fontSize: '1rem', margin: '0 0 16px 0' }}>Hizmet Alt Sayfa Detayları</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Detay Başlığı (Alt Sayfa Banner)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={detailTitle} 
                    onChange={(e) => setDetailTitle(e.target.value)} 
                    placeholder="Örn: Motosiklet Profesyonel Varyatör Bakımı" 
                  />
                </div>
                <div>
                  <label className="form-label">Detay Açıklaması (Alt Sayfa Banner)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={detailDesc} 
                    onChange={(e) => setDetailDesc(e.target.value)} 
                    placeholder="Motosiklet varyatör parçalarının temizliğini ve..." 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Sol Bölüm Başlığı (Yapılan İşlemler)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={leftTitle} 
                    onChange={(e) => setLeftTitle(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="form-label">Sol Bölüm Açıklaması</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={leftDesc} 
                    onChange={(e) => setLeftDesc(e.target.value)} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Sağ Sidebar Bölüm Başlığı</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={rightTitle} 
                    onChange={(e) => setRightTitle(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="form-label">Sağ Sidebar Açıklaması</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={rightDesc} 
                    onChange={(e) => setRightDesc(e.target.value)} 
                  />
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '24px 0' }} />
              <h3 style={{ color: '#007AFF', fontSize: '1rem', margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Yapılan İşlem Adımları (Maddeler)</span>
                <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={addServiceItemRow}>
                  + Madde Ekle
                </button>
              </h3>

              {serviceItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ flex: '1' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ marginBottom: '8px' }}
                      value={item.title} 
                      onChange={(e) => handleItemChange(idx, 'title', e.target.value)} 
                      placeholder="Madde Başlığı (Örn: Debriyaj Balatası Temizliği)"
                      required 
                    />
                    <textarea 
                      className="form-input" 
                      style={{ height: '50px', resize: 'vertical' }}
                      value={item.desc} 
                      onChange={(e) => handleItemChange(idx, 'desc', e.target.value)} 
                      placeholder="Madde Açıklaması..."
                      required 
                    />
                  </div>
                  <button 
                    type="button" 
                    className="admin-btn" 
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', padding: '6px 10px', fontSize: '0.8rem', marginTop: '30px' }} 
                    onClick={() => removeServiceItemRow(idx)}
                  >
                    Sil
                  </button>
                </div>
              ))}

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '24px 0' }} />
              <h3 style={{ color: '#007AFF', fontSize: '1rem', margin: '0 0 16px 0' }}>Çağrı Butonları (Call to Action)</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Buton 1 Metni</label>
                  <input type="text" className="form-input" value={cta1Text} onChange={(e) => setCta1Text(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Buton 1 Linki (Href)</label>
                  <input type="text" className="form-input" value={cta1Href} onChange={(e) => setCta1Href(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Buton 2 Metni</label>
                  <input type="text" className="form-input" value={cta2Text} onChange={(e) => setCta2Text(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Buton 2 Linki (Href)</label>
                  <input type="text" className="form-input" value={cta2Href} onChange={(e) => setCta2Href(e.target.value)} />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#FFF', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={ctaStyleReverse} 
                    onChange={(e) => setCtaStyleReverse(e.target.checked)} 
                    style={{ width: '16px', height: '16px', accentColor: '#007AFF' }}
                  />
                  Birincil ve ikincil buton stillerini yer değiştir (Reverse Style)
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsFormOpen(false)}>
                  İptal
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={formSaving}>
                  {formSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Action Grid */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '32px 0 16px 0', color: '#FFF' }}>Hızlı İşlemler</h2>
      <div className="quick-links-grid">
        {quickLinks.map((link, idx) => (
          <Link href={link.path} key={idx} className="quick-link-card" style={{ background: link.bg, borderColor: link.border }} target={link.target}>
            <span style={{ color: link.text }}>{link.label}</span>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ color: link.text }}>
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Recent Appointments Card */}
      <div className="admin-card" style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#FFF' }}>Son Randevu Talepleri</h2>
          <Link href="/admin/appointments" className="admin-btn admin-btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            Hepsini Gör
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8' }}>
            Henüz gelen bir randevu veya talep bulunmuyor.
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Müşteri</th>
                  <th>Telefon</th>
                  <th>Talep Türü</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#FFF' }}>{app.clientName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{app.email || 'E-posta belirtilmemiş'}</div>
                    </td>
                    <td>{app.phone}</td>
                    <td>
                      <span className="request-type-badge">
                        {app.requestType === 'periyodik-bakim' && 'Periyodik Bakım'}
                        {app.requestType === 'agir-onarım' && 'Ağır Onarım'}
                        {app.requestType === 'elektrik-arızası' && 'Elektrik Arızası'}
                        {app.requestType === 'sigorta-hasar' && 'Sigorta Hasar'}
                        {app.requestType === 'filo-teklif' && 'Filo Teklifi'}
                        {!['periyodik-bakim', 'agir-onarım', 'elektrik-arızası', 'sigorta-hasar', 'filo-teklif'].includes(app.requestType) && app.requestType}
                      </span>
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <span className={`badge badge-${app.status || 'pending'}`}>
                        {app.status === 'beklemede' || !app.status ? 'Beklemede' : ''}
                        {app.status === 'onaylandi' ? 'Onaylandı' : ''}
                        {app.status === 'tamamlandi' ? 'Tamamlandı' : ''}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {(app.status === 'beklemede' || !app.status) && (
                          <button 
                            className="action-btn-check" 
                            title="Onayla"
                            onClick={() => handleUpdateStatus(app.id, 'onaylandi')}
                          >
                            ✓
                          </button>
                        )}
                        {app.status === 'onaylandi' && (
                          <button 
                            className="action-btn-complete" 
                            title="Tamamla"
                            onClick={() => handleUpdateStatus(app.id, 'tamamlandi')}
                          >
                            ★
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }

        .stat-card {
          background: #16181E;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 122, 255, 0.2);
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.78rem;
          color: #94A3B8;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #FFF;
          line-height: 1.2;
          margin-top: 4px;
        }

        .quick-links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .quick-link-card {
          border: 1px solid;
          border-radius: 8px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.92rem;
          transition: all 0.2s ease;
        }

        .quick-link-card:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .request-type-badge {
          background: rgba(255,255,255,0.05);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #E2E8F0;
        }

        .action-btn-check {
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.2);
          width: 28px;
          height: 28px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transition: all 0.2s ease;
        }

        .action-btn-check:hover {
          background: #10B981;
          color: #FFF;
        }

        .action-btn-complete {
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
          border: 1px solid rgba(59, 130, 246, 0.2);
          width: 28px;
          height: 28px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transition: all 0.2s ease;
        }

        .action-btn-complete:hover {
          background: #3B82F6;
          color: #FFF;
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: #16181E;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }

        .close-modal-btn {
          background: none;
          border: none;
          color: #94A3B8;
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
        }

        .close-modal-btn:hover {
          color: #EF4444;
        }

        .form-label {
          display: block;
          color: #E2E8F0;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          background: #090A0D;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 10px 12px;
          color: #FFF;
          font-size: 0.9rem;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          border-color: #007AFF;
        }

        select.form-input {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
