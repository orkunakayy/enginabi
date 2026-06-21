"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('Bir bağlantı veya sunucu hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-viewport">
      <div className="login-glass-card">
        <div className="login-logo-section">
          <svg className="login-brand-icon" viewBox="0 0 24 24">
            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
          </svg>
          <h2>EMİRA MOTORS</h2>
          <span>Yönetim Sistemi Girişi</span>
        </div>

        {error && <div className="login-error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="login-username">Kullanıcı Adı</label>
            <input
              type="text"
              id="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              autoComplete="username"
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="login-password">Şifre</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn-submit" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-viewport {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle at center, #16181E 0%, #090A0D 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          box-sizing: border-box;
          z-index: 9999;
        }

        .login-glass-card {
          width: 100%;
          max-width: 400px;
          background: rgba(22, 24, 30, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 40px 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 122, 255, 0.15);
          box-sizing: border-box;
        }

        .login-logo-section {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-brand-icon {
          width: 48px;
          height: 48px;
          fill: #007AFF;
          margin-bottom: 12px;
          filter: drop-shadow(0 0 8px rgba(0, 122, 255, 0.4));
        }

        .login-logo-section h2 {
          font-family: var(--font-headings), sans-serif;
          font-size: 1.35rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: #FFF;
          margin: 0 0 4px 0;
        }

        .login-logo-section span {
          font-size: 0.75rem;
          color: #94A3B8;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .login-error-box {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.15);
          padding: 12px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 500;
          margin-bottom: 24px;
          line-height: 1.4;
          text-align: center;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-form-group label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #94A3B8;
        }

        .login-form-group input {
          width: 100%;
          padding: 12px;
          background: rgba(9, 10, 13, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          color: #FFF;
          font-size: 0.95rem;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .login-form-group input:focus {
          outline: none;
          border-color: #007AFF;
          box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.15);
          background: #090A0D;
        }

        .login-btn-submit {
          width: 100%;
          padding: 14px;
          background: #007AFF;
          color: #FFF;
          border: none;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-btn-submit:hover {
          background: #0056B3;
          box-shadow: 0 0 15px rgba(0, 122, 255, 0.4);
        }

        .login-btn-submit:disabled {
          background: rgba(0, 122, 255, 0.5);
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #FFF;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
