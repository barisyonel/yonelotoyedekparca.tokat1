'use server';

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import HomeSlidersRepository from '@/lib/repositories/HomeSlidersRepository';

async function deleteFromCloudinary(publicId: string): Promise<void> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret || !publicId) return;

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest('hex');

    await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        public_id: publicId,
        timestamp,
        api_key: apiKey,
        signature,
      }),
    });
  } catch {
    // Non-critical
  }
}

function revalidateHomeSliderPaths() {
  revalidatePath('/admin/home-sliders');
  revalidatePath('/');
}

export async function createHomeSlider(formData: FormData) {
  try {
    const title = String(formData.get('title') || '').trim();
    const subtitle = String(formData.get('subtitle') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const imageUrl = String(formData.get('imageUrl') || '').trim();
    const cloudinaryPublicId = String(formData.get('cloudinaryPublicId') || '').trim();
    const buttonText = String(formData.get('buttonText') || '').trim();
    const buttonLink = String(formData.get('buttonLink') || '').trim();
    const sortOrder = Number(formData.get('sortOrder') || 0);
    const isActive = String(formData.get('isActive') || 'true') === 'true';

    if (!imageUrl || !cloudinaryPublicId) {
      return { success: false, error: 'Lütfen görsel yükleyin.' };
    }

    await HomeSlidersRepository.create({
      Title: title || '',
      Subtitle: subtitle || '',
      Description: description || '',
      ImageUrl: imageUrl,
      CloudinaryPublicId: cloudinaryPublicId,
      ButtonText: buttonText || '',
      ButtonLink: buttonLink || '/',
      SortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      IsActive: isActive,
    });

    revalidateHomeSliderPaths();
    return { success: true, message: 'Anasayfa sliderı eklendi.' };
  } catch (error) {
    console.error('createHomeSlider error:', error);
    return { success: false, error: 'Slider eklenemedi.' };
  }
}

export async function updateHomeSlider(id: number, formData: FormData) {
  try {
    const title = String(formData.get('title') || '').trim();
    const subtitle = String(formData.get('subtitle') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const imageUrl = String(formData.get('imageUrl') || '').trim();
    const cloudinaryPublicId = String(formData.get('cloudinaryPublicId') || '').trim();
    const buttonText = String(formData.get('buttonText') || '').trim();
    const buttonLink = String(formData.get('buttonLink') || '').trim();
    const sortOrder = Number(formData.get('sortOrder') || 0);
    const isActive = String(formData.get('isActive') || 'true') === 'true';

    if (!imageUrl || !cloudinaryPublicId) {
      return { success: false, error: 'Lütfen görsel yükleyin.' };
    }

    await HomeSlidersRepository.update(id, {
      Title: title || '',
      Subtitle: subtitle || '',
      Description: description || '',
      ImageUrl: imageUrl,
      CloudinaryPublicId: cloudinaryPublicId,
      ButtonText: buttonText || '',
      ButtonLink: buttonLink || '/',
      SortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      IsActive: isActive,
    });

    revalidateHomeSliderPaths();
    return { success: true, message: 'Anasayfa sliderı güncellendi.' };
  } catch (error) {
    console.error('updateHomeSlider error:', error);
    return { success: false, error: 'Slider güncellenemedi.' };
  }
}

export async function deleteHomeSlider(id: number) {
  try {
    const slider = await HomeSlidersRepository.findById(id);
    if (!slider) {
      return { success: false, error: 'Slider bulunamadı.' };
    }

    if (slider.CloudinaryPublicId) {
      await deleteFromCloudinary(slider.CloudinaryPublicId);
    }

    await HomeSlidersRepository.delete(id);
    revalidateHomeSliderPaths();
    return { success: true, message: 'Anasayfa sliderı silindi.' };
  } catch (error) {
    console.error('deleteHomeSlider error:', error);
    return { success: false, error: 'Slider silinemedi.' };
  }
}
