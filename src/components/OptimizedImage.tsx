'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoadComplete?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 75,
  sizes,
  className,
  style,
  objectFit = 'cover',
  onLoadComplete,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadComplete = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 rounded bg-gray-100 ${className ?? ''}`}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          ...style,
        }}
      >
        <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs text-gray-400">Görsel yüklenemedi</span>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className ?? ''}`}
      style={{
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        ...style,
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center rounded bg-gray-100">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        quality={quality}
        priority={priority}
        sizes={sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px'}
        onLoad={handleLoadComplete}
        onError={handleError}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        style={{
          objectFit,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </div>
  );
}
