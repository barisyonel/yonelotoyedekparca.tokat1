import SliderImagesRepository from '@/lib/repositories/SliderImagesRepository';
import ProductsCarousel from '@/components/ProductsCarousel';
import ClientOnly from '@/components/ClientOnly';

/** Slider ayrı Suspense ile yüklenir — ürün listesi bekletilmez */
export default async function ProductsPageSlider() {
  let sliders: Awaited<ReturnType<typeof SliderImagesRepository.findAll>> = [];
  try {
    sliders = await SliderImagesRepository.findAll();
  } catch {
    sliders = [];
  }

  if (sliders.length === 0) {
    return <div style={{ height: 'clamp(280px, 35vh, 400px)', backgroundColor: '#f3f4f6' }} />;
  }

  return (
    <ClientOnly>
      <ProductsCarousel sliders={sliders} />
    </ClientOnly>
  );
}
