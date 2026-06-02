import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SliderImagesRepository from '@/lib/repositories/SliderImagesRepository';
import SlidersTable from './SlidersTable';

export const dynamic = 'force-dynamic';

export default async function AdminSlidersPage() {
  const sliders = await SliderImagesRepository.findAll();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
          Ürün Sayfası Slider Yönetimi
        </Typography>
      </Box>
      <SlidersTable sliders={sliders} />
    </Box>
  );
}
