import { Metadata } from 'next';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

export const metadata: Metadata = {
  title: 'İade ve Değişim Politikası | Yönel Oto Yedek Parça',
  description:
    'Yönel Oto Yedek Parça iade ve değişim politikası ile kullanılmamış, zarar görmemiş ürünler için haklarınızı hemen öğrenin.',
  keywords:
    'iade politikası, değişim politikası, kullanılmamış ürün iadesi, foton traktör iade, iveco yedek parça değişim',
  alternates: {
    canonical: 'https://www.yonelotoyedekparca.com/iade-ve-degisim',
  },
};

export default function ReturnAndExchangePage() {
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
          İade ve Değişim Politikası
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
          <strong>Son Güncelleme:</strong> {lastUpdated}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Müşteri memnuniyeti bizim için önceliklidir. Yasal mevzuata uygun olarak{' '}
            <strong>kullanılmayan, zarar görmemiş ve herhangi bir işlem görmemiş ürünlerde iade ve değişim hakları vardır.</strong> 
            İade/değişim sürecinin hızlı ilerlemesi için lütfen aşağıdaki koşullara dikkat edin.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            1. İade Süresi
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Mesafeli satışlarda, ürünün tesliminden itibaren 14 gün içinde cayma hakkınızı kullanabilirsiniz.
            Yetkili servis montajı gerektiren ürünlerde, montaj öncesinde iade süreci başlatılmalıdır.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            2. İade Koşulları
          </Typography>
          <Box component="ul" sx={{ pl: 3, lineHeight: 1.8 }}>
            <li>Ürün kullanılmamış, çizik veya darbe almamış olmalıdır.</li>
            <li>Orijinal ambalajı, aksesuarları, faturası ve varsa hediye ürünlerle birlikte gönderilmelidir.</li>
            <li>Elektronik parçalarda montaj sonrası meydana gelen arızalar garanti prosedürüne tabidir.</li>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            3. Değişim Süreci
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Stokta bulunan ürünler için değişim talepleri 3 iş günü içinde sonuçlandırılır. Stok bulunmaması halinde
            müşteri ile iletişime geçilerek alternatif ürün veya iade seçeneği sunulur.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            4. Kargo ve Ücret İadeleri
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Ürünün ayıplı çıkması durumunda kargo ücreti tarafımızca karşılanır. Cayma hakkı kapsamında yapılan iade
            gönderilerinde kargo bedeli müşteriye aittir. Onaylanan iade bedelleri 5-7 iş günü içinde aynı ödeme
            kanalına yapılır.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            5. İletişim ve Destek
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            İade ve değişim taleplerinizi <strong>tokatyonelotoyedekparca@gmail.com</strong> adresine veya{' '}
            <strong>0 (554) 259 72 73</strong> numaralı WhatsApp hattımıza iletebilirsiniz. Tüm süreçler kayıt altına
            alınır ve şeffaf şekilde ilerletilir.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

