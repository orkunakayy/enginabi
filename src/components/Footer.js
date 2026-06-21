"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LiveEditable from './LiveEditable';
import { useLiveContent } from '../hooks/useLiveContent';

export default function Footer() {
  const pathname = usePathname();
  const { get } = useLiveContent();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <LiveEditable path="global.footer.brandTitle" tagName="h3">
            {get('global.footer.brandTitle', 'EMİRA MOTORS')}
          </LiveEditable>
          <LiveEditable path="global.footer.brandDesc" tagName="p">
            {get('global.footer.brandDesc', '15 yılı aşkın süredir motor sektöründe biriktirdiğimiz tecrübemiz ve şeffaf çalışma prensiplerimizle tüm motosikletlerinize dükkanımızda servis hizmeti sunmaktayız.')}
          </LiveEditable>
          <div className="footer-socials">
            <LiveEditable path="global.footer.socialFacebook" tagName="a" href={get('global.footer.socialFacebook', '#')} aria-label="Facebook">
              <svg className="footer-social-icon" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79z"/></svg>
            </LiveEditable>
            <LiveEditable path="global.footer.socialInstagram" tagName="a" href={get('global.footer.socialInstagram', '#')} aria-label="Instagram">
              <svg className="footer-social-icon" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </LiveEditable>
            <LiveEditable path="global.footer.socialYoutube" tagName="a" href={get('global.footer.socialYoutube', '#')} aria-label="Youtube">
              <svg className="footer-social-icon" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </LiveEditable>
          </div>
        </div>
        
        <div>
          <LiveEditable path="global.footer.pagesTitle" tagName="h4" className="footer-links-title">
            {get('global.footer.pagesTitle', 'Sayfalar')}
          </LiveEditable>
          <ul className="footer-links-list">
            <li>
              <LiveEditable path="global.footer.menuHome" linkPath="global.footer.pagesUrls.home" tagName={Link} href={get('global.footer.pagesUrls.home', '/')}>
                {get('global.footer.menuHome', 'Anasayfa')}
              </LiveEditable>
            </li>
            <li>
              <LiveEditable path="global.footer.menuServices" linkPath="global.footer.pagesUrls.services" tagName={Link} href={get('global.footer.pagesUrls.services', '/hizmetler')}>
                {get('global.footer.menuServices', 'Hizmetler')}
              </LiveEditable>
            </li>
            <li>
              <LiveEditable path="global.footer.menuInsurance" linkPath="global.footer.pagesUrls.insurance" tagName={Link} href={get('global.footer.pagesUrls.insurance', '/sigorta-hasar')}>
                {get('global.footer.menuInsurance', 'Sigorta Hasar')}
              </LiveEditable>
            </li>
            <li>
              <LiveEditable path="global.footer.menuFleet" linkPath="global.footer.pagesUrls.fleet" tagName={Link} href={get('global.footer.pagesUrls.fleet', '/kurumsal-filo')}>
                {get('global.footer.menuFleet', 'Filo Çözümleri')}
              </LiveEditable>
            </li>
            <li>
              <LiveEditable path="global.footer.menuGallery" linkPath="global.footer.pagesUrls.gallery" tagName={Link} href={get('global.footer.pagesUrls.gallery', '/galeri')}>
                {get('global.footer.menuGallery', 'Yapılan İşler')}
              </LiveEditable>
            </li>
            <li>
              <LiveEditable path="global.footer.menuAbout" linkPath="global.footer.pagesUrls.about" tagName={Link} href={get('global.footer.pagesUrls.about', '/hakkimizda')}>
                {get('global.footer.menuAbout', 'Hakkımızda')}
              </LiveEditable>
            </li>
            <li>
              <LiveEditable path="global.footer.menuContact" linkPath="global.footer.pagesUrls.contact" tagName={Link} href={get('global.footer.pagesUrls.contact', '/iletisim')}>
                {get('global.footer.menuContact', 'İletişim')}
              </LiveEditable>
            </li>
          </ul>
        </div>

        <div>
          <LiveEditable path="global.footer.contactTitle" tagName="h4" className="footer-links-title">
            {get('global.footer.contactTitle', 'İletişim')}
          </LiveEditable>
          <ul className="footer-links-list" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <LiveEditable path="global.footer.telLabel" tagName="strong" style={{ display: 'inline', color: '#FFF' }}>
                {get('global.footer.telLabel', 'Tel:')}
              </LiveEditable>
              {' '}
              <LiveEditable path="global.footer.telVal" tagName="span" style={{ display: 'inline' }}>
                {get('global.footer.telVal', '(0212) 879 07 55')}
              </LiveEditable>
            </li>
            <li>
              <LiveEditable path="global.footer.emailLabel" tagName="strong" style={{ display: 'inline', color: '#FFF' }}>
                {get('global.footer.emailLabel', 'E-posta:')}
              </LiveEditable>
              {' '}
              <LiveEditable path="global.footer.emailVal" tagName="span" style={{ display: 'inline' }}>
                {get('global.footer.emailVal', 'servis@emiramotors.com')}
              </LiveEditable>
            </li>
            <li>
              <LiveEditable path="global.footer.addressLabel" tagName="strong" style={{ display: 'inline', color: '#FFF' }}>
                {get('global.footer.addressLabel', 'Adres:')}
              </LiveEditable>
              {' '}
              <LiveEditable path="global.footer.addressVal" tagName="span" style={{ display: 'inline' }}>
                {get('global.footer.addressVal', 'Beylikdüzü / İstanbul')}
              </LiveEditable>
            </li>
            <li>
              <LiveEditable path="global.footer.hoursLabel" tagName="strong" style={{ display: 'inline', color: '#FFF' }}>
                {get('global.footer.hoursLabel', 'Çalışma Saatleri:')}
              </LiveEditable>
              {' '}
              <LiveEditable path="global.footer.hoursVal" tagName="span" style={{ display: 'inline' }}>
                {get('global.footer.hoursVal', 'Pzt - Cmt: 09:00 - 19:30')}
              </LiveEditable>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container footer-bottom">
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} <LiveEditable path="global.footer.copyright" tagName="span" style={{ display: 'inline' }}>{get('global.footer.copyright', 'Emira Motors. Tüm Hakları Saklıdır.')}</LiveEditable>
        </div>
        <LiveEditable path="global.footer.author" tagName="div" className="footer-copy">
          {get('global.footer.author', 'Engin Usta Güvencesiyle')}
        </LiveEditable>
      </div>
    </footer>
  );
}
