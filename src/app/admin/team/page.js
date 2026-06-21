"use client";

import { useState, useEffect } from 'react';

export default function TeamAdminPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    desc: '',
    img: ''
  });

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/admin/team');
      if (!res.ok) throw new Error('Ekip listesi yüklenemedi.');
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
      
      setFormData(prev => ({ ...prev, img: data.url }));
    } catch (err) {
      alert("Yükleme Hatası: " + err.message);
    }
  };

  const handleNew = () => {
    setError('');
    setSuccess('');
    setEditingId(null);
    setFormData({
      name: '',
      role: '',
      desc: '',
      img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
    });
    setView('form');
  };

  const handleEdit = (member) => {
    setError('');
    setSuccess('');
    setEditingId(member.id);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      desc: member.desc || '',
      img: member.img || ''
    });
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu ekip üyesini silmek istediğinize emin misiniz?')) return;

    const updated = members.filter(m => m.id !== id);
    await saveTeamList(updated, 'Üye silindi.');
  };

  const saveTeamList = async (updatedList, successMsg) => {
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members: updatedList })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ekip güncellenemedi.');

      setMembers(data.members || []);
      setSuccess(successMsg);
      setView('list');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      setError('Ad Soyad ve Görev alanları zorunludur.');
      return;
    }

    let updatedList;
    if (editingId) {
      // Update
      updatedList = members.map(m => m.id === editingId ? { ...m, ...formData } : m);
    } else {
      // Create
      const newMember = {
        id: Date.now().toString(),
        ...formData
      };
      updatedList = [...members, newMember];
    }

    await saveTeamList(updatedList, editingId ? 'Ekip üyesi başarıyla güncellendi!' : 'Yeni ekip üyesi başarıyla eklendi!');
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
          <h1>Ekip & Kadro Yönetimi</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '0.88rem' }}>
            Hakkımızda sayfasında listelenen uzman kadroyu ve dükkan ustalarını yönetin.
          </p>
        </div>
        {view === 'list' ? (
          <button className="admin-btn admin-btn-primary" onClick={handleNew}>
            + Yeni Üye Ekle
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
          {members.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
              Ekipte henüz kimse bulunmuyor.
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Profil</th>
                    <th>Ad Soyad</th>
                    <th>Görev / Rol</th>
                    <th>Açıklama</th>
                    <th style={{ textAlign: 'right' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <img 
                          src={member.img} 
                          alt={member.name} 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }} 
                        />
                      </td>
                      <td style={{ fontWeight: 600, color: '#FFF' }}>{member.name}</td>
                      <td>
                        <span className="role-tag">{member.role}</span>
                      </td>
                      <td style={{ maxWidth: '300px', fontSize: '0.85rem', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {member.desc}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => handleEdit(member)}>
                            Düzenle
                          </button>
                          <button className="admin-btn admin-btn-danger" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => handleDelete(member.id)}>
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
        <div className="admin-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', color: '#FFF' }}>
            {editingId ? 'Ekip Üyesini Düzenle' : 'Yeni Ekip Üyesi Ekle'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-item">
              <label>Adı Soyadı *</label>
              <input 
                type="text" 
                name="name"
                className="admin-input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Örn: Engin Usta"
                required
              />
            </div>

            <div className="form-item">
              <label>Görevi / Ünvanı *</label>
              <input 
                type="text" 
                name="role"
                className="admin-input"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Örn: Kurucu & Baş Mekanisyen"
                required
              />
            </div>

            <div className="form-item">
              <label>Kısa Biyografi / Açıklama</label>
              <textarea 
                name="desc"
                className="admin-textarea"
                value={formData.desc}
                onChange={handleInputChange}
                rows={4}
                placeholder="Ustanın tecrübesi, uzmanlık alanları ve biyografisi..."
              ></textarea>
            </div>

            <div className="form-item">
              <label>Profil Resmi URL veya Dosya Yükleme</label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #007AFF', flexShrink: 0 }}>
                  <img src={formData.img} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input 
                    type="url" 
                    name="img"
                    className="admin-input"
                    value={formData.img}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      style={{ display: 'none' }} 
                      id="profile-file-upload" 
                    />
                    <label 
                      htmlFor="profile-file-upload" 
                      className="admin-btn admin-btn-secondary" 
                      style={{ cursor: 'pointer', display: 'inline-block', fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      💻 Bilgisayardan Profil Resmi Seç
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button type="submit" className="admin-btn admin-btn-primary">
                {editingId ? 'Güncellemeleri Kaydet' : 'Ekibe Ekle'}
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setView('list')}>
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
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

        .role-tag {
          background: rgba(0, 122, 255, 0.1);
          color: #007AFF;
          padding: 2px 8px;
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
