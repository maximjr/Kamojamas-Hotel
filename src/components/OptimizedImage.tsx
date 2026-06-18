import React, { ImgHTMLAttributes, useEffect } from 'react';

export interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt: string; // Enforce alt attribute
  src: string;
  className?: string;
  loading?: "lazy" | "eager";
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

/**
 * A utility component for images that requires descriptive alt text for 
 * accessibility and SEO. Automatically implements lazy loading by default.
 */
export function OptimizedImage({ alt, src, className, loading = "lazy", ...props }: OptimizedImageProps) {
  useEffect(() => {
    if (!alt || alt.trim() === '' || alt.toLowerCase().includes('image') || alt.toLowerCase().includes('picture')) {
      console.warn(`Accessibility/SEO Warning: Image with src "${src}" has poor or missing alt text: "${alt}". Please use a descriptive, unique alt text without using words like "image" or "picture".`);
    }
  }, [alt, src]);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      {...props}
    />
  );
}
