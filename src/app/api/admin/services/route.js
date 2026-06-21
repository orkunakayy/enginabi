import { NextResponse } from 'next/server';
import { readDB, writeDB, sanitizeInput } from '../../../../lib/db';

function verifyAdminSession(request) {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  if (!sessionCookie) return false;

  const db = readDB();
  const session = db.admin.sessions?.[sessionCookie];
  if (!session) return false;

  if (new Date(session.expiresAt) < new Date()) {
    return false;
  }
  return true;
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
      ctaStyleReverse: !!service.ctaStyleReverse
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
