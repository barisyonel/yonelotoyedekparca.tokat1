import { staticAsset } from '@/lib/cloudinaryAssets';

export type HomeSliderDefault = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  sortOrder: number;
};

export const HOME_SLIDER_DEFAULTS: HomeSliderDefault[] = [
  {
    title: 'İveco Daily Yedek Parça',
    subtitle: '120-14, 85-12, 65-9, 50NC Tüm Modeller',
    description: 'Orijinal ve yan sanayi yedek parçaları stoklarımızda',
    image: staticAsset('/assets/slider1.png'),
    buttonText: 'İveco Ürünleri',
    buttonLink: '/urunler/iveco/daily',
    sortOrder: 1,
  },
  {
    title: 'Fiat Ducato Yedek Parça',
    subtitle: '2.3 ve 3.0 Motor Serisi',
    description: 'Fren, motor, filtre sistemlerinde uzman çözümler',
    image: staticAsset('/assets/slider2.png'),
    buttonText: 'Ducato Ürünleri',
    buttonLink: '/urunler/fiat/ducato',
    sortOrder: 2,
  },
  {
    title: 'Foton Traktör Yedek Parça',
    subtitle: 'Tüm Modeller İçin Yedek Parça',
    description: 'Tarımda kesintisiz üretim için güvenilir parçalar',
    image: staticAsset('/assets/slider3.png'),
    buttonText: 'Foton Ürünleri',
    buttonLink: '/urunler/foton',
    sortOrder: 3,
  },
  {
    title: 'Karataş Traktör Yedek Parça',
    subtitle: 'Tüm Modeller İçin Yedek Parça',
    description: 'Tarımda kesintisiz üretim için güvenilir parçalar',
    image: staticAsset('/gorsel.png'),
    buttonText: 'Karataş Ürünleri',
    buttonLink: '/urunler/karatas',
    sortOrder: 4,
  },
  {
    title: 'Mutlu Akü ve Yağlar',
    subtitle: 'Orijinal ve Garantili Ürünler',
    description: 'Araç ve traktörleriniz için en kaliteli bakım malzemeleri',
    image: staticAsset('/gorsel1.png'),
    buttonText: 'Mutlu Akü',
    buttonLink: '/urunler/mutlu/aku',
    sortOrder: 5,
  },
];
