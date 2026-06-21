import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileStickyBar from "../components/MobileStickyBar";
import Script from 'next/script';

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
  return (
    <html lang="tr">
      <head>
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        
        {/* Google Analytics GA4 Setup */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MOCKGA4ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MOCKGA4ID');
          `}
        </Script>
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <MobileStickyBar />
      </body>
    </html>
  );
}
