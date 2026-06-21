import { NextResponse } from 'next/server';
import { readDB } from '../../../lib/db';

export async function GET(request) {
  try {
    const db = readDB();
    return NextResponse.json({
      reels: db.reels || [],
      horizontal_videos: db.horizontal_videos || [],
      before_after: db.before_after || [],
      workshop_images: db.workshop_images || []
    });
  } catch (err) {
    console.error("Public reels fetch error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
