"use client";

import { useState, useEffect, Suspense, useRef } from 'react';
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

  // WP-Style visual editor states
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState('visual');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    category: '',
    brand: '',
    readTime: '5 dk okuma',
    image: '',
    youtubeId: '',
    contentHtml: ''
  });

  // Dynamic Categories & Brands States
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeMetaModal, setActiveMetaModal] = useState(null); // 'category' | 'brand' | null
  const [newMetaItem, setNewMetaItem] = useState('');

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

  const fetchMeta = async () => {
    try {
      const res = await fetch('/api/admin/blog/meta');
      if (!res.ok) throw new Error('Kategori ve marka listeleri yüklenemedi.');
      const data = await res.json();
      setCategories(data.categories || []);
      setBrands(data.brands || []);

      // Prepopulate dropdown values in form
      setFormData(prev => ({
        ...prev,
        category: prev.category || data.categories?.[0] || 'Genel Tavsiyeler',
        brand: prev.brand || data.brands?.[0] || 'Genel'
      }));
    } catch (err) {
      console.error("Meta loading error:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchMeta();
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

  // Extract YouTube video ID
  const extractYouTubeId = (urlOrId) => {
    if (!urlOrId) return '';
    if (urlOrId.length === 11 && !urlOrId.includes('/') && !urlOrId.includes('.')) {
      return urlOrId;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : urlOrId;
  };

  const handleYoutubeBlur = (e) => {
    const val = e.target.value;
    if (val) {
      const parsedId = extractYouTubeId(val);
      setFormData(prev => ({ ...prev, youtubeId: parsedId }));
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Dosya yüklenemedi.');
      
      setFormData(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      alert("Yükleme Hatası: " + err.message);
    }
  };

  // Save changes to Category or Brand list
  const handleMetaSave = async (updatedItems, type) => {
    const payload = {
      categories: type === 'category' ? updatedItems : categories,
      brands: type === 'brand' ? updatedItems : brands
    };

    try {
      const res = await fetch('/api/admin/blog/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Veriler kaydedilemedi.');

      setCategories(data.categories || []);
      setBrands(data.brands || []);

      // If current form value was deleted, set to first item
      if (type === 'category') {
        if (!data.categories.includes(formData.category)) {
          setFormData(prev => ({ ...prev, category: data.categories[0] || '' }));
        }
      } else {
        if (!data.brands.includes(formData.brand)) {
          setFormData(prev => ({ ...prev, brand: data.brands[0] || '' }));
        }
      }
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  // Editor Helpers
  const execCmd = (command, value = null) => {
    if (activeTab !== 'visual') return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, contentHtml: editorRef.current.innerHTML }));
    }
  };

  const addLink = () => {
    const url = prompt('Bağlantı adresi girin (URL):', 'https://');
    if (url) execCmd('createLink', url);
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    if (activeTab === 'visual' && editorRef.current) {
      setFormData(prev => ({ ...prev, contentHtml: editorRef.current.innerHTML }));
    }
    setActiveTab(tab);
  };

  const insertTemplate = (html) => {
    if (activeTab === 'visual') {
      if (editorRef.current) {
        editorRef.current.focus();
        document.execCommand('insertHTML', false, html);
        setFormData(prev => ({ ...prev, contentHtml: editorRef.current.innerHTML }));
      }
    } else {
      setFormData(prev => ({ ...prev, contentHtml: prev.contentHtml + '\n' + html }));
    }
  };

  // Sync state back to visual contentEditable when view changes or tab changes
  useEffect(() => {
    if (view === 'form' && activeTab === 'visual' && editorRef.current) {
      editorRef.current.innerHTML = formData.contentHtml;
    }
  }, [view, activeTab]);

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
        <form onSubmit={handleSubmit} className="blog-wp-container">
          {/* Main Content Area */}
          <div className="blog-wp-main">
            <div className="admin-card compact-header">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: 0 }}>
                {editSlug ? '📝 Yazıyı Düzenle' : '✨ Yeni Yazı Oluştur'}
              </h2>
            </div>

            {/* Huge WP-Style Title Input */}
            <div className="admin-card title-card">
              <label className="field-label-wp">Yazı Başlığı</label>
              <input 
                type="text" 
                name="title"
                className="wp-title-input"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Yazı başlığını buraya girin..."
                required
              />
            </div>

            {/* Visual WYSIWYG / HTML Composer */}
            <div className="admin-card editor-card">
              <div className="editor-tabs">
                <button 
                  type="button" 
                  className={`editor-tab-btn ${activeTab === 'visual' ? 'active' : ''}`}
                  onClick={() => handleTabChange('visual')}
                >
                  👁️ Görsel Düzenleyici
                </button>
                <button 
                  type="button" 
                  className={`editor-tab-btn ${activeTab === 'html' ? 'active' : ''}`}
                  onClick={() => handleTabChange('html')}
                >
                  💻 HTML Kod Görünümü
                </button>
              </div>

              {activeTab === 'visual' ? (
                <div className="wysiwyg-wrapper">
                  {/* Styling Actions Toolbar */}
                  <div className="editor-toolbar">
                    <button type="button" onClick={() => execCmd('bold')} title="Kalın (Bold)"><b>B</b></button>
                    <button type="button" onClick={() => execCmd('italic')} title="İtalik (Italic)"><i>I</i></button>
                    <button type="button" onClick={() => execCmd('underline')} title="Altı Çizili (Underline)"><u>U</u></button>
                    <div className="toolbar-separator"></div>
                    <button type="button" onClick={() => execCmd('formatBlock', '<h2>')} title="Alt Başlık (H2)">H2</button>
                    <button type="button" onClick={() => execCmd('formatBlock', '<h3>')} title="Küçük Başlık (H3)">H3</button>
                    <button type="button" onClick={() => execCmd('formatBlock', '<p>')} title="Paragraf">P</button>
                    <div className="toolbar-separator"></div>
                    <button type="button" onClick={() => execCmd('insertUnorderedList')} title="Madde İşaretli Liste">• Liste</button>
                    <button type="button" onClick={() => execCmd('insertOrderedList')} title="Numaralı Liste">1. Liste</button>
                    <button type="button" onClick={() => execCmd('formatBlock', '<blockquote>')} title="Alıntı (Blockquote)">“ Alıntı</button>
                    <div className="toolbar-separator"></div>
                    <button type="button" onClick={addLink} title="Bağlantı Ekle (Link)">🔗 Link</button>
                    <button type="button" onClick={() => execCmd('unlink')} title="Bağlantıyı Kaldır">✕</button>
                  </div>

                  {/* Quick block inserters */}
                  <div className="block-inserters">
                    <span className="inserter-label">Hızlı Şablon:</span>
                    <button 
                      type="button" 
                      className="btn-insert-block"
                      onClick={() => insertTemplate('<p class="text-muted mb-md">Açıklama paragrafını buraya yazın...</p>\n')}
                    >
                      + Paragraf
                    </button>
                    <button 
                      type="button" 
                      className="btn-insert-block"
                      onClick={() => insertTemplate('<h2 style="font-size: 1.5rem; color: #FFF; margin: var(--space-lg) 0 var(--space-sm)">Alt Başlık</h2>\n')}
                    >
                      + Alt Başlık (H2)
                    </button>
                    <button 
                      type="button" 
                      className="btn-insert-block"
                      onClick={() => insertTemplate('<ul style="display: flex; flex-direction: column; gap: 8px; margin-bottom: var(--space-md); list-style: disc; padding-left: 20px; color: var(--text-secondary)">\n  <li>Madde 1</li>\n  <li>Madde 2</li>\n</ul>\n')}
                    >
                      + Liste Bloğu
                    </button>
                    <button 
                      type="button" 
                      className="btn-insert-block"
                      onClick={() => insertTemplate('<div style="background: rgba(0,122,255,0.05); border-left: 4px solid #007AFF; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;"><h4 style="color:#FFF; margin:0 0 8px 0; font-weight:700;">🛠️ Usta Tavsiyesi</h4><p class="text-muted" style="margin:0;">Tavsiye detaylarını buraya yazın...</p></div>\n')}
                    >
                      + Usta Tavsiyesi
                    </button>
                  </div>

                  {/* ContentEditable Div */}
                  <div 
                    ref={editorRef}
                    contentEditable
                    className="wysiwyg-editor"
                    onInput={(e) => {
                      setFormData(prev => ({ ...prev, contentHtml: e.currentTarget.innerHTML }));
                    }}
                    placeholder="Yazı içeriğinizi görsel olarak oluşturun veya şablon butonlarını kullanın..."
                  />
                </div>
              ) : (
                <div className="html-editor-wrapper">
                  <textarea 
                    name="contentHtml"
                    className="admin-textarea html-textarea"
                    value={formData.contentHtml}
                    onChange={handleInputChange}
                    rows={18}
                    placeholder="HTML formatında yazı kodları..."
                    required
                  ></textarea>
                </div>
              )}
            </div>

            {/* Excerpt / Summary Card */}
            <div className="admin-card">
              <label className="field-label-wp">Kısa Özet & Meta Açıklaması *</label>
              <textarea 
                name="desc"
                className="admin-textarea"
                value={formData.desc}
                onChange={handleInputChange}
                rows={3}
                placeholder="Blog kartında ve arama sonuçlarında görünecek 150-160 karakterlik açıklayıcı özet yazın..."
                required
              ></textarea>
            </div>
          </div>

          {/* WordPress Sidebar Area */}
          <div className="blog-wp-sidebar">
            
            {/* Widget 1: Publish Details */}
            <div className="admin-card sidebar-widget">
              <h3 className="widget-title">⚙️ Yayınlama Ayarları</h3>
              <div className="widget-content">
                <div className="form-item mt-sm">
                  <label>Okuma Süresi Etiketi</label>
                  <input 
                    type="text" 
                    name="readTime"
                    className="admin-input"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    placeholder="Örn: 4 dk okuma"
                  />
                </div>

                <div className="publish-actions">
                  <button type="submit" className="admin-btn admin-btn-primary full-width">
                    {editSlug ? '💾 Güncellemeleri Kaydet' : '🚀 Yazıyı Yayınla'}
                  </button>
                  <button 
                    type="button" 
                    className="admin-btn admin-btn-secondary full-width" 
                    onClick={() => setView('list')}
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            </div>

            {/* Widget 2: Classification */}
            <div className="admin-card sidebar-widget">
              <h3 className="widget-title">📁 Kategorizasyon</h3>
              <div className="widget-content">
                <div className="form-item">
                  <label>Kategori</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select 
                      name="category"
                      className="admin-select"
                      value={formData.category}
                      onChange={handleInputChange}
                      style={{ flex: 1 }}
                    >
                      {categories.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                    <button 
                      type="button" 
                      onClick={() => setActiveMetaModal('category')}
                      className="admin-btn admin-btn-secondary" 
                      style={{ padding: '8px 12px' }}
                      title="Kategorileri Yönet"
                    >
                      ⚙️
                    </button>
                  </div>
                </div>

                <div className="form-item mt-md">
                  <label>İlişkili Marka</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select 
                      name="brand"
                      className="admin-select"
                      value={formData.brand}
                      onChange={handleInputChange}
                      style={{ flex: 1 }}
                    >
                      {brands.map((b, i) => (
                        <option key={i} value={b}>{b}</option>
                      ))}
                    </select>
                    <button 
                      type="button" 
                      onClick={() => setActiveMetaModal('brand')}
                      className="admin-btn admin-btn-secondary" 
                      style={{ padding: '8px 12px' }}
                      title="Markaları Yönet"
                    >
                      ⚙️
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 3: Media Integration */}
            <div className="admin-card sidebar-widget">
              <h3 className="widget-title">🖼️ Medya & Galeri</h3>
              <div className="widget-content">
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
                  <div style={{ marginTop: '8px' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      style={{ display: 'none' }} 
                      id="cover-file-upload" 
                    />
                    <label 
                      htmlFor="cover-file-upload" 
                      className="admin-btn admin-btn-secondary" 
                      style={{ cursor: 'pointer', display: 'inline-block', fontSize: '0.8rem', padding: '6px 12px', width: '100%', textAlign: 'center' }}
                    >
                      💻 Bilgisayardan Fotoğraf Yükle
                    </label>
                  </div>
                </div>

                {formData.image && (
                  <div className="image-preview-container">
                    <img 
                      src={formData.image} 
                      alt="Önizleme" 
                      className="image-preview-element" 
                    />
                    <span className="image-preview-badge">Kapak Görseli Önizleme</span>
                  </div>
                )}

                <div className="form-item mt-md">
                  <label>YouTube Video Linki veya ID'si</label>
                  <input 
                    type="text" 
                    name="youtubeId"
                    className="admin-input"
                    value={formData.youtubeId}
                    onChange={handleInputChange}
                    onBlur={handleYoutubeBlur}
                    placeholder="Örn: https://www.youtube.com/watch?v=... veya dQw4w9WgXcQ"
                  />
                  <span className="input-help">Tam video linki yapıştırırsanız ID otomatik çözümlenir.</span>
                </div>
              </div>
            </div>

          </div>
        </form>
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

      {/* Dynamic Classification Metadata Management Modal */}
      {activeMetaModal && (
        <div className="admin-modal-overlay" onClick={() => { setActiveMetaModal(null); setNewMetaItem(''); }}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
              {activeMetaModal === 'category' ? '📁 Kategorileri Yönet' : '🏷️ Markaları Yönet'}
            </h3>

            {/* List of current items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
              {(activeMetaModal === 'category' ? categories : brands).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.9rem', color: '#FFF' }}>{item}</span>
                  <button 
                    type="button" 
                    className="admin-btn admin-btn-danger" 
                    style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                    onClick={() => {
                      const list = activeMetaModal === 'category' ? categories : brands;
                      const filtered = list.filter((_, i) => i !== idx);
                      handleMetaSave(filtered, activeMetaModal);
                    }}
                  >
                    Sil
                  </button>
                </div>
              ))}
              {(activeMetaModal === 'category' ? categories : brands).length === 0 && (
                <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Listede henüz eleman bulunmuyor.</span>
              )}
            </div>

            {/* Add New Item */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                {activeMetaModal === 'category' ? 'Yeni Kategori Ekle' : 'Yeni Marka Ekle'}
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={newMetaItem}
                  onChange={(e) => setNewMetaItem(e.target.value)}
                  placeholder={activeMetaModal === 'category' ? 'Örn: Vespa Tamiri' : 'Örn: Piaggio'}
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    const trimmed = newMetaItem.trim();
                    if (!trimmed) return;
                    const list = activeMetaModal === 'category' ? categories : brands;
                    if (list.includes(trimmed)) {
                      alert('Bu eleman zaten listede mevcut.');
                      return;
                    }
                    handleMetaSave([...list, trimmed], activeMetaModal);
                    setNewMetaItem('');
                  }}
                >
                  Ekle
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', gap: '8px' }}>
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary" 
                onClick={() => { setActiveMetaModal(null); setNewMetaItem(''); }}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .blog-wp-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .blog-wp-main {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .blog-wp-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .compact-header {
          padding: 14px 20px !important;
        }

        .title-card {
          padding: 20px !important;
        }

        .field-label-wp {
          color: #64748B;
          font-weight: 700;
          font-size: 0.76rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 6px;
        }

        .wp-title-input {
          font-family: inherit;
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(255, 255, 255, 0.08);
          font-size: 1.6rem;
          font-weight: 700;
          color: #FFF;
          padding: 8px 0 12px 0;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .wp-title-input:focus {
          border-bottom-color: #007AFF;
        }

        /* Editor styling */
        .editor-card {
          padding: 20px !important;
        }

        .editor-tabs {
          display: flex;
          gap: 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }

        .editor-tab-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .editor-tab-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #FFF;
        }

        .editor-tab-btn.active {
          background: rgba(0, 122, 255, 0.12);
          color: #007AFF;
        }

        .wysiwyg-wrapper {
          display: flex;
          flex-direction: column;
        }

        .editor-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          background: #0D0E12;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 6px;
          margin-bottom: 10px;
        }

        .editor-toolbar button {
          background: transparent;
          border: none;
          color: #E2E8F0;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s ease;
        }

        .editor-toolbar button:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #FFF;
        }

        .toolbar-separator {
          width: 1px;
          height: 18px;
          background: rgba(255, 255, 255, 0.08);
          margin: 0 4px;
          align-self: center;
        }

        .block-inserters {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .inserter-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #64748B;
        }

        .btn-insert-block {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #E2E8F0;
          font-size: 0.74rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-insert-block:hover {
          background: rgba(0, 122, 255, 0.1);
          border-color: rgba(0, 122, 255, 0.2);
          color: #007AFF;
        }

        .wysiwyg-editor {
          min-height: 400px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          background: #090A0D;
          color: #E2E8F0;
          outline: none;
          font-size: 0.96rem;
          line-height: 1.6;
          overflow-y: auto;
          transition: border-color 0.2s ease;
        }

        .wysiwyg-editor:focus {
          border-color: #007AFF;
          box-shadow: 0 0 0 1px rgba(0, 122, 255, 0.15);
        }

        /* Live rendering inside editor workspace matches the site */
        .wysiwyg-editor h2 {
          font-size: 1.45rem;
          color: #FFF;
          margin: 24px 0 12px 0;
          font-weight: 700;
        }

        .wysiwyg-editor h3 {
          font-size: 1.2rem;
          color: #FFF;
          margin: 20px 0 10px 0;
          font-weight: 600;
        }

        .wysiwyg-editor p {
          color: #94A3B8;
          margin: 0 0 16px 0;
        }

        .wysiwyg-editor p.text-muted {
          color: #94A3B8;
        }

        .wysiwyg-editor ul {
          list-style: disc;
          padding-left: 20px;
          margin-bottom: 16px;
          color: #94A3B8;
        }

        .wysiwyg-editor ol {
          list-style: decimal;
          padding-left: 20px;
          margin-bottom: 16px;
          color: #94A3B8;
        }

        .wysiwyg-editor li {
          margin-bottom: 6px;
        }

        .wysiwyg-editor blockquote {
          border-left: 4px solid #007AFF;
          background: rgba(0, 122, 255, 0.04);
          padding: 12px 16px;
          margin: 16px 0;
          color: #E2E8F0;
          border-radius: 0 4px 4px 0;
        }

        .html-textarea {
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.88rem;
          line-height: 1.5;
          background: #090A0D !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          min-height: 480px;
        }

        /* Sidebar Widgets */
        .sidebar-widget {
          padding: 16px 20px !important;
        }

        .widget-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #FFF;
          margin: 0 0 14px 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 8px;
        }

        .widget-content {
          display: flex;
          flex-direction: column;
        }

        .publish-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 16px;
        }

        .full-width {
          width: 100%;
        }

        .image-preview-container {
          margin-top: 12px;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          overflow: hidden;
          aspect-ratio: 16 / 10;
        }

        .image-preview-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-preview-badge {
          position: absolute;
          bottom: 6px;
          left: 6px;
          font-size: 0.65rem;
          font-weight: 700;
          color: #FFF;
          background: rgba(0, 0, 0, 0.75);
          padding: 2px 6px;
          border-radius: 4px;
          backdrop-filter: blur(3px);
        }

        .input-help {
          font-size: 0.72rem;
          color: #64748B;
          margin-top: 4px;
        }

        /* Generic styles */
        .form-grid {
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
          font-size: 0.82rem;
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

        .mt-sm { margin-top: 6px; }
        .mt-md { margin-top: 12px; }

        @media (min-width: 992px) {
          .blog-wp-container {
            flex-direction: row;
            align-items: flex-start;
          }
          .blog-wp-main {
            flex: 2.8;
          }
          .blog-wp-sidebar {
            flex: 1.2;
            position: sticky;
            top: 20px;
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
