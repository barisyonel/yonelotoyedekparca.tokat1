import { Metadata } from 'next';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Yönel Oto Yedek Parça',
  description:
    'Yönel Oto Yedek Parça mesafeli satış sözleşmesi ile online sipariş süreçleri, teslimat şartları ve iade kuralları hakkında detaylı bilgi alın.',
  keywords:
    'mesafeli satış sözleşmesi, online satış şartları, yonel oto, iveco yedek parça mesafeli satış, fiat ducato, foton traktör',
  alternates: {
    canonical: 'https://www.yonelotoyedekparca.com/mesafeli-satis-sozlesmesi',
  },
};

export default function DistanceSalesAgreementPage() {
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
          Mesafeli Satış Sözleşmesi
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
          <strong>Son Güncelleme:</strong> {lastUpdated}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            İşbu sözleşme, <strong>Yönel Oto Yedek Parça</strong> (Satıcı) ile yonelotoyedekparca.com üzerinden
            sipariş veren {`'Alıcı'`} arasında 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Satış
            Sözleşmeleri Yönetmeliği hükümlerine uygun olarak düzenlenmiştir.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            1. Sözleşmenin Konusu
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Alıcının, Satıcıya ait web sitesi üzerinden elektronik ortamda siparişini verdiği ürünün satış ve teslimatı ile
            ilgili olarak tarafların hak ve yükümlülüklerini düzenler.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            2. Ürünlerin Teslimatı
          </Typography>
          <Box component="ul" sx={{ pl: 3, lineHeight: 1.8 }}>
            <li>Ürünler, stok durumuna göre 1-3 iş günü içinde kargoya teslim edilir.</li>
            <li>Kargo sürecindeki olası gecikmeler taşıyıcı firmaların sorumluluğundadır.</li>
            <li>Teslimat sırasında paket üzerinde hasar görülmesi halinde tutanak tutulması gerekmektedir.</li>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            3. Ödeme ve Fatura Bilgileri
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Ödemeler banka havalesi/EFT veya anlaşmalı tahsilat yöntemleri ile yapılır. Her sipariş için e-fatura veya e-arşiv
            fatura düzenlenir ve alıcının e-posta adresine gönderilir.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            4. Cayma Hakkı ve İade
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Tüketiciler, teslimatı takip eden 14 gün içinde cayma hakkına sahiptir. Cayma hakkının kullanılabilmesi için:
          </Typography>
          <Box component="ul" sx={{ pl: 3, lineHeight: 1.8 }}>
            <li>Ürün kullanılmamış ve yeniden satışa uygun durumda olmalıdır.</li>
            <li>Orijinal ambalajı, aksesuarları ve fatura ile birlikte gönderilmelidir.</li>
            <li>Özel üretim veya müşteri talebine göre hazırlanan ürünlerde cayma hakkı geçerli değildir.</li>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            5. Garanti ve Servis
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            Satılan ürünler üretici/ithalatçı firmaların garanti şartlarına tabidir. Montaj ve kullanım hatalarından kaynaklı
            arızalar garanti kapsamı dışındadır. Teknik destek için uzman servis önerilir.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#2c3e50' }}>
            6. Uyuşmazlıkların Çözümü
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            İşbu sözleşmeden kaynaklanan uyuşmazlıklarda Ticaret Bakanlığı tarafından açıklanan parasal limitler dahilinde
            Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

