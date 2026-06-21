"use client";

import { useState, useEffect } from 'react';
import { checkAdminClient } from '../lib/auth-client';

export default function LiveListControls({ onAdd, onDelete, addLabel = "Yeni Ekle", className = "", style = {} }) {
  const [isEditParam, setIsEditParam] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin using client cache
    checkAdminClient().then(setIsAdmin);

    const params = new URLSearchParams(window.location.search);
    setIsEditParam(params.get('edit') === 'true');
  }, []);

  const isEditMode = isAdmin && isEditParam;

  if (!isEditMode) return null;

  return (
    <div className={`live-list-controls ${className}`} style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', margin: '4px 0', ...style }}>
      {onAdd && (
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(); }} 
          className="live-list-btn add-btn"
        >
          ➕ {addLabel}
        </button>
      )}
      {onDelete && (
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} 
          className="live-list-btn delete-btn"
          title="Bu öğeyi sil"
        >
          🗑️ Sil
        </button>
      )}

      <style jsx>{`
        .live-list-btn {
          border: none;
          border-radius: 4px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }
        .add-btn {
          background: #007AFF;
          color: #FFF;
        }
        .add-btn:hover {
          background: #0056B3;
          transform: translateY(-1px);
        }
        .delete-btn {
          background: #EF4444;
          color: #FFF;
        }
        .delete-btn:hover {
          background: #C53030;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
