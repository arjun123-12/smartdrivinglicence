import React from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * RevealText Component
 * Word-by-word or span-based text reveal with CSS hardware-accelerated transitions.
 */
export default function RevealText({
  text = '',
  as: Component = 'span',
  stagger = 0.05,
  delay = 0,
  className = '',
  style = {},
}) {
  const prefersReducedMotion = useReducedMotion();

  if (!text || typeof text !== 'string') return text;

  if (prefersReducedMotion) {
    return <Component className={className} style={style}>{text}</Component>;
  }

  const words = text.split(' ');

  return (
    <Component className={`sd-reveal-text-wrap ${className}`} style={style}>
      {words.map((word, idx) => (
        <span
          key={idx}
          className="sd-reveal-word"
          style={{
            display: 'inline-block',
            marginRight: '0.28em',
            animation: `sd-word-reveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) both`,
            animationDelay: `${delay + idx * stagger}s`,
          }}
        >
          {word}
        </span>
      ))}
    </Component>
  );
}
