import { NextResponse } from 'next/server';
import { readDB, writeDB, sanitizeInput } from '../../../../lib/db';

function verifyAdminSession(request) {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  return !!sessionCookie;
}

export async function GET(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = readDB();
  const items = db.content?.services?.items || [];
  return NextResponse.json(items);
}

export async function POST(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const service = await request.json();
    if (!service.slug || !service.title) {
      return NextResponse.json({ error: 'Slug ve Başlık alanları zorunludur.' }, { status: 400 });
    }

    const db = readDB();
    if (!db.content) db.content = {};
    if (!db.content.services) db.content.services = { items: [] };
    if (!db.content.services.items) db.content.services.items = [];

    const items = db.content.services.items;
    const existingIndex = items.findIndex(s => s.slug === service.slug);

    // Sanitize basic text fields
    const sanitizedService = {
      slug: sanitizeInput(service.slug),
      icon: sanitizeInput(service.icon || 'gear'),
      title: sanitizeInput(service.title),
      desc: sanitizeInput(service.desc || ''),
      detailTitle: sanitizeInput(service.detailTitle || service.title),
      detailDesc: sanitizeInput(service.detailDesc || service.desc || ''),
      leftTitle: sanitizeInput(service.leftTitle || 'Yapılan İşlemler'),
      leftDesc: sanitizeInput(service.leftDesc || 'Bu hizmet kapsamında yapılan adımlar:'),
      items: (service.items || []).map(item => ({
        title: sanitizeInput(item.title || ''),
        desc: sanitizeInput(item.desc || '')
      })),
      rightTitle: sanitizeInput(service.rightTitle || 'Uzman Markalar'),
      rightDesc: sanitizeInput(service.rightDesc || ''),
      badges: (service.badges || []).map(b => sanitizeInput(b)),
      cta1Text: sanitizeInput(service.cta1Text || 'Randevu Al'),
      cta1Href: sanitizeInput(service.cta1Href || '/iletisim'),
      cta2Text: sanitizeInput(service.cta2Text || 'WhatsApp Bilgi'),
      cta2Href: sanitizeInput(service.cta2Href || 'https://wa.me/905331301448'),
      ctaStyleReverse: !!service.ctaStyleReverse,
      
      // New features schema
      showCalculator: !!service.showCalculator,
      
      showBrandsCarousel: !!service.showBrandsCarousel,
      brandsCarouselTitle: sanitizeInput(service.brandsCarouselTitle || "Bakımlarda Sadece Dünyanın En İyi Parça ve Yağ Markalarını Kullanıyoruz."),
      brandsCarouselList: (service.brandsCarouselList || []).map(b => sanitizeInput(b).trim()).filter(Boolean),
      
      showPreventionSection: !!service.showPreventionSection,
      preventionTitle: sanitizeInput(service.preventionTitle || "Bu Bakımı Zamanında Yaptırmazsanız Ne Olur?"),
      preventionPositiveTitle: sanitizeInput(service.preventionPositiveTitle || "Zamanında Bakım"),
      preventionPositiveItems: (service.preventionPositiveItems || []).map(i => sanitizeInput(i).trim()).filter(Boolean),
      preventionNegativeTitle: sanitizeInput(service.preventionNegativeTitle || "İhmal Edilirse"),
      preventionNegativeItems: (service.preventionNegativeItems || []).map(i => sanitizeInput(i).trim()).filter(Boolean),
      
      showReviewsSection: !!service.showReviewsSection,
      reviewsTitle: sanitizeInput(service.reviewsTitle || "Müşteri Yorumları"),
      reviews: (service.reviews || []).map(r => ({
        author: sanitizeInput(r.author || ''),
        comment: sanitizeInput(r.comment || ''),
        rating: Math.min(5, Math.max(1, Number(r.rating || 5)))
      })).filter(r => r.author && r.comment),
      
      showFaqSection: !!service.showFaqSection,
      faqTitle: sanitizeInput(service.faqTitle || "Sıkça Sorulan Sorular"),
      faqs: (service.faqs || []).map(f => ({
        question: sanitizeInput(f.question || ''),
        answer: sanitizeInput(f.answer || '')
      })).filter(f => f.question && f.answer)
    };

    if (existingIndex > -1) {
      items[existingIndex] = sanitizedService;
    } else {
      items.push(sanitizedService);
    }

    writeDB(db);
    return NextResponse.json({ success: true, service: sanitizedService });
  } catch (err) {
    console.error("Save service failed:", err);
    return NextResponse.json({ error: 'Kaydetme işlemi başarısız.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug belirtilmedi.' }, { status: 400 });
    }

    const db = readDB();
    if (!db.content?.services?.items) {
      return NextResponse.json({ success: true });
    }

    db.content.services.items = db.content.services.items.filter(s => s.slug !== slug);
    writeDB(db);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete service failed:", err);
    return NextResponse.json({ error: 'Silme işlemi başarısız.' }, { status: 500 });
  }
}
