import { NextResponse } from 'next/server';
import { readDB, writeDB } from '../../../../lib/db';

export async function POST(request) {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  const response = NextResponse.json({ success: true });

  if (sessionCookie) {
    const db = readDB();
    if (db.admin.sessions && db.admin.sessions[sessionCookie]) {
      delete db.admin.sessions[sessionCookie];
      writeDB(db);
    }
  }

  // Clear cookie
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0 // Expire instantly
  });

  return response;
}
