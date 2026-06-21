"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MobileStickyBar() {
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleFocus = () => setIsVisible(false);
    const handleBlur = () => setIsVisible(true);

    // Watch all inputs, selects, and textareas
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="mobile-sticky-bar" id="mobile-sticky-bar">
      <a href="tel:02128790755" className="sticky-bar-btn sticky-bar-call">
        <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor' }}>
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
        Arayın
      </a>
      <a href="https://wa.me/902128790755" target="_blank" rel="noopener noreferrer" className="sticky-bar-btn sticky-bar-whatsapp">
        <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor' }}>
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.12 8.12 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.86-.38-4.12-1.11l-.3-.18-3.07.81.82-3.01-.2-.31a8.188 8.188 0 0 1-1.25-4.34c0-4.54 3.7-8.24 8.24-8.24h-.11z"/>
        </svg>
        WhatsApp
      </a>
    </div>
  );
}
