import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * DepthCarousel Component
 * High-end 3D perspective carousel.
 * Rotates cards in cylindrical 3D space with depth z-translation and interactive touch/keyboard navigation.
 */
export default function DepthCarousel({
  items = [],
  renderItem,
  autoPlay = true,
  interval = 5000,
  className = '',
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = items.length;

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    const timer = setInterval(handleNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, handleNext, total]);

  if (!items || total === 0) return null;

  return (
    <div className={`depth-carousel-container ${className}`}>
      <div className="depth-carousel-track">
        {items.map((item, index) => {
          let position = 'card-hidden';
          if (index === activeIndex) {
            position = 'card-active';
          } else if (index === (activeIndex - 1 + total) % total) {
            position = 'card-prev';
          } else if (index === (activeIndex + 1) % total) {
            position = 'card-next';
          }

          return (
            <div
              key={item.id || index}
              className={`depth-carousel-card ${position}`}
              onClick={() => {
                if (position === 'card-prev') handlePrev();
                if (position === 'card-next') handleNext();
              }}
            >
              {renderItem(item, index, index === activeIndex)}
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <div className="depth-carousel-controls">
          <button
            type="button"
            className="depth-nav-btn"
            onClick={handlePrev}
            aria-label="Previous card"
          >
            <ChevronLeft size={24} />
          </button>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {items.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setActiveIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                style={{
                  width: dotIdx === activeIndex ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '999px',
                  background: dotIdx === activeIndex ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
          <button
            type="button"
            className="depth-nav-btn"
            onClick={handleNext}
            aria-label="Next card"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
