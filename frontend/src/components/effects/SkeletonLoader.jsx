import React from 'react';

/**
 * Premium automotive shimmer skeleton loader.
 * Used during async data fetching to prevent layout shifts and provide sleek visual feedback.
 */
export default function SkeletonLoader({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  style = {},
  className = '',
}) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(226, 232, 240, 0.6) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(226, 232, 240, 0.6) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-pulse 1.6s ease-in-out infinite',
        ...style,
      }}
    />
  );
}
