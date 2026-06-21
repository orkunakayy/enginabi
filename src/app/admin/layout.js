"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  // Check if we need to show password change overlay
  useEffect(() => {
    if (pathname !== '/admin/login') {
      fetch('/api/admin/verify')
        .then(res => res.json())
        .then(data => {
          if (data.mustChangePassword) {
            setMustChangePassword(true);
          }
        })
        .catch(err => console.error("Error checking password status:", err));
    }
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <div className="admin-login-layout">{children}</div>;
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { label: 'Genel Bakış', path: '/admin', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { label: 'Randevular', path: '/admin/appointments', icon: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' },
    { label: 'Blog Yönetimi', path: '/admin/blog', icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
    { label: 'Fiyat Katsayıları', path: '/admin/calculator', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-3-9h-2V8h2v2zm0 3h-2v-2h2v2zm0 3h-2v-2h2v2zm-3-6H8V8h2v2zm0 3H8v-2h2v2zm0 3H8v-2h2v2z' },
    { label: 'Reels Videos', path: '/admin/reels', icon: 'M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-11 9V9l6 3-6 3z' }
  ];

  return (
    <div className="admin-dashboard-wrapper">
      {/* Top Mobile Bar */}
      <header className="admin-mobile-header">
        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d={isSidebarOpen ? "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" : "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"} />
          </svg>
        </button>
        <span className="admin-mobile-logo">EMİRA MOTORS PANEL</span>
      </header>

      {/* Sidebar Panel */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <svg viewBox="0 0 24 24" className="brand-logo-icon">
            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
          </svg>
          <div className="brand-text-wrapper">
            <h3>EMİRA MOTORS</h3>
            <span>Admin Paneli</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, idx) => {
            const active = pathname === item.path;
            return (
              <Link 
                href={item.path} 
                key={idx}
                className={`sidebar-nav-link ${active ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg viewBox="0 0 24 24" className="nav-icon" fill="currentColor">
                  <path d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" className="logout-icon" fill="currentColor">
              <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
            </svg>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-viewport">
        <div className="admin-content-inner">
          {children}
        </div>
      </main>

      {/* Mandatory Password Change Overlay Modal */}
      {mustChangePassword && (
        <PasswordChangeModal onClose={() => setMustChangePassword(false)} />
      )}

      {/* Custom styles just for Admin panel */}
      <style jsx global>{`
        body {
          background-color: #090A0D !important;
          color: #F8FAFC !important;
        }

        .admin-dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #090A0D;
        }

        .admin-mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 60px;
          background: #16181E;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          padding: 0 16px;
          z-index: 1001;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          color: #FFF;
          cursor: pointer;
          margin-right: 16px;
          display: flex;
          align-items: center;
        }

        .admin-mobile-logo {
          font-family: var(--font-headings), sans-serif;
          font-weight: 800;
          font-size: 0.95rem;
          color: #007AFF;
          letter-spacing: 0.05em;
        }

        .admin-sidebar {
          width: 260px;
          background: #121319;
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        .sidebar-brand {
          padding: 24px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .brand-logo-icon {
          width: 32px;
          height: 32px;
          fill: #007AFF;
        }

        .brand-text-wrapper h3 {
          font-size: 1rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          margin: 0;
          color: #FFF;
        }

        .brand-text-wrapper span {
          font-size: 0.72rem;
          color: #007AFF;
          text-transform: uppercase;
          font-weight: 700;
        }

        .sidebar-nav {
          padding: 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }

        .sidebar-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #94A3B8;
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 500;
          border-radius: 6px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .sidebar-nav-link:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #FFF;
        }

        .sidebar-nav-link.active {
          background: rgba(0, 122, 255, 0.12);
          color: #007AFF;
          font-weight: 600;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .btn-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 10px;
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-logout:hover {
          background: #EF4444;
          color: #FFF;
        }

        .logout-icon {
          width: 18px;
          height: 18px;
        }

        .admin-main-viewport {
          flex-grow: 1;
          padding-left: 0;
          margin-top: 60px;
          min-width: 0; /* fixes flexbox grid layouts */
        }

        .admin-content-inner {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Responsive Breakpoints */
        @media (min-width: 1024px) {
          .admin-mobile-header {
            display: none;
          }
          .admin-sidebar {
            transform: translateX(0) !important;
          }
          .admin-main-viewport {
            padding-left: 260px;
            margin-top: 0;
          }
          .admin-content-inner {
            padding: 40px;
          }
        }

        @media (max-width: 1023px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
        }

        /* Shared Dashboard Tables & UI Elements styling */
        .admin-card {
          background: #16181E;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .admin-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .admin-title-row h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #FFF;
          margin: 0;
        }

        .admin-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          font-size: 0.88rem;
          font-weight: 600;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .admin-btn-primary {
          background: #007AFF;
          color: #FFF;
        }

        .admin-btn-primary:hover {
          background: #0056B3;
          box-shadow: 0 0 12px rgba(0, 122, 255, 0.3);
        }

        .admin-btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #94A3B8;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .admin-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #FFF;
        }

        .admin-btn-danger {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }

        .admin-btn-danger:hover {
          background: #EF4444;
          color: #FFF;
        }

        .admin-table-container {
          overflow-x: auto;
          margin-top: 16px;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }

        .admin-table th {
          background: rgba(255,255,255,0.02);
          color: #94A3B8;
          font-weight: 600;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .admin-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: #E2E8F0;
          vertical-align: middle;
        }

        .admin-table tr:hover td {
          background: rgba(255,255,255,0.01);
        }

        .badge {
          display: inline-block;
          padding: 4px 8px;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .badge-pending {
          background: rgba(245, 158, 11, 0.15);
          color: #F59E0B;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .badge-approved {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .badge-completed {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .admin-input, .admin-select, .admin-textarea {
          width: 100%;
          padding: 10px 12px;
          background: #090A0D;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          color: #FFF;
          font-size: 0.9rem;
          transition: border-color 0.2s ease;
        }

        .admin-input:focus, .admin-select:focus, .admin-textarea:focus {
          outline: none;
          border-color: #007AFF;
          box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.15);
        }
      `}</style>
    </div>
  );
}

// Inline Sub-component: Mandatory Change Password Modal
function PasswordChangeModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Yeni şifre en az 8 karakter olmalıdır.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Şifre değiştirilemedi.');
      } else {
        onClose(); // Close the modal on success
      }
    } catch (err) {
      setError('Bir sunucu hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-pass-overlay">
      <div className="change-pass-modal">
        <h3>🔐 Şifre Değiştirme Gerekli</h3>
        <p className="modal-desc">Sisteme ilk kez giriş yaptınız veya şifreniz varsayılan değerde. Güvenliğiniz için lütfen yeni bir şifre belirleyin.</p>
        
        {error && <div className="modal-error-box">{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-item">
            <label>Mevcut Şifre</label>
            <input 
              type="password" 
              className="admin-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-item">
            <label>Yeni Şifre</label>
            <input 
              type="password" 
              className="admin-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="En az 8 karakter"
              required 
            />
          </div>

          <div className="form-item">
            <label>Yeni Şifre (Tekrar)</label>
            <input 
              type="password" 
              className="admin-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="admin-btn admin-btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle ve Devam Et'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .change-pass-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(9, 10, 13, 0.96);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          backdrop-filter: blur(8px);
        }

        .change-pass-modal {
          background: #16181E;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 32px;
          width: 90%;
          max-width: 420px;
          box-shadow: 0 0 24px rgba(0, 122, 255, 0.15);
        }

        .change-pass-modal h3 {
          margin: 0 0 10px 0;
          font-size: 1.25rem;
          color: #FFF;
          font-weight: 800;
        }

        .modal-desc {
          font-size: 0.85rem;
          color: #94A3B8;
          line-height: 1.5;
          margin-bottom: 20px;
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

        .modal-error-box {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.15);
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 500;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}
