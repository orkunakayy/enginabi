import { NextResponse } from 'next/server';
import { readDB } from '../../../../lib/db';

export async function GET(request) {
  try {
    const db = readDB();

    const appointments = db.appointments || [];
    const posts = db.blog?.posts || [];
    const reels = db.reels || [];

    // Calculate stats
    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter(a => a.status === 'beklemede' || !a.status).length;
    
    // Recent appointments (last 5)
    const recentAppointments = [...appointments]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);

    // Calculator stats
    const brandsCount = Object.keys(db.calculator?.brands || {}).length;
    const modelsCount = Object.values(db.calculator?.brands || {})
      .reduce((acc, curr) => acc + (curr.models?.length || 0), 0);

    const services = db.content?.services?.items || [];

    return NextResponse.json({
      stats: {
        totalAppointments,
        pendingAppointments,
        totalPosts: posts.length,
        totalReels: reels.length,
        brandsCount,
        modelsCount
      },
      recentAppointments,
      services
    });
  } catch (err) {
    console.error("Overview stats fetch failed:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
