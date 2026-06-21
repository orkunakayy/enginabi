"use client";

import { useState, useRef } from 'react';

export default function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`faq-item ${isOpen ? 'active' : ''}`}>
      <button className="faq-trigger" onClick={toggleAccordion}>
        <span>{question}</span>
        <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'var(--text-secondary)' }}>
          <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
        </svg>
      </button>
      <div 
        className="faq-content" 
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px'
        }}
      >
        <div className="faq-content-inner">
          {answer}
        </div>
      </div>
    </div>
  );
}
