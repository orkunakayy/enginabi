import { NextResponse } from 'next/server';
import { readDB } from '../../../../lib/db';
import { verifySession } from '../../../../lib/auth';

export async function GET(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => c.trim().split('='))
  );
  
  const token = cookies['admin_session'];
  
  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const db = readDB();
  return NextResponse.json({ valid: true, mustChangePassword: db.admin.mustChangePassword });
}
