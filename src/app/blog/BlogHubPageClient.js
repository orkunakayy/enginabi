"use client";

import BlogCatalog from './BlogCatalog';
import LiveEditable from '../../components/LiveEditable';
import LiveEditToolbar from '../../components/LiveEditToolbar';
import { useLiveContent } from '../../hooks/useLiveContent';
import { Suspense } from 'react';

export default function BlogHubPageClient() {
  const { get } = useLiveContent();

  return (
    <>
      <Suspense fallback={null}>
        <LiveEditToolbar />
      </Suspense>

      {/* TITLE BANNER */}
      <section className="section-padding" style={{ marginTop: '80px', background: 'linear-gradient(135deg, #090A0D 0%, #16181E 100%)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container text-center">

          <LiveEditable path="blog_page.banner.title" tagName="h1" style={{ fontSize: '2.75rem', fontWeight: 900 }} className="mb-md">
            {get('blog_page.banner.title', 'Blog & Vlog Köşemiz')}
          </LiveEditable>
          <LiveEditable path="blog_page.banner.desc" tagName="p" className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.15rem' }}>
            {get('blog_page.banner.desc', "Engin Usta'nın 15 yılı aşkın tecrübesiyle hazırladığı bakım rehberleri, kronik arıza teşhisleri ve video anlatımları.")}
          </LiveEditable>
        </div>
      </section>

      {/* BLOG CATALOG CLIENT COMPONENT */}
      <BlogCatalog />
    </>
  );
}
