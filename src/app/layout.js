import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileStickyBar from "../components/MobileStickyBar";
import Script from 'next/script';
import { readDB } from "../lib/db";

export const metadata = {
  title: "Emira Motors | Engin Usta Motosiklet Bakım Onarım Servisi",
  description: "Engin Usta güvencesiyle Honda, Yamaha, Vespa ve tüm markalarda periyodik bakım, ağır onarım, elektrik arızaları ve sigorta hasar işlemleri. Kurumsal filo çözümleri.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "MotorcycleRepair",
  "name": "Emira Motors",
  "alternateName": ["Engin Usta Motosiklet Servisi", "Emira Motors Motor Tamir ve Bakım"],
  "image": "https://emiramotors.com/images/workshop.jpg",
  "logo": "https://emiramotors.com/images/logo.png",
  "@id": "https://emiramotors.com",
  "url": "https://emiramotors.com",
  "telephone": "+905331301448",
  "priceRange": "$$",
  "hasMap": "https://maps.google.com/?q=Emira+Motors+Beylikduzu",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+90-212-879-0755",
    "contactType": "customer service",
    "areaServed": "TR",
    "availableLanguage": ["Turkish"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Yakuplu, Mohaç Cd No 1",
    "addressLocality": "Beylikdüzü",
    "addressRegion": "İstanbul",
    "postalCode": "34000",
    "addressCountry": "TR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 40.98848258531463,
    "longitude": 28.676023024978864
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "15:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "00:00",
      "closes": "00:00"
    }
  ],
  "sameAs": [
    "https://www.instagram.com/emiramotors",
    "https://www.youtube.com/@emiramotors"
  ]
};

export default function RootLayout({ children }) {
  const db = readDB();
  const integrations = db.integrations || {};

  return (
    <html lang="tr">
      <head>
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        
        {/* Google Search Console Verification */}
        {integrations.googleSearchConsoleId && (
          <meta name="google-site-verification" content={integrations.googleSearchConsoleId} />
        )}
        
        {/* Bing Webmaster Verification */}
        {integrations.bingWebmasterId && (
          <meta name="msvalidate.01" content={integrations.bingWebmasterId} />
        )}

        {/* Google Analytics Setup */}
        {integrations.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${integrations.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${integrations.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity Setup */}
        {integrations.clarityId && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script","${integrations.clarityId}");
            `}
          </Script>
        )}

        {/* Facebook Pixel Setup */}
        {integrations.facebookPixelId && (
          <>
            <Script id="facebook-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${integrations.facebookPixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img 
                height="1" 
                width="1" 
                style={{ display: 'none' }} 
                src={`https://www.facebook.com/tr?id=${integrations.facebookPixelId}&ev=PageView&noscript=1`} 
              />
            </noscript>
          </>
        )}

        {/* Custom Header Scripts */}
        {integrations.customHeaderScripts && (
          <style dangerouslySetInnerHTML={{ __html: '</' + 'style>' + integrations.customHeaderScripts + '<style>' }} />
        )}
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <MobileStickyBar />

        {/* Custom Footer/Body Scripts */}
        {integrations.customFooterScripts && (
          <div dangerouslySetInnerHTML={{ __html: integrations.customFooterScripts }} />
        )}
      </body>
    </html>
  );
}
