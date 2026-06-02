import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HomeSlidersRepository from '@/lib/repositories/HomeSlidersRepository';
import HomeSlidersTable from './HomeSlidersTable';

export const dynamic = 'force-dynamic';

export default async function AdminHomeSlidersPage() {
  const sliders = await HomeSlidersRepository.findAll();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
          Anasayfa Slider Yönetimi
        </Typography>
      </Box>
      <HomeSlidersTable sliders={sliders} />
    </Box>
  );
}
