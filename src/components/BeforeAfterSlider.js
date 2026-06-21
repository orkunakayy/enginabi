"use client";

import { useState, useRef, useEffect } from 'react';

export default function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel = "Öncesi", afterLabel = "Sonrası" }) {
  const [percentage, setPercentage] = useState(50);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const moveSlider = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const position = clientX - rect.left;
    let newPercentage = (position / rect.width) * 100;

    if (newPercentage < 0) newPercentage = 0;
    if (newPercentage > 100) newPercentage = 100;

    setPercentage(newPercentage);
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    moveSlider(e.clientX);
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    if (e.touches.length > 0) {
      moveSlider(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      moveSlider(e.clientX);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      if (e.touches.length > 0) {
        moveSlider(e.touches[0].clientX);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div 
      className="before-after-slider" 
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="ba-image ba-before">
        <img src={beforeImage} alt="Öncesi" />
      </div>
      <div 
        className="ba-image ba-after" 
        style={{ 
          clipPath: `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`, 
          width: '100%' 
        }}
      >
        <img src={afterImage} alt="Sonrası" />
      </div>
      <div className="ba-handle" style={{ left: `${percentage}%` }}>
        <div className="ba-handle-button">
          <svg viewBox="0 0 24 24"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/></svg>
        </div>
      </div>
      <div className="ba-label ba-label-before">{beforeLabel}</div>
      <div className="ba-label ba-label-after">{afterLabel}</div>
    </div>
  );
}
