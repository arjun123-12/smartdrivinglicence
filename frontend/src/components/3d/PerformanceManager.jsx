import React, { useRef, useState, useEffect } from 'react';

/**
 * PerformanceManager
 * Wraps a WebGL Canvas and uses an IntersectionObserver to pause rendering
 * whenever the canvas scrolls out of viewport.
 * This completely prevents GPU battery drain and CPU contention!
 */
export default function PerformanceManager({ children, className = '', style = {} }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`webgl-performance-wrapper ${className}`}
      style={{ position: 'relative', width: '100%', height: '100%', ...style }}
    >
      {isVisible ? children : null}
    </div>
  );
}
