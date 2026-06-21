import { NextResponse } from 'next/server';
import { readDB, writeDB, sanitizeInput } from '../../../../lib/db';

function verifyAdminSession(request) {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  return !!sessionCookie;
}

// Helper to extract Youtube Video ID from any youtube url (shorts, watch, share links)
function extractYoutubeId(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.length === 11) return trimmed; // already an ID

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[2].length === 11) ? match[2] : trimmed;
}

// GET: Retrieve items for a specific type
export async function GET(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'reels'; // 'reels', 'horizontal_videos', 'before_after', 'workshop_images'
    const db = readDB();
    const items = db[type] || [];
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add new item
export async function POST(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'reels';

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Geçersiz veri biçimi' }, { status: 400 });
    }

    const db = readDB();
    if (!db[type]) db[type] = [];

    // Auto-generate numeric ID
    const nextId = db[type].reduce((max, r) => r.id > max ? r.id : max, 0) + 1;
    let newItem = { id: nextId };

    if (type === 'reels' || type === 'horizontal_videos') {
      const { title, youtubeId, duration, likes } = body;
      if (!title || !youtubeId) {
        return NextResponse.json({ error: 'Başlık ve YouTube Video Linki/ID\'si zorunludur.' }, { status: 400 });
      }

      const ytId = extractYoutubeId(youtubeId);
      newItem.title = sanitizeInput(title);
      newItem.youtubeId = sanitizeInput(ytId);
      newItem.duration = sanitizeInput(duration || (type === 'reels' ? '0:45' : '10:00'));
      newItem.likes = sanitizeInput(likes || '100');
      newItem.thumbnail = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
    } else if (type === 'before_after') {
      const { title, beforeImage, afterImage, beforeLabel, afterLabel } = body;
      if (!title || !beforeImage || !afterImage) {
        return NextResponse.json({ error: 'Başlık, Öncesi Görseli ve Sonrası Görseli zorunludur.' }, { status: 400 });
      }
      newItem.title = sanitizeInput(title);
      newItem.beforeImage = sanitizeInput(beforeImage);
      newItem.afterImage = sanitizeInput(afterImage);
      newItem.beforeLabel = sanitizeInput(beforeLabel || 'Öncesi');
      newItem.afterLabel = sanitizeInput(afterLabel || 'Sonrası');
    } else if (type === 'workshop_images') {
      const { title, image } = body;
      if (!title || !image) {
        return NextResponse.json({ error: 'Başlık ve Görsel URL adresi zorunludur.' }, { status: 400 });
      }
      newItem.title = sanitizeInput(title);
      newItem.image = sanitizeInput(image);
    } else {
      return NextResponse.json({ error: 'Geçersiz kategori tipi.' }, { status: 400 });
    }

    db[type].push(newItem);
    writeDB(db);

    return NextResponse.json({ success: true, item: newItem });
  } catch (err) {
    console.error("Failed to add item:", err);
    return NextResponse.json({ error: 'İşlem başarısız oldu.' }, { status: 500 });
  }
}

// PUT: Update existing item
export async function PUT(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'reels';
  const idStr = searchParams.get('id');

  if (!idStr) {
    return NextResponse.json({ error: 'ID parametresi eksik' }, { status: 400 });
  }

  const id = Number(idStr);

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Geçersiz veri biçimi' }, { status: 400 });
    }

    const db = readDB();
    const index = db[type]?.findIndex(r => r.id === id);

    if (index === -1 || index === undefined) {
      return NextResponse.json({ error: 'Kayıt bulunamadı' }, { status: 404 });
    }

    let updatedItem = { id };

    if (type === 'reels' || type === 'horizontal_videos') {
      const { title, youtubeId, duration, likes } = body;
      if (!title || !youtubeId) {
        return NextResponse.json({ error: 'Başlık ve YouTube Video Linki/ID\'si zorunludur.' }, { status: 400 });
      }

      const ytId = extractYoutubeId(youtubeId);
      updatedItem.title = sanitizeInput(title);
      updatedItem.youtubeId = sanitizeInput(ytId);
      updatedItem.duration = sanitizeInput(duration || (type === 'reels' ? '0:45' : '10:00'));
      updatedItem.likes = sanitizeInput(likes || '100');
      updatedItem.thumbnail = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
    } else if (type === 'before_after') {
      const { title, beforeImage, afterImage, beforeLabel, afterLabel } = body;
      if (!title || !beforeImage || !afterImage) {
        return NextResponse.json({ error: 'Başlık, Öncesi Görseli ve Sonrası Görseli zorunludur.' }, { status: 400 });
      }
      updatedItem.title = sanitizeInput(title);
      updatedItem.beforeImage = sanitizeInput(beforeImage);
      updatedItem.afterImage = sanitizeInput(afterImage);
      updatedItem.beforeLabel = sanitizeInput(beforeLabel || 'Öncesi');
      updatedItem.afterLabel = sanitizeInput(afterLabel || 'Sonrası');
    } else if (type === 'workshop_images') {
      const { title, image } = body;
      if (!title || !image) {
        return NextResponse.json({ error: 'Başlık ve Görsel URL adresi zorunludur.' }, { status: 400 });
      }
      updatedItem.title = sanitizeInput(title);
      updatedItem.image = sanitizeInput(image);
    } else {
      return NextResponse.json({ error: 'Geçersiz kategori tipi.' }, { status: 400 });
    }

    db[type][index] = updatedItem;
    writeDB(db);
    return NextResponse.json({ success: true, item: updatedItem });
  } catch (err) {
    console.error("Failed to update item:", err);
    return NextResponse.json({ error: 'İşlem başarısız oldu.' }, { status: 500 });
  }
}

// DELETE: Remove item
export async function DELETE(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'reels';
  const idStr = searchParams.get('id');

  if (!idStr) {
    return NextResponse.json({ error: 'ID parametresi eksik' }, { status: 400 });
  }

  const id = Number(idStr);

  try {
    const db = readDB();
    const initialLength = db[type]?.length || 0;
    db[type] = db[type]?.filter(r => r.id !== id) || [];

    if (db[type].length === initialLength) {
      return NextResponse.json({ error: 'Kayıt bulunamadı' }, { status: 404 });
    }

    writeDB(db);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
