import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import ProductsRepository from '@/lib/repositories/ProductsRepository';
import { extractIdFromSlug, slugify, generateProductUrl } from '@/lib/utils/slugify';
import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import OptimizedImage from '@/components/OptimizedImage';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: {
    slug: string[];
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slugString = params.slug.join('/');
  const productId = extractIdFromSlug(slugString);

  if (!productId) {
    return {
      title: 'Ürün Bulunamadı | Yönel Oto',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const product = await ProductsRepository.findById(productId);
  if (!product) {
    return {
      title: 'Ürün Bulunamadı | Yönel Oto',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const expectedUrlPart = generateProductUrl(product);
  const canonicalUrl = `https://www.yonelotoyedekparca.com/urunler/urun/${expectedUrlPart}`;

  // Optimize title with keywords
  const brandKeywords = product.CategoryName ? ` - ${product.CategoryName}` : '';
  const title = `${product.Name}${brandKeywords} Yedek Parça | Yönel Oto`;

  // Optimize description with keywords
  const description = product.Description
    ? `${product.Description} ${product.CategoryName ? product.CategoryName : ''} yedek parça. Orijinal parça, hızlı teslimat, Türkiye geneli kargo.`
    : `${product.Name} yedek parça. Orijinal ${product.CategoryName || 'yedek parça'}, hızlı teslimat, Türkiye geneli kargo hizmeti.`;

  // Keywords
  const keywords = [
    product.Name.toLowerCase(),
    product.CategoryName?.toLowerCase(),
    product.SubCategoryName?.toLowerCase(),
    'yedek parça',
    'orijinal parça',
    'türkiye geneli',
    'hızlı teslimat',
  ]
    .filter(Boolean)
    .join(', ');

  return {
    title,
    description: description.length > 160 ? description.substring(0, 157) + '...' : description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      images: product.ImageUrl
        ? [
            {
              url: product.ImageUrl,
              width: 1200,
              height: 630,
              alt: product.Name,
            },
          ]
        : [
            {
              url: '/og-image.jpg',
              width: 1200,
              height: 630,
              alt: product.Name,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.ImageUrl ? [product.ImageUrl] : ['/twitter-image.jpg'],
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
}

export default async function ProductDetailPage({ params }: PageProps) {
  const slugString = params.slug.join('/');
  const productId = extractIdFromSlug(slugString);

  if (!productId) {
    notFound();
  }

  const product = await ProductsRepository.findById(productId);

  if (!product) {
    notFound();
  }

  // SEO-friendly URL redirect
  const expectedUrlPart = generateProductUrl(product);

  if (slugString !== expectedUrlPart) {
    redirect(`/urunler/urun/${expectedUrlPart}`);
  }

  // Canonical URL
  const canonicalUrl = `https://www.yonelotoyedekparca.com/urunler/urun/${expectedUrlPart}`;

  // Back URL
  let backUrl = '/urunler';
  if (product.CategoryName) {
    const categorySlug = slugify(product.CategoryName);
    if (product.SubCategoryName) {
      backUrl = `/urunler/${categorySlug}/${slugify(product.SubCategoryName)}`;
    } else {
      backUrl = `/urunler/${categorySlug}`;
    }
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905542597273';
  const whatsappMessage = `Merhaba, "${product.Name}" ürünü hakkında bilgi almak istiyorum.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // JSON-LD Product Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.Name,
    description: product.Description || `${product.Name} yedek parça`,
    image: product.ImageUrl || 'https://www.yonelotoyedekparca.com/og-image.jpg',
    url: canonicalUrl,
    brand: {
      '@type': 'Brand',
      name: product.CategoryName || 'Yönel Oto',
    },
    category: product.SubCategoryName || product.CategoryName || 'Yedek Parça',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'TRY',
      url: canonicalUrl,
      seller: {
        '@type': 'Organization',
        name: 'Yönel Oto Yedek Parça',
        url: 'https://www.yonelotoyedekparca.com',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ana Sayfa',
        item: 'https://www.yonelotoyedekparca.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Ürünler',
        item: 'https://www.yonelotoyedekparca.com/urunler',
      },
      ...(product.CategoryName
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: product.CategoryName,
              item: `https://www.yonelotoyedekparca.com/urunler/${slugify(product.CategoryName)}`,
            },
          ]
        : []),
      ...(product.SubCategoryName
        ? [
            {
              '@type': 'ListItem',
              position: product.CategoryName ? 4 : 3,
              name: product.SubCategoryName,
              item: `https://www.yonelotoyedekparca.com/urunler/${slugify(product.CategoryName!)}/${slugify(product.SubCategoryName)}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: product.CategoryName && product.SubCategoryName ? 5 : product.CategoryName ? 4 : 3,
        name: product.Name,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumb */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumb
            items={[
              { label: 'Ürünler', href: '/urunler' },
              ...(product.CategoryName
                ? [{ label: product.CategoryName, href: `/urunler/${slugify(product.CategoryName)}` }]
                : []),
              ...(product.SubCategoryName
                ? [
                    {
                      label: product.SubCategoryName,
                      href: `/urunler/${slugify(product.CategoryName!)}/${slugify(product.SubCategoryName)}`,
                    },
                  ]
                : []),
              { label: product.Name },
            ]}
          />
        </Box>

        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            component={Link}
            href={backUrl}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#666',
              '&:hover': {
                bgcolor: '#f5f5f5',
              },
            }}
          >
            Geri Dön
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: '#f9fafb',
                borderRadius: 2,
                border: '1px solid #e5e7eb',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
              }}
            >
              {product.ImageUrl ? (
                <OptimizedImage
                  src={product.ImageUrl}
                  alt={product.Name}
                  width={600}
                  height={600}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 600,
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f0f0f0',
                    borderRadius: 2,
                  }}
                >
                  <Typography color="text.secondary">Görsel Yok</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* Product Name - H1 for SEO */}
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#111827',
                  fontSize: { xs: '1.75rem', md: '2rem' },
                }}
              >
                {product.Name}
              </Typography>

              {/* Categories */}
              {(product.CategoryName || product.SubCategoryName) && (
                <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {product.CategoryName && (
                    <Chip
                      label={product.CategoryName}
                      color="primary"
                      sx={{
                        bgcolor: '#a80000',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {product.SubCategoryName && (
                    <Chip
                      label={product.SubCategoryName}
                      variant="outlined"
                      sx={{
                        borderColor: '#a80000',
                        color: '#a80000',
                        fontWeight: 600,
                        borderWidth: 2,
                      }}
                    />
                  )}
                </Box>
              )}

              {/* Description */}
              {product.Description && (
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    lineHeight: 1.8,
                    color: '#374151',
                    fontSize: '1rem',
                  }}
                >
                  {product.Description}
                </Typography>
              )}

              {/* Features */}
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: '#f9fafb',
                  borderRadius: 2,
                  border: '1px solid #e5e7eb',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: '#111827' }}>
                  Ürün Özellikleri
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedIcon sx={{ color: '#10b981', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Orijinal ve garantili ürün
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalShippingOutlinedIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Türkiye geneli hızlı teslimat
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedIcon sx={{ color: '#10b981', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      50+ yıllık tecrübe ile güvenilir hizmet
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* CTA Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<WhatsAppIcon />}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: '#25D366',
                    '&:hover': { bgcolor: '#128C7E' },
                    fontWeight: 600,
                    py: 1.5,
                    fontSize: '1rem',
                  }}
                >
                  WhatsApp ile Bilgi Al
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  component={Link}
                  href={backUrl}
                  sx={{
                    borderColor: '#a80000',
                    color: '#a80000',
                    '&:hover': {
                      borderColor: '#8b0000',
                      bgcolor: '#fff5f5',
                    },
                    fontWeight: 600,
                    py: 1.5,
                    fontSize: '1rem',
                  }}
                >
                  Kategoriye Dön
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* SEO Rich Content */}
        <Box
          component="section"
          sx={{
            mt: 6,
            p: 3,
            bgcolor: '#f9fafb',
            borderRadius: 2,
            border: '1px solid #e5e7eb',
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              fontWeight: 700,
              mb: 2,
              color: '#111827',
            }}
          >
            {product.Name} Hakkında
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              color: '#374151',
              mb: 2,
            }}
          >
            <strong>Yönel Oto Yedek Parça</strong> olarak,{' '}
            {product.CategoryName && (
              <Link
                href={`/urunler/${slugify(product.CategoryName)}`}
                style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}
              >
                <strong>{product.CategoryName}</strong>
              </Link>
            )}{' '}
            markası için {product.Name} yedek parçasını Türkiye geneline hızlı ve güvenilir şekilde
            ulaştırıyoruz. Orijinal yedek parça garantisi, hızlı teslimat ve uzman teknik destek ile
            hizmetinizdeyiz.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              color: '#374151',
            }}
          >
            50+ yıllık tecrübemizle, doğru parça seçimi ve montaj tavsiyeleri konusunda size yardımcı
            oluyoruz. Sipariş öncesi ve sonrası teknik destek, WhatsApp üzerinden hızlı iletişim ve
            Türkiye geneli kargo hizmetimizle yanınızdayız.
          </Typography>
        </Box>
      </Container>
    </>
  );
}
