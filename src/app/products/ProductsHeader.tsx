import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { resolveProductsHeading } from '@/app/products/heading';

interface Props {
  activeCategory?: { Name: string } | null;
  searchQuery?: string | null;
}

export default function ProductsHeader({ activeCategory, searchQuery }: Props) {
  const h1Text = resolveProductsHeading(activeCategory, searchQuery);
  const hasSearch = Boolean(searchQuery?.trim());

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
      {hasSearch && searchQuery && (
        <Typography 
          variant="body1" 
          sx={{ 
            mt: 1,
            color: '#666',
            fontSize: { xs: '0.9375rem', md: '1rem' },
          }}
        >
          &quot;{searchQuery}&quot; için arama sonuçları
        </Typography>
      )}
    </Box>
  );
}

