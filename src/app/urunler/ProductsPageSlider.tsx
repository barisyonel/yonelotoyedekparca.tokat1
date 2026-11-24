import SliderImagesRepository from '@/lib/repositories/SliderImagesRepository';
import ProductsCarousel from '@/components/ProductsCarousel';

/** Slider ayrı Suspense ile yüklenir — ürün listesi bekletilmez */
export default async function ProductsPageSlider() {
  let sliders: Awaited<ReturnType<typeof SliderImagesRepository.findAll>> = [];
  try {
    sliders = await SliderImagesRepository.findAll();
  } catch {
    sliders = [];
  }

  if (sliders.length === 0) {
    return null;
  }

  return <ProductsCarousel sliders={sliders} />;
}
