const features = [
  'Orijinal ve Yan Sanayi Parçalar',
  '5000+ Ürün Çeşidi',
  'Türkiye Geneli Hızlı Kargo',
  '45+ Yıllık Tecrübe',
  'Teknik Destek ve Danışmanlık',
  'Mutlu Akü Yetkili Bayi',
];

const tags = [
  'İveco Daily 65-9',
  'İveco 85-12',
  'İveco 120-14',
  'Ducato 2.3',
  'Ducato 3.0',
  'Foton 504',
  'Foton 604',
  'Karataş Traktör',
  'Mutlu Akü',
  'Motor Yağı',
  'Fren Balatası',
  'Yağ Filtresi',
  'Hava Filtresi',
  'Hidrolik Parça',
  'Debriyaj Seti',
  'Amortisör',
];

export default function ProductsInfoCards() {
  return (
    <div className="mt-12 mb-8 space-y-8">
      <section className="rounded-2xl border-2 border-red-600 bg-red-50 p-6 md:p-8 shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold text-red-600 text-center mb-6">
          Neden Yönel Oto Yedek Parça?
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-gray-900">{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Popüler Ürün Kategorilerimiz
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold shadow hover:bg-red-800 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-gray-50 p-6 md:p-8 shadow">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Yönel Oto Yedek Parça - Türkiye&apos;nin Güvenilir Tedarikçisi
        </h2>

        <p className="text-gray-600 leading-relaxed mb-6">
          <strong>İveco Daily yedek parça</strong>, <strong>Fiat Ducato yedek parça</strong>,
          <strong> Foton traktör yedek parça</strong> ve <strong>Karataş traktör</strong> parçaları
          konusunda 45+ yıldır güvenle ve uygun fiyatla hizmet veriyoruz. Tokat merkezli firmamız,
          Türkiye geneline hızlı kargo ile ulaşmaktadır.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-2">İveco Daily & Fiat Ducato Yedek Parça</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              İveco Daily modelleri ve Fiat Ducato 2.3 / 3.0 motor serisi için orijinal ve yan sanayi
              yedek parçalar stoklarımızda mevcuttur.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-2">Foton & Karataş Traktör Yedek Parça</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Foton ve Karataş traktör modelleri için motor, hidrolik, filtre ve şanzıman parçaları.
              <strong> Mutlu akü</strong> yetkili bayi olarak hizmetinizdeyiz.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {[
            { value: '5000+', label: 'Ürün Çeşidi' },
            { value: '45+', label: 'Yıllık Tecrübe' },
            { value: '7/24', label: 'Destek' },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-6 py-4 bg-white rounded-xl min-w-[140px] border border-gray-200">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
