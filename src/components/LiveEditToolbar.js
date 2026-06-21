"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { checkAdminClient } from '../lib/auth-client';

export default function LiveEditToolbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditParam = searchParams.get('edit') === 'true';

  const [isAdmin, setIsAdmin] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Check if user is admin using client cache
    checkAdminClient().then(setIsAdmin);

    // Listen to changes from LiveEditable items
    const handleDirty = () => {
      setIsDirty(true);
    };

    window.addEventListener('live-edit-dirty', handleDirty);
    return () => {
      window.removeEventListener('live-edit-dirty', handleDirty);
    };
  }, []);

  useEffect(() => {
    if (isAdmin && isEditParam) {
      document.body.classList.add('live-edit-active');

      const handleLinkClick = (e) => {
        // If clicked on an editable element or overlay button, prevent default navigation
        if (e.target.closest('.live-editable-element') || e.target.closest('.live-edit-overlay-btn')) {
          e.preventDefault();
          return;
        }

        const anchor = e.target.closest('a');
        if (anchor && anchor.href && anchor.host === window.location.host) {
          const url = new URL(anchor.href);
          
          // Force edit=true on all internal navigation links clicked in edit mode
          if (!url.pathname.startsWith('/admin') && !url.pathname.startsWith('/api')) {
            e.preventDefault();
            url.searchParams.set('edit', 'true');
            if (window.liveEditChanges && Object.keys(window.liveEditChanges).length > 0) {
              if (!confirm('Kaydedilmemiş değişiklikleriniz var. Başka sayfaya geçerseniz kaybolacak. Devam etmek istiyor musunuz?')) {
                return;
              }
            }
            window.liveEditChanges = {};
            window.location.href = url.pathname + url.search + url.hash;
          }
        }
      };

      document.addEventListener('click', handleLinkClick, true);
      return () => {
        document.body.classList.remove('live-edit-active');
        document.removeEventListener('click', handleLinkClick, true);
      };
    } else {
      document.body.classList.remove('live-edit-active');
    }
  }, [isAdmin, isEditParam]);

  if (!isAdmin || !isEditParam) {
    return null;
  }

  const handleSave = async () => {
    const changes = window.liveEditChanges;
    if (!changes || Object.keys(changes).length === 0) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/live-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: changes })
      });

      if (res.ok) {
        window.liveEditChanges = {};
        setIsDirty(false);
        // Refresh the page
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Değişiklikler kaydedilemedi.');
      }
    } catch (err) {
      alert('Ağ hatası oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (!confirm('Kaydedilmemiş değişiklikleriniz var. Çıkmak istediğinize emin misiniz?')) {
        return;
      }
    }
    window.liveEditChanges = {};
    // Remove query param and navigate back to normal page
    const url = new URL(window.location.href);
    url.searchParams.delete('edit');
    router.push(url.pathname);
  };

  return (
    <div className="live-editor-bar">
      <div className="live-editor-container">
        <div className="live-editor-left">
          <span className="pulse-indicator"></span>
          <span className="live-editor-title">CANLI DÜZENLEME MODU</span>
        </div>
        <div className="live-editor-right">
          <button 
            className={`live-editor-btn save-btn ${isDirty ? 'active' : ''}`}
            disabled={!isDirty || saving}
            onClick={handleSave}
          >
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
          <button 
            className="live-editor-btn cancel-btn"
            onClick={handleCancel}
            disabled={saving}
          >
            Düzenlemeyi Kapat
          </button>
        </div>
      </div>

      <style jsx>{`
        .live-editor-bar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 60px;
          background: #16181E;
          border-bottom: 2px solid #007AFF;
          box-shadow: 0 4px 20px rgba(0, 122, 255, 0.25);
          z-index: 99999;
          display: flex;
          align-items: center;
          font-family: var(--font-headings), sans-serif;
          box-sizing: border-box;
        }

        .live-editor-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .live-editor-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pulse-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 10px #10B981;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .live-editor-title {
          color: #FFF;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .live-editor-right {
          display: flex;
          gap: 12px;
        }

        .live-editor-btn {
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .save-btn {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: not-allowed;
        }

        .save-btn.active {
          background: #007AFF;
          color: #FFF;
          border-color: #007AFF;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 122, 255, 0.4);
        }

        .save-btn.active:hover {
          background: #0056B3;
        }

        .cancel-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .cancel-btn:hover {
          background: #EF4444;
          color: #FFF;
        }
      `}</style>
      <style jsx global>{`
        body.live-edit-active {
          margin-top: 60px !important;
        }
        body.live-edit-active .header {
          top: 60px !important;
        }
        body.live-edit-active .hero-slider-container {
          margin-top: 0 !important;
        }
      `}</style>
    </div>
  );
}
