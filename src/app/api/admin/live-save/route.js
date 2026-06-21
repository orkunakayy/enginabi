import { NextResponse } from 'next/server';
import { readDB, writeDB, sanitizeInput } from '../../../../lib/db';

function verifyAdminSession(request) {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  return !!sessionCookie;
}

// Deep key setter helper
function setDeepValue(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) {
      const nextPart = parts[i + 1];
      current[part] = !isNaN(Number(nextPart)) ? [] : {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

// POST: Save live point-and-type editing changes
export async function POST(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    }

    const { updates } = body; // e.g. { "homepage.hero.slides.0.title": "New Title" }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'Değişiklik verisi eksik.' }, { status: 400 });
    }

    const db = readDB();
    if (!db.content) db.content = {};

    for (const [path, rawValue] of Object.entries(updates)) {
      // Validate path structure for safety (only allow lowercase letters, digits, underscores, dots, hyphens)
      if (!/^[a-z0-9_.-]+$/i.test(path)) {
        return NextResponse.json({ error: 'Geçersiz veri yolu tespit edildi.' }, { status: 400 });
      }

      // Sanitize the value to prevent stored XSS
      const sanitizedValue = sanitizeInput(String(rawValue).substring(0, 1000));
      
      // Update database object in place
      setDeepValue(db.content, path, sanitizedValue);
    }

    // Persist changes atomically
    writeDB(db);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Live save endpoint failed:", err);
    return NextResponse.json({ error: 'İşlem tamamlanamadı.' }, { status: 500 });
  }
}
