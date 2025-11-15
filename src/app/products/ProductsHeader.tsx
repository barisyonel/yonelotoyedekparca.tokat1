'use client';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSearchParams } from 'next/navigation';

interface Props {
  activeCategory?: { Name: string } | null;
}

export default function ProductsHeader({ activeCategory }: Props) {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  
  // SEO için dinamik H1 - Optimized length (max 580 pixels ≈ 55-60 characters)
  let h1Text = 'Yedek Parça Kataloğu';
  
  // Önce kategoriye göre belirle
  if (activeCategory) {
    const categoryName = activeCategory.Name.toLowerCase();
    if (categoryName.includes('iveco')) {
      h1Text = 'İveco Daily Yedek Parçaları';
    } else if (categoryName.includes('ducato') || categoryName.includes('fiat')) {
      h1Text = 'Fiat Ducato Yedek Parçaları';
    } else if (categoryName.includes('foton')) {
      h1Text = 'Foton Traktör Yedek Parçaları';
    } else if (categoryName.includes('karataş')) {
      h1Text = 'Karataş Traktör Yedek Parçaları';
    } else if (categoryName.includes('mutlu')) {
      h1Text = 'Mutlu Akü Çeşitleri';
    } else {
      // Kategori adını kullan ama uzunsa kısalt
      h1Text = `${activeCategory.Name} Yedek Parçaları`;
      if (h1Text.length > 60) {
        h1Text = activeCategory.Name.length > 45 
          ? `${activeCategory.Name.substring(0, 45)}... Yedek Parça`
          : `${activeCategory.Name} Yedek Parça`;
      }
    }
  } else if (search) {
    // Arama terimi varsa özelleştir
    const searchLower = search.toLowerCase();
    if (searchLower.includes('iveco')) {
      h1Text = 'İveco Daily Yedek Parçaları';
    } else if (searchLower.includes('ducato') || searchLower.includes('fiat')) {
      h1Text = 'Fiat Ducato Yedek Parçaları';
    } else if (searchLower.includes('foton')) {
      h1Text = 'Foton Traktör Yedek Parçaları';
    } else if (searchLower.includes('karataş')) {
      h1Text = 'Karataş Traktör Yedek Parçaları';
    } else if (searchLower.includes('mutlu')) {
      h1Text = 'Mutlu Akü Çeşitleri';
    } else {
      // Arama terimini kullan ama uzunsa kısalt
      const searchText = search.length > 40 ? `${search.substring(0, 40)}...` : search;
      h1Text = `${searchText} Yedek Parçaları`;
    }
  }

  return (
    <Box sx={{ mb: { xs: '1.5rem', md: '2rem' } }}>
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          fontWeight: 800,
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem', lg: '2.5rem' },
          color: '#2c3e50',
          lineHeight: 1.2,
        }}
      >
        {h1Text}
      </Typography>
      {search && (
        <Typography 
          variant="body1" 
          sx={{ 
            mt: 1,
            color: '#666',
            fontSize: { xs: '0.9375rem', md: '1rem' },
          }}
        >
          &quot;{search}&quot; için arama sonuçları
        </Typography>
      )}
    </Box>
  );
}

