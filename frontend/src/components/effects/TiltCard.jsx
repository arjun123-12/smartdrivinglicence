import React, { useRef, useState, useCallback } from 'react';

/**
 * TiltCard Component
 * High-performance 3D perspective tilt card that responds smoothly to mouse cursor position.
 * Features an internal specular glare reflection and depth layers.
 */
export default function TiltCard({
  children,
  className = '',
  maxTilt = 12,
  perspective = 1200,
  scale = 1.02,
  glare = true,
  style = {},
  ...props
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transformStyle, setTransformStyle] = useState('');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setTransformStyle(
        `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
      );
      setGlarePos({ x: glareX, y: glareY });
    },
    [maxTilt, perspective, scale]
  );

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      {...props}
    >
      <div
        className={`tilt-card-inner ${isHovered ? 'is-hovered' : ''}`}
        style={{
          transform: transformStyle,
          '--glare-x': `${glarePos.x}%`,
          '--glare-y': `${glarePos.y}%`,
        }}
      >
        {glare && <div className="tilt-card-glare" />}
        {children}
      </div>
    </div>
  );
}
