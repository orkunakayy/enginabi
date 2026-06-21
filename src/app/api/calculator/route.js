import { NextResponse } from 'next/server';
import { readDB } from '../../../lib/db';

export async function GET(request) {
  try {
    const db = readDB();
    const calculator = db.calculator || { brands: {}, levels: [] };
    return NextResponse.json(calculator);
  } catch (err) {
    console.error("Public calculator config fetch error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
