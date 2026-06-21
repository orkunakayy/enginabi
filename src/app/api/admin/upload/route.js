import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function verifyAdminSession(request) {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  if (!sessionCookie) return false;

  // Read DB to verify session
  const dbPath = path.join(process.cwd(), 'src/data/db.json');
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(raw);
    const session = db.admin.sessions?.[sessionCookie];
    if (!session) return false;

    if (new Date(session.expiresAt) < new Date()) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function POST(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Dosya yüklenemedi veya eksik.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename to prevent directory traversal or unsafe chars
    const extension = path.extname(file.name).toLowerCase();
    const safeName = file.name
      .replace(extension, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    
    const filename = `${Date.now()}_${safeName}${extension}`;

    // Target upload folder: public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: 'Dosya kaydetme hatası.' }, { status: 500 });
  }
}
