import { NextResponse } from 'next/server';
import { readDB } from '../../../lib/db';

export async function GET(request) {
  try {
    const db = readDB();
    const content = db.content || {};
    return NextResponse.json(content);
  } catch (err) {
    console.error("Public content fetch error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
