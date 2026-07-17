import type { Metadata } from 'next';
import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';
import ConditionalLayout from '@/components/ConditionalLayout';
import NavigationProgress from '@/components/NavigationProgress';
import { Suspense } from 'react';
import { staticAsset } from '@/lib/cloudinaryAssets';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.yonelotoyedekparca.com'),
  title: 'Yönel Oto Yedek Parça | Foton, Karataş, Iveco, Mutlu Akü',
  description: 'Foton traktör yedek parçaları, Iveco Daily, Karataş traktör, Ducato yedek parça ve Mutlu akü satışında Türkiye\'nin güvenilir adresi.',
  keywords: 'foton yedek parça, iveco daily yedek parça, karataş traktör, mutlu akü, ducato yedek parça',
  icons: {
    icon: staticAsset('/assets/logo1.png'),
    shortcut: staticAsset('/assets/logo1.png'),
    apple: staticAsset('/apple-touch-icon.png'),
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://www.yonelotoyedekparca.com',
    title: 'Yönel Oto Yedek Parça',
    description: 'Foton, Iveco, Karataş Traktör ve Mutlu Akü - 50+ yıllık tecrübe',
    images: [
      {
        url: staticAsset('/og-image.jpg'),
        width: 1200,
        height: 630,
        alt: 'Yönel Oto Yedek Parça',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yönel Oto Yedek Parça',
    description: 'Foton, Iveco, Karataş Traktör ve Mutlu Akü - 50+ yıllık tecrübe',
    images: [staticAsset('/twitter-image.jpg')],
  },
  alternates: {
    canonical: 'https://www.yonelotoyedekparca.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeRegistry>
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}

