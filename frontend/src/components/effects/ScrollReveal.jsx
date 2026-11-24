import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ScrollReveal Component
 * Smooth 3D perspective entrance trigger powered by GSAP ScrollTrigger.
 */
export default function ScrollReveal({
  children,
  className = '',
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'scale'
  duration = 0.9,
  delay = 0,
  distance = 50,
  rotateX = 15,
  stagger = 0,
  start = 'top 85%',
  once = true,
  style = {},
  ...props
}) {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    let x = 0;
    let y = 0;
    let rX = 0;
    let rY = 0;

    if (direction === 'up') {
      y = distance;
      rX = rotateX;
    } else if (direction === 'down') {
      y = -distance;
      rX = -rotateX;
    } else if (direction === 'left') {
      x = distance;
      rY = -12;
    } else if (direction === 'right') {
      x = -distance;
      rY = 12;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          x,
          y,
          rotateX: rX,
          rotateY: rY,
          transformPerspective: 1000,
          scale: direction === 'scale' ? 0.92 : 1,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            once,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [direction, distance, duration, delay, rotateX, start, once, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`scroll-reveal-container ${className}`}
      style={{ willChange: 'transform, opacity', ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
