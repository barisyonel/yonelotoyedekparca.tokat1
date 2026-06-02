'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HOME_SLIDER_DEFAULTS } from '@/lib/homeSliderDefaults';

type SlideItem = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
};

const fallbackSlides: SlideItem[] = HOME_SLIDER_DEFAULTS.map((slide, index) => ({
  id: index + 1,
  title: slide.title,
  subtitle: slide.subtitle,
  description: slide.description,
  image: slide.image,
  buttonText: slide.buttonText,
  buttonLink: slide.buttonLink,
}));

interface Props {
  slides?: SlideItem[];
}

export default function ModernHeroSlider({ slides: incomingSlides }: Props) {
  const slides = incomingSlides && incomingSlides.length > 0 ? incomingSlides : fallbackSlides;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);

  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      <div className="relative gradient-box mobile-gradient-bg py-10 md:py-12 lg:py-16 px-4 md:px-6 lg:px-0 min-h-[620px] md:min-h-[680px] lg:min-h-0 lg:h-[540px] 2xl:h-[700px] overflow-hidden rounded-[24px] md:rounded-[30px] lg:rounded-[36px]">
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
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

        <div className="slider md:max-w-[760px] lg:max-w-[1000px] xl:max-w-[1200px] 2xl:max-w-[1440px] mx-auto relative lg:top-[46%] lg:-translate-y-1/2 h-[90vh] md:h-[640px] lg:h-full w-full lg:flex items-center z-10">
          <div className="slides relative w-full h-full">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`slide ${
                  index === currentSlide ? 'active' : ''
                } max-w-[350px] md:max-w-full w-full flex flex-col lg:flex-row justify-start lg:justify-center gap-8 md:gap-10 lg:gap-5 pb-28 md:pb-24 lg:pb-0`}
              >
                <div className="lg:w-1/2 md:mt-4 lg:mt-[100px] pl-1 md:pl-2 lg:pl-3">
                  <p className="uppercase text-white text-sm tracking-wide font-medium">Yönel Oto</p>
                  <div className="mt-4 lg:mt-8 xl:mt-12">
                    <div className="flex flex-col md:flex-row md:max-w-[620px] lg:max-w-[560px] 2xl:max-w-[650px] gap-4 md:gap-6 lg:gap-8">
                      <div className="mt-2 shrink-0 w-12 h-12 rounded-full border-2 border-white/80 flex items-center justify-center">
                        <span className="text-white font-semibold">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <div className="backdrop-blur-[2px] bg-black/10 rounded-2xl p-3 md:p-4 border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                        <h2 className="text-[24px] leading-[30px] md:text-[30px] md:leading-[36px] lg:text-[36px] 2xl:text-[44px] 2xl:leading-[52px] text-white font-semibold lg:leading-[42px] tracking-[-0.64px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
                          {slide.title}
                        </h2>
                        {slide.subtitle ? (
                          <p className="text-white/95 mt-3 text-lg md:text-xl font-medium">{slide.subtitle}</p>
                        ) : null}
                        {slide.description ? (
                          <p className="text-white/90 mt-3 md:mt-4 max-w-[520px] text-[15px] md:text-base">{slide.description}</p>
                        ) : null}
                        {slide.buttonText ? (
                          <Link
                            href={slide.buttonLink || '/'}
                            className="inline-flex items-center gap-2 mt-4 md:mt-5 bg-white/15 hover:bg-white/25 border border-white/40 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:translate-y-[-1px] shadow-lg"
                          >
                            {slide.buttonText}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2 flex lg:justify-end">
                  <div
                    className="relative w-full md:w-[92%] md:mx-auto lg:w-full xl:w-[620px] 2xl:w-[720px] aspect-[9/7] rounded-[26px] lg:rounded-[40px] border border-white/60 shadow-[0_18px_50px_rgba(0,0,0,0.28)] bg-white/95 overflow-hidden"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover md:object-contain p-0 md:p-3 lg:p-4"
                      sizes="(max-width: 768px) 92vw, (max-width: 1200px) 48vw, 720px"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 rounded-[30px] lg:rounded-[40px] bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute max-w-[300px] md:max-w-[420px] lg:max-w-[450px] xl:max-w-[475px] 2xl:max-w-[550px] w-[92%] md:w-[90%] lg:w-full bottom-[-8px] md:bottom-[6px] lg:bottom-[-14px] xl:bottom-[-18px] left-1/2 -translate-x-1/2 lg:left-3 lg:translate-x-0">
            <div className="flex items-center gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`pagination-tabs ${index === currentSlide ? 'active' : ''}`}
                  aria-label={`${index + 1}. slayta git`}
                >
                  <div className="h-[3px] bg-white/95 w-full rounded-full" />
                  <p className="mt-2 uppercase text-white tracking-[2px] text-sm font-medium">{String(index + 1).padStart(2, '0')}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slide {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0;
          transition: opacity 1s ease-in-out;
          pointer-events: none;
        }

        .slide.active {
          opacity: 1;
          pointer-events: auto;
        }

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
            background: linear-gradient(90deg, #0f274a -0.15%, #173a69 24.85%, #7a1522 58.85%, #a80000 82.85%, #c8102e 99.85%);
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

