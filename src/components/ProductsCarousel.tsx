'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { PlainSliderImage } from '@/lib/serializeDb';
import { getSliderImageUrl } from '@/lib/utils/sliderImage';
import { IMAGE_QUALITY, PRODUCTS_CAROUSEL_SIZES } from '@/lib/imageConfig';

interface Props {
  sliders: PlainSliderImage[];
}

export default function ProductsCarousel({ sliders }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const total = sliders.length;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || total <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(interval);
  }, [total, isMounted, isPaused]);

  if (total === 0) return null;

  const renderSlides = (interactive: boolean) =>
    sliders.map((slider, index) => {
      const isActive = index === activeIndex;
      return (
        <div
          key={slider.Id}
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          onClick={interactive ? () => goTo(index) : undefined}
          onKeyDown={
            interactive
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goTo(index);
                  }
                }
              : undefined
          }
          className={`products-carousel-slide absolute inset-0 transition-opacity duration-700 ease-out ${
            isActive ? 'opacity-100 z-20' : 'opacity-0 z-10 pointer-events-none'
          } ${interactive && !isActive ? 'cursor-pointer' : ''}`}
          aria-hidden={!isActive}
        >
          <div className="relative w-full h-full products-carousel-frame rounded-2xl md:rounded-3xl overflow-hidden bg-[#0a1628] ring-1 ring-gray-200/80 shadow-[0_16px_48px_rgba(15,39,74,0.14)]">
            <Image
              src={getSliderImageUrl(slider.ImageUrl)}
              alt={`Yönel Oto ürünler sayfası banner görseli ${index + 1}`}
              fill
              className="products-carousel-img object-contain object-center"
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              quality={IMAGE_QUALITY.hero}
              sizes={PRODUCTS_CAROUSEL_SIZES}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0f274a]/20 via-transparent to-transparent pointer-events-none"
              aria-hidden
            />
          </div>
        </div>
      );
    });

  const shell = (
    <section
      className="products-carousel relative w-full mb-6 md:mb-8"
      aria-roledescription="carousel"
      aria-label="Ürünler sayfası slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full max-w-6xl mx-auto px-1 sm:px-0">
        {/* 1920×600 ≈ 16:5 — admin önerilen banner oranı */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[16/5]">
          <div className="absolute inset-0">{renderSlides(isMounted)}</div>

          {isMounted && total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="products-carousel-nav absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/95 text-[#0f274a] shadow-lg border border-gray-200/80 flex items-center justify-center hover:bg-white hover:scale-105 transition-all"
                aria-label="Önceki görsel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="products-carousel-nav absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/95 text-[#0f274a] shadow-lg border border-gray-200/80 flex items-center justify-center hover:bg-white hover:scale-105 transition-all"
                aria-label="Sonraki görsel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {isMounted && (
            <div className="absolute top-3 right-3 z-30 px-3 py-1 rounded-full text-xs md:text-sm font-bold text-white bg-gradient-to-r from-[#0f274a] to-primary shadow-md tabular-nums">
              {activeIndex + 1} / {total}
            </div>
          )}
        </div>

        {isMounted && total > 1 && (
          <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Slider görselleri">
            {sliders.map((slider, index) => (
              <button
                key={slider.Id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`${index + 1}. görsel`}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-8 bg-gradient-to-r from-[#173a69] via-primary to-[#c8102e]'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .products-carousel-frame :global(img) {
          object-fit: contain !important;
          object-position: center !important;
        }
      `}</style>
    </section>
  );

  if (!isMounted) {
    return (
      <section className="products-carousel relative w-full mb-6 md:mb-8" aria-label="Ürünler sayfası slider">
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="relative w-full aspect-[16/9] sm:aspect-[16/5]">
            <div className="absolute inset-0">{renderSlides(false)}</div>
            <div className="absolute top-3 right-3 z-30 px-3 py-1 rounded-full text-xs font-bold text-white bg-primary">
              1 / {total}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return shell;
}
