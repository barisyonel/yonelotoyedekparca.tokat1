import { Metadata } from 'next';
import { staticAsset } from '@/lib/cloudinaryAssets';
import {
  BLOG_KEYWORDS_CORE,
  BLOG_SITE_URL,
  BLOG_TRUST_SHORT,
} from '@/lib/blog/trustCopy';

export const metadata: Metadata = {
  title: 'Blog | İveco Grubu Yedek Parça Rehberi - Yönel Oto Tokat',
  description:
    '45+ yıldır İveco grubunun tüm yedek parçalarını güvenle ve uygun fiyatla satıyoruz. İveco Daily, Ducato, Foton, Karataş bakım rehberleri. Tokat merkez, Türkiye geneli teslimat.',
  keywords: BLOG_KEYWORDS_CORE,
  openGraph: {
    title: 'Blog | İveco Grubu Yedek Parça Rehberi - Yönel Oto',
    description: BLOG_TRUST_SHORT,
    url: `${BLOG_SITE_URL}/blog`,
    type: 'website',
    locale: 'tr_TR',
    images: [
      {
        url: staticAsset('/og-image.jpg'),
        width: 1200,
        height: 630,
        alt: 'Yönel Oto Yedek Parça Blog - Tokat',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | İveco Grubu Yedek Parça Rehberi',
    description: BLOG_TRUST_SHORT,
    images: [staticAsset('/twitter-image.jpg')],
  },
  alternates: {
    canonical: `${BLOG_SITE_URL}/blog`,
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
