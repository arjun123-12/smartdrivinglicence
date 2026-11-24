import React from 'react';
import SectionHeading from '../typography/SectionHeading';

/**
 * AnimatedHeading Component
 * Proxies to the unified automotive SectionHeading component for complete backwards compatibility.
 */
export default function AnimatedHeading({
  title = '',
  subtitle = '',
  highlightWord = '',
  badgeText = '',
  align = 'center',
  theme = 'dark',
  className = '',
  ...props
}) {
  return (
    <SectionHeading
      eyebrow={badgeText}
      title={title}
      highlightWord={highlightWord}
      subtitle={subtitle}
      align={align}
      theme={theme}
      className={className}
      {...props}
    />
  );
}
