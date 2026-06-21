import { NextResponse } from 'next/server';
import { readDB, writeDB } from '../../../../lib/db';

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

// GET: Fetch current integration settings
export async function GET(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = readDB();
    const integrations = db.integrations || {};
    return NextResponse.json(integrations);
  } catch (err) {
    console.error("GET integrations error:", err);
    return NextResponse.json({ error: 'Ayarlar yüklenemedi.' }, { status: 500 });
  }
}

// POST: Update integrations settings
export async function POST(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Geçersiz veri biçimi.' }, { status: 400 });
    }

    const {
      googleAnalyticsId,
      googleSearchConsoleId,
      bingWebmasterId,
      clarityId,
      facebookPixelId,
      customHeaderScripts,
      customFooterScripts
    } = body;

    const db = readDB();

    db.integrations = {
      googleAnalyticsId: (googleAnalyticsId || '').trim(),
      googleSearchConsoleId: (googleSearchConsoleId || '').trim(),
      bingWebmasterId: (bingWebmasterId || '').trim(),
      clarityId: (clarityId || '').trim(),
      facebookPixelId: (facebookPixelId || '').trim(),
      customHeaderScripts: customHeaderScripts || '', // Keep raw script tags intact
      customFooterScripts: customFooterScripts || ''  // Keep raw script tags intact
    };

    writeDB(db);
    return NextResponse.json({ success: true, integrations: db.integrations });
  } catch (err) {
    console.error("POST integrations error:", err);
    return NextResponse.json({ error: 'Ayarlar kaydedilemedi.' }, { status: 500 });
  }
}
