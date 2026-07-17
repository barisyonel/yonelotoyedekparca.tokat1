'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HOME_SLIDER_DEFAULTS } from '@/lib/homeSliderDefaults';
import { getSliderImageUrl } from '@/lib/utils/sliderImage';
import { resolveHomeSliderCta } from '@/lib/utils/homeSliderLinks';
import { HERO_SLIDE_SIZES, IMAGE_QUALITY } from '@/lib/imageConfig';

type SlideItem = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
};

const fallbackSlides: SlideItem[] = HOME_SLIDER_DEFAULTS.map((slide, index) => {
  const cta = resolveHomeSliderCta(slide);
  return {
    id: index + 1,
    title: slide.title,
    subtitle: slide.subtitle,
    description: slide.description,
    image: slide.image,
    buttonText: cta.buttonText,
    buttonLink: cta.buttonLink,
  };
});

interface Props {
  slides?: SlideItem[];
}

export default function ModernHeroSlider({ slides: incomingSlides }: Props) {
  const raw = incomingSlides && incomingSlides.length > 0 ? incomingSlides : fallbackSlides;
  const slides = raw.map((slide) => {
    const cta = resolveHomeSliderCta(slide);
    return { ...slide, buttonText: cta.buttonText, buttonLink: cta.buttonLink };
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 px-2 sm:px-4">
      <div className="relative brand-hero-shell mobile-gradient-bg py-10 md:py-12 lg:py-16 px-4 md:px-6 lg:px-0 min-h-[620px] md:min-h-[680px] lg:min-h-0 lg:h-[540px] 2xl:h-[700px] overflow-hidden rounded-[24px] md:rounded-[30px] lg:rounded-[36px] shadow-[0_24px_80px_rgba(15,39,74,0.25)]">
        <div
          className="brand-hero-orb w-64 h-64 md:w-80 md:h-80 top-[-10%] right-[-5%] bg-[#f5c542]/25"
          style={{ animationDelay: '0s' }}
          aria-hidden
        />
        <div
          className="brand-hero-orb w-56 h-56 bottom-[-15%] left-[-8%] bg-[#173a69]/50"
          style={{ animationDelay: '2s' }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/15 pointer-events-none z-[2]" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="hidden md:block w-full absolute left-0 md:-left-[12%] top-0 h-full"
          viewBox="0 0 1200 540"
          fill="none"
          aria-hidden="true"
        >
          <path clipPath="url(#svgPath)" d="M1200 0H0V540H1200V0Z" fill="url(#paint0_linear_3178_781)" />
          <defs>
            <clipPath id="svgPath">
              <path d="M417.616 0C404.551 0 396.134 3.93474 389.697 10.2961L373.613 26.2278C371.249 28.575 366.793 30.0265 361.969 30.0265H21.5005C3.57885 30.0265 -5.38198 30.0265 -12.2272 33.5142C-18.2483 36.5822 -23.1437 41.4776 -26.2117 47.4988C-29.6995 54.3439 -29.6995 63.3048 -29.6995 81.2264V488.8C-29.6995 506.722 -29.6995 515.682 -26.2117 522.528C-23.1437 528.549 -18.2483 533.444 -12.2272 536.512C-5.38198 540 3.57886 540 21.5005 540H342.371C353.648 540 364.046 534.931 369.588 529.443L380.593 517.832C382.957 515.484 387.668 510.869 397.843 510.869H1148.44C1166.37 510.869 1175.33 510.869 1182.17 507.381C1188.19 504.314 1193.09 499.418 1196.16 493.397C1199.64 486.552 1199.64 477.591 1199.64 459.669V51.2C1199.64 33.2783 1199.64 24.3175 1196.16 17.4723C1193.09 11.4511 1188.19 6.55574 1182.17 3.48779C1175.33 0 1166.37 0 1148.44 0H417.616Z" />
            </clipPath>
            <linearGradient id="paint0_linear_3178_781" x1="-1.8522" y1="269.875" x2="1198.15" y2="269.875" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0F274A" />
              <stop offset="0.22" stopColor="#173A69" />
              <stop offset="0.55" stopColor="#7A1522" />
              <stop offset="0.82" stopColor="#A80000" />
              <stop offset="1" stopColor="#C8102E" />
            </linearGradient>
          </defs>
        </svg>

        <div className="hero-slider-viewport md:max-w-[760px] lg:max-w-[1000px] xl:max-w-[1200px] 2xl:max-w-[1440px] mx-auto relative lg:top-[46%] lg:-translate-y-1/2 w-full lg:flex lg:items-center z-[3] min-h-[500px] md:min-h-[580px] lg:min-h-0 lg:h-full">
          <div className="hero-slider-track w-full">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              if (!isActive) return null;

              return (
                <div key={slide.id} className="hero-slider-slide is-active">
                  <div className="w-full max-w-[350px] md:max-w-full mx-auto flex flex-col lg:flex-row justify-start lg:justify-center gap-6 md:gap-8 lg:gap-5 pb-36 md:pb-32 lg:pb-0">
                    <div className="hero-slide-copy lg:w-[46%] xl:w-[42%] mt-0 md:mt-2 lg:mt-[52px] xl:mt-[60px] lg:-translate-y-6 xl:-translate-y-8 lg:pb-4 pl-1 md:pl-2 lg:pl-3">
                      <p className="inline-flex items-center gap-2 uppercase text-white/95 text-xs md:text-sm tracking-[0.2em] font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f5c542] animate-pulse" />
                        Yönel Oto
                      </p>
                      <div className="mt-3 md:mt-4 lg:mt-8 xl:mt-12">
                        <div className="flex flex-col md:flex-row md:max-w-[620px] lg:max-w-[560px] 2xl:max-w-[650px] gap-4 md:gap-6 lg:gap-8">
                          <div className="mt-2 shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[#f5c542]/80 bg-white/10 flex items-center justify-center shadow-lg shadow-black/20">
                            <span className="text-white font-bold text-sm md:text-base">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <div className="brand-glass-panel rounded-2xl md:rounded-3xl p-4 md:p-5">
                            <p className="text-[24px] leading-[30px] md:text-[30px] md:leading-[36px] lg:text-[36px] 2xl:text-[44px] 2xl:leading-[52px] text-white font-semibold lg:leading-[42px] tracking-[-0.64px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.2)] m-0">
                              {slide.title}
                            </p>
                            {slide.subtitle ? (
                              <p className="text-white/95 mt-3 text-lg md:text-xl font-medium">{slide.subtitle}</p>
                            ) : null}
                            {slide.description ? (
                              <p className="text-white/90 mt-3 md:mt-4 max-w-[520px] text-[15px] md:text-base">
                                {slide.description}
                              </p>
                            ) : null}
                            <Link
                              href={slide.buttonLink}
                              className="brand-cta-btn inline-flex items-center gap-2 mt-4 md:mt-5 px-6 py-3 rounded-xl font-bold"
                            >
                              {slide.buttonText}
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-[54%] xl:w-[58%] flex lg:justify-end w-full">
                      <div className="hero-slide-media w-full max-w-[350px] sm:max-w-none md:w-[92%] md:mx-auto lg:w-full lg:max-w-[560px] xl:max-w-none xl:w-[700px] 2xl:w-[820px]">
                        <Link
                          href={slide.buttonLink}
                          className="hero-slide-image-card relative block w-full aspect-video overflow-hidden rounded-2xl md:rounded-3xl lg:rounded-[2rem] bg-[#0a1628] shadow-[0_20px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c542]"
                          aria-label={`${slide.title} — ${slide.buttonText}`}
                        >
                          <Image
                            src={getSliderImageUrl(slide.image)}
                            alt={`${slide.title} - Yönel Oto yedek parça`}
                            fill
                            className="hero-slide-img object-contain object-center transition-transform duration-500 hover:scale-[1.02]"
                            sizes={HERO_SLIDE_SIZES}
                            quality={IMAGE_QUALITY.hero}
                            priority={index === 0}
                            loading={index === 0 ? 'eager' : 'lazy'}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hero-slide-pagination absolute z-20 w-[92%] max-w-[300px] md:max-w-[420px] lg:max-w-[480px] xl:max-w-[520px] 2xl:max-w-[560px] bottom-4 md:bottom-5 lg:bottom-5 xl:bottom-6 left-1/2 -translate-x-1/2 lg:left-6 lg:translate-x-0 xl:left-8 md:mx-0 lg:mx-0 pointer-events-auto">
          <div className="flex items-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`pagination-tabs ${index === currentSlide ? 'active' : ''}`}
                aria-label={`${index + 1}. slayta git`}
              >
                <div className="h-[3px] w-full rounded-full overflow-hidden bg-white/25">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? 'w-full bg-gradient-to-r from-[#f5c542] via-white to-[#f5c542]'
                        : 'w-0 bg-white/60'
                    }`}
                  />
                </div>
                <p className="mt-2 uppercase text-white tracking-[2px] text-sm font-medium">
                  {String(index + 1).padStart(2, '0')}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .pagination-tabs {
          width: 75px;
          opacity: 0.5;
          transition: 600ms ease-out all;
          text-align: left;
        }

        .pagination-tabs.active {
          width: 200px;
          opacity: 1;
        }

        @media screen and (max-width: 760px) {
          .mobile-gradient-bg {
            background: var(--brand-gradient);
          }
        }

        @media screen and (min-width: 1400px) {
          .pagination-tabs.active {
            width: 300px;
          }
        }
      `}</style>
    </section>
  );
}
