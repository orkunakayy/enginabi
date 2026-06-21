"use client";

import { useState, useEffect } from 'react';

export function useLiveContent() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch content');
      })
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("useLiveContent Hook error:", err);
        setLoading(false);
      });
  }, []);

  const get = (path, defaultValue) => {
    if (!content) return defaultValue;
    const parts = path.split('.');
    let current = content;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return defaultValue;
      }
    }
    return current !== undefined && current !== null ? current : defaultValue;
  };

  return { get, loading, content };
}
