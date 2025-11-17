import { Metadata } from 'next';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları | Yönel Oto Yedek Parça',
  description:
    'Yönel Oto Yedek Parça web sitesi kullanım koşulları, ziyaretçi sorumlulukları ve hizmet şartları hakkında detaylı bilgi alın.',
  keywords:
    'kullanım koşulları, hizmet şartları, yonel oto, iveco yedek parça, fiat ducato yedek parça, foton traktör, karataş traktör',
  alternates: {
    canonical: 'https://www.yonelotoyedekparca.com/kullanim-kosullari',
  },
};

export default function TermsOfUsePage() {
  const lastUpdated = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 800, color: '#a80000', mb: 3 }}
        >
          Kullanım Koşulları
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
          <strong>Son Güncelleme:</strong> {lastUpdated}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Bu kullanım koşulları, <strong>Yönel Oto Yedek Parça</strong> web sitesini ve hizmetlerini
            ziyaret eden tüm kullanıcılar için geçerlidir. Siteyi kullanarak aşağıdaki koşulları kabul etmiş
            sayılırsınız.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            1. Hizmet Tanımı
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Yönel Oto Yedek Parça, İveco Daily, Fiat Ducato, Foton Traktör ve Karataş Traktör gibi ticari
            ve tarımsal araçlara uygun orijinal yedek parça ve Mutlu akü satışı yapmaktadır. Site üzerinde
            sunulan tüm bilgiler bilgilendirme amaçlıdır, fiyat ve stok bilgileri değişiklik gösterebilir.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            2. Kullanıcı Sorumlulukları
          </Typography>
          <Box component="ul" sx={{ pl: 3, lineHeight: 1.8 }}>
            <li>Site üzerinden paylaşılan iletişim formları ve WhatsApp hattı sorumlu şekilde kullanılmalıdır.</li>
            <li>Kullanıcılar, sağladıkları bilgilerin doğru ve güncel olduğundan emin olmalıdır.</li>
            <li>Site içeriği izinsiz çoğaltılamaz, ticari amaçlarla kullanılamaz.</li>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            3. Fikri Mülkiyet Hakları
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Yönel Oto Yedek Parça markası, logosu, ürün görselleri ve tüm içerikler telif hakkı ile
            korunmaktadır. Yazılı izin olmadan kopyalanamaz veya dağıtılamaz.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            4. Sorumluluğun Sınırlandırılması
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Web sitemizde yer alan teknik bilgiler ve yönlendirmeler, genel nitelikte olup herhangi bir
            arıza veya montaj işlemi öncesinde uzman görüşü alınması önerilir. Dış bağlantılardan kaynaklanan
            sorunlardan firmamız sorumlu değildir.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            5. Değişiklik Hakkı
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Yönel Oto Yedek Parça, kullanım koşullarını dilediği zaman güncelleme hakkını saklı tutar.
            Güncel versiyon web sitemizde yayınlandığı andan itibaren geçerlidir.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            6. İletişim
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Kullanım koşulları hakkında sorularınız için{' '}
            <strong>tokatyonelotoyedekparca@gmail.com</strong> adresinden veya <strong>0 (554) 259 72 73</strong>{' '}
            numaralı telefondan bizimle iletişime geçebilirsiniz.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

