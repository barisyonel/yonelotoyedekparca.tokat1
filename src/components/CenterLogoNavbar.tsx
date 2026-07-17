'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { staticAsset } from '@/lib/cloudinaryAssets';

const leftMenuItems = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Ürünler', href: '/urunler' },
];

const rightMenuItems = [
  { label: 'Blog', href: '/blog' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'İletişim', href: '/iletisim' },
];

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

export default function CenterLogoNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen, isMounted]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {!isScrolled && (
        <div className="brand-top-bar text-white nav-top-bar-enter">
          <div className="hidden lg:block py-2.5 px-4 relative z-10">
            <div className="container mx-auto flex justify-between items-center text-sm">
              <div className="flex gap-6">
                <a href="tel:05542597273" className="flex items-center gap-2 hover:text-[#f5c542] transition-colors">
                  <PhoneIcon />
                  <span>0 (554) 259 72 73</span>
                </a>
                <a
                  href="mailto:tokatyonelotoyedekparca@gmail.com"
                  className="flex items-center gap-2 hover:text-[#f5c542] transition-colors"
                >
                  <EmailIcon />
                  <span>tokatyonelotoyedekparca@gmail.com</span>
                </a>
              </div>
              <span className="font-semibold tracking-wide px-3 py-0.5 rounded-full bg-white/10 border border-white/20">
                50+ Yıllık Tecrübe
              </span>
            </div>
          </div>

          <div className="lg:hidden py-2 px-4 relative z-10">
            <div className="container mx-auto flex justify-between items-center text-xs">
              <a href="tel:05542597273" className="flex items-center gap-1.5 hover:text-[#f5c542] transition-colors">
                <PhoneIcon className="w-3.5 h-3.5" />
                <span className="font-semibold">0554 259 72 73</span>
              </a>
              <span className="font-semibold">50+ Yıl</span>
            </div>
          </div>
        </div>
      )}

      <nav
        className={`sticky left-0 right-0 z-50 transition-all duration-500 backdrop-blur-xl brand-navbar nav-bar-enter ${
          isScrolled ? 'brand-navbar--scrolled top-0' : 'top-[30px] lg:top-0'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between lg:justify-center h-20 lg:h-24">
            <div className="hidden lg:flex items-center gap-8 mr-12">
              {leftMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="brand-nav-link px-4 py-2 font-semibold text-base tracking-wide text-gray-800 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex-shrink-0 nav-logo-enter hover:scale-105 transition-transform duration-300">
              <Link href="/" className="block brand-logo-ring">
                <div className="relative h-16 lg:h-20 w-40 lg:w-52 bg-white/90 rounded-xl">
                  <Image
                    src={staticAsset('/assets/logo1.png')}
                    alt="Yönel Oto Yedek Parça"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                    quality={70}
                    sizes="(max-width: 1024px) 160px, 224px"
                  />
                </div>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-8 ml-12">
              {rightMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="brand-nav-link px-4 py-2 font-semibold text-base tracking-wide text-gray-800 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <button
              onClick={handleDrawerToggle}
              className="lg:hidden flex flex-col gap-1.5 w-10 h-10 justify-center items-center rounded-lg transition-all hover:bg-gray-100 ml-auto"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span
                className={`block h-0.5 w-6 rounded-full bg-gray-800 transition-all duration-300 ${
                  mobileOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 rounded-full bg-gray-800 transition-all duration-300 ${
                  mobileOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-0.5 w-6 rounded-full bg-gray-800 transition-all duration-300 ${
                  mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {isMounted && mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40 mobile-overlay-enter"
            onClick={handleDrawerToggle}
            aria-hidden
          />

          <div
            className="fixed inset-0 flex items-center justify-center lg:hidden z-50 p-4 mobile-panel-enter"
            onClick={handleDrawerToggle}
          >
            <div
              className="p-[2px] rounded-3xl bg-gradient-to-br from-[#173a69] via-[#a80000] to-[#f5c542] shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-[22px] p-8 relative w-full">
                <button
                  onClick={handleDrawerToggle}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex justify-center mb-8 pt-4">
                  <div className="relative h-20 w-48">
                    <Image
                      src={staticAsset('/assets/logo1.png')}
                      alt="Yönel Oto"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>

                <nav className="space-y-2">
                  {[...leftMenuItems, ...rightMenuItems].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleDrawerToggle}
                      className="block px-6 py-4 rounded-xl text-gray-800 font-semibold text-lg hover:bg-gradient-to-r hover:from-[#0f274a]/5 hover:to-primary/10 hover:text-primary transition-all text-center border border-transparent hover:border-primary/10"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                  <a
                    href="tel:05542597273"
                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-red-50 rounded-xl hover:shadow-md transition-all"
                  >
                    <PhoneIcon className="text-primary w-5 h-5" />
                    <span className="font-bold text-gray-900">0 (554) 259 72 73</span>
                  </a>
                </div>

                <p className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
                  Medya{' '}
                  <a
                    href="https://bariscanyonel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:text-red-800 hover:underline transition-colors"
                  >
                    Barış Can Yönel
                  </a>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
