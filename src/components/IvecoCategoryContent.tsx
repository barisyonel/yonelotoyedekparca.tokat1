import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { Category } from '@/lib/models/Category';
import { slugify } from '@/lib/utils/slugify';

interface Props {
  parentCategory: Category;
  activeCategory: Category;
}

export default function IvecoCategoryContent({ parentCategory, activeCategory }: Props) {
  const categoryName = activeCategory.Name.toLowerCase();
  const is12014 = categoryName.includes('120-14') || categoryName.includes('12014');
  const is8512 = categoryName.includes('85-12') || categoryName.includes('8512');
  const is659 = categoryName.includes('65-9') || categoryName.includes('659');
  const is50NC = categoryName.includes('50nc') || categoryName.includes('50-nc');
  const isDaily = categoryName.includes('daily');

  // Model bazlı içerik
  const getModelContent = () => {
    if (is12014) {
      return {
        title: 'İveco Daily 120-14 Yedek Parça Kataloğu',
        intro: 'İveco Daily 120-14, ağır hizmet ticari araç segmentinde en güçlü ve dayanıklı modellerden biridir. Yüksek taşıma kapasitesi ve güçlü motor yapısı nedeniyle, bu model için özel olarak tasarlanmış yedek parçalar gereklidir.',
        features: [
          'Yüksek torklu motor parçaları (piston, silindir, krank mili)',
          'Ağır hizmet fren sistemi (balata, disk, kampana)',
          'Güçlendirilmiş şanzıman komponentleri',
          'Diferansiyel ve aks parçaları',
          'Süspansiyon sistemleri (yay, amortisör)',
        ],
        maintenance: 'İveco Daily 120-14 için periyodik bakım çok önemlidir. Özellikle fren sistemi ve motor parçaları düzenli kontrol edilmeli, ağır yük taşımacılığında kullanılan araçlarda bakım periyotları kısaltılmalıdır.',
        blogLink: '/blog/iveco-daily-yedek-parca-secimi-rehberi',
      };
    } else if (is8512) {
      return {
        title: 'İveco Daily 85-12 Yedek Parça Kataloğu',
        intro: 'İveco Daily 85-12, orta segment ticari araç kategorisinde en çok tercih edilen modellerden biridir. Şehir içi ve şehirlerarası taşımacılıkta ideal performans sunan bu model için geniş yedek parça yelpazesi sunuyoruz.',
        features: [
          'Motor aksamı parçaları (enjektör, turbo, EGR valfi)',
          'Fren sistemi (balata, disk, fren merkezi)',
          'Elektrik sistemi (alternatör, marş motoru, akü)',
          'Filtreler (hava, yağ, yakıt, polen)',
          'Kaporta ve aydınlatma parçaları',
        ],
        maintenance: 'İveco Daily 85-12 için önerilen bakım periyodu 10.000 km\'dir. Özellikle filtre değişimleri ve yağ kontrolleri düzenli yapılmalıdır.',
        blogLink: '/blog/iveco-daily-yedek-parca-secimi-rehberi',
      };
    } else if (is659) {
      return {
        title: 'İveco Daily 65-9 Yedek Parça Kataloğu',
        intro: 'İveco Daily 65-9, hafif ticari araç segmentinde şehir içi dağıtım ve kurye hizmetlerinde yaygın olarak kullanılan bir modeldir. Kompakt yapısı ve ekonomik yakıt tüketimi ile öne çıkan bu model için özel yedek parça çözümleri sunuyoruz.',
        features: [
          'Motor parçaları (piston, segman, supap)',
          'Fren sistemi (balata, disk, fren hortumu)',
          'Debriyaj sistemi (disk, bilya, rulman)',
          'Elektrik parçaları (sensörler, röleler)',
          'Kaporta parçaları (tampon, kapı, cam)',
        ],
        maintenance: 'İveco Daily 65-9 için stop-and-go kullanımda fren ve debriyaj sistemleri daha sık kontrol edilmelidir. Şehir içi kullanımda filtre değişimleri de önemlidir.',
        blogLink: '/blog/iveco-daily-yedek-parca-secimi-rehberi',
      };
    } else if (is50NC) {
      return {
        title: 'İveco Daily 50NC Yedek Parça Kataloğu',
        intro: 'İveco Daily 50NC, özellikle şehir içi taşımacılık ve kurye hizmetlerinde tercih edilen kompakt bir modeldir. Ekonomik işletme maliyetleri ve güvenilir yapısı ile öne çıkan bu model için kapsamlı yedek parça desteği sunuyoruz.',
        features: [
          'Motor aksamı (enjektör, yakıt pompası, turbo)',
          'Şanzıman parçaları (dişli setleri, senkromeç)',
          'Fren sistemi (balata, disk, fren merkezi)',
          'Elektrik sistemi (alternatör, marş motoru)',
          'Soğutma sistemi (radyatör, termostat, su pompası)',
        ],
        maintenance: 'İveco Daily 50NC için önerilen bakım periyodu 10.000 km\'dir. Özellikle şanzıman bakımı ve elektrik sistemi kontrolleri düzenli yapılmalıdır.',
        blogLink: '/blog/iveco-daily-yedek-parca-secimi-rehberi',
      };
    } else if (isDaily) {
      return {
        title: 'İveco Daily Yedek Parça Kataloğu',
        intro: 'İveco Daily serisi, Türkiye\'de en çok tercih edilen hafif ticari araç modellerinden biridir. 120-14, 85-12, 65-9, 50NC ve Eurobus modelleri için kapsamlı yedek parça kataloğu sunuyoruz.',
        features: [
          'Tüm model serileri için motor parçaları',
          'Fren sistemi komponentleri',
          'Şanzıman ve diferansiyel parçaları',
          'Elektrik ve elektronik parçalar',
          'Kaporta ve aydınlatma parçaları',
        ],
        maintenance: 'İveco Daily serisi için model bazlı bakım periyotları değişiklik gösterebilir. Genel olarak 10.000 km\'de periyodik bakım önerilir.',
        blogLink: '/blog/iveco-daily-yedek-parca-secimi-rehberi',
      };
    }
    return null;
  };

  const content = getModelContent();

  if (!content) {
    return null;
  }

  return (
    <Box
      component="section"
      sx={{
        mb: { xs: '1.5rem', md: '2rem' },
        p: { xs: '1.5rem', md: '2rem' },
        bgcolor: '#f9fafb',
        borderRadius: 2,
        border: '1px solid #e5e7eb',
      }}
    >
      {/* H2 Başlık - SEO için */}
      <Typography
        variant="h2"
        component="h2"
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 700,
          color: '#111827',
          mb: { xs: '1rem', md: '1.5rem' },
        }}
      >
        {content.title}
      </Typography>

      {/* Giriş Paragrafı */}
      <Typography
        component="p"
        sx={{
          fontSize: { xs: '1rem', md: '1.1rem' },
          lineHeight: 1.8,
          color: '#374151',
          mb: { xs: '1rem', md: '1.5rem' },
          fontWeight: 500,
        }}
      >
        {content.intro}
      </Typography>

      {/* Özellikler Bölümü */}
      <Box sx={{ mb: { xs: '1.5rem', md: '2rem' } }}>
        <Typography
          variant="h3"
          component="h3"
          sx={{
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 600,
            color: '#111827',
            mb: { xs: '0.75rem', md: '1rem' },
          }}
        >
          {activeCategory.Name} İçin Yedek Parça Kategorileri
        </Typography>
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: { xs: '0.75rem', md: '1rem' },
          }}
        >
          {content.features.map((feature, index) => (
            <Box
              key={index}
              component="li"
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                fontSize: { xs: '0.95rem', md: '1rem' },
                color: '#374151',
                lineHeight: 1.7,
              }}
            >
              <span style={{ color: '#a80000', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
              <span>{feature}</span>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Bakım Bilgisi */}
      <Box
        sx={{
          p: { xs: '1rem', md: '1.5rem' },
          bgcolor: '#fff',
          borderRadius: 2,
          border: '1px solid #e5e7eb',
          mb: { xs: '1.5rem', md: '2rem' },
        }}
      >
        <Typography
          variant="h3"
          component="h3"
          sx={{
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 600,
            color: '#111827',
            mb: { xs: '0.75rem', md: '1rem' },
          }}
        >
          Bakım ve Kullanım Önerileri
        </Typography>
        <Typography
          component="p"
          sx={{
            fontSize: { xs: '0.95rem', md: '1rem' },
            lineHeight: 1.8,
            color: '#374151',
            mb: { xs: '0.75rem', md: '1rem' },
          }}
        >
          {content.maintenance}
        </Typography>
        <Typography
          component="p"
          sx={{
            fontSize: { xs: '0.95rem', md: '1rem' },
            lineHeight: 1.8,
            color: '#374151',
          }}
        >
          <Link href={content.blogLink} style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
            İveco Daily bakım rehberimizi
          </Link>{' '}
          inceleyerek daha detaylı bilgi edinebilirsiniz. Ayrıca{' '}
          <Link href="/blog" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
            blog sayfamızda
          </Link>{' '}
          İveco modelleri hakkında daha fazla içerik bulabilirsiniz. 50+ yıllık tecrübemizle, doğru parça seçimi ve montaj konusunda size yardımcı oluyoruz.
        </Typography>
      </Box>

      {/* İçerik Bölümü - SEO için zengin içerik */}
      <Box sx={{ mb: { xs: '1.5rem', md: '2rem' } }}>
        <Typography
          variant="h3"
          component="h3"
          sx={{
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 600,
            color: '#111827',
            mb: { xs: '0.75rem', md: '1rem' },
          }}
        >
          {activeCategory.Name} Yedek Parça Temini
        </Typography>
        <Typography
          component="p"
          sx={{
            fontSize: { xs: '0.95rem', md: '1rem' },
            lineHeight: 1.8,
            color: '#374151',
            mb: { xs: '0.75rem', md: '1rem' },
          }}
        >
          <strong>Yönel Oto Yedek Parça</strong> olarak, <strong>{activeCategory.Name}</strong> modeli için{' '}
          {is12014 && (
            <>
              <Link href="/urunler/iveco/85-12" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
                İveco 85-12
              </Link>
              ,{' '}
              <Link href="/urunler/iveco/65-9" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
                İveco 65-9
              </Link>
              ,{' '}
              <Link href="/urunler/iveco/50nc" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
                İveco 50NC
              </Link>{' '}
              ve{' '}
            </>
          )}
          {is8512 && (
            <>
              <Link href="/urunler/iveco/120-14" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
                İveco 120-14
              </Link>
              ,{' '}
              <Link href="/urunler/iveco/65-9" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
                İveco 65-9
              </Link>
              ,{' '}
              <Link href="/urunler/iveco/50nc" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
                İveco 50NC
              </Link>{' '}
              ve{' '}
            </>
          )}
          {is659 && (
            <>
              <Link href="/urunler/iveco/120-14" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
                İveco 120-14
              </Link>
              ,{' '}
              <Link href="/urunler/iveco/85-12" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
                İveco 85-12
              </Link>
              ,{' '}
              <Link href="/urunler/iveco/50nc" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
                İveco 50NC
              </Link>{' '}
              ve{' '}
            </>
          )}
          {is50NC && (
            <>
              <Link href="/urunler/iveco/120-14" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
                İveco 120-14
              </Link>
              ,{' '}
              <Link href="/urunler/iveco/85-12" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
                İveco 85-12
              </Link>
              ,{' '}
              <Link href="/urunler/iveco/65-9" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
                İveco 65-9
              </Link>{' '}
              ve{' '}
            </>
          )}
          <Link href="/urunler/iveco/daily" style={{ color: '#a80000', textDecoration: 'none', fontWeight: 600 }}>
            İveco Daily
          </Link>{' '}
          modelleri için de geniş yedek parça stoğu bulunduruyoruz. Türkiye geneline hızlı teslimat ve güvenilir hizmet sunuyoruz.
        </Typography>
        <Typography
          component="p"
          sx={{
            fontSize: { xs: '0.95rem', md: '1rem' },
            lineHeight: 1.8,
            color: '#374151',
            mb: { xs: '0.75rem', md: '1rem' },
          }}
        >
          Her siparişte şasi numarası, ürün kodu veya katalog referansı ile eşleştirme yaparak aracın üretim yılına, motor tipine veya özel paketine göre doğru
          parçayı göndermeyi garanti ediyoruz. Orijinal yedek parçaların yanı sıra, OEM sertifikalı yan sanayi çözümleri de sunarak farklı bütçelere uygun
          alternatifler öneriyoruz.
        </Typography>
        <Typography
          component="p"
          sx={{
            fontSize: { xs: '0.95rem', md: '1rem' },
            lineHeight: 1.8,
            color: '#374151',
          }}
        >
          Sipariş öncesi ve sonrası teknik destek, montaj tavsiyeleri ve tork değerleri gibi detaylı bilgileri de müşterilerimizle paylaşıyoruz. 50+ yıllık
          tecrübemizle, <strong>{activeCategory.Name}</strong> yedek parça konusunda profesyonel destek sunuyoruz.
        </Typography>
      </Box>

      {/* FAQ Bölümü - SEO için */}
      <Box
        sx={{
          p: { xs: '1rem', md: '1.5rem' },
          bgcolor: '#fff',
          borderRadius: 2,
          border: '1px solid #e5e7eb',
        }}
      >
        <Typography
          variant="h3"
          component="h3"
          sx={{
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 600,
            color: '#111827',
            mb: { xs: '1rem', md: '1.5rem' },
          }}
        >
          Sık Sorulan Sorular
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: '1rem', md: '1.5rem' } }}>
          <Box>
            <Typography
              component="h4"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 600,
                color: '#111827',
                mb: '0.5rem',
              }}
            >
              {activeCategory.Name} için hangi yedek parçalar mevcut?
            </Typography>
            <Typography
              component="p"
              sx={{
                fontSize: { xs: '0.95rem', md: '1rem' },
                lineHeight: 1.7,
                color: '#374151',
              }}
            >
              {activeCategory.Name} için motor parçaları, fren sistemi, şanzıman komponentleri, filtreler, elektrik parçaları ve kaporta parçaları dahil olmak
              üzere geniş bir yedek parça yelpazesi sunuyoruz. Tüm ürünlerimiz orijinal veya OEM sertifikalı kalitededir.
            </Typography>
          </Box>
          <Box>
            <Typography
              component="h4"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 600,
                color: '#111827',
                mb: '0.5rem',
              }}
            >
              {activeCategory.Name} yedek parça fiyatları nasıl?
            </Typography>
            <Typography
              component="p"
              sx={{
                fontSize: { xs: '0.95rem', md: '1rem' },
                lineHeight: 1.7,
                color: '#374151',
              }}
            >
              {activeCategory.Name} yedek parça fiyatları, ürün tipine ve kalitesine göre değişiklik göstermektedir. Orijinal parçalar ve kaliteli yan sanayi
              seçenekleri sunuyoruz. Detaylı fiyat bilgisi için bizimle iletişime geçebilirsiniz.
            </Typography>
          </Box>
          <Box>
            <Typography
              component="h4"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 600,
                color: '#111827',
                mb: '0.5rem',
              }}
            >
              {activeCategory.Name} yedek parça teslimat süresi ne kadar?
            </Typography>
            <Typography
              component="p"
              sx={{
                fontSize: { xs: '0.95rem', md: '1rem' },
                lineHeight: 1.7,
                color: '#374151',
              }}
            >
              Stokta bulunan {activeCategory.Name} yedek parçaları için Türkiye geneline aynı gün kargo hizmeti sunuyoruz. Özel siparişler için teslimat süresi
              değişiklik gösterebilir.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
