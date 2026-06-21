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

// GET: Fetch full pricing config
export async function GET(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = readDB();
    const calculator = db.calculator || { brands: {}, levels: [] };
    return NextResponse.json(calculator);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Save updated pricing configuration
export async function PUT(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Geçersiz veri biçimi' }, { status: 400 });
    }

    const { brands, levels } = body;

    if (!brands || !levels || !Array.isArray(levels)) {
      return NextResponse.json({ error: 'Geçersiz yapılandırma verisi.' }, { status: 400 });
    }

    // Validate pricing coefficients and base prices are positive numbers
    for (const [brand, info] of Object.entries(brands)) {
      const coeff = Number(info.basePriceCoeff);
      if (isNaN(coeff) || coeff <= 0 || coeff > 10) {
        return NextResponse.json({ error: `${brand} markası için katsayı (0-10) arası geçerli bir sayı olmalıdır.` }, { status: 400 });
      }
      brands[brand].basePriceCoeff = coeff;

      if (!Array.isArray(info.models)) {
        return NextResponse.json({ error: `${brand} markası için model listesi geçersiz.` }, { status: 400 });
      }
      // Sanitize model strings
      brands[brand].models = info.models.map(m => String(m).trim()).filter(Boolean);
    }

    for (const lvl of levels) {
      const base = Number(lvl.priceBase);
      if (isNaN(base) || base <= 0 || base > 100000) {
        return NextResponse.json({ error: `${lvl.label} paketi için baz fiyat geçerli bir sayı olmalıdır.` }, { status: 400 });
      }
      lvl.priceBase = Math.round(base);

      if (!Array.isArray(lvl.items)) {
        return NextResponse.json({ error: `${lvl.label} paketi için işlem adımları geçersiz.` }, { status: 400 });
      }
      lvl.items = lvl.items.map(i => String(i).trim()).filter(Boolean);
    }

    const db = readDB();
    db.calculator = { brands, levels };
    writeDB(db);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save calculator parameters:", err);
    return NextResponse.json({ error: 'İşlem başarısız oldu.' }, { status: 500 });
  }
}
