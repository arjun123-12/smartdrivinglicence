import React from 'react';

/**
 * CardHeading Component
 * Standardized typography for card, module, and feature titles.
 */
export default function CardHeading({
  title = '',
  level = 'h3',
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon = null,
  badge = '',
  theme = 'light', // 'light' | 'dark'
  className = '',
  style = {},
  children,
}) {
  const HeadingTag = ['h2', 'h3', 'h4', 'h5', 'h6'].includes(level) ? level : 'h3';

  return (
    <div className={`sd-card-heading-container ${className}`} style={{ marginBottom: '0.65rem', ...style }}>
      <HeadingTag className={`sd-card-heading theme-${theme} size-${size}`}>
        {Icon && <Icon size={18} className="sd-card-heading-icon" aria-hidden="true" />}
        <span>{title || children}</span>
        {badge && (
          <span style={{
            fontSize: '0.725rem',
            padding: '2px 8px',
            borderRadius: '9999px',
            background: 'rgba(34, 197, 94, 0.15)',
            color: '#22c55e',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginLeft: 'auto',
          }}>
            {badge}
          </span>
        )}
      </HeadingTag>
    </div>
  );
}
