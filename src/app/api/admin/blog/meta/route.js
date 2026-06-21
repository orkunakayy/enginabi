import { NextResponse } from 'next/server';
import { readDB, writeDB } from '../../../../../lib/db';

function verifyAdminSession(request) {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  return !!sessionCookie;
}

// GET: Fetch blog categories and brands
export async function GET(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = readDB();
    return NextResponse.json({
      categories: db.blogCategories || [],
      brands: db.blogBrands || []
    });
  } catch (err) {
    return NextResponse.json({ error: 'Veriler yüklenemedi.' }, { status: 500 });
  }
}

// POST: Save updated categories and brands list
export async function POST(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { categories, brands } = body;

    const db = readDB();

    if (Array.isArray(categories)) {
      db.blogCategories = categories.map(c => c.trim()).filter(c => c.length > 0);
    }
    if (Array.isArray(brands)) {
      db.blogBrands = brands.map(b => b.trim()).filter(b => b.length > 0);
    }

    writeDB(db);

    return NextResponse.json({
      success: true,
      categories: db.blogCategories,
      brands: db.blogBrands
    });
  } catch (err) {
    console.error("Failed to save blog meta:", err);
    return NextResponse.json({ error: 'Ayarlar kaydedilemedi.' }, { status: 500 });
  }
}
