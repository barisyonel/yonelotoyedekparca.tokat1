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
    return (
      <div
        className="mb-4 rounded-2xl bg-gray-100"
        style={{ height: 'clamp(280px, 35vh, 400px)' }}
      />
    );
  }

  return <ProductsCarousel sliders={sliders} />;
}
