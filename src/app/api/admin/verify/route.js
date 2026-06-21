import { NextResponse } from 'next/server';
import { readDB, writeDB } from '../../../../lib/db';

export async function GET(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => c.trim().split('='))
  );
  
  const token = cookies['admin_session'];
  
  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const db = readDB();
  const session = db.admin.sessions?.[token];

  if (!session) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const expiresAt = new Date(session.expiresAt);
  if (expiresAt < new Date()) {
    // Session expired, remove it
    delete db.admin.sessions[token];
    writeDB(db);
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  return NextResponse.json({ valid: true, mustChangePassword: db.admin.mustChangePassword });
}
