"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import LiveEditable from '../components/LiveEditable';
import LiveEditToolbar from '../components/LiveEditToolbar';
import LiveListControls from '../components/LiveListControls';
import { useLiveContent } from '../hooks/useLiveContent';
import { checkAdminClient } from '../lib/auth-client';

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1400",
    badgeIcon: (
      <svg style={{ width: '14px', height: '14px', fill: 'currentColor' }} viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
    badgeText: "Engin Usta Güvencesi",
    title: "Motosikletiniz İçin Profesyonel Bakım & Onarım",
    desc: "Honda, Yamaha, Vespa ve tüm markalarda 15 yılı aşkın uzmanlık. Dükkanımızda kaliteli yedek parça ve garantili işçilikle hizmetinizdeyiz.",
    cta1Text: "Hizmetleri İncele",
    cta1Href: "/hizmetler",
    cta2Text: "Randevu Al",
    cta2Href: "/iletisim"
  },
  {
    image: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&q=80&w=1400",
    badgeIcon: (
      <svg style={{ width: '14px', height: '14px', fill: 'currentColor' }} viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 12c-2.7 0-5.8-1.28-6-2v-1c0-1.66 2-3 6-3s6 1.34 6 3v1c-.2.72-3.3 2-6 2z" />
      </svg>
    ),
    badgeText: "%100 Güvenli Süreç",
    title: "Sigorta ve Kasko Kapsamında Hasar Onarımı",
    desc: "Ekspertiz sürecinden teslimata kadar tüm hasar onarım işlemlerinizi koordine ediyoruz. Onay sonrasında cebinizden hiçbir ek ücret çıkmaz.",
    cta1Text: "Hasar Sürecini Gör",
    cta1Href: "/sigorta-hasar",
    cta2Text: "Biz Sizi Arayalım",
    cta2Href: "/iletisim"
  },
  {
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1400",
    badgeIcon: (
      <svg style={{ width: '14px', height: '14px', fill: 'currentColor' }} viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    badgeText: "B2B Kurumsal Çözümler",
    title: "Kurye ve Motosiklet Filoları İçin Hızlı Çözümler",
    desc: "İşinizin durmaması için öncelikli hızlı servis, toplu periyodik bakım anlaşmaları ve CRM km takip sistemleriyle iş ortağınız oluyoruz.",
    cta1Text: "Kurumsal Filo Çözümleri",
    cta1Href: "/kurumsal-filo",
    cta2Text: "Teklif Al",
    cta2Href: "/kurumsal-filo#B2Bform"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tel: '',
    type: 'periyodik-bakim',
    message: ''
  });
  
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsStats, setReviewsStats] = useState({ rating: 4.9, count: 147 });
  const [isEditMode, setIsEditMode] = useState(false);
  const [insuranceBrands, setInsuranceBrands] = useState([]);

  const { get, loading } = useLiveContent();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasEdit = params.get('edit') === 'true';
    if (hasEdit) {
      checkAdminClient().then(isAdmin => {
        if (isAdmin) setIsEditMode(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      const items = get('homepage.insurance_brands', ["Allianz", "Axa Sigorta", "Anadolu Sig.", "Sompo Sig.", "Mapfre", "Quick Sig."]);
      setInsuranceBrands(items);
    }
  }, [loading]);

  const handleAddBrand = () => {
    const updated = [...insuranceBrands, "Yeni Marka"];
    setInsuranceBrands(updated);
    window.liveEditChanges = window.liveEditChanges || {};
    window.liveEditChanges['homepage.insurance_brands'] = updated;
    window.dispatchEvent(new CustomEvent('live-edit-dirty'));
  };

  const handleDeleteBrand = (idx) => {
    const updated = insuranceBrands.filter((_, i) => i !== idx);
    setInsuranceBrands(updated);
    window.liveEditChanges = window.liveEditChanges || {};
    window.liveEditChanges['homepage.insurance_brands'] = updated;
    window.dispatchEvent(new CustomEvent('live-edit-dirty'));
  };

  const heroSlides = SLIDES.map((staticSlide, idx) => {
    return {
      ...staticSlide,
      badgeText: get(`homepage.hero.slides.${idx}.badgeText`, staticSlide.badgeText),
      title: get(`homepage.hero.slides.${idx}.title`, staticSlide.title),
      desc: get(`homepage.hero.slides.${idx}.desc`, staticSlide.desc),
      cta1Text: get(`homepage.hero.slides.${idx}.cta1Text`, staticSlide.cta1Text),
      cta2Text: get(`homepage.hero.slides.${idx}.cta2Text`, staticSlide.cta2Text),
    };
  });

  const calcBanner = {
    title: get('homepage.calculator_banner.title', "Online Fiyat Hesaplayıcı ile Bütçeni Planla"),
    desc: get('homepage.calculator_banner.desc', "Motosikletinin marka, model ve kilometresini seç, yapılacak işlemleri gör ve tahmini maliyet aralığını şeffaf bir şekilde öğren."),
    btnText: get('homepage.calculator_banner.btnText', "Hemen Fiyat Hesapla"),
    btnHref: get('homepage.calculator_banner.btnHref', "/bakim-hesaplayici")
  };

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          if (data.reviews) {
            setReviews(data.reviews);
            setReviewsStats({
              rating: data.rating,
              count: data.user_ratings_total
            });
          }
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    }
    fetchReviews();
  }, []);
  
  const timerRef = useRef(null);

  const startSliderTimer = () => {
    if (isEditMode) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 5000);
  };

  useEffect(() => {
    if (isEditMode) {
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      startSliderTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isEditMode]);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
    startSliderTimer();
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    startSliderTimer();
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    startSliderTimer();
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Map id to state key: client-name -> name, etc.
    const key = id.replace('client-', '').replace('request-', '');
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Touch Swipe Support for Mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.name,
          phone: formData.tel,
          requestType: formData.type,
          message: formData.message
        })
      });
      if (res.ok) {
        setFormSubmitted(true);
      } else {
        const data = await res.json();
        alert(data.error || 'Randevu talebi gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      alert('Bir ağ hatası oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <LiveEditToolbar />
      </Suspense>

      {/* HERO SLIDER SECTION */}
      <section 
        className="hero-slider-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="hero-slider" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide, idx) => (
            <div 
              key={idx} 
              className="hero-slide" 
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              <div className="container">
                <div className="slide-content">
                  <div className="slide-badge">
                    {slide.badgeIcon}
                    <LiveEditable path={`homepage.hero.slides.${idx}.badgeText`} tagName="span" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      {slide.badgeText}
                    </LiveEditable>
                  </div>
                  <LiveEditable path={`homepage.hero.slides.${idx}.title`} tagName="h1" className="slide-title">
                    {slide.title}
                  </LiveEditable>
                  <LiveEditable path={`homepage.hero.slides.${idx}.desc`} tagName="p" className="slide-desc">
                    {slide.desc}
                  </LiveEditable>
                  <div className="slide-ctas">
                    <Link href={slide.cta1Href} className="btn btn-accent">
                      <LiveEditable path={`homepage.hero.slides.${idx}.cta1Text`} tagName="span">
                        {slide.cta1Text}
                      </LiveEditable>
                    </Link>
                    <Link href={slide.cta2Href} className="btn btn-secondary">
                      <LiveEditable path={`homepage.hero.slides.${idx}.cta2Text`} tagName="span">
                        {slide.cta2Text}
                      </LiveEditable>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Arrows */}
        <div className="slider-arrow slider-arrow-prev" onClick={handlePrevSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </div>
        <div className="slider-arrow slider-arrow-next" onClick={handleNextSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </div>

        {/* Slider Dots */}
        <div className="slider-dots">
          {heroSlides.map((_, idx) => (
            <button 
              key={idx}
              className={`slider-dot ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => handleDotClick(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* QUICK ACTION CARDS */}
      <section className="container" style={{ position: 'relative' }}>
        <div className="hero-cta-cards">
          {/* B2C CTA CARD */}
          <div className="hero-cta-card">
            <svg className="hero-cta-card-icon" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            <div className="hero-cta-card-content">
              <LiveEditable path="homepage.quick_cards.b2c_title" tagName="h3">
                {get("homepage.quick_cards.b2c_title", "Bireysel Bakım Randevusu")}
              </LiveEditable>
              <LiveEditable path="homepage.quick_cards.b2c_desc" tagName="p">
                {get("homepage.quick_cards.b2c_desc", "Motosikletinizi dükkanımıza getirin, randevulu sistemle beklemeden profesyonel usta hizmeti alın.")}
              </LiveEditable>
              <Link href="/iletisim" className="hero-cta-card-link">
                <LiveEditable path="homepage.quick_cards.b2c_link_text" tagName="span" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {get("homepage.quick_cards.b2c_link_text", "Randevu Oluştur")}
                </LiveEditable>
                <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', fill: 'currentColor' }}><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
              </Link>
            </div>
          </div>

          {/* B2B CTA CARD */}
          <div className="hero-cta-card">
            <svg className="hero-cta-card-icon" viewBox="0 0 24 24">
              <path d="M12 7V3H2v18h20V7H12zm-6 12H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm8 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2z"/>
            </svg>
            <div className="hero-cta-card-content">
              <LiveEditable path="homepage.quick_cards.b2b_title" tagName="h3">
                {get("homepage.quick_cards.b2b_title", "Kurumsal Filo Çözümleri")}
              </LiveEditable>
              <LiveEditable path="homepage.quick_cards.b2b_desc" tagName="p">
                {get("homepage.quick_cards.b2b_desc", "Kurye firmaları ve şirket motorları için toplu sözleşmeler, CRM km takibi ve öncelikli hızlı onarım garantisi.")}
              </LiveEditable>
              <Link href="/kurumsal-filo" className="hero-cta-card-link">
                <LiveEditable path="homepage.quick_cards.b2b_link_text" tagName="span" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {get("homepage.quick_cards.b2b_link_text", "Kurumsal Paketleri İncele")}
                </LiveEditable>
                <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', fill: 'currentColor' }}><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK INFO BAR */}
      <section className="info-bar mt-xl">
        <div className="container info-bar-grid">
          <div className="info-item">
            <svg className="info-icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <div>
              <span className="font-bold">
                <LiveEditable path="homepage.info_bar.location_label" tagName="span" style={{ display: 'inline' }}>
                  {get("homepage.info_bar.location_label", "Konum:")}
                </LiveEditable>
              </span>
              {' '}
              <LiveEditable path="homepage.info_bar.location_val" tagName="span" style={{ display: 'inline' }}>
                {get("homepage.info_bar.location_val", "Beylikdüzü / İSTANBUL")}
              </LiveEditable>
            </div>
          </div>
          <div className="info-item">
            <svg className="info-icon" viewBox="0 0 24 24"><path d="M22 5.72l-4.14-4.14c-.39-.39-1.02-.39-1.41 0L1.72 16.31c-.39.39-.39 1.02 0 1.41l4.14 4.14c.39.39 1.02.39 1.41 0L22 7.13c.39-.39.39-1.02 0-1.41zm-15.5 14L2.83 16l3-3 3.67 3.67-3 3z"/></svg>
            <div>
              <span className="font-bold">
                <LiveEditable path="homepage.info_bar.hours_label" tagName="span" style={{ display: 'inline' }}>
                  {get("homepage.info_bar.hours_label", "Çalışma Saatleri:")}
                </LiveEditable>
              </span>
              {' '}
              <LiveEditable path="homepage.info_bar.hours_val" tagName="span" style={{ display: 'inline' }}>
                {get("homepage.info_bar.hours_val", "Pzt - Cmt: 09:00 - 19:30")}
              </LiveEditable>
            </div>
          </div>
          <div className="info-item">
            <svg className="info-icon" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.57c-2.83-1.44-5.15-3.75-6.59-6.59l1.57-1.57c.27-.27.35-.65.24-1-.36-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
            <div>
              <span className="font-bold">
                <LiveEditable path="homepage.info_bar.phone_label" tagName="span" style={{ display: 'inline' }}>
                  {get("homepage.info_bar.phone_label", "Telefon:")}
                </LiveEditable>
              </span>
              {' '}
              <LiveEditable path="homepage.info_bar.phone_val" tagName="span" style={{ display: 'inline' }}>
                {get("homepage.info_bar.phone_val", "(0212) 879 07 55")}
              </LiveEditable>
            </div>
          </div>
        </div>
      </section>

      {/* PRICE CALCULATOR PROMO SECTION */}
      <section className="section-padding" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="calculator-promo-grid">
            <div>
              <LiveEditable path="homepage.calculator_banner.badgeText" tagName="span" className="promo-badge" style={{ display: 'inline-block' }}>
                {get("homepage.calculator_banner.badgeText", "ONLINE ARAÇ")}
              </LiveEditable>
              <LiveEditable path="homepage.calculator_banner.title" tagName="h2" style={{ fontSize: '2.5rem', marginTop: 'var(--space-xs)', fontFamily: 'var(--font-headings)' }}>
                {calcBanner.title}
              </LiveEditable>
              <LiveEditable path="homepage.calculator_banner.desc" tagName="p" className="text-secondary mt-md" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                {calcBanner.desc}
              </LiveEditable>
              <div className="mt-lg">
                <Link href={calcBanner.btnHref} className="btn btn-primary">
                  <LiveEditable path="homepage.calculator_banner.btnText" tagName="span" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    {calcBanner.btnText}
                  </LiveEditable>
                  <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                </Link>
              </div>
            </div>
            
            <div className="promo-card-mock">
              <div className="promo-mock-header">
                <LiveEditable path="homepage.calculator_promo.mock_title" tagName="span" className="promo-mock-title">
                  {get("homepage.calculator_promo.mock_title", "Yamaha NMAX 125/155")}
                </LiveEditable>
                <LiveEditable path="homepage.calculator_promo.mock_status" tagName="span" className="promo-mock-status">
                  {get("homepage.calculator_promo.mock_status", "Hafif Bakım")}
                </LiveEditable>
              </div>
              <div className="promo-mock-list">
                <div className="promo-mock-item">
                  <LiveEditable path="homepage.calculator_promo.item1_label" tagName="span">
                    {get("homepage.calculator_promo.item1_label", "• Buji ve Hava Filtresi Değişimi")}
                  </LiveEditable>
                  <LiveEditable path="homepage.calculator_promo.item1_status" tagName="span" style={{ color: 'var(--color-secondary)' }}>
                    {get("homepage.calculator_promo.item1_status", "Dahil")}
                  </LiveEditable>
                </div>
                <div className="promo-mock-item">
                  <LiveEditable path="homepage.calculator_promo.item2_label" tagName="span">
                    {get("homepage.calculator_promo.item2_label", "• Motor ve Şanzıman Yağı Değişimi")}
                  </LiveEditable>
                  <LiveEditable path="homepage.calculator_promo.item2_status" tagName="span" style={{ color: 'var(--color-secondary)' }}>
                    {get("homepage.calculator_promo.item2_status", "Dahil")}
                  </LiveEditable>
                </div>
                <div className="promo-mock-item">
                  <LiveEditable path="homepage.calculator_promo.item3_label" tagName="span">
                    {get("homepage.calculator_promo.item3_label", "• Varyatör Filtresi Temizliği & Kontrol")}
                  </LiveEditable>
                  <LiveEditable path="homepage.calculator_promo.item3_status" tagName="span" style={{ color: 'var(--color-secondary)' }}>
                    {get("homepage.calculator_promo.item3_status", "Dahil")}
                  </LiveEditable>
                </div>
              </div>
              <div className="promo-mock-footer">
                <LiveEditable path="homepage.calculator_promo.mock_price" tagName="span" className="promo-mock-price">
                  {get("homepage.calculator_promo.mock_price", "1.495 TL - 1.835 TL")}
                </LiveEditable>
                <LiveEditable path="homepage.calculator_promo.mock_note" tagName="span" className="promo-mock-note">
                  {get("homepage.calculator_promo.mock_note", "*Orijinal Parça, İşçilik Dahil")}
                </LiveEditable>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW SECTION */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-xl">
            <LiveEditable path="homepage.services_overview.title" tagName="h2" style={{ fontSize: '2.25rem' }}>
              {get("homepage.services_overview.title", "Hizmetlerimiz")}
            </LiveEditable>
            <LiveEditable path="homepage.services_overview.desc" tagName="p" className="text-muted mt-sm" style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              {get("homepage.services_overview.desc", "Motosikletinizin ömrünü uzatmak ve sürüş güvenliğinizi sağlamak için geniş hizmet yelpazemizle yanınızdayız.")}
            </LiveEditable>
          </div>

          <div className="card-grid">
            {/* Service 1: Periyodik Bakim */}
            <Link href="/hizmetler/periyodik-bakim" className="card">
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
              </svg>
              <LiveEditable path="homepage.services.s1.title" tagName="h3" className="card-title">
                {get("homepage.services.s1.title", "Periyodik Bakım")}
              </LiveEditable>
              <LiveEditable path="homepage.services.s1.desc" tagName="p" className="card-desc">
                {get("homepage.services.s1.desc", "Yağ değişimi, filtrelerin kontrolü ve sürüş performansı için gerekli 21 nokta kontrol ve ayarları içeren periyodik motor bakımı.")}
              </LiveEditable>
              <span className="card-link">
                <LiveEditable path="homepage.services.s1.btn" tagName="span">
                  {get("homepage.services.s1.btn", "Detaylı Bilgi Al")}
                </LiveEditable>
                <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </span>
            </Link>

            {/* Service 2: Agir Bakim */}
            <Link href="/hizmetler/agir-bakim" className="card">
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.3C.5 6.7.9 9.7 2.9 11.7c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.4-2.4c.4-.4.4-1.1 0-1.4z"/>
              </svg>
              <LiveEditable path="homepage.services.s2.title" tagName="h3" className="card-title">
                {get("homepage.services.s2.title", "Ağır Bakım")}
              </LiveEditable>
              <LiveEditable path="homepage.services.s2.desc" tagName="p" className="card-desc">
                {get("homepage.services.s2.desc", "Şanzıman, debriyaj seti, varyatör, zincir-dişli set değişimi ve diğer ağır mekanik aksam bakımlarının güvenli işçilikle onarımı.")}
              </LiveEditable>
              <span className="card-link">
                <LiveEditable path="homepage.services.s2.btn" tagName="span">
                  {get("homepage.services.s2.btn", "Detaylı Bilgi Al")}
                </LiveEditable>
                <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </span>
            </Link>

            {/* Service 3: Motor Revizyonu */}
            <Link href="/hizmetler/motor-revizyonu" className="card">
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
              <LiveEditable path="homepage.services.s3.title" tagName="h3" className="card-title">
                {get("homepage.services.s3.title", "Motor Revizyonu")}
              </LiveEditable>
              <LiveEditable path="homepage.services.s3.desc" tagName="p" className="card-desc">
                {get("homepage.services.s3.desc", "Kompresyon kaybı, yağ yakma gibi durumlarda motor bloğunun rektifiye edilmesi, silindir piston set değişimi ve anahtar teslim rekorlu motor onarımı.")}
              </LiveEditable>
              <span className="card-link">
                <LiveEditable path="homepage.services.s3.btn" tagName="span">
                  {get("homepage.services.s3.btn", "Detaylı Bilgi Al")}
                </LiveEditable>
                <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </span>
            </Link>

            {/* Service 4: Kaynak Isciligi */}
            <Link href="/hizmetler/kaynak-isciligi" className="card">
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.07 19.59 10.48 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-8h2v4h-2zm0-3h2v2h-2z"/>
              </svg>
              <LiveEditable path="homepage.services.s4.title" tagName="h3" className="card-title">
                {get("homepage.services.s4.title", "Kaynak İşçiliği")}
              </LiveEditable>
              <LiveEditable path="homepage.services.s4.desc" tagName="p" className="card-desc">
                {get("homepage.services.s4.desc", "Kırık ayaklıklar, şasi çatlakları, egzoz bağlantı kaynakları ve demir/alüminyum aksamların gazaltı kaynak işçiliği ile sağlamlaştırılması.")}
              </LiveEditable>
              <span className="card-link">
                <LiveEditable path="homepage.services.s4.btn" tagName="span">
                  {get("homepage.services.s4.btn", "Detaylı Bilgi Al")}
                </LiveEditable>
                <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </span>
            </Link>

            {/* Service 5: Fren & Suspansiyon */}
            <Link href="/hizmetler/fren-suspansiyon" className="card">
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <LiveEditable path="homepage.services.s5.title" tagName="h3" className="card-title">
                {get("homepage.services.s5.title", "Fren & Süspansiyon")}
              </LiveEditable>
              <LiveEditable path="homepage.services.s5.desc" tagName="p" className="card-desc">
                {get("homepage.services.s5.desc", "Ön amortisör keçe değişimi, hidrolik yağ yenileme, fren balatası ve disk değişimi ile sürüş konforu ve fren güvenliğiniz en üst düzeye çıkarılır.")}
              </LiveEditable>
              <span className="card-link">
                <LiveEditable path="homepage.services.s5.btn" tagName="span">
                  {get("homepage.services.s5.btn", "Detaylı Bilgi Al")}
                </LiveEditable>
                <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </span>
            </Link>

            {/* Service 6: Elektrik Arizalari */}
            <Link href="/hizmetler/elektrik-arizalari" className="card">
              <svg className="card-icon" viewBox="0 0 24 24">
                <path d="M7 2v 11h3v9l7-12h-4l4-8z"/>
              </svg>
              <LiveEditable path="homepage.services.s6.title" tagName="h3" className="card-title">
                {get("homepage.services.s6.title", "Elektrik Arızaları")}
              </LiveEditable>
              <LiveEditable path="homepage.services.s6.desc" tagName="p" className="card-desc">
                {get("homepage.services.s6.desc", "Çözülemeyen karmaşık tesisat arızaları, konjektör, statör, akü, şarj problemleri ve Honda Alpha elektrik arızalarında uzman teşhis.")}
              </LiveEditable>
              <span className="card-link">
                <LiveEditable path="homepage.services.s6.btn" tagName="span">
                  {get("homepage.services.s6.btn", "Detaylı Bilgi Al")}
                </LiveEditable>
                <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
              </span>
            </Link>
          </div>
          <div className="text-center mt-xl">
            <Link href="/hizmetler" className="btn btn-secondary">
              <LiveEditable path="homepage.services_overview.all_btn" tagName="span">
                {get("homepage.services_overview.all_btn", "Tüm Hizmetleri ve Markaları Gör")}
              </LiveEditable>
            </Link>
          </div>
        </div>
      </section>

      {/* B2B FLEET & CRM INFO SECTION */}
      <section className="section-padding" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container grid-2">
          <div>
            <LiveEditable path="homepage.b2b.badge" tagName="div" className="slide-badge" style={{ display: 'inline-flex', background: 'rgba(0,229,255,0.1)', borderColor: 'rgba(0,229,255,0.3)', color: 'var(--color-secondary)' }}>
              {get("homepage.b2b.badge", "Filo Yönetimi & km Takibi")}
            </LiveEditable>
            <LiveEditable path="homepage.b2b.title" tagName="h2" style={{ fontSize: '2.25rem', marginBottom: 'var(--space-md)' }}>
              {get("homepage.b2b.title", "CRM Sistemi ile Şeffaf Masraf Takibi")}
            </LiveEditable>
            <LiveEditable path="homepage.b2b.desc" tagName="p" className="text-muted mb-md">
              {get("homepage.b2b.desc", "Motosiklet filonuza ait tüm bakım geçmişi dijital veri tabanımızda kayıt altında tutulur. Hangi motosikletin hangi tarihte, hangi kilometrede hangi parçalarının değiştiğini anlık olarak panelinizden izleyebilirsiniz.")}
            </LiveEditable>
            <ul style={{ marginBottom: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <svg style={{ width: '20px', height: '20px', fill: 'var(--color-secondary)', flexShrink: 0 }} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <LiveEditable path="homepage.b2b.list1" tagName="span">
                  {get("homepage.b2b.list1", "Her motorun servis geçmişine crm.emiramotors.com üzerinden erişim")}
                </LiveEditable>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <svg style={{ width: '20px', height: '20px', fill: 'var(--color-secondary)', flexShrink: 0 }} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <LiveEditable path="homepage.b2b.list2" tagName="span">
                  {get("homepage.b2b.list2", "Kilometre bazlı erken deformasyon analizi ile parça sarfiyatını düşürme")}
                </LiveEditable>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <svg style={{ width: '20px', height: '20px', fill: 'var(--color-secondary)', flexShrink: 0 }} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <LiveEditable path="homepage.b2b.list3" tagName="span">
                  {get("homepage.b2b.list3", "Şirketler için aylık toplu raporlama ve faturalı ödeme kolaylığı")}
                </LiveEditable>
              </li>
            </ul>
            <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <Link href="/kurumsal-filo" className="btn btn-primary">
                <LiveEditable path="homepage.b2b.btn1" tagName="span">
                  {get("homepage.b2b.btn1", "B2B Filo Çözümlerini Gör")}
                </LiveEditable>
              </Link>
              <a href="http://crm.emiramotors.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <LiveEditable path="homepage.b2b.btn2" tagName="span">
                  {get("homepage.b2b.btn2", "Müşteri Paneli")}
                </LiveEditable>
              </a>
            </div>
          </div>
          
          {/* Visual Mock UI of the CRM Dashboard */}
          <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', boxShadow: 'var(--shadow-lg)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <LiveEditable path="homepage.b2b.crm_header_title" tagName="span" style={{ fontFamily: 'var(--font-headings)', fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-secondary)' }}>
                {get("homepage.b2b.crm_header_title", "EMİRA CRM - FİLO PANELİ")}
              </LiveEditable>
              <LiveEditable path="homepage.b2b.crm_header_badge" tagName="span" style={{ fontSize: '0.75rem', background: 'rgba(0,102,255,0.2)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', color: 'var(--color-primary)' }}>
                {get("homepage.b2b.crm_header_badge", "Aktif Raporlama")}
              </LiveEditable>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <div style={{ background: 'var(--bg-card)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <LiveEditable path="homepage.b2b.crm_stat1_label" tagName="div" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {get("homepage.b2b.crm_stat1_label", "Aktif Motosikletler")}
                </LiveEditable>
                <LiveEditable path="homepage.b2b.crm_stat1_val" tagName="div" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-headings)', fontWeight: '800', color: '#FFF' }}>
                  {get("homepage.b2b.crm_stat1_val", "18 Adet")}
                </LiveEditable>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <LiveEditable path="homepage.b2b.crm_stat2_label" tagName="div" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {get("homepage.b2b.crm_stat2_label", "Aylık Gider")}
                </LiveEditable>
                <LiveEditable path="homepage.b2b.crm_stat2_val" tagName="div" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-headings)', fontWeight: '800', color: 'var(--color-secondary)' }}>
                  {get("homepage.b2b.crm_stat2_val", "42.850 TL")}
                </LiveEditable>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-sm)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: 'var(--space-sm)', display: 'flex', justifyContent: 'space-between' }}>
                <LiveEditable path="homepage.b2b.crm_chart_title" tagName="span">
                  {get("homepage.b2b.crm_chart_title", "Varyatör Aşınma km Analizi")}
                </LiveEditable>
                <LiveEditable path="homepage.b2b.crm_chart_badge" tagName="span" style={{ color: '#25D366' }}>
                  {get("homepage.b2b.crm_chart_badge", "%92 Doğruluk")}
                </LiveEditable>
              </div>
              <div style={{ height: '10px', background: 'var(--bg-dark)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }}></div>
              </div>
              <LiveEditable path="homepage.b2b.crm_chart_note" tagName="div" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                {get("homepage.b2b.crm_chart_note", "Plaka: 34 MTR 522 - Kalan ömür: ~2.400 km")}
              </LiveEditable>
            </div>

            <LiveEditable path="homepage.b2b.crm_footer_update" tagName="div" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-sm)', textAlign: 'right' }}>
              {get("homepage.b2b.crm_footer_update", "Son Güncelleme: Bugün, 19:42")}
            </LiveEditable>
          </div>
        </div>
      </section>

      {/* INSURANCE PARTNERS GRID */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-xl">
            <LiveEditable path="homepage.insurance.title" tagName="h2" style={{ fontSize: '2.25rem' }}>
              {get("homepage.insurance.title", "Anlaşmalı Sigorta ve Hasar Onarımı")}
            </LiveEditable>
            <LiveEditable path="homepage.insurance.desc" tagName="p" className="text-muted mt-sm" style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              {get("homepage.insurance.desc", "Kaza durumunda sigorta firmanızdan onay aldıktan sonra dükkanımızda ek ücret ödemeden motosikletinizi teslim alırsınız.")}
            </LiveEditable>
          </div>
          
          <div className="brand-grid">
            {insuranceBrands.map((brand, idx) => (
              <div key={idx} className="brand-logo-item" style={{ position: 'relative' }}>
                <LiveEditable path={`homepage.insurance_brands.${idx}`} tagName="span">
                  {brand}
                </LiveEditable>
                <LiveListControls 
                  onDelete={() => handleDeleteBrand(idx)} 
                  style={{ position: 'absolute', right: '-4px', top: '-4px', scale: '0.85', zIndex: 10 }}
                />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
            <LiveListControls onAdd={handleAddBrand} addLabel="Yeni Sigorta Ekle" />
          </div>
          <div className="text-center mt-xl">
            <Link href="/sigorta-hasar" className="btn btn-accent">
              <LiveEditable path="homepage.insurance.btn" tagName="span">
                {get("homepage.insurance.btn", "Hasar Süreci Adımlarını İncele")}
              </LiveEditable>
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK TESTIMONIALS SECTION */}
      <section className="section-padding" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="text-center mb-xl">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '100px', marginBottom: 'var(--space-sm)' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#4285F4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFF' }}>Google Puanı: ★ {reviewsStats.rating} / 5.0</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({reviewsStats.count} Yorum)</span>
            </div>
            <LiveEditable path="homepage.reviews.title" tagName="h2" style={{ fontSize: '2.25rem', fontFamily: 'var(--font-headings)' }}>
              {get("homepage.reviews.title", "Müşterilerimizin Canlı Yorumları")}
            </LiveEditable>
            <LiveEditable path="homepage.reviews.desc" tagName="p" className="text-muted mt-sm">
              {get("homepage.reviews.desc", "Google Maps API üzerinden anlık çekilen gerçek müşteri değerlendirmeleri.")}
            </LiveEditable>
          </div>

          {reviewsLoading ? (
            <div className="card-grid">
              {[1, 2, 3].map(i => (
                <div className="card" key={i} style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div style={{ width: '80px', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} className="animate-pulse"></div>
                  <div style={{ width: '100%', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} className="animate-pulse"></div>
                  <div style={{ width: '90%', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} className="animate-pulse"></div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} className="animate-pulse"></div>
                    <div style={{ width: '100px', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} className="animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-grid">
              {reviews.slice(0, 3).map((review, index) => (
                <div className="card" key={index} style={{ cursor: 'default', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                    <div style={{ color: 'var(--color-accent)', fontSize: '1.25rem' }}>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{review.relative_time_description}</span>
                  </div>
                  
                  <p className="card-desc" style={{ flexGrow: 1, fontSize: '0.92rem', fontStyle: 'italic', lineHeight: '1.5', marginBottom: 'var(--space-md)' }}>
                    "{review.text}"
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-sm)' }}>
                    <img 
                      src={review.profile_photo_url} 
                      alt={review.author_name} 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150";
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#FFF' }}>{review.author_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Google Maps Doğrulanmış Müşteri</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* QUICK CONTACT / APPOINTMENT FORM */}
      <section className="section-padding" id="iletisim-bolumu">
        <div className="container">
          <div className="text-center mb-xl">
            <LiveEditable path="homepage.form_section.title" tagName="h2" style={{ fontSize: '2.25rem' }}>
              {get("homepage.form_section.title", "Randevu & Talep Oluştur")}
            </LiveEditable>
            <LiveEditable path="homepage.form_section.desc" tagName="p" className="text-muted mt-sm">
              {get("homepage.form_section.desc", "Bakım, tamir veya hasar işlemleriniz için bilgilerinizi bırakın, hemen fiyat ve planlama bilgisi verelim.")}
            </LiveEditable>
          </div>

          <div className="form-container">
            {formSubmitted ? (
              <div className="form-success-banner" style={{ textAlign: 'center', padding: 'var(--space-xl) var(--space-lg)', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid #25D366', borderRadius: 'var(--radius-lg)' }}>
                <svg style={{ width: '48px', height: '48px', fill: '#25D366', marginBottom: 'var(--space-md)' }} viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h3 style={{ marginBottom: 'var(--space-sm)' }}>Talebiniz Başarıyla Alındı!</h3>
                <p className="text-muted" style={{ marginBottom: 'var(--space-md)' }}>Engin Usta en kısa sürede belirttiğiniz telefon numarasından sizinle iletişime geçecektir.</p>
                <button 
                  onClick={() => { 
                    setFormSubmitted(false); 
                    setFormData({ name: '', tel: '', type: 'periyodik-bakim', message: '' }); 
                  }} 
                  className="btn btn-secondary btn-sm"
                >
                  Yeni Talep Oluştur
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <LiveEditable path="homepage.form.name_label" tagName="label" className="form-label" htmlFor="client-name">
                    {get("homepage.form.name_label", "Adınız Soyadınız / Firma Adı *")}
                  </LiveEditable>
                  <input 
                    type="text" 
                    id="client-name" 
                    className="form-control" 
                    placeholder={get("homepage.form.name_placeholder", "Örn: Engin Yıldırım")}
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <LiveEditable path="homepage.form.tel_label" tagName="label" className="form-label" htmlFor="client-tel">
                    {get("homepage.form.tel_label", "Telefon Numaranız *")}
                  </LiveEditable>
                  <input 
                    type="tel" 
                    id="client-tel" 
                    className="form-control" 
                    placeholder={get("homepage.form.tel_placeholder", "Örn: 0555 123 4567")}
                    value={formData.tel}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <LiveEditable path="homepage.form.type_label" tagName="label" className="form-label" htmlFor="request-type">
                    {get("homepage.form.type_label", "Talebiniz *")}
                  </LiveEditable>
                  <select 
                    id="request-type" 
                    className="form-control" 
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="periyodik-bakim">Periyodik Bakım Randevusu</option>
                    <option value="agir-onarım">Mekanik Onarım / Ağır Bakım</option>
                    <option value="elektrik-arızası">Elektrik Arıza Teşhisi</option>
                    <option value="sigorta-hasar">Sigorta / Kasko Hasar Onarımı</option>
                    <option value="filo-teklif">Kurumsal Filo Özel Teklifi</option>
                  </select>
                </div>

                <div className="form-group">
                  <LiveEditable path="homepage.form.message_label" tagName="label" className="form-label" htmlFor="client-message">
                    {get("homepage.form.message_label", "Mesajınız *")}
                  </LiveEditable>
                  <textarea 
                    id="client-message" 
                    className="form-control" 
                    placeholder={get("homepage.form.message_placeholder", "Motosikletinizin marka/modelini ve talebinizi buraya yazabilirsiniz...")}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <LiveEditable path="homepage.form.submit_btn" tagName="span">
                    {get("homepage.form.submit_btn", "Talebi Gönder")}
                  </LiveEditable>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
