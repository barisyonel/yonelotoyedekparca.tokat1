'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Image from 'next/image';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import type { PlainHomeSlider } from '@/lib/serializeDb';
import { createHomeSlider, deleteHomeSlider, updateHomeSlider } from './actions';

interface Props {
  sliders: PlainHomeSlider[];
}

interface HomeSliderFormData {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  buttonText: string;
  buttonLink: string;
  sortOrder: number;
  isActive: boolean;
}

const initialForm: HomeSliderFormData = {
  title: '',
  subtitle: '',
  description: '',
  imageUrl: '',
  cloudinaryPublicId: '',
  buttonText: '',
  buttonLink: '/urunler',
  sortOrder: 0,
  isActive: true,
};

export default function HomeSlidersTable({ sliders }: Props) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<HomeSliderFormData>(initialForm);

  const handleOpenDialog = (slider?: PlainHomeSlider) => {
    if (slider) {
      setFormData({
        id: slider.Id,
        title: slider.Title,
        subtitle: slider.Subtitle,
        description: slider.Description,
        imageUrl: slider.ImageUrl,
        cloudinaryPublicId: slider.CloudinaryPublicId,
        buttonText: slider.ButtonText,
        buttonLink: slider.ButtonLink,
        sortOrder: slider.SortOrder,
        isActive: slider.IsActive,
      });
    } else {
      setFormData(initialForm);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData(initialForm);
  };

  const handleImageUpload = (url: string, publicId: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url, cloudinaryPublicId: publicId }));
  };

  const handleSubmit = async () => {
    if (!formData.imageUrl || !formData.cloudinaryPublicId) {
      alert('Lütfen görsel yükleyin.');
      return;
    }

    setLoading(true);

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('subtitle', formData.subtitle);
    payload.append('description', formData.description);
    payload.append('imageUrl', formData.imageUrl);
    payload.append('cloudinaryPublicId', formData.cloudinaryPublicId);
    payload.append('buttonText', formData.buttonText);
    payload.append('buttonLink', formData.buttonLink);
    payload.append('sortOrder', String(formData.sortOrder));
    payload.append('isActive', String(formData.isActive));

    const result = formData.id ? await updateHomeSlider(formData.id, payload) : await createHomeSlider(payload);
    setLoading(false);

    if (result.success) {
      alert(result.message);
      handleCloseDialog();
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu anasayfa sliderını silmek istediğinize emin misiniz?')) return;

    setLoading(true);
    const result = await deleteHomeSlider(id);
    setLoading(false);

    if (result.success) {
      alert(result.message);
      router.refresh();
    } else {
      alert(result.error);
    }
  };

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddPhotoAlternateIcon />}
          onClick={() => handleOpenDialog()}
          disabled={loading}
          sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}
        >
          Anasayfa Slider Ekle
        </Button>
      </Box>

      <Grid container spacing={3}>
        {sliders.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f9fafb', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary">
                Henüz anasayfa sliderı eklenmemiş
              </Typography>
            </Box>
          </Grid>
        ) : (
          sliders.map((slider) => (
            <Grid item key={slider.Id} xs={12} md={6}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative', paddingTop: '42%', bgcolor: '#f3f4f6' }}>
                  <Image src={slider.ImageUrl} alt={slider.Title} fill style={{ objectFit: 'cover' }} unoptimized />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {slider.Title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {slider.Subtitle}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Buton: {slider.ButtonText} ({slider.ButtonLink})
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Sıra: {slider.SortOrder} | Durum: {slider.IsActive ? 'Aktif' : 'Pasif'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                  <IconButton onClick={() => handleOpenDialog(slider)} disabled={loading} sx={{ color: '#3b82f6' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(slider.Id)} disabled={loading} sx={{ color: '#dc2626' }}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{formData.id ? 'Anasayfa Slider Düzenle' : 'Anasayfa Slider Ekle'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
            <TextField
              label="Başlık"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Alt Başlık"
              value={formData.subtitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
              helperText="Opsiyonel"
              fullWidth
            />
            <TextField
              label="Açıklama"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              multiline
              minRows={2}
              helperText="Opsiyonel"
              fullWidth
            />
            <TextField
              label="Buton Metni"
              value={formData.buttonText}
              onChange={(e) => setFormData((prev) => ({ ...prev, buttonText: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Buton Linki"
              value={formData.buttonLink}
              onChange={(e) => setFormData((prev) => ({ ...prev, buttonLink: e.target.value }))}
              fullWidth
            />
            <TextField
              type="number"
              label="Sıralama"
              value={formData.sortOrder}
              onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: Number(e.target.value) || 0 }))}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
              }
              label="Aktif"
            />
            <CloudinaryUpload currentImageUrl={formData.imageUrl} onUploadSuccess={handleImageUpload} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} disabled={loading}>
            İptal
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{ bgcolor: '#dc2626' }}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
