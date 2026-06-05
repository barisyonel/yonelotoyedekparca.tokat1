'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
}

const directionClass: Record<NonNullable<Props['direction']>, string> = {
  up: 'scroll-fade-from-up',
  down: 'scroll-fade-from-down',
  left: 'scroll-fade-from-left',
  right: 'scroll-fade-from-right',
  none: '',
};

export default function ScrollFadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-fade-in ${directionClass[direction]} ${visible ? 'scroll-fade-in--visible' : ''} ${className}`}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
