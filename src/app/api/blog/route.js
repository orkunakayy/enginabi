import { NextResponse } from 'next/server';
import { readDB } from '../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    const db = readDB();
    const posts = db.blog?.posts || [];

    if (slug) {
      const post = posts.find(p => p.slug === slug);
      if (!post) {
        return NextResponse.json({ error: 'Yazı bulunamadı' }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    return NextResponse.json(posts);
  } catch (err) {
    console.error("Public blog fetch error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
