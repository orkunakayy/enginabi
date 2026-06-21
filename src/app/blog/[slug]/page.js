import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDB } from '../../../lib/db';
import BlogReaderClient from './BlogReaderClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const db = readDB();
  const posts = db.blog?.posts || [];
  const post = posts.find(p => p.slug === slug);
  
  if (!post) return {};

  return {
    title: `${post.title} | Emira Motors`,
    description: post.desc
  };
}

export default async function BlogPostReaderPage({ params }) {
  const { slug } = await params;
  const db = readDB();
  const posts = db.blog?.posts || [];
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get up to 3 other posts for the sidebar suggestions
  const otherPosts = posts
    .filter(p => p.slug !== slug)
    .slice(0, 3);

  return (
    <>
      {/* TITLE BANNER */}
      <section className="section-padding" style={{ marginTop: '80px', background: 'linear-gradient(135deg, #090A0D 0%, #16181E 100%)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)', fontWeight: '600', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>
            <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            Tüm Blog Yazılarına Dön
          </Link>
          <div style={{ color: 'var(--color-secondary)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
            {post.category} - {post.readTime}
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: '1.2' }} className="mb-sm">{post.title}</h1>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>Yayınlanma: {post.date} - Engin Usta Güvencesiyle</p>
        </div>
      </section>

      {/* RENDER THE DETAILED CLIENT SIDE LAYOUT */}
      <BlogReaderClient currentSlug={slug} post={post} otherPosts={otherPosts} />
    </>
  );
}
