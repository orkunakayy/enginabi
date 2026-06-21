"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LiveEditable from './LiveEditable';
import { useLiveContent } from '../hooks/useLiveContent';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { get } = useLiveContent();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav when page changes
  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  };

  // Helper to determine if link is active.
  // Deals with sub-routes (e.g. /hizmetler/periyodik-bakim should highlight /hizmetler)
  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const logoImg = get('global.header.logoImg', '');

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <LiveEditable 
            linkPath="global.header.logoUrl"
            tagName="link" 
            href={get('global.header.logoUrl', '/')} 
            className="logo-link"
          >
            <span className="logo-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {logoImg ? (
                <LiveEditable path="global.header.logoImg" type="image" tagName="span" className="logo-image-container" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <img src={logoImg} alt="Logo" className="logo-image" />
                </LiveEditable>
              ) : (
                <LiveEditable path="global.header.logoImg" type="image" tagName="span" className="logo-svg-container" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg className="logo-icon" viewBox="0 0 24 24" style={{ display: 'inline' }}>
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                  </svg>
                </LiveEditable>
              )}
            </span>
          </LiveEditable>
          <nav className="nav-menu">
            <LiveEditable 
              path="global.header.menu.home" 
              linkPath="global.header.menuUrls.home" 
              tagName={Link} 
              href={get('global.header.menuUrls.home', '/')} 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              {get('global.header.menu.home', 'Anasayfa')}
            </LiveEditable>
            <div className="nav-item-dropdown">
              <span className={`nav-link dropdown-trigger ${isActive('/hakkimizda') || isActive('/iletisim') || isActive('/blog') ? 'active' : ''}`}>
                <LiveEditable path="global.header.menu.corporate" tagName="span" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {get('global.header.menu.corporate', 'Kurumsal')}
                </LiveEditable>
                <svg className="dropdown-arrow" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M7 10l5 5 5-5H7z"/>
                </svg>
              </span>
              <div className="dropdown-menu">
                <LiveEditable 
                  path="global.header.menu.about" 
                  linkPath="global.header.menuUrls.about" 
                  tagName={Link} 
                  href={get('global.header.menuUrls.about', '/hakkimizda')} 
                  className="dropdown-link"
                >
                  {get('global.header.menu.about', 'Hakkımızda')}
                </LiveEditable>
                <LiveEditable 
                  path="global.header.menu.team" 
                  linkPath="global.header.menuUrls.team" 
                  tagName={Link} 
                  href={get('global.header.menuUrls.team', '/hakkimizda#ekibimiz')} 
                  className="dropdown-link"
                >
                  {get('global.header.menu.team', 'Ekibimiz')}
                </LiveEditable>
                <LiveEditable 
                  path="global.header.menu.blog" 
                  linkPath="global.header.menuUrls.blog" 
                  tagName={Link} 
                  href={get('global.header.menuUrls.blog', '/blog')} 
                  className="dropdown-link"
                >
                  {get('global.header.menu.blog', 'Usta Tavsiyeleri')}
                </LiveEditable>
                <LiveEditable 
                  path="global.header.menu.contact" 
                  linkPath="global.header.menuUrls.contact" 
                  tagName={Link} 
                  href={get('global.header.menuUrls.contact', '/iletisim')} 
                  className="dropdown-link"
                >
                  {get('global.header.menu.contact', 'İletişim')}
                </LiveEditable>
              </div>
            </div>
            <LiveEditable 
              path="global.header.menu.services" 
              linkPath="global.header.menuUrls.services" 
              tagName={Link} 
              href={get('global.header.menuUrls.services', '/hizmetler')} 
              className={`nav-link ${isActive('/hizmetler') ? 'active' : ''}`}
            >
              {get('global.header.menu.services', 'Hizmetler')}
            </LiveEditable>
            <LiveEditable 
              path="global.header.menu.calculator" 
              linkPath="global.header.menuUrls.calculator" 
              tagName={Link} 
              href={get('global.header.menuUrls.calculator', '/bakim-hesaplayici')} 
              className={`nav-link ${isActive('/bakim-hesaplayici') ? 'active' : ''}`}
            >
              {get('global.header.menu.calculator', 'Fiyat Hesaplayıcı')}
            </LiveEditable>
            <LiveEditable 
              path="global.header.menu.insurance" 
              linkPath="global.header.menuUrls.insurance" 
              tagName={Link} 
              href={get('global.header.menuUrls.insurance', '/sigorta-hasar')} 
              className={`nav-link ${isActive('/sigorta-hasar') ? 'active' : ''}`}
            >
              {get('global.header.menu.insurance', 'Sigorta Hasar')}
            </LiveEditable>
            <LiveEditable 
              path="global.header.menu.fleet" 
              linkPath="global.header.menuUrls.fleet" 
              tagName={Link} 
              href={get('global.header.menuUrls.fleet', '/kurumsal-filo')} 
              className={`nav-link ${isActive('/kurumsal-filo') ? 'active' : ''}`}
            >
              {get('global.header.menu.fleet', 'Filo Çözümleri')}
            </LiveEditable>
            <LiveEditable 
              path="global.header.menu.gallery" 
              linkPath="global.header.menuUrls.gallery" 
              tagName={Link} 
              href={get('global.header.menuUrls.gallery', '/galeri')} 
              className={`nav-link ${isActive('/galeri') ? 'active' : ''}`}
            >
              {get('global.header.menu.gallery', 'Yapılan İşler')}
            </LiveEditable>
          </nav>
          <div className="nav-cta">
            <LiveEditable 
              path="global.header.menu.appointmentBtn" 
              linkPath="global.header.menuUrls.appointmentBtn" 
              tagName={Link} 
              href={get('global.header.menuUrls.appointmentBtn', '/iletisim')} 
              className="btn btn-primary btn-sm"
            >
              {get('global.header.menu.appointmentBtn', 'Randevu Al')}
            </LiveEditable>
          </div>
          <div className={`mobile-nav-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      {/* MOBILE MENU PANEL */}
      <div className={`mobile-menu-panel ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-links">
          <Link href="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>Anasayfa</Link>
          
          <div className="mobile-nav-group">
            <span className="mobile-nav-group-title">Kurumsal</span>
            <div className="mobile-nav-group-links">
              <Link href="/hakkimizda" className={`mobile-nav-sub-link ${isActive('/hakkimizda') && !pathname.endsWith('#ekibimiz') ? 'active' : ''}`}>Hakkımızda</Link>
              <Link href="/hakkimizda#ekibimiz" className={`mobile-nav-sub-link ${pathname.endsWith('#ekibimiz') ? 'active' : ''}`}>Ekibimiz</Link>
              <Link href="/blog" className={`mobile-nav-sub-link ${isActive('/blog') ? 'active' : ''}`}>Usta Tavsiyeleri</Link>
              <Link href="/iletisim" className={`mobile-nav-sub-link ${isActive('/iletisim') ? 'active' : ''}`}>İletişim</Link>
            </div>
          </div>

          <Link href="/hizmetler" className={`mobile-nav-link ${isActive('/hizmetler') ? 'active' : ''}`}>Hizmetler</Link>
          <Link href="/bakim-hesaplayici" className={`mobile-nav-link ${isActive('/bakim-hesaplayici') ? 'active' : ''}`}>Fiyat Hesaplayıcı</Link>
          <Link href="/sigorta-hasar" className={`mobile-nav-link ${isActive('/sigorta-hasar') ? 'active' : ''}`}>Sigorta Hasar</Link>
          <Link href="/kurumsal-filo" className={`mobile-nav-link ${isActive('/kurumsal-filo') ? 'active' : ''}`}>Filo Çözümleri</Link>
          <Link href="/galeri" className={`mobile-nav-link ${isActive('/galeri') ? 'active' : ''}`}>Yapılan İşler</Link>
          <Link href="/iletisim" className="btn btn-accent mt-md w-full">Hemen Randevu Al</Link>
        </div>
      </div>
    </>
  );
}
