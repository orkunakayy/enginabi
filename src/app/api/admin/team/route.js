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

// GET: Retrieve team roster
export async function GET(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = readDB();
    const teamMembers = db.content?.about?.team?.members || [];
    return NextResponse.json(teamMembers);
  } catch (err) {
    console.error("GET team error:", err);
    return NextResponse.json({ error: 'Ekip listesi yüklenemedi.' }, { status: 500 });
  }
}

// POST: Save complete team roster array
export async function POST(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { members } = body;

    if (!Array.isArray(members)) {
      return NextResponse.json({ error: 'Geçersiz veri biçimi.' }, { status: 400 });
    }

    const db = readDB();
    if (!db.content) db.content = {};
    if (!db.content.about) db.content.about = {};
    if (!db.content.about.team) db.content.about.team = {};

    db.content.about.team.members = members;

    writeDB(db);
    return NextResponse.json({ success: true, members: db.content.about.team.members });
  } catch (err) {
    console.error("POST team error:", err);
    return NextResponse.json({ error: 'Ekip kaydedilemedi.' }, { status: 500 });
  }
}
