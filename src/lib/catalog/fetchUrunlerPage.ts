import { unstable_cache } from 'next/cache';
import { getConnection, sql } from '../db';
import { CACHE_REVALIDATE, CACHE_TAGS, generateCacheKey } from '../cache';
import { buildCategoryTree, type CategoryRow } from '../repositories/categoryTree';
import { resolveCategoryFromSlug } from '../utils/resolveCategoryFromSlug';
import { toPlainCategory, toPlainProduct, type PlainCategory, type PlainProduct } from '../serializeDb';
import type { Product } from '../models/Product';

export type UrunlerPageData = {
  categories: PlainCategory[];
  products: PlainProduct[];
  total: number;
  activeCategory: PlainCategory | null;
  parentCategory: PlainCategory | null;
};

type FetchParams = {
  slug?: string[];
  page: number;
  limit: number;
  search: string;
  sort: string;
};

async function queryCatalogProducts(
  pool: Awaited<ReturnType<typeof getConnection>>,
  params: {
    page: number;
    limit: number;
    search: string;
    sort: string;
    categoryIds?: number[];
  },
): Promise<{ products: Product[]; total: number }> {
  const offset = (params.page - 1) * params.limit;
  const filterIds = params.categoryIds ?? [];

  let whereClause = 'WHERE 1=1';
  const request = pool.request();

  if (params.search) {
    whereClause += ` AND (
      p.Name LIKE '%' + @search + '%'
      OR p.Description LIKE '%' + @search + '%'
      OR c.Name LIKE '%' + @search + '%'
      OR sc.Name LIKE '%' + @search + '%'
    )`;
    request.input('search', sql.NVarChar, params.search);
  }

  if (filterIds.length === 1) {
    whereClause += ` AND (p.CategoryId = @categoryId OR p.SubCategoryId = @categoryId)`;
    request.input('categoryId', sql.Int, filterIds[0]);
  } else if (filterIds.length > 1) {
    const placeholders = filterIds.map((_, i) => `@catId${i}`).join(', ');
    whereClause += ` AND (p.CategoryId IN (${placeholders}) OR p.SubCategoryId IN (${placeholders}))`;
    filterIds.forEach((id, i) => {
      request.input(`catId${i}`, sql.Int, id);
    });
  }

  let orderBy = 'p.CreatedAt DESC';
  switch (params.sort) {
    case 'oldest':
      orderBy = 'p.CreatedAt ASC';
      break;
    case 'name-asc':
      orderBy = 'p.Name ASC';
      break;
    case 'name-desc':
      orderBy = 'p.Name DESC';
      break;
    default:
      orderBy = 'p.CreatedAt DESC';
  }

  request.input('offset', sql.Int, offset);
  request.input('limit', sql.Int, params.limit);

  // Tek sorgu: COUNT + liste (2 DB round-trip yerine 1)
  const query = `
    SELECT
      p.Id, p.Name, p.ImageUrl,
      c.Name AS CategoryName,
      sc.Name AS SubCategoryName,
      COUNT(*) OVER() AS Total
    FROM Products p
    LEFT JOIN Categories c ON p.CategoryId = c.Id
    LEFT JOIN Categories sc ON p.SubCategoryId = sc.Id
    ${whereClause}
    ORDER BY ${orderBy}
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
  `;

  const result = await request.query(query);
  const rows = result.recordset as (Product & { Total: number })[];
  const total = rows.length > 0 ? Number(rows[0].Total) : 0;

  return {
    products: rows.map(({ Total: _total, ...product }) => product),
    total,
  };
}

async function fetchFromDatabase(params: FetchParams): Promise<UrunlerPageData> {
  const pool = await getConnection();

  const catResult = await pool.request().query<CategoryRow>(
    'SELECT Id, Name, ParentId, CreatedAt FROM Categories ORDER BY Name',
  );
  const categories = buildCategoryTree(catResult.recordset).map(toPlainCategory);

  const { categoryIds, activeCategory, parentCategory } = resolveCategoryFromSlug(
    params.slug,
    categories,
  );

  const { products, total } = await queryCatalogProducts(pool, {
    page: params.page,
    limit: params.limit,
    search: params.search,
    sort: params.sort,
    categoryIds,
  });

  return {
    categories,
    products: products.map(toPlainProduct),
    total,
    activeCategory,
    parentCategory,
  };
}

/** Tek bağlantı + tek ürün sorgusu + sayfa cache */
export async function fetchUrunlerPageData(params: FetchParams): Promise<UrunlerPageData> {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return {
      categories: [],
      products: [],
      total: 0,
      activeCategory: null,
      parentCategory: null,
    };
  }

  const cacheKey = generateCacheKey('urunler-page', {
    slug: (params.slug ?? []).join('/'),
    page: params.page,
    limit: params.limit,
    search: params.search,
    sort: params.sort,
  });

  return unstable_cache(() => fetchFromDatabase(params), [cacheKey], {
    tags: [CACHE_TAGS.PRODUCTS, CACHE_TAGS.CATEGORIES],
    revalidate: CACHE_REVALIDATE.PRODUCTS,
  })();
}
