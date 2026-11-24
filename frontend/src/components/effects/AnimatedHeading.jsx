import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * AnimatedHeading Component
 * 3D typography reveal with letter/word perspective rotation on scroll.
 */
export default function AnimatedHeading({
  title = '',
  subtitle = '',
  highlightWord = '',
  badgeText = '',
  align = 'center',
  className = '',
}) {
  const headingRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !headingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.heading-anim-item',
        {
          opacity: 0,
          y: 35,
          rotateX: 25,
          transformPerspective: 800,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.12,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, headingRef);

    return () => ctx.revert();
  }, [title, subtitle, prefersReducedMotion]);

  const renderTitle = () => {
    if (!highlightWord) return title;
    const parts = title.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className="gradient-word">{highlightWord}</span>
        {parts[1] || ''}
      </>
    );
  };

  return (
    <div
      ref={headingRef}
      className={`section-header-3d ${className}`}
      style={{ textAlign: align }}
    >
      {badgeText && (
        <div style={{ marginBottom: '1rem' }} className="heading-anim-item">
          <span className="badge-3d">{badgeText}</span>
        </div>
      )}
      <h2 className="heading-3d-reveal heading-anim-item">
        {renderTitle()}
      </h2>
      {subtitle && (
        <p className="heading-3d-sub heading-anim-item">
          {subtitle}
        </p>
      )}
    </div>
  );
}
