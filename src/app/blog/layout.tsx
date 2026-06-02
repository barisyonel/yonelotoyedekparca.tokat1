import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Yedek Parça Rehberi ve Bakım İpuçları - Yönel Oto',
  description: 'İveco Daily, Ducato, Foton, Karataş traktör bakım ve onarım rehberleri. 50+ yıl tecrübe ile hazırlanmış uzman tavsiyeleri.',
  keywords: 'iveco daily bakım, ducato yedek parça rehberi, foton traktör bakım ipuçları, karataş traktör onarım, mutlu akü bakımı, yedek parça seçimi, orijinal parça, yan sanayi parça',
  openGraph: {
    title: 'Blog | Yedek Parça Rehberi - Yönel Oto',
    description: 'İveco, Ducato, Foton ve Karataş için profesyonel yedek parça rehberleri. 50+ yıl tecrübe.',
    url: 'https://www.yonelotoyedekparca.com/blog',
    type: 'website',
    locale: 'tr_TR',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Yönel Oto Yedek Parça Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Yedek Parça Rehberi',
    description: 'İveco, Ducato, Foton ve Karataş bakım rehberleri',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.yonelotoyedekparca.com/blog',
  },
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
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
