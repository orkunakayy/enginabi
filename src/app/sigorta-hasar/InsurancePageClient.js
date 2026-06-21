"use client";

import { useState, useEffect } from 'react';
import FAQItem from '../../components/FAQItem';
import LiveEditable from '../../components/LiveEditable';
import LiveEditToolbar from '../../components/LiveEditToolbar';
import LiveListControls from '../../components/LiveListControls';
import { useLiveContent } from '../../hooks/useLiveContent';
import { Suspense } from 'react';

export default function InsurancePageClient() {
  const { get, loading } = useLiveContent();
  const [faqsList, setFaqsList] = useState([]);

  const defaultFaqs = [
    {
      question: "Hasar onarımı kaskodan mı ödenir trafik sigortasından mı?",
      answer: "Kaza durumunda eğer haklı taraf sizseniz, karşı tarafın Trafik Sigortası sizin masraflarınızı karşılar. Eğer kazada kusurluysanız veya tek taraflı bir kaza yaptıysanız, kendi Kaskonuz hasarı karşılar. Her iki durumda da dükkanımızda dosya açarak süreci yönetebiliriz."
    },
    {
      question: "Ekspertiz süreci ne kadar sürer?",
      answer: "Motosikletinizi dükkanımıza çektikten ve sigorta ihbarı yapıldıktan sonra sigorta şirketi 24-48 saat içerisinde bağımsız bir eksper atar. Eksper dükkanımıza gelip inceleme yaptıktan sonra genellikle 2-3 iş günü içerisinde onarım listesini onaylar."
    },
    {
      question: "Motosiklet hasarındayken yedek araç (ikame motor) veriliyor mu?",
      answer: "İkame araç temini kasko poliçenizin detaylarına bağlıdır. Kasko poliçenizde \"motosiklet ikame teminatı\" varsa, sigorta şirketi size geçici motor temin eder. Emira Motors olarak biz dosya onay sürecini hızlandırarak motorunuzu en kısa sürede teslim etmeye odaklanıyoruz."
    },
    {
      question: "Tüm yedek parçalar orijinal mi takılıyor?",
      answer: "Evet, sigorta ve kasko onay listesine bağlı kalarak Honda, Yamaha, Vespa veya diğer markaların yetkili bayilerinden temin edilen orijinal ve faturalı yedek parçaları kullanmaktayız. Şeffaflık ilkemiz gereği değişen parçaları size teslimat sırasında gösteriyoruz."
    }
  ];

  useEffect(() => {
    if (!loading) {
      const items = get('insurance.faqs.items', []);
      setFaqsList(items.length > 0 ? items : defaultFaqs);
    }
  }, [loading]);

  const handleAddFaq = () => {
    const updated = [...faqsList, { question: "Yeni Soru", answer: "Yeni cevap metni" }];
    setFaqsList(updated);
    window.liveEditChanges = window.liveEditChanges || {};
    window.liveEditChanges['insurance.faqs.items'] = updated;
    window.dispatchEvent(new CustomEvent('live-edit-dirty'));
  };

  const handleDeleteFaq = (idx) => {
    const updated = faqsList.filter((_, i) => i !== idx);
    setFaqsList(updated);
    window.liveEditChanges = window.liveEditChanges || {};
    window.liveEditChanges['insurance.faqs.items'] = updated;
    window.dispatchEvent(new CustomEvent('live-edit-dirty'));
  };

  const steps = [
    {
      key: '0',
      defaultTitle: "Kaza & Hasar Bildirimi",
      defaultDesc: "Kazadan sonra tutulan tutanak, ruhsat ve ehliyet fotoğraflarıyla dükkanımızla iletişime geçersiniz. Motorunuzu çekici ile dükkanımıza getiririz."
    },
    {
      key: '1',
      defaultTitle: "Ekspertiz Değerlendirmesi",
      defaultDesc: "Sigorta firması tarafından atanan bağımsız eksper dükkanımıza gelerek motosikleti inceler. Hasarlı parçaları tespit edip onarım listesini onaylar."
    },
    {
      key: '2',
      defaultTitle: "Garantili Onarım",
      defaultDesc: "Onaylanan hasar listesine istinaden orijinal yedek parçalar tedarik edilir. Engin Usta güvencesiyle mekanik ve kaporta onarımları titizlikle yapılır."
    },
    {
      key: '3',
      defaultTitle: "Test Sürüşü & Teslimat",
      defaultDesc: "Onarımı biten motosikletin sürüş testleri yapılır. Tam güvenlik onayından geçtikten sonra temizlenmiş olarak sahibine anahtar teslim edilir."
    }
  ];

  return (
    <>
      <Suspense fallback={null}>
        <LiveEditToolbar />
      </Suspense>

      {/* TITLE BANNER */}
      <section className="section-padding" style={{ marginTop: '80px', background: 'linear-gradient(135deg, #090A0D 0%, #16181E 100%)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container text-center">

          <LiveEditable path="insurance.banner.title" tagName="h1" style={{ fontSize: '2.75rem', fontWeight: 900 }} className="mb-md">
            {get('insurance.banner.title', 'Sigorta ve Hasar Onarımı')}
          </LiveEditable>
          <LiveEditable path="insurance.banner.desc" tagName="p" className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.15rem' }}>
            {get('insurance.banner.desc', 'Kazaya karışan motosikletlerinizin hasar dosyası açılışından eksper koordinasyonuna ve orijinal parçalarla anahtar teslim onarımına kadar tüm süreçleri yönetiyoruz.')}
          </LiveEditable>
        </div>
      </section>

      {/* TRUST STATEMENT BANNER */}
      <section className="section-padding" style={{ background: 'rgba(0, 102, 255, 0.1)', borderBottom: '1px solid rgba(0,102,255,0.2)' }}>
        <div className="container text-center">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
            <svg style={{ width: '48px', height: '48px', fill: 'var(--color-secondary)', flexShrink: 0 }} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            <div style={{ textAlign: 'left', maxWidth: '700px' }}>
              <LiveEditable path="insurance.alert.title" style={{ display: 'block' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '4px', display: 'inline' }}>
                  {get('insurance.alert.title', 'Sigorta Onayı Sonrası Sürpriz Ücret Yok!')}
                </h3>
              </LiveEditable>
              <LiveEditable path="insurance.alert.desc" tagName="p" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {get('insurance.alert.desc', 'İlgili sigorta veya kasko firması hasar onarım dosyanızı onayladıktan sonra cebinizden hiçbir ek ücret çıkmadan motorunuzu teslim alırsınız. Süreç tamamen yasal ve faturalıdır.')}
              </LiveEditable>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE PROCESS */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-xl">
            <LiveEditable path="insurance.process.title" tagName="h2" style={{ fontSize: '2rem' }}>
              {get('insurance.process.title', 'Hasar Onarım Süreci Nasıl İşler?')}
            </LiveEditable>
            <LiveEditable path="insurance.process.desc" tagName="p" className="text-muted mt-sm">
              {get('insurance.process.desc', 'Kazadan motorunuzu teslim alana kadar geçen 4 temel adım.')}
            </LiveEditable>
          </div>

          <div className="timeline">
            {steps.map((step, idx) => (
              <div key={step.key} className="timeline-item">
                <div className="timeline-badge">{idx + 1}</div>
                <div className="timeline-card">
                  <LiveEditable path={`insurance.process.steps.${idx}.title`} tagName="h3" className="timeline-title">
                    {get(`insurance.process.steps.${idx}.title`, step.defaultTitle)}
                  </LiveEditable>
                  <LiveEditable path={`insurance.process.steps.${idx}.desc`} tagName="p" className="timeline-desc">
                    {get(`insurance.process.steps.${idx}.desc`, step.defaultDesc)}
                  </LiveEditable>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section-padding" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="text-center mb-xl">
            <LiveEditable path="insurance.faqs.title" tagName="h2" style={{ fontSize: '2rem' }}>
              {get('insurance.faqs.title', 'Sıkça Sorulan Sorular')}
            </LiveEditable>
            <LiveEditable path="insurance.faqs.desc" tagName="p" className="text-muted mt-sm">
              {get('insurance.faqs.desc', 'Motosiklet hasar ve sigorta onarımı süreçleri hakkında merak edilenler.')}
            </LiveEditable>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {faqsList.map((faq, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <FAQItem 
                  question={
                    <LiveEditable path={`insurance.faqs.items.${idx}.question`} tagName="span" style={{ display: 'inline' }}>
                      {faq.question}
                    </LiveEditable>
                  } 
                  answer={
                    <LiveEditable path={`insurance.faqs.items.${idx}.answer`} tagName="div">
                      {faq.answer}
                    </LiveEditable>
                  } 
                />
                <LiveListControls 
                  onDelete={() => handleDeleteFaq(idx)} 
                  style={{ position: 'absolute', right: '12px', top: '12px', zIndex: 10 }}
                />
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
              <LiveListControls onAdd={handleAddFaq} addLabel="Yeni Soru Ekle" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
