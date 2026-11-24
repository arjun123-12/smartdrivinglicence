import React from 'react';
import GradientText from './GradientText';

/**
 * PageHeading Component
 * Unified cinematic page header used at the top of secondary pages.
 * Features specular radial highlights, precision automotive typography,
 * category pill badge, and flexible call-to-action actions.
 */
export default function PageHeading({
  badge = '',
  badgeIcon: BadgeIcon = null,
  liveDot = false,
  title = '',
  highlightWord = '',
  highlightVariant = 'emerald',
  subtitle = '',
  children,
  align = 'center',
  maxWidth = '920px',
  className = '',
  style = {},
}) {
  const renderTitle = () => {
    if (!highlightWord || typeof title !== 'string') return title;

    const regex = new RegExp(`(${highlightWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = title.split(regex);

    return parts.map((part, idx) => {
      if (part.toLowerCase() === highlightWord.toLowerCase()) {
        return (
          <GradientText key={idx} variant={highlightVariant}>
            {part}
          </GradientText>
        );
      }
      return part;
    });
  };

  return (
    <section className={`sd-page-banner ${className}`} style={style}>
      <div className="sd-page-banner-inner" style={{ maxWidth, textAlign: align }}>
        {badge && (
          <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <span className="sd-heading-eyebrow" style={{
              background: 'rgba(27, 108, 49, 0.25)',
              color: '#86efac',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 15px rgba(27, 108, 49, 0.2)',
            }}>
              {liveDot && <span className="sd-eyebrow-live-dot" aria-hidden="true" />}
              {BadgeIcon && <BadgeIcon size={14} aria-hidden="true" />}
              <span>{badge}</span>
            </span>
          </div>
        )}

        <h1 className="sd-page-banner-title">
          {renderTitle()}
        </h1>

        {subtitle && (
          <p className="sd-page-banner-desc">
            {subtitle}
          </p>
        )}

        {children && (
          <div className="sd-page-banner-actions">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
