import { Metadata } from 'next';
import Link from 'next/link';
import LaunchIcon from '@mui/icons-material/Launch';
import WebIcon from '@mui/icons-material/Web';
import DescriptionIcon from '@mui/icons-material/Description';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupsIcon from '@mui/icons-material/Groups';
import { staticAsset } from '@/lib/cloudinaryAssets';

export const metadata: Metadata = {
  title: 'Önerilen İş Ortaklarımız ve Güvenilir Web Siteleri | Yönel Oto',
  description: 'Yönel Oto Yedek Parça olarak güvendiğimiz ve önerdiğimiz iş ortaklarımız ve web siteleri. Kaliteli hizmet veren firmalar ve güvenilir online platformlar.',
  keywords: 'önerilen siteler, iş ortakları, güvenilir web siteleri, kaliteli firmalar, online platformlar',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Önerilen İş Ortaklarımız | Yönel Oto Yedek Parça',
    description: 'Güvendiğimiz ve önerdiğimiz iş ortaklarımız ve web siteleri',
    type: 'website',
    url: 'https://www.yonelotoyedekparca.com/organic-seo',
    images: [
      {
        url: staticAsset('/og-image.jpg'),
        width: 1200,
        height: 630,
        alt: 'Yönel Oto Yedek Parça - İş Ortaklarımız',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.yonelotoyedekparca.com/organic-seo',
  },
};

// Partner sites data with enhanced info
const partnerSites = [
  {
    name: 'Polat Mermer',
    url: 'https://polatmermer.com',
    description: 'Polat Mermer, doğal mermer ve taş işleme sektöründe uzun yıllardır hizmet veren, kaliteli mermer ürünleri ve profesyonel montaj hizmetleri sunan güvenilir bir firmadır. Doğal mermer, granit, traverten ve diğer doğal taş ürünlerinde geniş bir ürün yelpazesi ile müşterilerine hizmet vermektedir.',
    category: 'İnşaat & Dekorasyon',
    icon: '🏗️',
    color: 'from-blue-500 to-blue-700',
    features: [
      'Doğal mermer ve taş işleme',
      'Profesyonel montaj hizmetleri',
      'Geniş ürün yelpazesi',
      'Kaliteli işçilik garantisi',
    ],
    rating: 4.9,
    years: '15+',
  },
  {
    name: 'Balsan Papel',
    url: 'https://balsanpapel.com',
    description: 'Balsan Papel, kağıt ve ambalaj sektöründe faaliyet gösteren, endüstriyel kağıt ürünleri, ambalaj çözümleri ve özel kesim hizmetleri sunan deneyimli bir firmadır. Kurumsal müşterilere ve bireysel kullanıcılara geniş bir ürün yelpazesi ile hizmet vermektedir.',
    category: 'Kağıt & Ambalaj',
    icon: '📦',
    color: 'from-green-500 to-green-700',
    features: [
      'Endüstriyel kağıt ürünleri',
      'Ambalaj çözümleri',
      'Özel kesim hizmetleri',
      'Kurumsal çözümler',
    ],
    rating: 4.8,
    years: '12+',
  },
  {
    name: 'Barış Can Yönel',
    url: 'https://bariscanyonel.com',
    description: 'Barış Can Yönel, web tasarım, yazılım geliştirme ve dijital pazarlama alanlarında profesyonel hizmetler sunan bir teknoloji firmasıdır. Modern web siteleri, e-ticaret platformları ve dijital çözümler konusunda uzman ekibi ile müşterilerine hizmet vermektedir.',
    category: 'Teknoloji & Yazılım',
    icon: '💻',
    color: 'from-purple-500 to-purple-700',
    features: [
      'Web tasarım ve geliştirme',
      'E-ticaret çözümleri',
      'Dijital pazarlama',
      'Yazılım geliştirme',
    ],
    rating: 5.0,
    years: '8+',
  },
  {
    name: 'My Golden Food',
    url: 'https://mygoldenfood.com',
    description: 'My Golden Food, kaliteli gıda ürünleri ve organik beslenme çözümleri sunan, sağlıklı yaşam odaklı bir gıda platformudur. Organik ürünler, doğal gıdalar ve sağlıklı beslenme ürünleri ile müşterilerine hizmet vermektedir.',
    category: 'Gıda & Organik Ürünler',
    icon: '🌱',
    color: 'from-amber-500 to-orange-600',
    features: [
      'Organik gıda ürünleri',
      'Doğal beslenme çözümleri',
      'Sağlıklı yaşam ürünleri',
      'Kaliteli gıda garantisi',
    ],
    rating: 4.7,
    years: '10+',
  },
];

export default function OrganicSEOPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Önerilen İş Ortaklarımız',
            description: 'Yönel Oto Yedek Parça olarak güvendiğimiz ve önerdiğimiz iş ortaklarımız',
            url: 'https://www.yonelotoyedekparca.com/organic-seo',
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: partnerSites.map((site, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Organization',
                  name: site.name,
                  url: site.url,
                  description: site.description,
                  category: site.category,
                },
              })),
            },
          }),
        }}
      />

      {/* Hero Section - Premium Design */}
      <section className="relative bg-gradient-to-br from-primary via-red-700 to-red-900 text-white py-24 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-300/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/30 shadow-lg">
              <GroupsIcon className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-bold text-sm uppercase tracking-wider">Güvenilir İş Ortaklarımız</span>
              <VerifiedIcon className="w-5 h-5 text-yellow-300" />
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
              <span className="block mb-2">Önerilen İş</span>
              <span className="block text-yellow-300 drop-shadow-2xl">Ortaklarımız</span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-red-50 leading-relaxed max-w-4xl mx-auto mb-8">
              <strong className="text-white">Yönel Oto Yedek Parça</strong> olarak, kaliteli hizmet veren ve güvenilir iş ortaklarımızı sizlerle paylaşıyoruz. 
              Bu firmalar, kendi sektörlerinde uzun yıllardır hizmet veren, müşteri memnuniyetini ön planda tutan ve 
              kaliteli ürün/hizmet sunan güvenilir kuruluşlardır.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-300 mb-1">{partnerSites.length}</div>
                <div className="text-sm text-red-100">Güvenilir Firma</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-300 mb-1">50+</div>
                <div className="text-sm text-red-100">Yıllık Tecrübe</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-300 mb-1">100%</div>
                <div className="text-sm text-red-100">Güvenilirlik</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Partners Grid - Premium Cards */}
      <section className="py-20 bg-white relative">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-bold mb-4 uppercase tracking-wider">
                Güvenilir Firmalar
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Güvendiğimiz ve Önerdiğimiz Firmalar
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                50+ yıllık tecrübemizle, sektöründe öne çıkan ve kaliteli hizmet veren firmaları sizlerle buluşturuyoruz.
              </p>
            </div>

            {/* Partners Grid */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
              {partnerSites.map((site, index) => (
                <div
                  key={site.name}
                  className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-primary/50 transform hover:-translate-y-2"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Gradient Header */}
                  <div className={`relative bg-gradient-to-br ${site.color} p-8 text-white overflow-hidden`}>
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20H0v-2h20z'/%3E%3C/g%3E%3C/svg%3E")`,
                      }}></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-lg border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
                            {site.icon}
                          </div>
                          <div>
                            <h3 className="text-3xl font-extrabold mb-2 drop-shadow-lg">
                              {site.name}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full font-semibold text-sm border border-white/30">
                                {site.category}
                              </span>
                              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                <StarIcon className="w-4 h-4 text-yellow-300" />
                                <span className="text-sm font-bold">{site.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                          <div className="text-xs text-white/80 mb-1">Tecrübe</div>
                          <div className="text-lg font-bold">{site.years}</div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-tl-full"></div>
                  </div>

                  {/* Content Body */}
                  <div className="p-8">
                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-6 text-base">
                      {site.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                        <DescriptionIcon className="w-6 h-6 text-primary" />
                        Hizmet Alanları
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {site.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 group/item">
                            <div className="w-6 h-6 bg-gradient-to-br from-primary to-red-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                            <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <a
                      href={site.url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className={`group/btn relative inline-flex items-center justify-center gap-3 bg-gradient-to-r ${site.color} text-white px-8 py-4 rounded-xl font-bold text-base hover:shadow-2xl transition-all duration-300 w-full overflow-hidden`}
                    >
                      {/* Button Background Animation */}
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                      
                      {/* Button Content */}
                      <div className="relative z-10 flex items-center gap-3">
                        <WebIcon className="w-5 h-5" />
                        <span>Web Sitesini Ziyaret Et</span>
                        <LaunchIcon className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </div>
                    </a>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${site.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none rounded-3xl`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-100 relative overflow-hidden">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-700 rounded-xl flex items-center justify-center">
                    <TrendingUpIcon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Neden Bu Firmaları Öneriyoruz?
                  </h2>
                </div>

                <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                  <p>
                    <strong className="text-primary">Yönel Oto Yedek Parça</strong> olarak, 50+ yıllık sektör tecrübemizle, 
                    kaliteli hizmet veren ve müşteri memnuniyetini ön planda tutan firmaları tanıyoruz. 
                    Bu sayfada yer alan firmalar, kendi sektörlerinde:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mt-8">
                    {[
                      'Uzun yıllardır hizmet veren, güvenilir kuruluşlardır',
                      'Kaliteli ürün ve hizmet standartlarına sahiptirler',
                      'Müşteri memnuniyetini ön planda tutarlar',
                      'Profesyonel hizmet anlayışına sahiptirler',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-gradient-to-br from-primary/5 to-red-50 rounded-xl p-4 border border-primary/10">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-red-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <VerifiedIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-gray-800 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-red-50 rounded-2xl border-2 border-primary/20">
                    <p className="text-gray-800 leading-relaxed">
                      Bu firmalar, <Link href="/" className="text-primary hover:text-red-700 font-bold underline decoration-2 underline-offset-2 transition-colors">Yönel Oto Yedek Parça</Link> olarak 
                      güvendiğimiz ve önerdiğimiz iş ortaklarımızdır. Ancak, bu sayfa sadece bilgilendirme amaçlıdır ve 
                      herhangi bir ticari ilişki veya garanti içermemektedir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home - Enhanced */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Ana Sayfaya Dön</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
