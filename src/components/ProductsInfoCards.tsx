'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ProductsInfoCards() {
  const features = [
    '✓ Orijinal ve Yan Sanayi Parçalar',
    '✓ 5000+ Ürün Çeşidi',
    '✓ Türkiye Geneli Hızlı Kargo',
    '✓ 50 Yıllık Tecrübe',
    '✓ Teknik Destek ve Danışmanlık',
    '✓ Mutlu Akü Yetkili Bayi',
  ];

  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      {/* Neden Yönel Oto Kartı */}
      <Card 
        sx={{ 
          mb: 4, 
          bgcolor: '#fef2f2', 
          border: '2px solid #dc2626',
          boxShadow: 3
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 3, 
              color: '#dc2626', 
              textAlign: 'center',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Neden Yönel Oto Yedek Parça?
          </Typography>
          <Grid container spacing={2}>
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#16a34a', fontSize: 24, flexShrink: 0 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                    {feature}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Ürün Etiketleri/Tags */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            mb: 3, 
            color: '#1a1a1a',
            fontSize: { xs: '1.25rem', md: '1.5rem' }
          }}
        >
          Popüler Ürün Kategorilerimiz
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {[
            'İveco Daily 65-9',
            'İveco 85-12',
            'İveco 120-14',
            'Ducato 2.3',
            'Ducato 3.0',
            'Foton 504',
            'Foton 604',
            'Karataş Traktör',
            'Mutlu Akü',
            'Motor Yağı',
            'Fren Balatası',
            'Yağ Filtresi',
            'Hava Filtresi',
            'Hidrolik Parça',
            'Debriyaj Seti',
            'Amortisör',
          ].map((tag, idx) => (
            <Box
              key={idx}
              sx={{
                px: 3,
                py: 1.5,
                bgcolor: '#dc2626',
                color: 'white',
                borderRadius: '25px',
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: 2,
                transition: 'all 0.3s',
                cursor: 'default',
                '&:hover': {
                  bgcolor: '#b91c1c',
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              {tag}
            </Box>
          ))}
        </Box>
      </Box>

      {/* SEO Zengin İçerik Kartı */}
      <Card sx={{ bgcolor: '#f9fafb', boxShadow: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 3, 
              color: '#1a1a1a',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Yönel Oto Yedek Parça - Türkiye&apos;nin Güvenilir Tedarikçisi
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph 
            sx={{ lineHeight: 2, mb: 3, fontSize: '1rem' }}
          >
            <strong>İveco Daily yedek parça</strong>, <strong>Fiat Ducato yedek parça</strong>, 
            <strong> Foton traktör yedek parça</strong> ve <strong>Karataş traktör</strong> parçaları 
            konusunda 50 yıllık tecrübemizle hizmet vermekteyiz. Tokat merkezli firmamız, Türkiye 
            geneline hızlı kargo ile ulaşmaktadır.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#dc2626' }}>
                🚗 İveco Daily & Fiat Ducato Yedek Parça
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                İveco Daily <strong>65-9 VOLAN DİŞLİSİ</strong>, <strong>85-12 fren balatası</strong>, 
                <strong> 120-14 motor parçaları</strong> ve <strong>50NC yağ filtresi</strong> gibi 
                tüm İveco Daily modelleri için orijinal ve yan sanayi yedek parçalar stoklarımızda. 
                Fiat Ducato <strong>2.3 motor</strong> ve <strong>3.0 motor serisi</strong> için 
                filtre sistemleri, fren balatası, hidrolik parçalar mevcuttur.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#dc2626' }}>
                🚜 Foton & Karataş Traktör Yedek Parça
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                <strong>Foton 504</strong>, <strong>Foton 604</strong> traktör modelleri ve tüm 
                Foton traktör serisi için motor parçaları, hidrolik sistem, filtre takımları, 
                debriyaj ve şanzıman yedek parçaları. <strong>Karataş traktör</strong> yedek 
                parçaları, <strong>Karataş motor yağları</strong>, hidrolik yağlar ve 
                <strong> Mutlu akü</strong> yetkili bayi olarak hizmetinizdeyiz.
              </Typography>
            </Grid>
          </Grid>

          <Box 
            sx={{ 
              p: 3, 
              bgcolor: '#fff', 
              borderRadius: 2,
              border: '1px solid #e5e7eb'
            }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 2, fontSize: '0.95rem' }}>
              <strong>Geniş ürün yelpazemizde:</strong> Motor yağları, yağ filtreleri, hava filtreleri, 
              yakıt filtreleri, fren balatası, fren diski, debriyaj seti, amortisör, rot balans, 
              hidrolik parçalar, şanzıman parçaları, motor contaları, kayışlar, rulmanlar, 
              <strong> Mutlu akü</strong> ve daha fazlası bulunmaktadır. Orijinal ve yan sanayi 
              seçenekleriyle, aynı gün kargo ve teknik destek hizmetimizle yanınızdayız.
            </Typography>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center', px: 3, py: 2, bgcolor: '#fff', borderRadius: 2, minWidth: '150px' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626' }}>
                5000+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ürün Çeşidi
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', px: 3, py: 2, bgcolor: '#fff', borderRadius: 2, minWidth: '150px' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626' }}>
                50 Yıl
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tecrübe
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', px: 3, py: 2, bgcolor: '#fff', borderRadius: 2, minWidth: '150px' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626' }}>
                7/24
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Destek
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

