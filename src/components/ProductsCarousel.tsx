'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SliderImage } from '@/lib/models/SliderImage';

interface Props {
  sliders: SliderImage[];
}

export default function ProductsCarousel({ sliders }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || sliders.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliders.length, isMounted]);

  if (sliders.length === 0) return null;

  // Hydration için placeholder - server ve client aynı render
  if (!isMounted) {
    return (
      <div className="relative w-full mb-8 overflow-hidden">
        <div className="relative w-full" style={{ height: 'clamp(320px, 42vh, 520px)' }}>
          <div className="relative w-full h-full flex items-center justify-center">
            {sliders.map((slider, index) => (
              <div
                key={slider.Id}
                className="absolute w-[96%] md:w-[96%] lg:w-[88%] h-full rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                style={{
                  transform: 'translateX(0%) scale(1)',
                  zIndex: index === 0 ? 30 : 10,
                  opacity: index === 0 ? 1 : 0,
                }}
              >
                <div className="relative w-full h-full bg-white">
                  <Image
                    src={slider.ImageUrl}
                    alt={`Yönel Oto Yedek Parça - Görsel ${slider.Id}`}
                    fill
                    className="object-contain"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    quality={85}
                    sizes="(max-width: 768px) 90vw, 75vw"
                  />
                </div>
                {index === 0 && (
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-600 text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold shadow-lg">
                    1 / {sliders.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getSlideStyle = (index: number) => ({
    transform: 'translateX(0%) scale(1)',
    zIndex: index === activeIndex ? 30 : 10,
    opacity: index === activeIndex ? 1 : 0,
  });

  return (
    <div className="relative w-full mb-8 overflow-hidden">
      <div className="relative w-full" style={{ height: 'clamp(320px, 42vh, 520px)' }}>
        <div className="relative w-full h-full flex items-center justify-center">
          {sliders.map((slider, index) => {
            const style = getSlideStyle(index);
            return (
              <div
                key={slider.Id}
                className="absolute w-[96%] md:w-[96%] lg:w-[88%] h-full rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.12)] cursor-pointer transition-opacity duration-500 ease-out"
                style={style}
                onClick={() => setActiveIndex(index)}
              >
              {/* Image - No Padding, Full Fill */}
              <div className="relative w-full h-full bg-white">
                <Image
                  src={slider.ImageUrl}
                  alt={`Yönel Oto Yedek Parça - Görsel ${slider.Id}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  quality={85}
                  sizes="(max-width: 768px) 90vw, 75vw"
                />
              </div>
              
              {/* Active Badge */}
              {index === activeIndex && (
                <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-600 text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold shadow-lg">
                  {activeIndex + 1} / {sliders.length}
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

