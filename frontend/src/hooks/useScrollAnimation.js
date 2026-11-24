import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Custom hook to bind GSAP ScrollTrigger 3D animations with automatic cleanup.
 *
 * @param {Function} animationCallback - Function receiving (ref.current, gsap, ScrollTrigger)
 * @param {Array} dependencies - Dependency array to trigger re-binding
 */
export function useScrollAnimation(animationCallback, dependencies = []) {
  const elementRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !elementRef.current) return;

    // Use gsap.context for scoped selector queries and clean unmounting
    const ctx = gsap.context(() => {
      if (typeof animationCallback === 'function') {
        animationCallback(elementRef.current, gsap, ScrollTrigger);
      }
    }, elementRef);

    return () => {
      ctx.revert(); // Automatically kills all ScrollTriggers and reverts inline styles
    };
  }, [prefersReducedMotion, ...dependencies]);

  return elementRef;
}

export default useScrollAnimation;
