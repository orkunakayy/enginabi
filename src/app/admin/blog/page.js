"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function BlogAdminContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get('action'); // 'new'

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [editSlug, setEditSlug] = useState(null);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    category: 'Genel Tavsiyeler',
    brand: 'Genel',
    readTime: '5 dk okuma',
    image: '',
    youtubeId: '',
    contentHtml: ''
  });

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      if (!res.ok) throw new Error('Yazılar yüklenemedi.');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    if (initialAction === 'new') {
      handleNew();
    }
  }, [initialAction]);

  const handleNew = () => {
    setError('');
    setSuccess('');
    setEditSlug(null);
    setFormData({
      title: '',
      desc: '',
      category: 'Genel Tavsiyeler',
      brand: 'Genel',
      readTime: '5 okuma',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600',
      youtubeId: '',
      contentHtml: `<p class="text-muted mb-md">Giriş paragrafı buraya gelecek...</p>\n\n<h2 style="font-size: 1.5rem; color: #FFF; margin: var(--space-lg) 0 var(--space-sm)">Alt Başlık</h2>\n<p class="text-muted mb-md">Detaylı açıklama buraya...</p>\n\n<ul style="display: flex; flex-direction: column; gap: 8px; margin-bottom: var(--space-md); list-style: disc; padding-left: 20px; color: var(--text-secondary)">\n  <li>Madde 1</li>\n  <li>Madde 2</li>\n</ul>`
    });
    setView('form');
  };

  const handleEdit = (post) => {
    setError('');
    setSuccess('');
    setEditSlug(post.slug);
    setFormData({
      title: post.title || '',
      desc: post.desc || '',
      category: post.category || 'Genel Tavsiyeler',
      brand: post.brand || 'Genel',
      readTime: post.readTime || '5 dk okuma',
      image: post.image || '',
      youtubeId: post.youtubeId || '',
      contentHtml: post.contentHtml || ''
    });
    setView('form');
  };

  const handleDelete = async (slug) => {
    try {
      const res = await fetch(`/api/admin/blog?slug=${slug}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Yazı silinemedi.');
      
      setPosts(prev => prev.filter(p => p.slug !== slug));
      setDeleteConfirmSlug(null);
      setSuccess('Yazı başarıyla silindi.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const url = editSlug ? `/api/admin/blog?slug=${editSlug}` : '/api/admin/blog';
    const method = editSlug ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Yazı kaydedilemedi.');
      }

      setSuccess(editSlug ? 'Yazı başarıyla güncellendi!' : 'Yeni yazı başarıyla eklendi!');
      setView('list');
      fetchPosts();
    } catch (err) {
      setError(err.message);
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
          <h1>Blog & Usta Tavsiyeleri</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '0.88rem' }}>Müşterileri bilgilendirici, SEO destekli blog makaleleri ve video rehberler.</p>
        </div>
        {view === 'list' ? (
          <button className="admin-btn admin-btn-primary" onClick={handleNew}>
            + Yeni Yazı Ekle
          </button>
        ) : (
          <button className="admin-btn admin-btn-secondary" onClick={() => setView('list')}>
            Listeye Dön
          </button>
        )}
      </div>

      {success && <div className="success-banner mb-md">{success}</div>}
      {error && <div className="error-box mb-md">{error}</div>}

      {/* List View */}
      {view === 'list' && (
        <div className="admin-card">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
              Henüz yayınlanmış bir blog yazısı bulunmuyor.
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Görsel</th>
                    <th>Başlık & Özet</th>
                    <th>Kategori</th>
                    <th>Marka</th>
                    <th>Tarih</th>
                    <th style={{ textAlign: 'right' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.slug}>
                      <td>
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }} 
                        />
                      </td>
                      <td style={{ maxWidth: '350px' }}>
                        <div style={{ fontWeight: 600, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.desc}</div>
                      </td>
                      <td>{post.category}</td>
                      <td>
                        <span className="brand-tag">{post.brand}</span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{post.date}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => handleEdit(post)}>
                            Düzenle
                          </button>
                          <button className="admin-btn admin-btn-danger" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => setDeleteConfirmSlug(post.slug)}>
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
      )}

      {/* Form View */}
      {view === 'form' && (
        <div className="admin-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', color: '#FFF' }}>
            {editSlug ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı Ekle'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-grid">
              <div className="form-item">
                <label>Başlık *</label>
                <input 
                  type="text" 
                  name="title"
                  className="admin-input"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Vespa debriyaj balatası bakımı..."
                  required
                />
              </div>

              <div className="form-item">
                <label>Kısa Özet *</label>
                <input 
                  type="text" 
                  name="desc"
                  className="admin-input"
                  value={formData.desc}
                  onChange={handleInputChange}
                  placeholder="Yazı kartında ve Google arama sonuçlarında görünecek 150 karakterlik açıklama..."
                  required
                />
              </div>
            </div>

            <div className="form-grid-three">
              <div className="form-item">
                <label>Kategori</label>
                <select 
                  name="category"
                  className="admin-select"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Periyodik Bakım">Periyodik Bakım</option>
                  <option value="Vespa Bakımı">Vespa Bakımı</option>
                  <option value="Honda Arızaları">Honda Arızaları</option>
                  <option value="Yamaha Bakımı">Yamaha Bakımı</option>
                  <option value="Genel Tavsiyeler">Genel Tavsiyeler</option>
                </select>
              </div>

              <div className="form-item">
                <label>İlişkili Marka</label>
                <select 
                  name="brand"
                  className="admin-select"
                  value={formData.brand}
                  onChange={handleInputChange}
                >
                  <option value="Genel">Genel / Tümü</option>
                  <option value="Vespa">Vespa</option>
                  <option value="Honda">Honda</option>
                  <option value="Yamaha">Yamaha</option>
                  <option value="SYM">SYM</option>
                </select>
              </div>

              <div className="form-item">
                <label>Okuma Süresi (Etiket)</label>
                <input 
                  type="text" 
                  name="readTime"
                  className="admin-input"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  placeholder="Örn: 5 dk okuma"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-item">
                <label>Kapak Görseli URL</label>
                <input 
                  type="url" 
                  name="image"
                  className="admin-input"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-item">
                <label>YouTube Video ID (Vlog Entegrasyonu)</label>
                <input 
                  type="text" 
                  name="youtubeId"
                  className="admin-input"
                  value={formData.youtubeId}
                  onChange={handleInputChange}
                  placeholder="Örn: dQw4w9WgXcQ (Varsa)"
                />
              </div>
            </div>

            <div className="form-item">
              <label>Makale Detay İçeriği (HTML formatında yazınız) *</label>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.78rem', color: '#94A3B8' }}>
                Görsel şablonu korumak için <code>&lt;p class="text-muted mb-md"&gt;</code>, <code>&lt;h2 style="font-size: 1.5rem; color: #FFF; margin: var(--space-lg) 0 var(--space-sm)"&gt;</code> ve <code>&lt;ul style="..."&gt;</code> etiketlerini kullanabilirsiniz.
              </p>
              <textarea 
                name="contentHtml"
                className="admin-textarea"
                value={formData.contentHtml}
                onChange={handleInputChange}
                rows={12}
                placeholder="<p class='text-muted mb-md'>Makale detayları buraya gelecek...</p>"
                required
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button type="submit" className="admin-btn admin-btn-primary">
                {editSlug ? 'Güncellemeleri Kaydet' : 'Yazıyı Yayınla'}
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setView('list')}>
                İptal Et
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmSlug && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirmSlug(null)}>
          <div className="admin-modal-card confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🗑️ Makaleyi Sil?</h3>
            <p>Bu blog yazısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirmSlug)}>
                Evet, Sil
              </button>
              <button className="admin-btn admin-btn-secondary" onClick={() => setDeleteConfirmSlug(null)}>
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .form-grid-three {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
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

        .brand-tag {
          background: rgba(0, 122, 255, 0.1);
          color: #007AFF;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 600;
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

        /* Modals styling */
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

        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
          .form-grid-three {
            grid-template-columns: 1fr 1fr 1fr;
          }
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

export default function BlogAdminPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner"></div></div>}>
      <BlogAdminContent />
    </Suspense>
  );
}
