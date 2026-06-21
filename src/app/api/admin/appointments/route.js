import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDB, writeDB, sanitizeInput } from '../../../../lib/db';

// Verify session helper
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

// GET: List all appointments (Admin only)
export async function GET(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = readDB();
    const appointments = db.appointments || [];
    // Sort by newest first
    const sorted = [...appointments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return NextResponse.json(sorted);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create appointment (Publicly accessible)
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Geçersiz veri biçimi' }, { status: 400 });
    }

    const { clientName, phone, email, requestType, message } = body;

    // Basic required fields validation
    if (!clientName || !phone || !requestType || !message) {
      return NextResponse.json({ error: 'Eksik bilgi bıraktınız. Lütfen tüm alanları doldurun.' }, { status: 400 });
    }

    // Sanitize values to prevent stored XSS
    const sanitizedName = sanitizeInput(clientName.substring(0, 100));
    const sanitizedPhone = sanitizeInput(phone.substring(0, 30));
    const sanitizedEmail = email ? sanitizeInput(email.substring(0, 100)) : '';
    const sanitizedType = sanitizeInput(requestType.substring(0, 50));
    const sanitizedMessage = sanitizeInput(message.substring(0, 2000));

    const db = readDB();
    const newAppointment = {
      id: crypto.randomUUID(),
      clientName: sanitizedName,
      phone: sanitizedPhone,
      email: sanitizedEmail,
      requestType: sanitizedType,
      message: sanitizedMessage,
      status: 'beklemede',
      createdAt: new Date().toISOString()
    };

    if (!db.appointments) {
      db.appointments = [];
    }
    db.appointments.push(newAppointment);
    
    // Write atomically
    writeDB(db);

    return NextResponse.json({ success: true, id: newAppointment.id });
  } catch (err) {
    console.error("Failed to create appointment:", err);
    return NextResponse.json({ error: 'İşlem tamamlanamadı. Lütfen tekrar deneyin.' }, { status: 500 });
  }
}

// PATCH: Update appointment status (Admin only)
export async function PATCH(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID parametresi eksik' }, { status: 400 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Geçersiz veri biçimi' }, { status: 400 });
    }

    const { status } = body;
    const allowedStatuses = ['beklemede', 'onaylandi', 'tamamlandi'];

    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Geçersiz durum değeri' }, { status: 400 });
    }

    const db = readDB();
    const index = db.appointments?.findIndex(a => a.id === id);

    if (index === -1 || index === undefined) {
      return NextResponse.json({ error: 'Kayıt bulunamadı' }, { status: 404 });
    }

    db.appointments[index].status = status;
    writeDB(db);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Remove appointment (Admin only)
export async function DELETE(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID parametresi eksik' }, { status: 400 });
  }

  try {
    const db = readDB();
    const initialLength = db.appointments?.length || 0;
    db.appointments = db.appointments?.filter(a => a.id !== id) || [];

    if (db.appointments.length === initialLength) {
      return NextResponse.json({ error: 'Kayıt bulunamadı' }, { status: 404 });
    }

    writeDB(db);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
