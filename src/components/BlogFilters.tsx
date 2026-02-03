'use client';

import { useState, useMemo } from 'react';
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
  category: string;
  tags: string[];
  featured: boolean;
}

interface Props {
  posts: BlogPost[];
  onFilterChange: (filteredPosts: BlogPost[]) => void;
}

export default function BlogFilters({ posts, onFilterChange }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  // Tüm kategorileri çıkar
  const categories = useMemo(() => {
    return ['Tümü', ...Array.from(new Set(posts.map(post => post.category)))];
  }, [posts]);

  // Tüm etiketleri çıkar
  const allTags = useMemo(() => {
    const tags = posts.flatMap(post => post.tags);
    const tagCounts: Record<string, number> = {};
    tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [posts]);

  // Filtrelenmiş blog yazıları
  const filteredPosts = useMemo(() => {
    let filtered = posts;

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
  }, [posts, selectedCategory, searchQuery]);

  // Kategoriye göre sayıları hesapla
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Tümü: posts.length };
    posts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, [posts]);

  // Filtre değiştiğinde parent'a bildir
  useMemo(() => {
    onFilterChange(filteredPosts);
  }, [filteredPosts, onFilterChange]);

  return (
    <>
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
              </Box>
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
    </>
  );
}
