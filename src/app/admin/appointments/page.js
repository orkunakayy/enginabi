"use client";

import { useState, useEffect } from 'react';

export default function AppointmentsAdminPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, beklemede, onaylandi, tamamlandi
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/admin/appointments');
      if (!res.ok) {
        throw new Error('Randevular yüklenemedi.');
      }
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/appointments?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Durum güncellenemedi.');
      
      // Update state locally
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      if (activeAppointment && activeAppointment.id === id) {
        setActiveAppointment(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/appointments?id=${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Kayıt silinemedi.');
      
      setAppointments(prev => prev.filter(a => a.id !== id));
      setDeleteConfirmId(null);
      if (activeAppointment && activeAppointment.id === id) {
        setActiveAppointment(null);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Filter and search logic
  const filteredAppointments = appointments.filter(app => {
    const statusMatch = filterStatus === 'all' || 
                        (filterStatus === 'beklemede' && (app.status === 'beklemede' || !app.status)) ||
                        app.status === filterStatus;
                        
    const query = searchQuery.toLowerCase();
    const queryMatch = !query || 
                       app.clientName.toLowerCase().includes(query) ||
                       app.phone.toLowerCase().includes(query) ||
                       (app.email && app.email.toLowerCase().includes(query)) ||
                       app.message.toLowerCase().includes(query);
                       
    return statusMatch && queryMatch;
  });

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
          <h1>Randevu Talepleri</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '0.88rem' }}>Müşterilerin web sitesinden gönderdiği tüm servis ve onarım randevu talepleri.</p>
        </div>
      </div>

      {/* Filters and Search toolbar */}
      <div className="toolbar-row">
        <div className="filter-group">
          {['all', 'beklemede', 'onaylandi', 'tamamlandi'].map((status) => (
            <button 
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' && 'Tümü'}
              {status === 'beklemede' && 'Bekleyenler'}
              {status === 'onaylandi' && 'Onaylananlar'}
              {status === 'tamamlandi' && 'Tamamlananlar'}
            </button>
          ))}
        </div>

        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Müşteri adı, tel veya notlarda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input"
            style={{ maxWidth: '300px' }}
          />
        </div>
      </div>

      {/* Main Content Card */}
      <div className="admin-card">
        {error && (
          <div className="error-box mb-md">{error}</div>
        )}

        {filteredAppointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
            Arama kriterlerinize uygun randevu talebi bulunamadı.
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
                  <th style={{ textAlign: 'right' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#FFF' }}>{app.clientName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{app.email || 'E-posta girilmemiş'}</div>
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
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button 
                          className="admin-btn admin-btn-secondary" 
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          onClick={() => setActiveAppointment(app)}
                        >
                          Detaylar
                        </button>
                        
                        {(app.status === 'beklemede' || !app.status) && (
                          <button 
                            className="action-circle-btn confirm"
                            title="Onayla"
                            onClick={() => handleUpdateStatus(app.id, 'onaylandi')}
                          >
                            ✓
                          </button>
                        )}

                        {app.status === 'onaylandi' && (
                          <button 
                            className="action-circle-btn complete"
                            title="Tamamlandı Olarak İşaretle"
                            onClick={() => handleUpdateStatus(app.id, 'tamamlandi')}
                          >
                            ★
                          </button>
                        )}

                        {app.status === 'tamamlandi' && (
                          <button 
                            className="action-circle-btn revert"
                            title="Tekrar Beklemeye Al"
                            onClick={() => handleUpdateStatus(app.id, 'beklemede')}
                          >
                            ⟲
                          </button>
                        )}

                        <button 
                          className="action-circle-btn delete"
                          title="Sil"
                          onClick={() => setDeleteConfirmId(app.id)}
                        >
                          ✕
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

      {/* Appointment Detail Modal */}
      {activeAppointment && (
        <div className="admin-modal-overlay" onClick={() => setActiveAppointment(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Randevu Detayı</h3>
              <button className="modal-close-btn" onClick={() => setActiveAppointment(null)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Müşteri Adı:</span>
                <span className="detail-value">{activeAppointment.clientName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Telefon:</span>
                <span className="detail-value">{activeAppointment.phone}</span>
              </div>
              {activeAppointment.email && (
                <div className="detail-row">
                  <span className="detail-label">E-posta:</span>
                  <span className="detail-value">{activeAppointment.email}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Talep Türü:</span>
                <span className="detail-value" style={{ textTransform: 'capitalize' }}>{activeAppointment.requestType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Gönderim Tarihi:</span>
                <span className="detail-value">{new Date(activeAppointment.createdAt).toLocaleString('tr-TR')}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Durum:</span>
                <span className={`badge badge-${activeAppointment.status || 'pending'}`}>{activeAppointment.status}</span>
              </div>
              
              <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <span className="detail-label" style={{ display: 'block', marginBottom: '8px' }}>Müşteri Mesajı:</span>
                <div className="message-content-box">
                  {activeAppointment.message}
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
              {(activeAppointment.status === 'beklemede' || !activeAppointment.status) && (
                <button 
                  className="admin-btn admin-btn-primary"
                  onClick={() => handleUpdateStatus(activeAppointment.id, 'onaylandi')}
                >
                  Talebi Onayla
                </button>
              )}
              {activeAppointment.status === 'onaylandi' && (
                <button 
                  className="admin-btn admin-btn-primary"
                  onClick={() => handleUpdateStatus(activeAppointment.id, 'tamamlandi')}
                >
                  Tamamlandı Olarak İşaretle
                </button>
              )}
              <button 
                className="admin-btn admin-btn-danger"
                onClick={() => {
                  setDeleteConfirmId(activeAppointment.id);
                }}
              >
                Sil
              </button>
              <button className="admin-btn admin-btn-secondary" onClick={() => setActiveAppointment(null)}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="admin-modal-card confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🗑️ Randevu Silinsin mi?</h3>
            <p>Bu randevu kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
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
        .toolbar-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .filter-group {
          display: flex;
          background: #16181E;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 6px;
          padding: 3px;
        }

        .filter-btn {
          background: none;
          border: none;
          color: #94A3B8;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          color: #FFF;
        }

        .filter-btn.active {
          background: rgba(0, 122, 255, 0.15);
          color: #007AFF;
        }

        .search-wrapper {
          flex-grow: 1;
          display: flex;
          justify-content: flex-end;
        }

        .request-type-badge {
          background: rgba(255,255,255,0.05);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #E2E8F0;
        }

        .action-circle-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.8rem;
        }

        .action-circle-btn.confirm {
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
          border-color: rgba(16, 185, 129, 0.2);
        }

        .action-circle-btn.confirm:hover {
          background: #10B981;
          color: #FFF;
        }

        .action-circle-btn.complete {
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
          border-color: rgba(59, 130, 246, 0.2);
        }

        .action-circle-btn.complete:hover {
          background: #3B82F6;
          color: #FFF;
        }

        .action-circle-btn.revert {
          background: rgba(245, 158, 11, 0.1);
          color: #F59E0B;
          border-color: rgba(245, 158, 11, 0.2);
        }

        .action-circle-btn.revert:hover {
          background: #F59E0B;
          color: #FFF;
        }

        .action-circle-btn.delete {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border-color: rgba(239, 68, 68, 0.2);
        }

        .action-circle-btn.delete:hover {
          background: #EF4444;
          color: #FFF;
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
          max-width: 550px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .confirm-modal {
          max-width: 400px;
          text-align: center;
        }

        .confirm-modal h3 {
          margin-top: 0;
          color: #FFF;
        }

        .confirm-modal p {
          color: #94A3B8;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }

        .modal-header h3 {
          margin: 0;
          color: #FFF;
        }

        .modal-close-btn {
          background: none;
          border: none;
          color: #94A3B8;
          font-size: 1.1rem;
          cursor: pointer;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          font-size: 0.9rem;
        }

        .detail-label {
          color: #94A3B8;
          font-weight: 500;
        }

        .detail-value {
          color: #FFF;
          font-weight: 600;
        }

        .message-content-box {
          background: #090A0D;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 6px;
          padding: 16px;
          font-size: 0.92rem;
          color: #E2E8F0;
          line-height: 1.6;
          white-space: pre-wrap;
          max-height: 200px;
          overflow-y: auto;
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
