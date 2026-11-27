import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import GradientText from './GradientText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SectionHeading Component
 * Unified, responsive, automotive-grade section header with eyebrow, title,
 * optional gradient highlighted keyword, decorative expanding underline,
 * and subtitle.
 */
export default function SectionHeading({
  eyebrow = '',
  eyebrowIcon: EyebrowIcon = null,
  liveDot = false,
  title = '',
  highlightWord = '',
  highlightVariant,
  subtitle = '',
  align = 'center',
  theme = 'light',
  level = 'h2',
  headingId,
  size = 'md',
  underline = true,
  animate = true,
  className = '',
  style = {},
  children,
}) {
  const containerRef = useRef(null);
  const underlineRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Dynamic semantic heading level tag
  const HeadingTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(level) ? level : 'h2';

  // Determine auto highlight variant if not explicitly given
  const effectiveHighlightVariant = highlightVariant || (theme === 'dark' ? 'emerald' : 'emerald-light');

  useEffect(() => {
    if (!animate || prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Staggered reveal for heading elements
      gsap.fromTo(
        '.sd-heading-anim-target',
        {
          opacity: 0,
          y: 28,
          rotateX: 12,
          transformPerspective: 800,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      );

      // Underline reveal animation
      if (underlineRef.current) {
        gsap.fromTo(
          underlineRef.current,
          { scaleX: 0, transformOrigin: align === 'center' ? 'center center' : align === 'right' ? 'right center' : 'left center' },
          {
            scaleX: 1,
            duration: 0.65,
            delay: 0.35,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [animate, prefersReducedMotion, title, subtitle, align]);

  // Render title with highlighted word(s)
  const renderTitle = () => {
    if (!highlightWord || typeof title !== 'string') return title;

    // Support multiple words if separated by comma or single word
    const words = Array.isArray(highlightWord)
      ? highlightWord
      : [highlightWord];

    let result = [title];

    words.forEach((word) => {
      if (!word) return;
      const nextResult = [];
      result.forEach((part) => {
        if (typeof part !== 'string') {
          nextResult.push(part);
          return;
        }

        const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const splitParts = part.split(regex);

        splitParts.forEach((sp, idx) => {
          if (sp.toLowerCase() === word.toLowerCase()) {
            nextResult.push(
              <GradientText
                key={`${word}-${idx}`}
                variant={effectiveHighlightVariant}
              >
                {sp}
              </GradientText>
            );
          } else if (sp) {
            nextResult.push(sp);
          }
        });
      });
      result = nextResult;
    });

    return result;
  };

  return (
    <div
      ref={containerRef}
      className={`sd-sec-heading align-${align} theme-${theme} size-${size} ${className}`}
      style={style}
    >
      {/* Eyebrow Label */}
      {eyebrow && (
        <div className="sd-heading-eyebrow-wrap sd-heading-anim-target">
          <span className="sd-heading-eyebrow">
            {liveDot && <span className="sd-eyebrow-live-dot" aria-hidden="true" />}
            {EyebrowIcon && <EyebrowIcon size={14} aria-hidden="true" />}
            <span>{eyebrow}</span>
          </span>
        </div>
      )}

      {/* Main Heading */}
      <HeadingTag id={headingId} className="sd-heading-title sd-heading-anim-target">
        {renderTitle()}
      </HeadingTag>

      {/* Decorative Accent Underline */}
      {underline && (
        <div className="sd-heading-underline-wrap" aria-hidden="true">
          <div ref={underlineRef} className="sd-heading-underline" />
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className="sd-heading-subtitle sd-heading-anim-target">
          {subtitle}
        </p>
      )}

      {children && (
        <div className="sd-heading-extra sd-heading-anim-target" style={{ marginTop: '1.25rem' }}>
          {children}
        </div>
      )}
    </div>
  );
}
