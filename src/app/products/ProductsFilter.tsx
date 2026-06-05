'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import type { PlainCategory } from '@/lib/serializeDb';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { buildUrunlerUrl, findParentCategory } from '@/lib/utils/urunlerUrls';

interface Props {
  categories: PlainCategory[];
  activeCategory?: PlainCategory | null;
  /** Sadece marka URL'sinde alt menüyü açmak için (filtre uygulanmaz) */
  expandedParentCategory?: PlainCategory | null;
  onClose?: () => void;
}

export default function ProductsFilter({
  categories,
  activeCategory,
  expandedParentCategory,
  onClose,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({});
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Aktif filtre var mı kontrolü
  const hasActiveFilters = searchParams.get('search') || activeCategory;

  const handleCategoryClick = (categoryId: number) => {
    setOpenCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const getParent = useCallback(
    (category: PlainCategory) => findParentCategory(category, categories),
    [categories],
  );

  const pushUrunler = useCallback(
    (options: { category?: PlainCategory | null; params?: URLSearchParams }) => {
      router.push(
        buildUrunlerUrl({
          category: options.category ?? undefined,
          categories,
          searchParams: options.params,
        }),
      );
      onClose?.();
    },
    [router, categories, onClose],
  );

  // Alt kategori veya marka URL'sinde ilgili marka menüsünü aç
  useEffect(() => {
    const toOpen: number[] = [];
    if (expandedParentCategory?.SubCategories?.length) {
      toOpen.push(expandedParentCategory.Id);
    }
    if (activeCategory) {
      const parent = getParent(activeCategory);
      if (parent) toOpen.push(parent.Id);
    }
    if (toOpen.length === 0) return;
    setOpenCategories((prev) => {
      const next = { ...prev };
      for (const id of toOpen) next[id] = true;
      return next;
    });
  }, [activeCategory, expandedParentCategory, getParent]);

  const handleCategoryFilter = (category?: PlainCategory) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    pushUrunler({ category: category ?? null, params });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    pushUrunler({ category: activeCategory, params });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    router.push('/urunler');
    onClose?.();
  };

  const removeFilter = (filterType: 'search' | 'category') => {
    if (filterType === 'search') {
      setSearchTerm('');
      pushUrunler({ category: activeCategory });
    } else if (filterType === 'category') {
      const params = new URLSearchParams();
      const search = searchParams.get('search');
      if (search) params.set('search', search);
      pushUrunler({ params });
    }
  };

  return (
    <Paper
      sx={{
        p: { xs: '1.5rem', md: '1.8rem', lg: '2rem' },
        position: 'sticky',
        top: '1.25rem',
        maxHeight: 'calc(100vh - 2.5rem)',
        overflowY: 'auto',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        '&::-webkit-scrollbar': {
          width: '0.5rem',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '0.25rem',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#a80000',
          borderRadius: '0.25rem',
          '&:hover': {
            background: '#8b0000',
          },
        },
      }}
    >
      {/* Aktif Filtreler */}
      {hasActiveFilters && (
        <Box sx={{ mb: { xs: '1.5rem', md: '2rem' } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: '0.75rem',
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#a80000', fontSize: { xs: '0.875rem', md: '0.9375rem' } }}>
              Aktif Filtreler
            </Typography>
            <Button
              size="small"
              startIcon={<FilterListOffIcon />}
              onClick={clearAllFilters}
              sx={{
                fontSize: { xs: '0.7rem', md: '0.75rem' },
                minWidth: 'auto',
              }}
            >
              Temizle
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: '0.5rem', md: '0.75rem' } }}>
            {searchParams.get('search') && (
              <Chip
                label={`Arama: "${searchParams.get('search')}"`}
                onDelete={() => removeFilter('search')}
                color="primary"
                size="small"
              />
            )}
            {activeCategory && (
              <Chip
                label={`Kategori: ${activeCategory.Name}`}
                onDelete={() => removeFilter('category')}
                color="primary"
                size="small"
              />
            )}
          </Box>
        </Box>
      )}

      {/* Search */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          fontSize: { xs: '1rem', md: '1.125rem' },
          mb: { xs: '1rem', md: '1.25rem' },
        }}
      >
        Arama
      </Typography>
      <form onSubmit={handleSearch}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: searchTerm && (
              <ClearIcon
                sx={{ cursor: 'pointer', color: 'action.active' }}
                onClick={() => {
                  setSearchTerm('');
                  removeFilter('search');
                }}
              />
            ),
          }}
          sx={{
            mb: { xs: '0.75rem', md: '1rem' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '0.5rem',
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          startIcon={<SearchIcon />}
          sx={{
            mb: { xs: '2rem', md: '2.5rem' },
            py: { xs: '0.75rem', md: '0.875rem' },
            borderRadius: '0.5rem',
            fontWeight: 600,
            fontSize: { xs: '0.875rem', md: '0.9375rem' },
            bgcolor: '#a80000',
            '&:hover': {
              bgcolor: '#8b0000',
            },
          }}
        >
          Ara
        </Button>
      </form>

      {/* Categories */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          fontSize: { xs: '1rem', md: '1.125rem' },
          mb: { xs: '1rem', md: '1.25rem' },
        }}
      >
        Kategoriler
      </Typography>
      <List
        component="nav"
        sx={{
          '& .MuiListItemButton-root': {
            borderRadius: '0.5rem',
            mb: '0.25rem',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(168, 0, 0, 0.08)',
            },
          },
        }}
      >
        <ListItemButton
          onClick={() => handleCategoryFilter()}
          selected={!activeCategory}
          sx={{
            '&.Mui-selected': {
              bgcolor: '#a80000',
              color: 'white',
              '&:hover': { bgcolor: '#8b0000' },
            },
          }}
        >
          <ListItemText
            primary="Tüm Ürünler"
            primaryTypographyProps={{
              sx: {
                fontSize: { xs: '0.875rem', md: '0.9375rem' },
                fontWeight: !activeCategory ? 600 : 500,
              },
            }}
          />
        </ListItemButton>
        {categories.map((category) => {
          const hasSubs = Boolean(category.SubCategories && category.SubCategories.length > 0);
          // Marka (ana kategori) seçili görünmesin; sadece alt kategori veya altı olmayan marka
          const isCategoryActive =
            activeCategory?.Id === category.Id && !hasSubs;
          return (
            <div key={category.Id}>
              <ListItemButton
                onClick={() => {
                  if (hasSubs) {
                    handleCategoryClick(category.Id);
                  } else {
                    handleCategoryFilter(category);
                  }
                }}
                selected={isCategoryActive}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: '#a80000',
                    color: 'white',
                    '&:hover': { bgcolor: '#8b0000' },
                  },
                }}
              >
                <ListItemText
                  primary={category.Name}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: { xs: '0.875rem', md: '0.9375rem' },
                      fontWeight: isCategoryActive ? 600 : 500,
                    },
                  }}
                />
                {category.SubCategories && category.SubCategories.length > 0 && (
                  <>{openCategories[category.Id] ? <ExpandLess /> : <ExpandMore />}</>
                )}
              </ListItemButton>
              {category.SubCategories && category.SubCategories.length > 0 && (
                <Collapse in={openCategories[category.Id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {category.SubCategories.map((sub) => {
                      const isSubActive = activeCategory?.Id === sub.Id;
                      return (
                        <ListItemButton
                          key={sub.Id}
                          sx={{
                            pl: 4,
                          '&.Mui-selected': {
                            bgcolor: '#a80000',
                            color: 'white',
                            '&:hover': { bgcolor: '#8b0000' },
                          },
                        }}
                        selected={isSubActive}
                        onClick={() => handleCategoryFilter(sub)}
                      >
                        <ListItemText
                          primary={sub.Name}
                          primaryTypographyProps={{
                            sx: {
                              fontSize: { xs: '0.8125rem', md: '0.875rem' },
                              fontWeight: isSubActive ? 600 : 400,
                            },
                          }}
                        />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </div>
          );
        })}
      </List>
    </Paper>
  );
}

