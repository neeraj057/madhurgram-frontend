"use client";

import React, { useState, useEffect } from 'react';

interface BlogImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fallbackClassName?: string;
}

export default function BlogImage({
  src,
  alt,
  className,
  fallbackSrc = "/images/newlogo.svg",
  fallbackClassName = "w-full h-full object-contain p-12 opacity-30"
}: BlogImageProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={fallbackClassName}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
