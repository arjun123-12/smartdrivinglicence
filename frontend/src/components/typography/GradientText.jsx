import React from 'react';

/**
 * GradientText Component
 * Renders high-end automotive gradient typography with customizable variants.
 * 
 * Variants:
 * - 'emerald': Luxury emerald green gradient (on dark surfaces)
 * - 'emerald-light': High-contrast emerald-to-navy (on light surfaces)
 * - 'green': Pure brand green gradient
 * - 'navy': Deep navy gradient
 * - 'silver': Platinum silver sheen
 * - 'gold': Metallic gold accent
 */
export default function GradientText({
  children,
  variant = 'emerald',
  className = '',
  as: Component = 'span',
  style = {},
  ...props
}) {
  const variantClass = `gradient-text-${variant}`;

  return (
    <Component
      className={`${variantClass} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}
