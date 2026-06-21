import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readDB, writeDB } from '../../../../lib/db';
import { verifySession } from '../../../../lib/auth';

export async function POST(request) {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  const session = await verifySession(sessionCookie);

  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 });
  }

  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Mevcut şifre ve yeni şifre gereklidir.' }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Yeni şifre en az 8 karakter olmalıdır.' }, { status: 400 });
  }

  const db = readDB();

  // Validate current password
  const isCurrentPasswordValid = bcrypt.compareSync(currentPassword, db.admin.passwordHash);
  if (!isCurrentPasswordValid) {
    return NextResponse.json({ error: 'Mevcut şifreniz yanlış.' }, { status: 400 });
  }

  // Hash new password
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(newPassword, salt);

  db.admin.passwordHash = hash;
  db.admin.mustChangePassword = false;

  writeDB(db);

  return NextResponse.json({ success: true });
}
