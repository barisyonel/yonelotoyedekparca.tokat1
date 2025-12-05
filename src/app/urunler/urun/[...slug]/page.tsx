import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import ProductsRepository from '@/lib/repositories/ProductsRepository';
import { extractIdFromSlug, slugify, generateProductUrl } from '@/lib/utils/slugify';
import { Metadata } from 'next';

// Force dynamic rendering to prevent build-time database connection
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
      title: 'Ürün Bulunamadı',
    };
  }

  const product = await ProductsRepository.findById(productId);

  if (!product) {
    return {
      title: 'Ürün Bulunamadı',
    };
  }

  const canonicalUrl = `https://www.yonelotoyedekparca.com/urunler/urun/${generateProductUrl(product)}`;
  
  const seoKeywords = [
    product.Name,
    product.CategoryName,
    product.SubCategoryName,
    'yedek parça',
    'orijinal yedek parça',
  ].filter(Boolean).join(', ');
  
  const ivecoModels = ['120-14', '85-12', '65-9', '50NC', 'Eurobus'];
  const ducatoModels = ['2.3', '3.0'];
  
  let enhancedKeywords = seoKeywords;
  const turkeyKeywords = ', online yedek parça, türkiye geneli yedek parça, tüm türkiye yedek parça, türkiye yedek parça satışı';
  
  if (product.CategoryName && product.CategoryName.toLowerCase().includes('iveco')) {
    enhancedKeywords += `, iveco daily ${ivecoModels.join(', iveco daily ')}, iveco daily yedek parça, iveco daily online, türkiye geneli iveco daily, tüm türkiye iveco yedek parça${turkeyKeywords}`;
  }
  if (product.CategoryName && (product.CategoryName.toLowerCase().includes('ducato') || product.CategoryName.toLowerCase().includes('fiat'))) {
    enhancedKeywords += `, fiat ducato ${ducatoModels.join(', fiat ducato ')}, ducato yedek parça, ducato online, türkiye geneli ducato, tüm türkiye ducato yedek parça${turkeyKeywords}`;
  }
  if (product.CategoryName && product.CategoryName.toLowerCase().includes('foton')) {
    enhancedKeywords += `, foton traktör yedek parça, foton traktör parçaları, foton traktör online, türkiye geneli foton traktör, tüm türkiye foton traktör${turkeyKeywords}`;
  }
  if (product.CategoryName && product.CategoryName.toLowerCase().includes('karataş')) {
    enhancedKeywords += `, karataş traktör yedek parça, karataş traktör parçaları, karataş traktör online, türkiye geneli karataş traktör, tüm türkiye karataş traktör${turkeyKeywords}`;
  }
  if (product.CategoryName && product.CategoryName.toLowerCase().includes('mutlu')) {
    enhancedKeywords += `, mutlu akü, mutlu akü fiyat, mutlu akü çeşitleri, mutlu akü online, türkiye geneli mutlu akü, tüm türkiye mutlu akü${turkeyKeywords}`;
  }
  
  if (!enhancedKeywords.includes('türkiye geneli')) {
    enhancedKeywords += turkeyKeywords;
  }

  return {
    title: `${product.Name} | ${product.CategoryName || 'Yedek Parça'} | Tüm Türkiye'ye Online Satış | Yönel Oto Yedek Parça`,
    description: product.Description || `${product.Name} - ${product.CategoryName || ''} yedek parça. Tüm Türkiye'ye online yedek parça satışı ve hızlı teslimat. Orijinal yedek parça. 50+ yıl tecrübe.`,
    keywords: enhancedKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.Name} | ${product.CategoryName || 'Yedek Parça'} | Tüm Türkiye'ye Online Satış | Yönel Oto Yedek Parça`,
      description: product.Description || `${product.Name} - ${product.CategoryName || ''} yedek parça. Tüm Türkiye'ye online yedek parça satışı ve hızlı teslimat. Orijinal yedek parça.`,
      images: product.ImageUrl ? [{ url: product.ImageUrl, width: 1200, height: 630, alt: product.Name }] : [{ url: '/og-image.jpg' }],
      type: 'website',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.Name} | Yönel Oto Yedek Parça`,
      description: product.Description || product.Name,
      images: product.ImageUrl ? [product.ImageUrl] : ['/twitter-image.jpg'],
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

  // --- YÖNLENDİRME KONTROLÜ ---
  const expectedUrlSlug = generateProductUrl(product);
  
  if (slugString !== expectedUrlSlug) {
      redirect(`/urunler/urun/${expectedUrlSlug}`);
  }
  // ---------------------------

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

  const visualBreadcrumbs = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Ürünler', href: '/urunler' },
    ...(product.CategoryName
      ? [{ label: product.CategoryName, href: `/urunler/${slugify(product.CategoryName)}` }]
      : []),
    ...(product.SubCategoryName && product.CategoryName
      ? [
          {
            label: product.SubCategoryName,
            href: `/urunler/${slugify(product.CategoryName)}/${slugify(product.SubCategoryName)}`,
          },
        ]
      : []),
    { label: product.Name },
  ];

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Visual Breadcrumb */}
        <Box component="nav" aria-label="breadcrumbs" sx={{ mb: 2, fontSize: '0.95rem', color: '#6b7280' }}>
          {visualBreadcrumbs.map((item, idx) => (
            <Box component="span" key={`${item.label}-${idx}`}>
              {item.href ? (
                <Link href={item.href} className="text-primary hover:underline">
                  {item.label}
                </Link>
              ) : (
                <Typography component="span" sx={{ fontWeight: 600, color: '#111827' }}>
                  {item.label}
                </Typography>
              )}
              {idx < visualBreadcrumbs.length - 1 && <span style={{ margin: '0 4px' }}>/</span>}
            </Box>
          ))}
        </Box>

        {/* Geri Butonu */}
        <Box sx={{ mb: 3 }}>
          <Link href={backUrl} style={{ textDecoration: 'none' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="primary"
              sx={{
                borderWidth: 2,
                fontWeight: 600,
                px: 3,
                py: 1.5,
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'primary.main',
                  color: 'white',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Ürünlere Geri Dön
            </Button>
          </Link>
        </Box>

        <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            {product.ImageUrl ? (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 400,
                  bgcolor: '#f5f5f5',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={product.ImageUrl}
                  alt={product.Name}
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
            ) : (
              <Box
                sx={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#f5f5f5',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Görsel Yok
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              {product.Name}
            </Typography>

            {/* Kategoriler */}
            {(product.CategoryName || product.SubCategoryName) && (
              <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {product.CategoryName && (
                  <Chip 
                    label={product.CategoryName} 
                    color="primary" 
                    size="medium"
                    sx={{ fontWeight: 600 }}
                  />
                )}
                {product.SubCategoryName && (
                  <Chip 
                    label={product.SubCategoryName} 
                    variant="outlined"
                    color="primary"
                    size="medium"
                    sx={{ fontWeight: 600, borderWidth: 2 }}
                  />
                )}
              </Box>
            )}

            {product.Description && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.8 }}
              >
                {product.Description}
              </Typography>
            )}

            {/* CTA */}
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                color="success"
                startIcon={<WhatsAppIcon />}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
                sx={{
                  bgcolor: '#25D366',
                  '&:hover': { bgcolor: '#128C7E' },
                  fontWeight: 600,
                  py: 2,
                  px: 4,
                }}
              >
                WhatsApp ile Bilgi Al
              </Button>
            </Box>

            {/* Product Features */}
            <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Ürün Özellikleri
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                ✓ Orijinal ve garantili ürün
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                ✓ Hızlı teslimat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ✓ Uzman destek
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
    </>
  );
}
