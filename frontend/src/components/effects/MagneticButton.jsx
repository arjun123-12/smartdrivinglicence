import React, { useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * MagneticButton Component
 * Gives buttons an organic physical magnetic pull toward the cursor on hover.
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 20, // max pixel displacement
  variant = 'green', // 'green' | 'gold' | 'outline'
  as: Component = 'button',
  onClick,
  ...props
}) {
  const btnRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (e.clientX - centerX) / (width / 2);
    const deltaY = (e.clientY - centerY) / (height / 2);

    setPosition({
      x: deltaX * strength,
      y: deltaY * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="magnetic-btn-wrapper" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <Component
        ref={btnRef}
        className={`magnetic-btn ${variant === 'gold' ? 'btn-gold' : ''} ${className}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
        onClick={onClick}
        {...props}
      >
        {children}
      </Component>
    </div>
  );
}
