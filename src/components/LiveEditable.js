"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { checkAdminClient } from '../lib/auth-client';

export default function LiveEditable({ path, linkPath, type, tagName = 'div', className = '', style = {}, children, ...props }) {
  const [isEditParam, setIsEditParam] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const elementRef = useRef(null);
  const initialTextRef = useRef('');

  useEffect(() => {
    // Check if user is admin using client cache
    checkAdminClient().then(setIsAdmin);

    // Get edit param client-side to prevent SSR suspense mismatch
    const params = new URLSearchParams(window.location.search);
    setIsEditParam(params.get('edit') === 'true');

    // Store initial text value
    const isTagNameString = typeof tagName === 'string';
    const tagNameLower = isTagNameString ? tagName.toLowerCase() : '';
    if (elementRef.current && tagNameLower !== 'img' && type !== 'image') {
      initialTextRef.current = elementRef.current.innerText;
    }
  }, [tagName, type]);

  const isEditMode = isAdmin && isEditParam;
  const Tag = tagName === 'link' ? Link : tagName;
  const isTagNameString = typeof tagName === 'string';
  const tagNameLower = isTagNameString ? tagName.toLowerCase() : '';
  const isImg = tagNameLower === 'img' || type === 'image';

  const handleBlur = () => {
    if (!elementRef.current || isImg) return;
    
    const newText = elementRef.current.innerText.trim();
    const oldText = initialTextRef.current.trim();

    if (newText !== oldText) {
      // Store change globally
      window.liveEditChanges = window.liveEditChanges || {};
      window.liveEditChanges[path] = newText;

      // Dispatch event to update toolbar save button state
      window.dispatchEvent(new CustomEvent('live-edit-dirty'));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && tagName !== 'textarea' && !e.shiftKey) {
      e.preventDefault();
      elementRef.current?.blur();
    }
  };

  const handleImageClick = (e) => {
    if (isEditMode) {
      e.preventDefault();
      e.stopPropagation();

      let currentSrc = '';
      if (tagNameLower === 'img') {
        currentSrc = elementRef.current?.getAttribute('src') || '';
      } else {
        const nestedImg = elementRef.current?.querySelector('img');
        currentSrc = nestedImg?.getAttribute('src') || '';
      }

      const newSrc = prompt('Yeni görsel / resim URL adresini girin:', currentSrc);
      if (newSrc !== null && newSrc !== currentSrc) {
        if (tagNameLower === 'img') {
          elementRef.current.setAttribute('src', newSrc);
        } else {
          const nestedImg = elementRef.current?.querySelector('img');
          if (nestedImg) {
            nestedImg.setAttribute('src', newSrc);
          }
        }
        window.liveEditChanges = window.liveEditChanges || {};
        window.liveEditChanges[path] = newSrc;
        window.dispatchEvent(new CustomEvent('live-edit-dirty'));
      }
    }
  };

  const handleLinkEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentHref = props.href || '';
    const newHref = prompt('Yeni yönlendirme linkini (URL) girin:', currentHref);
    if (newHref !== null && newHref !== currentHref) {
      window.liveEditChanges = window.liveEditChanges || {};
      window.liveEditChanges[linkPath] = newHref;
      window.dispatchEvent(new CustomEvent('live-edit-dirty'));
      
      if (elementRef.current) {
        elementRef.current.setAttribute('href', newHref);
      }
    }
  };

  const handleClick = (e) => {
    if (isEditMode) {
      e.preventDefault(); // Stop click navigation on anchors/buttons
      e.stopPropagation();

      if (isImg) {
        handleImageClick(e);
      }
    }
  };

  const isBlockTag = typeof tagName === 'string' && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'section', 'ul', 'li', 'ol', 'form'].includes(tagName.toLowerCase());
  const defaultDisplay = isBlockTag ? 'block' : 'inline-block';
  const defaultWidth = isBlockTag ? '100%' : 'auto';

  return (
    <div 
      className={`live-editable-wrapper ${isEditMode ? 'wrapper-active' : ''}`}
      style={{ 
        position: 'relative', 
        display: style.display || defaultDisplay,
        width: style.width || defaultWidth,
        height: style.height || 'auto'
      }}
    >
      <Tag
        ref={elementRef}
        className={`live-editable-element ${className} ${isEditMode ? 'edit-active' : ''}`}
        style={{
          ...style,
          display: style.display === 'inline-flex' ? 'inline-flex' : (isBlockTag ? 'block' : 'inline-block')
        }}
        contentEditable={isEditMode && !isImg}
        suppressContentEditableWarning={true}
        onBlur={isImg ? undefined : handleBlur}
        onKeyDown={isImg ? undefined : handleKeyDown}
        onClick={isImg ? handleImageClick : handleClick}
        {...props}
      >
        {children}
      </Tag>

      {isEditMode && isImg && (
        <button
          onClick={handleImageClick}
          className="live-edit-overlay-btn image-btn"
          title="Görseli Değiştir"
        >
          ✏️ Görseli Değiştir
        </button>
      )}

      {isEditMode && linkPath && (
        <button
          onClick={handleLinkEdit}
          className="live-edit-overlay-btn link-btn"
          title="Linki Düzenle"
        >
          🔗 Linki Düzenle
        </button>
      )}

      <style jsx global>{`
        .live-editable-wrapper {
          transition: outline 0.2s ease;
        }
        .live-editable-wrapper.wrapper-active:hover {
          outline: 1.5px dashed rgba(0, 122, 255, 0.4);
          outline-offset: 4px;
        }
        .live-editable-element.edit-active {
          outline: 1.5px dashed rgba(0, 122, 255, 0.4);
          outline-offset: 4px;
          cursor: text;
          transition: outline-color 0.2s ease, background-color 0.2s ease;
        }

        .live-editable-element.edit-active:hover {
          outline-color: #007AFF;
          background-color: rgba(0, 122, 255, 0.05);
        }

        .live-editable-element.edit-active:focus {
          outline-color: #10B981;
          outline-style: solid;
          background-color: rgba(16, 185, 129, 0.03);
        }
        .live-edit-overlay-btn {
          position: absolute;
          background: #007AFF;
          color: #FFF;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          padding: 3px 8px;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          z-index: 999;
          font-family: system-ui, -apple-system, sans-serif;
          white-space: nowrap;
          opacity: 0.85;
          transition: opacity 0.2s, transform 0.2s;
        }
        .live-edit-overlay-btn:hover {
          opacity: 1;
          transform: scale(1.05);
        }
        .live-edit-overlay-btn.image-btn {
          top: 8px;
          right: 8px;
          background: #007AFF;
        }
        .live-edit-overlay-btn.link-btn {
          bottom: -22px;
          left: 50%;
          transform: translateX(-50%);
          background: #10B981;
        }
      `}</style>
    </div>
  );
}
