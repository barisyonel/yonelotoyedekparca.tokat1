'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'iveco-daily-yedek-parca-secimi-rehberi',
    title: 'İveco Daily Yedek Parça Seçimi: Orijinal mi Yan Sanayi mi? Uzman Rehberi',
    excerpt: 'İveco Daily 120-14, 85-12, 65-9 ve 50NC modelleri için doğru yedek parça seçimi nasıl yapılır? 50 yıllık tecrübemizle tüm detayları açıklıyoruz.',
    content: '',
    category: 'İveco Daily',
    tags: ['İveco Daily Rehberi', 'Parça Seçimi'],
    author: 'Yönel Oto Uzman Ekibi',
    date: '15 Aralık 2024',
    readTime: '8 dk',
    image: '/assets/dailly.png',
    featured: true,
  },
  {
    slug: 'fiat-ducato-motor-bakimi-ipuclari',
    title: 'Fiat Ducato Motor Bakımı: 2.3 ve 3.0 Dizel Motorlar için Kapsamlı Bakım Rehberi',
    excerpt: 'Fiat Ducato 2.3 MultiJet ve 3.0 HDI motorlarının uzun ömürlü olması için yapılması gereken periyodik bakımlar ve dikkat edilmesi gereken noktalar.',
    content: '',
    category: 'Fiat Ducato',
    tags: ['Fiat Ducato Motor', 'Periyodik Bakım'],
    author: 'Yönel Oto Uzman Ekibi',
    date: '10 Aralık 2024',
    readTime: '10 dk',
    image: '/assets/d.png',
    featured: true,
  },
  {
    slug: 'foton-traktor-yedek-parca-temini',
    title: 'Foton Traktör Yedek Parça Temini ve Bakım Önerileri: Güvenilir Kaynaklardan Tedarik',
    excerpt: 'Foton traktör sahipleri için yedek parça bulma zorlukları, doğru tedarikçi seçimi ve traktörünüzün performansını artıracak bakım önerileri.',
    content: '',
    category: 'Foton Traktör',
    tags: ['Foton Traktör İpuçları', 'Tarım Performansı'],
    author: 'Yönel Oto Uzman Ekibi',
    date: '5 Aralık 2024',
    readTime: '7 dk',
    image: '/assets/foton.png',
    featured: true,
  },
  {
    slug: 'karatas-traktor-hidrolik-sistem-bakimi',
    title: 'Karataş Traktör Hidrolik Sistem Bakımı: Sorunsuz Çalışma için Profesyonel İpuçları',
    excerpt: 'Karataş traktörlerde hidrolik sistem bakımı, yağ değişimi, filtre seçimi ve sık karşılaşılan sorunların çözümleri hakkında detaylı bilgiler.',
    content: '',
    category: 'Karataş Traktör',
    tags: ['Karataş Hidrolik', 'Servis Bakımı'],
    author: 'Yönel Oto Uzman Ekibi',
    date: '1 Aralık 2024',
    readTime: '9 dk',
    image: '/assets/karat.png',
    featured: false,
  },
  {
    slug: 'mutlu-aku-bakim-ve-kullanim-omru',
    title: 'Mutlu Akü Bakımı: Kış Aylarında Dikkat Edilmesi Gerekenler',
    excerpt: 'Mutlu akü bakım önerileri, şarj durumu kontrolü, kış aylarında alınacak önlemler ve akü bakım ipuçları.',
    content: '',
    category: 'Mutlu Akü',
    tags: ['Mutlu Akü Bakımı', 'Kış Önlemleri'],
    author: 'Yönel Oto Uzman Ekibi',
    date: '25 Kasım 2024',
    readTime: '6 dk',
    image: '/images/60aku.png',
    featured: false,
  },
  {
    slug: 'iveco-daily-fren-sistemi-bakimi',
    title: 'İveco Daily Fren Sistemi Bakımı: Balata, Disk ve Hidrolik Sistem Kontrolü',
    excerpt: 'İveco Daily ticari araçlarda fren sisteminin önemi, balata ve disk değişim zamanları, fren hidroliği bakımı ve güvenli sürüş için kritik kontroller.',
    content: '',
    category: 'İveco Daily',
    tags: ['İveco Fren Sistemi', 'Güvenli Sürüş'],
    author: 'Yönel Oto Uzman Ekibi',
    date: '20 Kasım 2024',
    readTime: '8 dk',
    image: '/assets/dailly.png',
    featured: false,
  },
  {
    slug: 'orijinal-yan-sanayi-yedek-parca-farklari',
    title: 'Orijinal ve Yan Sanayi Yedek Parça Farkları: Hangi Durumlarda Hangisi Tercih Edilmeli?',
    excerpt: 'Orijinal yedek parça mı yoksa kaliteli yan sanayi mı? Fiyat-performans dengesini nasıl kurarsınız? Hangi parçalarda orijinal şart? Tüm soruların cevapları.',
    content: '',
    category: 'Genel',
    tags: ['Orijinal Parça', 'Yan Sanayi Tercihi'],
    author: 'Yönel Oto Uzman Ekibi',
    date: '15 Kasım 2024',
    readTime: '12 dk',
    image: '/assets/logo.webp',
    featured: true,
  },
  {
    slug: 'ducato-salincak-ve-rotil-degisimi',
    title: 'Fiat Ducato Ön Takım: Salıncak, Rotil ve Bijon Değişimi Zamanı Nasıl Anlaşılır?',
    excerpt: 'Ducato ön takım parçalarının (salıncak, rotil, bijon, rot başı) yıpranma belirtileri, değişim zamanı ve kaliteli yedek parça seçimi hakkında bilmeniz gerekenler.',
    content: '',
    category: 'Fiat Ducato',
    tags: ['Ducato Ön Takım', 'Süspansiyon Kontrolü'],
    author: 'Yönel Oto Uzman Ekibi',
    date: '10 Kasım 2024',
    readTime: '7 dk',
    image: '/assets/d.png',
    featured: false,
  },
  {
    slug: 'traktor-filtre-bakimi-rehberi',
    title: 'Traktör Filtre Bakımı: Hava, Yağ, Yakıt ve Hidrolik Filtre Değişim Aralıkları',
    excerpt: 'Foton ve Karataş traktörlerde filtre bakımının önemi, doğru filtre seçimi, değişim periyotları ve filtrelerin motor ömrüne etkisi hakkında kapsamlı rehber.',
    content: '',
    category: 'Tarım Makinaları',
    tags: ['Traktör Filtreleri', 'Motor Koruma'],
    author: 'Yönel Oto Uzman Ekibi',
    date: '5 Kasım 2024',
    readTime: '9 dk',
    image: '/assets/foton.png',
    featured: false,
  },
];

