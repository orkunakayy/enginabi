"use client";

import { useState, useEffect } from 'react';

export default function CalculatorAdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('brands'); // 'brands' or 'levels'

  const [brands, setBrands] = useState({});
  const [levels, setLevels] = useState([]);

  // Modal / Add New Brand helper
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCoeff, setNewBrandCoeff] = useState('1.0');
  const [showAddBrand, setShowAddBrand] = useState(false);

  // Model specific pricing override helper
  const [editingModel, setEditingModel] = useState(null); // { brand, index, name, prices: {} }

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/calculator');
      if (!res.ok) throw new Error('Hesaplayıcı verisi yüklenemedi.');
      const data = await res.json();
      
      const normalizedBrands = {};
      for (const [brand, info] of Object.entries(data.brands || {})) {
        normalizedBrands[brand] = {
          basePriceCoeff: info.basePriceCoeff,
          models: (info.models || []).map(m => {
            if (typeof m === 'object' && m !== null) {
              return {
                name: m.name || '',
                prices: m.prices || {}
              };
            }
            return {
              name: String(m),
              prices: {}
            };
          })
        };
      }
      setBrands(normalizedBrands);
      setLevels(data.levels || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleCoeffChange = (brand, val) => {
    setBrands(prev => ({
      ...prev,
      [brand]: {
        ...prev[brand],
        basePriceCoeff: val
      }
    }));
  };

  const handleModelsChange = (brand, index, val) => {
    setBrands(prev => {
      const updatedModels = [...prev[brand].models];
      updatedModels[index] = {
        ...updatedModels[index],
        name: val
      };
      return {
        ...prev,
        [brand]: {
          ...prev[brand],
          models: updatedModels
        }
      };
    });
  };

  const handleAddModel = (brand) => {
    setBrands(prev => ({
      ...prev,
      [brand]: {
        ...prev[brand],
        models: [...prev[brand].models, { name: '', prices: {} }]
      }
    }));
  };

  const handleRemoveModel = (brand, index) => {
    setBrands(prev => ({
      ...prev,
      [brand]: {
        ...prev[brand],
        models: prev[brand].models.filter((_, idx) => idx !== index)
      }
    }));
  };

  const handleAddBrand = (e) => {
    e.preventDefault();
    setError('');
    const name = newBrandName.trim();
    if (!name) return;

    if (brands[name]) {
      setError('Bu marka zaten mevcut.');
      return;
    }

    const coeff = Number(newBrandCoeff);
    if (isNaN(coeff) || coeff <= 0) {
      setError('Geçersiz katsayı değeri.');
      return;
    }

    setBrands(prev => ({
      ...prev,
      [name]: {
        models: [],
        basePriceCoeff: coeff
      }
    }));

    setNewBrandName('');
    setNewBrandCoeff('1.0');
    setShowAddBrand(false);
  };

  const handleRemoveBrand = (brand) => {
    if (confirm(`${brand} markasını ve tüm ilişkili modellerini silmek istediğinize emin misiniz?`)) {
      setBrands(prev => {
        const copy = { ...prev };
        delete copy[brand];
        return copy;
      });
    }
  };

  // Levels handlers
  const handleLevelLabelChange = (index, val) => {
    setLevels(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        label: val
      };
      return copy;
    });
  };

  const handleBasePriceChange = (index, val) => {
    setLevels(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        priceBase: val
      };
      return copy;
    });
  };

  const handleLevelItemsChange = (index, text) => {
    setLevels(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        items: text.split('\n').filter(Boolean)
      };
      return copy;
    });
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    
    // Clean up empty models and format them properly
    const cleanedBrands = {};
    for (const [brand, info] of Object.entries(brands)) {
      cleanedBrands[brand] = {
        basePriceCoeff: Number(info.basePriceCoeff),
        models: info.models
          .map(m => {
            const name = String(m.name || '').trim();
            const prices = {};
            if (m.prices && typeof m.prices === 'object') {
              for (const [k, v] of Object.entries(m.prices)) {
                if (v !== undefined && v !== null && v !== '') {
                  const num = Number(v);
                  if (!isNaN(num) && num > 0) {
                    prices[k] = Math.round(num);
                  }
                }
              }
            }
            return { name, prices };
          })
          .filter(m => m.name)
      };
    }

    try {
      const res = await fetch('/api/admin/calculator', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brands: cleanedBrands, levels })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Yapılandırma kaydedilemedi.');
      }
      
      setSuccess('Hesaplayıcı yapılandırması başarıyla güncellendi!');
      fetchConfig();
    } catch (err) {
      setError(err.message);
    }
  };

  // Save specific model pricing overrides locally in state
  const handleSaveModelPrices = (brand, index, updatedPrices) => {
    setBrands(prev => {
      const updatedModels = [...prev[brand].models];
      updatedModels[index] = {
        ...updatedModels[index],
        prices: updatedPrices
      };
      return {
        ...prev,
        [brand]: {
          ...prev[brand],
          models: updatedModels
        }
      };
    });
    setEditingModel(null);
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
          <h1>Bakım Hesaplayıcı Ayarları</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '0.88rem' }}>Motosiklet marka katsayılarını, modelleri, bakım paketlerinin taban fiyatlarını ve işlem listelerini yönetin.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave}>
          ✓ Ayarları Kaydet
        </button>
      </div>

      {success && <div className="success-banner mb-md">{success}</div>}
      {error && <div className="error-box mb-md">{error}</div>}

      {/* Tabs */}
      <div className="tab-menu" style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px', gap: '8px' }}>
        <button 
          className={`tab-btn ${activeTab === 'brands' ? 'active' : ''}`}
          onClick={() => setActiveTab('brands')}
        >
          Markalar & Modeller
        </button>
        <button 
          className={`tab-btn ${activeTab === 'levels' ? 'active' : ''}`}
          onClick={() => setActiveTab('levels')}
        >
          Bakım Paketleri & İşlemler
        </button>
      </div>

      {/* Brands & Models Tab */}
      {activeTab === 'brands' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }} onClick={() => setShowAddBrand(true)}>
              + Yeni Marka Ekle
            </button>
          </div>

          <div className="brands-list-grid">
            {Object.entries(brands).map(([brand, info]) => (
              <div className="admin-card brand-card" key={brand}>
                <div className="brand-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, color: '#007AFF', fontSize: '1.15rem' }}>{brand}</h3>
                  <button className="admin-btn admin-btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => handleRemoveBrand(brand)}>
                    Markayı Sil
                  </button>
                </div>

                <div className="form-item" style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Fiyat Katsayısı</label>
                  <input 
                    type="number" 
                    step="0.05"
                    min="0.1"
                    max="5.0"
                    className="admin-input" 
                    value={info.basePriceCoeff}
                    onChange={(e) => handleCoeffChange(brand, e.target.value)}
                  />
                </div>

                <div className="models-section">
                  <label style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Modeller</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {info.models.map((model, idx) => {
                      const modelObj = typeof model === 'object' && model !== null ? model : { name: String(model), prices: {} };
                      const hasOverrides = modelObj.prices && Object.keys(modelObj.prices).filter(k => modelObj.prices[k] !== undefined && modelObj.prices[k] !== null && modelObj.prices[k] !== '').length > 0;
                      return (
                        <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input 
                            type="text" 
                            className="admin-input"
                            value={modelObj.name || ''}
                            onChange={(e) => handleModelsChange(brand, idx, e.target.value)}
                            placeholder="Model adı..."
                            style={{ flexGrow: 1 }}
                          />
                          {modelObj.name && (
                            <button
                              type="button"
                              className={`admin-btn ${hasOverrides ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                              style={{ padding: '6px 10px', fontSize: '0.72rem', whiteSpace: 'nowrap', minHeight: '34px', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => setEditingModel({ brand, index: idx, name: modelObj.name, prices: { ...modelObj.prices } })}
                            >
                              🏷️ {hasOverrides ? 'Özel Fiyat' : 'Fiyat Tanımla'}
                            </button>
                          )}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveModel(brand, idx)}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button className="admin-btn admin-btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem', padding: '6px 12px', marginTop: '12px' }} onClick={() => handleAddModel(brand)}>
                    + Model Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Levels & Items Tab */}
      {activeTab === 'levels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {levels.map((lvl, index) => (
            <div className="admin-card" key={lvl.key}>
              <h3 style={{ color: '#FFF', fontSize: '1.15rem', marginBottom: '16px' }}>{lvl.label}</h3>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-item">
                  <label style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>Paket Adı</label>
                  <input 
                    type="text" 
                    className="admin-input"
                    value={lvl.label}
                    onChange={(e) => handleLevelLabelChange(index, e.target.value)}
                    required
                  />
                </div>
                <div className="form-item">
                  <label style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>Taban Paket Fiyatı (TL)</label>
                  <input 
                    type="number" 
                    className="admin-input"
                    value={lvl.priceBase}
                    onChange={(e) => handleBasePriceChange(index, e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-item">
                <label style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Yapılacak Bakım İşlemleri (Satır Satır Yazınız)</label>
                <textarea 
                  className="admin-textarea"
                  rows={8}
                  value={lvl.items.join('\n')}
                  onChange={(e) => handleLevelItemsChange(index, e.target.value)}
                  placeholder="Her satıra tek bir işlem yazın..."
                  required
                ></textarea>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Brand Modal Popup */}
      {showAddBrand && (
        <div className="admin-modal-overlay" onClick={() => setShowAddBrand(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'left', maxWidth: '350px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#FFF' }}>Yeni Marka Ekle</h3>
            <form onSubmit={handleAddBrand} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-item">
                <label>Marka Adı *</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={newBrandName} 
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="Örn: Kymco"
                  required
                />
              </div>

              <div className="form-item">
                <label>Katsayı *</label>
                <input 
                  type="number" 
                  step="0.05"
                  className="admin-input" 
                  value={newBrandCoeff} 
                  onChange={(e) => setNewBrandCoeff(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Ekle
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowAddBrand(false)}>
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Model Specific Prices Modal */}
      {editingModel && (
        <div className="admin-modal-overlay" onClick={() => setEditingModel(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'left', maxWidth: '450px' }}>
            <h3 style={{ margin: '0 0 4px 0', color: '#FFF' }}>{editingModel.name} için Özel Fiyat Tanımla</h3>
            <p style={{ margin: '0 0 20px 0', color: '#94A3B8', fontSize: '0.82rem' }}>
              {editingModel.brand} katsayısı ({brands[editingModel.brand]?.basePriceCoeff || 1.0}) yerine kullanılacak sabit TL fiyatlarını giriniz.
              Boş bırakılan paketler marka katsayısı ile hesaplanır.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {levels.map((lvl) => {
                const baseVal = lvl.priceBase;
                const coeff = brands[editingModel.brand]?.basePriceCoeff || 1.0;
                const standardPrice = Math.round((baseVal * coeff) / 50) * 50;

                return (
                  <div key={lvl.key} style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '16px', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFF', fontSize: '0.88rem' }}>{lvl.label.split('(')[0]}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Varsayılan: {standardPrice} TL</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        placeholder="Standart"
                        className="admin-input"
                        style={{ textAlign: 'right', padding: '6px' }}
                        value={editingModel.prices[lvl.key] !== undefined && editingModel.prices[lvl.key] !== null ? editingModel.prices[lvl.key] : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingModel(prev => ({
                            ...prev,
                            prices: {
                              ...prev.prices,
                              [lvl.key]: val !== '' ? Number(val) : ''
                            }
                          }));
                        }}
                      />
                      <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>TL</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <button 
                type="button" 
                className="admin-btn admin-btn-primary"
                onClick={() => handleSaveModelPrices(editingModel.brand, editingModel.index, editingModel.prices)}
              >
                Uygula
              </button>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setEditingModel(null)}>
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .tab-btn {
          background: none;
          border: none;
          color: #94A3B8;
          padding: 12px 20px;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
        }

        .tab-btn:hover {
          color: #FFF;
        }

        .tab-btn.active {
          color: #007AFF;
          border-bottom-color: #007AFF;
        }

        .brands-list-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .brands-list-grid {
            grid-template-columns: 1fr 1fr;
          }
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
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
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
