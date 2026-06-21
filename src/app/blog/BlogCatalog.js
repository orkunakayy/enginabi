"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { key: "all", label: "Tüm Yazılar" },
  { key: "Vespa", label: "Vespa Bakımı" },
  { key: "Honda", label: "Honda Arızaları" },
  { key: "Yamaha", label: "Yamaha Bakımı" },
  { key: "Genel", label: "Genel Tavsiyeler" }
];

export default function BlogCatalog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load blog posts:", err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredPosts = posts.filter(post => {
    const matchesBrand = selectedBrand === "all" || post.brand === selectedBrand;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  return (
    <section className="section-padding">
      <div className="container">
        
        {/* SEARCH & FILTER CONTROLS */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)'
        }}>
          {/* Search bar */}
          <div style={{ position: 'relative', width: '100%' }}>
            <span style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Konu, model veya tavsiye ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: 'var(--bg-dark)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '1rem',
                transition: 'all var(--transition-fast)',
                outline: 'none'
              }}
              className="search-input-focus"
            />
          </div>

          {/* Filter Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-xs)',
            marginTop: '4px'
          }}>
            {CATEGORIES.map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedBrand(category.key)}
                style={{
                  padding: '8px 16px',
                  background: selectedBrand === category.key ? 'var(--color-primary)' : 'var(--bg-dark)',
                  color: selectedBrand === category.key ? '#FFF' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: selectedBrand === category.key ? 'var(--color-primary)' : 'var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* BLOG CATALOG GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>Usta tavsiyeleri yükleniyor...</div>
        ) : filteredPosts.length > 0 ? (
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {filteredPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'var(--color-primary)',
                    color: '#FFF',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {post.category}
                  </div>
                </div>
                
                <div style={{ padding: 'var(--space-md) var(--space-lg) var(--space-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#FFF', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.title}
                  </h3>
                  
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: 'var(--space-md)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.desc}
                  </p>
                  
                  <span className="card-link" style={{ fontSize: '0.9rem', color: 'var(--color-secondary)' }}>
                    Devamını Oku & İzle
                    <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', fill: 'currentColor' }}><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)'
          }}>
            <svg viewBox="0 0 24 24" width="48" height="48" fill="var(--text-muted)" style={{ marginBottom: '1rem' }}>
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <h3 style={{ marginBottom: 'var(--space-xs)' }}>Yazı veya Tavsiye Bulunamadı</h3>
            <p className="text-muted" style={{ marginBottom: 'var(--space-md)' }}>Arama kriterlerinize veya seçilen markaya ait usta tavsiyesi bulunmuyor.</p>
            <button
              onClick={() => { setSelectedBrand("all"); setSearchQuery(""); }}
              className="btn btn-secondary btn-sm"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
