"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ReelsAdminContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get('action'); // 'new'

  const [activeTab, setActiveTab] = useState('reels'); // 'reels', 'horizontal_videos', 'before_after', 'workshop_images'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [editId, setEditId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form States
  const [videoForm, setVideoForm] = useState({
    title: '',
    youtubeId: '',
    duration: '0:50',
    likes: '100'
  });

  const [beforeAfterForm, setBeforeAfterForm] = useState({
    title: '',
    beforeImage: '',
    afterImage: '',
    beforeLabel: 'Kirli / Eski',
    afterLabel: 'Temiz / Yeni'
  });

  const [photoForm, setPhotoForm] = useState({
    title: '',
    image: ''
  });

  const fetchItems = async (type = activeTab) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reels?type=${type}`);
      if (!res.ok) throw new Error('Veriler yüklenemedi.');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (initialAction === 'new') {
      handleNew();
    }
  }, [initialAction]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setView('list');
    setError('');
    setSuccess('');
  };

  const handleNew = () => {
    setError('');
    setSuccess('');
    setEditId(null);
    
    // Initialise forms based on active tab
    setVideoForm({
      title: '',
      youtubeId: '',
      duration: activeTab === 'reels' ? '0:45' : '12:00',
      likes: '150'
    });

    setBeforeAfterForm({
      title: '',
      beforeImage: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=700',
      afterImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=700',
      beforeLabel: 'Kirli / Eski',
      afterLabel: 'Temiz / Yeni'
    });

    setPhotoForm({
      title: '',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800'
    });

    setView('form');
  };

  const handleEdit = (item) => {
    setError('');
    setSuccess('');
    setEditId(item.id);

    if (activeTab === 'reels' || activeTab === 'horizontal_videos') {
      setVideoForm({
        title: item.title || '',
        youtubeId: item.youtubeId || '',
        duration: item.duration || '',
        likes: item.likes || ''
      });
    } else if (activeTab === 'before_after') {
      setBeforeAfterForm({
        title: item.title || '',
        beforeImage: item.beforeImage || '',
        afterImage: item.afterImage || '',
        beforeLabel: item.beforeLabel || 'Öncesi',
        afterLabel: item.afterLabel || 'Sonrası'
      });
    } else if (activeTab === 'workshop_images') {
      setPhotoForm({
        title: item.title || '',
        image: item.image || ''
      });
    }

    setView('form');
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/reels?type=${activeTab}&id=${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Öğe silinemedi.');
      
      setItems(prev => prev.filter(r => r.id !== id));
      setDeleteConfirmId(null);
      setSuccess('Öğe başarıyla silindi.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleYoutubeIdChange = async (val) => {
    setVideoForm(p => ({ ...p, youtubeId: val }));

    if (val.includes('youtube.com') || val.includes('youtu.be') || val.length === 11) {
      setError('');
      setSuccess('Video bilgileri otomatik çekiliyor...');
      try {
        const res = await fetch(`/api/admin/reels/fetch-meta?url=${encodeURIComponent(val)}`);
        if (!res.ok) throw new Error('Video bilgileri alınamadı.');
        const data = await res.json();
        if (data.success) {
          setVideoForm({
            title: data.title || '',
            youtubeId: data.youtubeId,
            duration: data.duration || '10:00',
            likes: data.likes || '150'
          });
          setSuccess('YouTube video bilgileri otomatik dolduruldu!');
        }
      } catch (err) {
        setSuccess('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const url = editId ? `/api/admin/reels?type=${activeTab}&id=${editId}` : `/api/admin/reels?type=${activeTab}`;
    const method = editId ? 'PUT' : 'POST';

    let payload = {};
    if (activeTab === 'reels' || activeTab === 'horizontal_videos') {
      payload = videoForm;
    } else if (activeTab === 'before_after') {
      payload = beforeAfterForm;
    } else if (activeTab === 'workshop_images') {
      payload = photoForm;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Kaydedilemedi.');
      }

      setSuccess('Başarıyla kaydedildi!');
      setView('list');
      fetchItems(activeTab);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="admin-title-row">
        <div>
          <h1>Galeri & Medya Yönetimi</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '0.88rem' }}>Atölye fotoğrafları, videoları ve öncesi/sonrası sürgülerini buradan yönetin.</p>
        </div>
        {view === 'list' ? (
          <button className="admin-btn admin-btn-primary" onClick={handleNew}>
            + Yeni Öğe Ekle
          </button>
        ) : (
          <button className="admin-btn admin-btn-secondary" onClick={() => setView('list')}>
            Listeye Dön
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="admin-tabs-row" style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px', paddingBottom: '10px', flexWrap: 'wrap' }}>
        <button 
          className={`admin-tab-btn ${activeTab === 'reels' ? 'active' : ''}`}
          onClick={() => handleTabChange('reels')}
        >
          📱 Reels (Dikey)
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'horizontal_videos' ? 'active' : ''}`}
          onClick={() => handleTabChange('horizontal_videos')}
        >
          🖥️ Yatay Videolar
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'before_after' ? 'active' : ''}`}
          onClick={() => handleTabChange('before_after')}
        >
          ↔️ Öncesi / Sonrası
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'workshop_images' ? 'active' : ''}`}
          onClick={() => handleTabChange('workshop_images')}
        >
          📸 Atölye Görselleri
        </button>
      </div>

      {success && <div className="success-banner mb-md">{success}</div>}
      {error && <div className="error-box mb-md">{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* List View */}
          {view === 'list' && (
            <div className="admin-card">
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                  Bu kategoride henüz eklenmiş içerik bulunmuyor.
                </div>
              ) : (
                <div className="items-table-grid">
                  {items.map((item) => (
                    <div className="item-admin-card" key={item.id}>
                      <div className="item-thumb-container">
                        <img 
                          src={
                            activeTab === 'workshop_images' ? item.image :
                            activeTab === 'before_after' ? item.afterImage :
                            item.thumbnail
                          } 
                          alt={item.title} 
                        />
                        {(activeTab === 'reels' || activeTab === 'horizontal_videos') && (
                          <span className="item-duration">{item.duration}</span>
                        )}
                      </div>
                      <div className="item-details">
                        <h3 className="item-title">{item.title}</h3>
                        
                        <div className="item-meta">
                          {activeTab === 'before_after' ? (
                            <span>Labels: {item.beforeLabel} ↔️ {item.afterLabel}</span>
                          ) : (activeTab === 'reels' || activeTab === 'horizontal_videos') ? (
                            <>
                              <span>ID: {item.youtubeId}</span>
                              <span>❤️ {item.likes} Beğeni</span>
                            </>
                          ) : (
                            <span>📸 Görsel URL: ...{item.image?.slice(-20)}</span>
                          )}
                        </div>

                        <div className="item-actions">
                          <button className="admin-btn admin-btn-secondary" onClick={() => handleEdit(item)}>
                            Düzenle
                          </button>
                          <button className="admin-btn admin-btn-danger" onClick={() => setDeleteConfirmId(item.id)}>
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Form View */}
          {view === 'form' && (
            <div className="admin-card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', color: '#FFF' }}>
                {editId ? 'Kaydı Düzenle' : 'Yeni Öğe Ekle'}
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* VIDEO FORM fields */}
                {(activeTab === 'reels' || activeTab === 'horizontal_videos') && (
                  <>
                    <div className="form-item">
                      <label>Video Başlığı *</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={videoForm.title}
                        onChange={(e) => setVideoForm(p => ({...p, title: e.target.value}))}
                        placeholder="Örn: Vespa Varyatör Titremesi Çözümü"
                        required
                      />
                    </div>

                    <div className="form-item">
                      <label>YouTube Video Linki veya Video ID *</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={videoForm.youtubeId}
                        onChange={(e) => handleYoutubeIdChange(e.target.value)}
                        placeholder="Örn: https://www.youtube.com/watch?v=dQw4w9WgXcQ veya dQw4w9WgXcQ"
                        required
                      />
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                        YouTube linkini girdiğinizde kapak görseli otomatik olarak oluşturulacaktır.
                      </span>
                    </div>

                    <div className="form-grid">
                      <div className="form-item">
                        <label>Süre</label>
                        <input 
                          type="text" 
                          className="admin-input"
                          value={videoForm.duration}
                          onChange={(e) => setVideoForm(p => ({...p, duration: e.target.value}))}
                          placeholder="Örn: 10:45"
                        />
                      </div>

                      <div className="form-item">
                        <label>Beğeni Sayısı</label>
                        <input 
                          type="text" 
                          className="admin-input"
                          value={videoForm.likes}
                          onChange={(e) => setVideoForm(p => ({...p, likes: e.target.value}))}
                          placeholder="Örn: 250"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* BEFORE / AFTER fields */}
                {activeTab === 'before_after' && (
                  <>
                    <div className="form-item">
                      <label>Karşılaştırma Başlığı *</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={beforeAfterForm.title}
                        onChange={(e) => setBeforeAfterForm(p => ({...p, title: e.target.value}))}
                        placeholder="Örn: Egzoz Revizyonu"
                        required
                      />
                    </div>

                    <div className="form-item">
                      <label>Öncesi Görseli (URL) *</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={beforeAfterForm.beforeImage}
                        onChange={(e) => setBeforeAfterForm(p => ({...p, beforeImage: e.target.value}))}
                        placeholder="https://..."
                        required
                      />
                    </div>

                    <div className="form-item">
                      <label>Sonrası Görseli (URL) *</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={beforeAfterForm.afterImage}
                        onChange={(e) => setBeforeAfterForm(p => ({...p, afterImage: e.target.value}))}
                        placeholder="https://..."
                        required
                      />
                    </div>

                    <div className="form-grid">
                      <div className="form-item">
                        <label>Öncesi Etiketi</label>
                        <input 
                          type="text" 
                          className="admin-input"
                          value={beforeAfterForm.beforeLabel}
                          onChange={(e) => setBeforeAfterForm(p => ({...p, beforeLabel: e.target.value}))}
                          placeholder="Örn: Hasarlı"
                        />
                      </div>

                      <div className="form-item">
                        <label>Sonrası Etiketi</label>
                        <input 
                          type="text" 
                          className="admin-input"
                          value={beforeAfterForm.afterLabel}
                          onChange={(e) => setBeforeAfterForm(p => ({...p, afterLabel: e.target.value}))}
                          placeholder="Örn: Onarılmış"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* WORKSHOP IMAGE fields */}
                {activeTab === 'workshop_images' && (
                  <>
                    <div className="form-item">
                      <label>Görsel Başlığı / Açıklaması *</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={photoForm.title}
                        onChange={(e) => setPhotoForm(p => ({...p, title: e.target.value}))}
                        placeholder="Örn: Honda Forza Lastik Yenileme"
                        required
                      />
                    </div>

                    <div className="form-item">
                      <label>Görsel URL Adresi *</label>
                      <input 
                        type="text" 
                        className="admin-input"
                        value={photoForm.image}
                        onChange={(e) => setPhotoForm(p => ({...p, image: e.target.value}))}
                        placeholder="https://..."
                        required
                      />
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="submit" className="admin-btn admin-btn-primary">
                    {editId ? 'Değişiklikleri Kaydet' : 'Ekle'}
                  </button>
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setView('list')}>
                    İptal Et
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="admin-modal-card confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🗑️ Öğeyi Sil?</h3>
            <p>Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Evet, Sil
              </button>
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-tab-btn {
          background: #1e212a;
          color: #94A3B8;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .admin-tab-btn.active {
          background: #007AFF;
          color: #FFF;
          border-color: #007AFF;
          box-shadow: 0 0 10px rgba(0, 122, 255, 0.4);
        }

        .items-table-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .item-admin-card {
          background: #121319;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          gap: 16px;
          padding: 12px;
          align-items: center;
        }

        .item-thumb-container {
          width: 80px;
          height: 80px;
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          background: #000;
          flex-shrink: 0;
        }

        .item-thumb-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-duration {
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: rgba(0,0,0,0.7);
          color: #FFF;
          font-size: 0.65rem;
          padding: 1px 3px;
          border-radius: 2px;
          font-weight: bold;
        }

        .item-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .item-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #FFF;
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          WebkitLineClamp: 2;
          WebkitBoxOrient: 'vertical';
          overflow: hidden;
        }

        .item-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .item-actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .form-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-item label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #94A3B8;
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

        .admin-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(9, 10, 13, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(5px);
        }

        .admin-modal-card {
          background: #16181E;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          width: 90%;
          max-width: 400px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          text-align: center;
        }

        .admin-modal-card h3 {
          margin-top: 0;
          color: #FFF;
        }

        .admin-modal-card p {
          color: #94A3B8;
          font-size: 0.9rem;
          line-height: 1.5;
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
      `}</style>
    </div>
  );
}

export default function ReelsAdminPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner"></div></div>}>
      <ReelsAdminContent />
    </Suspense>
  );
}
