'use server';

import SliderImagesRepository from '@/lib/repositories/SliderImagesRepository';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

// Cloudinary'den görsel silme fonksiyonu
async function deleteFromCloudinary(publicId: string): Promise<void> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary credentials eksik, görsel Cloudinary\'den silinemedi');
    return;
  }

  if (!publicId) {
    return;
  }

  try {
    // Cloudinary destroy API'sini kullanarak görseli sil
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          timestamp,
          api_key: apiKey,
          signature,
        }),
      }
    );

    const result = await response.json();

    if (result.result !== 'ok') {
      console.warn('Cloudinary silme uyarısı:', result);
    }
  } catch (error) {
    // Cloudinary silme hatası kritik değil, sadece logla
    console.warn('Cloudinary\'den görsel silinirken hata:', error);
  }
}

// GET - All slider images
export async function getSliderImages() {
  try {
    const sliders = await SliderImagesRepository.findAll();
    return { success: true, data: sliders };
  } catch (error) {
    console.error('Slider görselleri getirme hatası:', error);
    return { success: false, error: 'Slider görselleri getirilemedi' };
  }
}

// POST - Create slider image
export async function createSliderImage(formData: FormData) {
  try {
    const imageUrl = formData.get('imageUrl') as string;
    const cloudinaryPublicId = formData.get('cloudinaryPublicId') as string;

    if (!imageUrl || !cloudinaryPublicId) {
      return { success: false, error: 'Resim URL ve Public ID gerekli' };
    }

    await SliderImagesRepository.create({
      ImageUrl: imageUrl,
      CloudinaryPublicId: cloudinaryPublicId,
    });

    revalidatePath('/admin/sliders');
    revalidatePath('/');

    return { success: true, message: 'Slider görseli başarıyla eklendi!' };
  } catch (error) {
    console.error('Slider görseli oluşturma hatası:', error);
    return { success: false, error: 'Slider görseli eklenemedi' };
  }
}

// PUT - Update slider image
export async function updateSliderImage(id: number, formData: FormData) {
  try {
    const imageUrl = formData.get('imageUrl') as string;
    const cloudinaryPublicId = formData.get('cloudinaryPublicId') as string;

    if (!imageUrl || !cloudinaryPublicId) {
      return { success: false, error: 'Resim URL ve Public ID gerekli' };
    }

    await SliderImagesRepository.update(id, {
      ImageUrl: imageUrl,
      CloudinaryPublicId: cloudinaryPublicId,
    });

    revalidatePath('/admin/sliders');
    revalidatePath('/');

    return { success: true, message: 'Slider görseli başarıyla güncellendi!' };
  } catch (error) {
    console.error('Slider görseli güncelleme hatası:', error);
    return { success: false, error: 'Slider görseli güncellenemedi' };
  }
}

// DELETE - Delete slider image
export async function deleteSliderImage(id: number) {
  try {
    // Önce slider'ı bulalım
    const slider = await SliderImagesRepository.findById(id);
    if (!slider) {
      return { success: false, error: 'Slider görseli bulunamadı' };
    }

    // Cloudinary'den görseli sil (publicId varsa)
    if (slider.CloudinaryPublicId) {
      await deleteFromCloudinary(slider.CloudinaryPublicId);
    }

    // Veritabanından sil
    const success = await SliderImagesRepository.delete(id);
    if (!success) {
      return { success: false, error: 'Slider görseli veritabanından silinemedi' };
    }

    revalidatePath('/admin/sliders');
    revalidatePath('/');

    return { success: true, message: 'Slider görseli başarıyla silindi!' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    console.error('Slider görseli silme hatası:', errorMessage);
    
    // Veritabanı bağlantı hatası kontrolü
    if (errorMessage.includes('connection') || errorMessage.includes('timeout') || errorMessage.includes('ECONNREFUSED')) {
      return { 
        success: false, 
        error: 'Veritabanı bağlantı hatası. Lütfen daha sonra tekrar deneyin.' 
      };
    }

    return { 
      success: false, 
      error: `Slider görseli silinemedi: ${errorMessage}` 
    };
  }
}