const MAX_VISIBLE_TAGS = 2;

const getShortLinkLabel = (title: string) => {
  const truncated = title.split(':')[0].trim();
  if (truncated.length <= 45) return truncated;
  return `${truncated.slice(0, 45)}…`;
};

const getDisplayTags = (tags: string[]) =>
  Array.from(new Set(tags)).slice(0, MAX_VISIBLE_TAGS);

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  // Tüm kategorileri çıkar
  const categories = useMemo(() => {
    const cats = ['Tümü', ...Array.from(new Set(blogPosts.map(post => post.category)))];
    return cats;
  }, []);

  // Tüm etiketleri çıkar
  const allTags = useMemo(() => {
    const tags = blogPosts.flatMap(post => post.tags);
    const tagCounts: Record<string, number> = {};
    tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, []);

  // Filtrelenmiş blog yazıları
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Kategori filtresi
    if (selectedCategory !== 'Tümü') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Arama filtresi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query)) ||
          post.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  // Kategoriye göre sayıları hesapla
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Tümü: blogPosts.length };
    blogPosts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Yönel Oto Yedek Parça Blog',
            description: 'İveco Daily, Fiat Ducato, Foton ve Karataş Traktör yedek parça bakım rehberleri',
            url: 'https://www.yonelotoyedekparca.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Yönel Oto Yedek Parça',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.yonelotoyedekparca.com/assets/logo.webp',
              },
            },
            blogPost: blogPosts.map(post => ({
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              author: {
                '@type': 'Organization',
                name: post.author,
                url: 'https://www.yonelotoyedekparca.com',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.yonelotoyedekparca.com/assets/logo.webp',
                },
                sameAs: [
                  'https://www.yonelotoyedekparca.com',
                ],
              },
              publisher: {
                '@type': 'Organization',
                name: 'Yönel Oto Yedek Parça',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.yonelotoyedekparca.com/assets/logo.webp',
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://www.yonelotoyedekparca.com/blog/${post.slug}`,
              },
            })),
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-red-700 to-red-900 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight mt-4">
              Uzman Yedek Parça Bakım Blogu
            </h1>
            <p className="text-xl md:text-2xl text-gray-900 max-w-3xl mx-auto leading-relaxed font-medium">
              <strong className="text-gray-900">İveco Daily, Fiat Ducato, Foton, Karataş Traktör</strong> ve <strong>Mutlu Akü</strong> için 
              <strong className="text-gray-900"> 50+ yıllık tecrübemizle </strong> 
              hazırladığımız profesyonel bakım rehberleri ve uzman tavsiyeleri
            </p>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Blog yazılarında ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <CloseIcon
                        sx={{ cursor: 'pointer', color: '#666', '&:hover': { color: '#a80000' } }}
                        onClick={() => setSearchQuery('')}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#f9fafb',
                    '&:hover': {
                      bgcolor: '#f3f4f6',
                    },
                    '&.Mui-focused': {
                      bgcolor: '#fff',
                    },
                  },
                }}
              />
            </Box>

            {/* Category Filters */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              <FilterListIcon sx={{ color: '#666', fontSize: 20 }} />
              <span className="text-sm font-semibold text-gray-700 mr-2">Kategoriler:</span>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={`${category} (${categoryCounts[category] || 0})`}
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    bgcolor: selectedCategory === category ? '#a80000' : '#f3f4f6',
                    color: selectedCategory === category ? '#fff' : '#374151',
                    fontWeight: selectedCategory === category ? 600 : 500,
                    '&:hover': {
                      bgcolor: selectedCategory === category ? '#8b0000' : '#e5e7eb',
                    },
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </Box>

            {/* Active Filters Info */}
            {(selectedCategory !== 'Tümü' || searchQuery) && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <span className="text-sm text-gray-600">
                  {filteredPosts.length} yazı bulundu
                </span>
                {(selectedCategory !== 'Tümü' || searchQuery) && (
                  <Chip
                    label="Filtreleri Temizle"
                    onClick={() => {
                      setSelectedCategory('Tümü');
                      setSearchQuery('');
                    }}
                    size="small"
                    sx={{
                      bgcolor: '#f3f4f6',
                      color: '#374151',
                      '&:hover': { bgcolor: '#e5e7eb' },
                      cursor: 'pointer',
                    }}
                  />
                )}
              </Box>
            )}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-bold mb-4">
                  ⭐ ÖNE ÇIKAN YAZILAR
                </div>
                <h2 className="text-4xl font-bold text-gray-900">
                  En Çok Okunan İçerikler
                </h2>
              </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary"
                >
                  <div className="relative h-80 overflow-hidden bg-gray-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <CalendarTodayIcon sx={{ fontSize: 16 }} />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                        {post.readTime}
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {getDisplayTags(post.tags).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-primary font-bold">
                        Devamını Oku
                        <ArrowForwardIcon sx={{ fontSize: 20, ml: 1 }} className="group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* All Posts */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              {selectedCategory !== 'Tümü' || searchQuery
                ? `Filtrelenmiş Blog Yazıları (${filteredPosts.length})`
                : 'Tüm Blog Yazıları'}
            </h2>

            {filteredPosts.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  bgcolor: '#f9fafb',
                  borderRadius: 2,
                  border: '1px solid #e5e7eb',
                }}
              >
                <p className="text-lg text-gray-600 mb-2">Aradığınız kriterlere uygun yazı bulunamadı.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('Tümü');
                    setSearchQuery('');
                  }}
                  className="text-primary hover:underline font-semibold"
                >
                  Filtreleri temizle
                </button>
              </Box>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {[...featuredPosts.slice(2), ...regularPosts].map((post) => (
                  <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-primary"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <CalendarTodayIcon sx={{ fontSize: 12 }} />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <AccessTimeIcon sx={{ fontSize: 12 }} />
                        {post.readTime}
                      </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-primary font-semibold text-sm">
                      Devamını Oku
                      <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Tags Section */}
      {allTags.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Popüler Etiketler
              </h3>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                {allTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => setSearchQuery(tag)}
                    sx={{
                      bgcolor: '#fff',
                      color: '#374151',
                      border: '1px solid #e5e7eb',
                      '&:hover': {
                        bgcolor: '#f3f4f6',
                        borderColor: '#a80000',
                        color: '#a80000',
                      },
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </Box>
            </div>
          </div>
        </section>
      )}

      {/* SEO Content Section - 800+ words for better SEO */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Bakım Rehberleri ve Uzman Tavsiyeleri
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>Yönel Oto Yedek Parça</strong> olarak, <strong>İveco Daily</strong> (120-14, 85-12, 65-9, 50NC, Eurobus), 
                <strong> Fiat Ducato</strong> (2.3, 3.0), <strong>Foton Traktör</strong>, <strong>Karataş Traktör</strong> yedek parçaları ve 
                <strong> Mutlu Akü</strong> konusunda 50+ yıllık tecrübemizle, araç sahipleri için kapsamlı <strong>bakım rehberleri</strong> ve 
                <strong> uzman tavsiyeleri</strong> hazırlıyoruz. Blog sayfamızda, yedek parça seçimi, periyodik bakım, onarım teknikleri ve 
                bakım ipuçları hakkında detaylı bilgiler bulabilirsiniz.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                İveco Daily Yedek Parça Bakım Rehberleri
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>İveco Daily</strong> araçlarınız için <Link href="/urunler/iveco/daily" className="text-primary hover:underline font-semibold">yedek parça kataloğumuz</Link> kapsamında, 
                motor aksamı, şanzıman, diferansiyel, fren sistemi, elektrik parçaları ve kaporta ürünleri hakkında detaylı rehberler sunuyoruz. 
                <strong> İveco Daily 120-14, 85-12, 65-9, 50NC</strong> ve <strong>Eurobus</strong> modelleri için özel bakım tavsiyeleri, 
                yedek parça seçimi, orijinal ve yan sanayi parça farkları hakkında blog yazılarımızda kapsamlı bilgiler bulabilirsiniz. 
                İveco Daily bakım rehberleri sayesinde, araçlarınızın performansını maksimum seviyede tutabilir ve beklenmedik arızaları önleyebilirsiniz.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Fiat Ducato Motor Bakımı ve Yedek Parça
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>Fiat Ducato</strong> ticari araçlarınız için <Link href="/urunler/fiat/ducato" className="text-primary hover:underline font-semibold">Ducato yedek parça ürünlerimiz</Link> ile, 
                <strong> 2.3 MultiJet</strong> ve <strong>3.0 HDI</strong> motorlarının uzun ömürlü olması için gerekli periyodik bakımlar hakkında detaylı rehberler hazırladık. 
                Ducato motor bakımı, fren sistemi bakımı, filtre değişimleri, ön takım parçaları (salıncak, rotil, bijon) ve diğer kritik yedek parçalar hakkında 
                blog yazılarımızda profesyonel tavsiyeler bulabilirsiniz. Ducato bakım rehberleri, ticari araçlarınızın verimliliğini artırmanıza yardımcı olacaktır.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Foton ve Karataş Traktör Yedek Parça Bakım İpuçları
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>Foton Traktör</strong> ve <strong>Karataş Traktör</strong> sahipleri için <Link href="/urunler/foton" className="text-primary hover:underline font-semibold">Foton yedek parça kataloğumuz</Link> ve 
                <Link href="/urunler/karatas" className="text-primary hover:underline font-semibold">Karataş yedek parça ürünlerimiz</Link> kapsamında, 
                tarımda kesintisiz üretim için gerekli bakım rehberleri hazırladık. Foton ve Karataş traktör bakım rehberlerinde; 
                hidrolik sistem bakımı, filtre değişim aralıkları (hava, yağ, yakıt, hidrolik), motor parçaları bakımı, şanzıman bakımı ve 
                elektrik sistemleri hakkında detaylı bilgiler bulabilirsiniz. Traktör yedek parça bakımı, tarımsal üretimde verimliliği doğrudan etkiler.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Mutlu Akü Bakımı ve Seçimi
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>Mutlu Akü</strong> çeşitlerimiz için <Link href="/urunler/mutlu/aku" className="text-primary hover:underline font-semibold">Mutlu akü kataloğumuz</Link> kapsamında, 
                akü bakımı, şarj durumu kontrolü, kış aylarında dikkat edilmesi gerekenler ve akü seçimi hakkında rehberler hazırladık. 
                Otomobil, hafif ticari, ağır vasıta ve traktör aküleri için farklı bakım önerileri, uzun ömürlü kullanım ipuçları ve 
                doğru akü seçimi konularında blog yazılarımızda detaylı bilgiler bulabilirsiniz. Mutlu akü bakım rehberleri sayesinde, 
                araçlarınızın elektrik sisteminin sorunsuz çalışmasını sağlayabilirsiniz.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Orijinal ve Yan Sanayi Yedek Parça Seçimi
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Yedek parça seçiminde <strong>orijinal parça</strong> mı yoksa <strong>kaliteli yan sanayi</strong> parça mı tercih edilmeli? 
                Hangi parçalarda orijinal şart, hangi parçalarda yan sanayi kullanılabilir? Fiyat-performans dengesini nasıl kurarsınız? 
                Blog yazılarımızda, orijinal ve yan sanayi yedek parça farkları, kalite standartları, garanti kapsamı ve 
                hangi durumlarda hangi seçeneğin daha uygun olduğu konularında detaylı açıklamalar bulabilirsiniz. 
                <Link href="/urunler" className="text-primary hover:underline font-semibold">Yedek parça kataloğumuz</Link> kapsamında, 
                hem orijinal hem de kaliteli yan sanayi ürünleri sunuyoruz.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Periyodik Bakım ve Onarım Tavsiyeleri
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>İveco Daily, Fiat Ducato, Foton ve Karataş Traktör</strong> yedek parça bakımında, periyodik bakımın önemi büyüktür. 
                Motor bakımı, fren sistemi kontrolleri, filtre değişimleri, yağ kontrolleri ve elektrik sistemleri bakımı konularında 
                blog yazılarımızda uzman tavsiyeleri bulabilirsiniz. Düzenli bakım yaparak, araçlarınızın ömrünü uzatabilir, 
                beklenmedik arızaları önleyebilir ve yakıt tüketimini optimize edebilirsiniz. 50+ yıllık tecrübemizle, 
                yedek parça bakımı konusunda profesyonel destek sunuyoruz.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Yedek Parça Temini ve Hızlı Teslimat
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>Yönel Oto Yedek Parça</strong> olarak, tüm Türkiye&apos;ye <strong>aynı gün kargo</strong> hizmeti sunuyoruz. 
                İveco Daily, Fiat Ducato, Foton ve Karataş Traktör yedek parçaları için geniş stoklarımızla, 
                ihtiyacınız olan parçayı hızlı bir şekilde tedarik edebiliriz. <Link href="/urunler" className="text-primary hover:underline font-semibold">Online yedek parça kataloğumuz</Link> üzerinden, 
                aradığınız ürünü kolayca bulabilir ve sipariş verebilirsiniz. <strong>Orijinal ürün garantisi</strong>, 
                profesyonel destek ve hızlı teslimat ile hizmetinizdeyiz.
              </p>

              <div className="bg-gray-50 rounded-2xl p-8 mt-8 border-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Blog Yazılarımızdan Faydalanın
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  Blog sayfamızda, <strong>İveco Daily</strong> fren sistemi bakımı, <strong>Fiat Ducato</strong> motor bakımı, 
                  <strong> Foton ve Karataş Traktör</strong> hidrolik sistem bakımı, <strong>Mutlu Akü</strong> bakımı ve 
                  orijinal-yan sanayi yedek parça seçimi gibi konularda detaylı rehberler bulabilirsiniz. 
                  Her blog yazısı, 50+ yıllık tecrübemizle hazırlanmış uzman tavsiyeleri içermektedir.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {blogPosts.slice(0, 6).map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="text-primary hover:underline font-semibold text-base"
                    >
                      → {getShortLinkLabel(post.title)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-red-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Yedek Parça İhtiyacınız mı Var?
            </h2>
            <p className="text-xl text-red-50 mb-8">
              50+ yıllık tecrübemizle size en doğru yedek parçayı buluyoruz
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+905542597273"
                className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:scale-105"
              >
                📞 Hemen Arayın
              </a>
              <Link
                href="/urunler"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition-all shadow-lg hover:scale-105"
              >
                🛒 Ürünleri İnceleyin
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

