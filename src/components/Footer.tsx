'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905542597273';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <Box
      component="footer"
      className="brand-footer-shell"
      sx={{
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        mt: 'auto',
      }}
    >
      <div className="brand-footer-glow brand-footer-glow--gold" aria-hidden />
      <div className="brand-footer-glow brand-footer-glow--navy" aria-hidden />
      <Box
        className="brand-footer-wave"
        sx={{ zIndex: 2 }}
        aria-hidden
      >
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: 48, display: 'block' }}>
          <path d="M0 48L60 38C120 28 240 8 360 4C480 0 600 12 720 18C840 24 960 24 1080 20C1200 16 1320 8 1380 4L1440 0V48H0Z" fill="rgba(255,255,255,0.08)" />
          <path d="M0 32L80 26C160 20 320 8 480 10C640 12 800 28 960 32C1120 36 1280 28 1360 24L1440 20V48H0V32Z" fill="rgba(255,255,255,0.05)" />
        </svg>
      </Box>
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: '2%', sm: '3%', md: '2%', lg: '1.5%' },
          py: { xs: '3rem', sm: '4rem', md: '5rem' },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h5"
              gutterBottom
              className="brand-section-title"
              sx={{
                color: 'white',
                fontWeight: 800,
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                mb: 2,
                textShadow: '0 2px 16px rgba(0,0,0,0.35)',
                letterSpacing: '0.02em',
              }}
            >
              YÖNEL OTO YEDEK PARÇA
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                lineHeight: 1.8,
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: { xs: '0.9375rem', md: '1rem' },
                mb: 3,
              }}
            >
              50+ yıllık tecrübe ile Foton traktör, Iveco Daily, Karataş traktör yedek parçaları
              ve Mutlu akü satışında Türkiye&apos;nin güvenilir adresi.
            </Typography>

            {/* Social Media */}
            <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
              <IconButton
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    bgcolor: '#25D366',
                    borderColor: '#25D366',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <WhatsAppIcon />
              </IconButton>
              <IconButton
                href="https://www.instagram.com/fethiynll?igsh=dmVwYnYycTMyamRn"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    bgcolor: '#E4405F',
                    borderColor: '#E4405F',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px rgba(228, 64, 95, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              gutterBottom
              className="brand-section-title"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                mb: 2.5,
                color: 'white',
              }}
            >
              Hızlı Linkler
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3 }}>
              {[
                { href: '/', label: 'Ana Sayfa' },
                { href: '/urunler', label: 'Ürünler' },
                { href: '/blog', label: 'Blog' },
                { href: '/hakkimizda', label: 'Hakkımızda' },
                { href: '/iletisim', label: 'İletişim' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9375rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffd700';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: '0.875rem', opacity: 0.7 }} />
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Product Categories - Enhanced with more internal links for SEO */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              gutterBottom
              className="brand-section-title"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                mb: 2.5,
                color: 'white',
              }}
            >
              Ürün Kategorileri
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3 }}>
              {[
                { href: '/urunler/iveco/daily', label: 'İveco Daily Yedek Parça' },
                { href: '/urunler/iveco/120-14', label: 'İveco 120-14 Yedek Parça' },
                { href: '/urunler/iveco/85-12', label: 'İveco 85-12 Yedek Parça' },
                { href: '/urunler/fiat/ducato', label: 'Fiat Ducato Yedek Parça' },
                { href: '/urunler/foton', label: 'Foton Traktör Yedek Parça' },
                { href: '/urunler/karatas', label: 'Karataş Traktör Yedek Parça' },
                { href: '/urunler/mutlu/aku', label: 'Mutlu Akü' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9375rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffd700';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: '0.875rem', opacity: 0.7 }} />
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              gutterBottom
              className="brand-section-title"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                mb: 2.5,
                color: 'white',
              }}
            >
              İletişim
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
              <Box
                component="a"
                href="tel:+905542597273"
                className="brand-footer-card"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#f5c542',
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PhoneIcon sx={{ fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.9375rem' }}>
                  0 (554) 259 72 73
                </Typography>
              </Box>

              <Box
                component="a"
                href="mailto:tokatyonelotoyedekparca@gmail.com"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#ffd700',
                    transform: 'translateX(5px)',
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EmailIcon sx={{ fontSize: '1.25rem' }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.9375rem',
                    wordBreak: 'break-word',
                  }}
                >
                  tokatyonelotoyedekparca@gmail.com
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.9375rem' }}>
                  Pzt-Cmt: 08:00 - 18:00
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocationOnIcon sx={{ fontSize: '1.25rem' }} />
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.9375rem' }}>
                  Tokat, Türkiye
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Yasal Metinler / Legal Documents */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              className="brand-section-title"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                mb: 2.5,
                color: 'white',
              }}
            >
              Yasal Metinler
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3 }}>
              <Link
                href="/kvkk"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9375rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffd700';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: '0.875rem', opacity: 0.7 }} />
                KVKK Aydınlatma Metni
              </Link>
              <Link
                href="/gizlilik-politikasi"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9375rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffd700';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: '0.875rem', opacity: 0.7 }} />
                Gizlilik Politikası
              </Link>
              <Link
                href="/kullanim-kosullari"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9375rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffd700';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: '0.875rem', opacity: 0.7 }} />
                Kullanım Koşulları
              </Link>
              <Link
                href="/mesafeli-satis-sozlesmesi"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9375rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffd700';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: '0.875rem', opacity: 0.7 }} />
                Mesafeli Satış Sözleşmesi
              </Link>
              <Link
                href="/iade-ve-degisim"
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9375rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffd700';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: '0.875rem', opacity: 0.7 }} />
                İade ve Değişim
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            mt: { xs: 4, md: 5 },
            pt: { xs: 3, md: 4 },
            textAlign: 'center',
            background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.12))',
            borderRadius: '1rem 1rem 0 0',
            mx: -1,
            px: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.85)',
              mb: 1,
              fontSize: { xs: '0.875rem', md: '0.9375rem' },
            }}
          >
            © {new Date().getFullYear()} Yönel Oto Yedek Parça. Tüm hakları saklıdır.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: { xs: '0.8125rem', md: '0.875rem' },
            }}
          >
            Designed by{' '}
            <Box
              component="a"
              href="https://www.bariscanyonel.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#ffd700',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                borderBottom: '1px solid transparent',
                '&:hover': {
                  borderBottom: '1px solid #ffd700',
                  color: '#ffed4e',
                },
              }}
            >
              Barış Can Yönel
            </Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

