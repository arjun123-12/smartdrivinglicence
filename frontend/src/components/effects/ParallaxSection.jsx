import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ParallaxSection Component
 * Applies continuous Z-axis / Y-axis depth motion reacting smoothly to scroll position.
 */
export default function ParallaxSection({
  children,
  className = '',
  speed = 0.25, // -1 to 1: positive moves down slower, negative moves faster
  rotate = 0,
  style = {},
  ...props
}) {
  const targetRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !targetRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targetRef.current,
        { y: -50 * speed, rotateZ: -rotate },
        {
          y: 50 * speed,
          rotateZ: rotate,
          ease: 'none',
          scrollTrigger: {
            trigger: targetRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }, targetRef);

    return () => ctx.revert();
  }, [speed, rotate, prefersReducedMotion]);

  return (
    <div ref={targetRef} className={`parallax-section ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}
