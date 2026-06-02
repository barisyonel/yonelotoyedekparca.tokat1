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
    image: '/assets/slider1.png',
    buttonText: 'İveco Ürünleri',
    buttonLink: '/urunler/iveco/daily',
    sortOrder: 1,
  },
  {
    title: 'Fiat Ducato Yedek Parça',
    subtitle: '2.3 ve 3.0 Motor Serisi',
    description: 'Fren, motor, filtre sistemlerinde uzman çözümler',
    image: '/assets/slider2.png',
    buttonText: 'Ducato Ürünleri',
    buttonLink: '/urunler/fiat/ducato',
    sortOrder: 2,
  },
  {
    title: 'Foton & Karataş Traktör',
    subtitle: 'Tüm Modeller İçin Yedek Parça',
    description: 'Tarımda kesintisiz üretim için güvenilir parçalar',
    image: '/assets/slider3.png',
    buttonText: 'Traktör Parçaları',
    buttonLink: '/urunler/karatas',
    sortOrder: 3,
  },
  {
    title: 'Kaliteli Yedek Parça',
    subtitle: 'Geniş Ürün Yelpazesi',
    description: 'Motor, fren, filtre ve akü çözümlerinde uzman kadro',
    image: '/gorsel.png',
    buttonText: 'Tüm Ürünler',
    buttonLink: '/urunler',
    sortOrder: 4,
  },
  {
    title: 'Mutlu Akü ve Yağlar',
    subtitle: 'Orijinal ve Garantili Ürünler',
    description: 'Araç ve traktörleriniz için en kaliteli bakım malzemeleri',
    image: '/gorsel1.png',
    buttonText: 'Ürünleri İncele',
    buttonLink: '/urunler',
    sortOrder: 5,
  },
];
