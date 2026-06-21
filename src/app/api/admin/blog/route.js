import { NextResponse } from 'next/server';
import { readDB, writeDB, sanitizeInput, sanitizeRichText } from '../../../../lib/db';

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

// Helper to generate URL-friendly slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric except spaces/hyphens
    .replace(/[\s_]+/g, '-')   // replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '');  // trim leading/trailing hyphens
}

// GET: Retrieve all posts (Admin list view)
export async function GET(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = readDB();
    const posts = db.blog?.posts || [];
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add new article
export async function POST(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Geçersiz veri biçimi' }, { status: 400 });
    }

    const { title, desc, category, brand, readTime, image, youtubeId, contentHtml, slug: manualSlug } = body;

    if (!title || !desc || !contentHtml) {
      return NextResponse.json({ error: 'Başlık, özet ve içerik gereklidir.' }, { status: 400 });
    }

    const db = readDB();
    if (!db.blog) db.blog = { posts: [] };

    // Generate or validate slug
    let slug = manualSlug ? generateSlug(manualSlug) : generateSlug(title);
    if (!slug) slug = 'yazi-' + Date.now();

    // Check slug uniqueness
    const exists = db.blog.posts.some(p => p.slug === slug);
    if (exists) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Build post object
    const newPost = {
      slug,
      title: sanitizeInput(title),
      desc: sanitizeInput(desc),
      category: sanitizeInput(category || 'Genel Tavsiyeler'),
      brand: sanitizeInput(brand || 'Genel'),
      readTime: sanitizeInput(readTime || '5 dk okuma'),
      image: sanitizeInput(image || 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600'),
      youtubeId: sanitizeInput(youtubeId || ''),
      contentHtml: sanitizeRichText(contentHtml),
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    db.blog.posts.push(newPost);
    writeDB(db);

    return NextResponse.json({ success: true, slug: newPost.slug });
  } catch (err) {
    console.error("Failed to create blog post:", err);
    return NextResponse.json({ error: 'İşlem başarısız oldu.' }, { status: 500 });
  }
}

// PUT: Edit existing article
export async function PUT(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const targetSlug = searchParams.get('slug');

  if (!targetSlug) {
    return NextResponse.json({ error: 'Slug parametresi eksik' }, { status: 400 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Geçersiz veri biçimi' }, { status: 400 });
    }

    const { title, desc, category, brand, readTime, image, youtubeId, contentHtml } = body;

    if (!title || !desc || !contentHtml) {
      return NextResponse.json({ error: 'Başlık, özet ve içerik gereklidir.' }, { status: 400 });
    }

    const db = readDB();
    const index = db.blog?.posts?.findIndex(p => p.slug === targetSlug);

    if (index === -1 || index === undefined) {
      return NextResponse.json({ error: 'Yazı bulunamadı' }, { status: 404 });
    }

    // Update fields (retain same slug and date)
    const existingPost = db.blog.posts[index];
    db.blog.posts[index] = {
      ...existingPost,
      title: sanitizeInput(title),
      desc: sanitizeInput(desc),
      category: sanitizeInput(category || 'Genel Tavsiyeler'),
      brand: sanitizeInput(brand || 'Genel'),
      readTime: sanitizeInput(readTime || '5 dk okuma'),
      image: sanitizeInput(image || 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600'),
      youtubeId: sanitizeInput(youtubeId || ''),
      contentHtml: sanitizeRichText(contentHtml)
    };

    writeDB(db);
    return NextResponse.json({ success: true, slug: existingPost.slug });
  } catch (err) {
    console.error("Failed to edit blog post:", err);
    return NextResponse.json({ error: 'İşlem başarısız oldu.' }, { status: 500 });
  }
}

// DELETE: Remove article
export async function DELETE(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const targetSlug = searchParams.get('slug');

  if (!targetSlug) {
    return NextResponse.json({ error: 'Slug parametresi eksik' }, { status: 400 });
  }

  try {
    const db = readDB();
    const initialLength = db.blog?.posts?.length || 0;
    db.blog.posts = db.blog?.posts?.filter(p => p.slug !== targetSlug) || [];

    if (db.blog.posts.length === initialLength) {
      return NextResponse.json({ error: 'Yazı bulunamadı' }, { status: 404 });
    }

    writeDB(db);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
