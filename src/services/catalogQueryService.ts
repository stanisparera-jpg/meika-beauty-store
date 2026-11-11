import type { Product } from '../types/product';
import { getEffectivePrice, getProductTotalStock } from '../utils/formatters';

export type PricePreset = 'all' | 'under-50' | '50-to-150' | 'above-150' | 'custom';
export type CatalogSortBy = 'latest' | 'price-asc' | 'price-desc' | 'popular';

export interface CatalogFilterParams {
  q?: string;
  category?: string;
  subcategory?: string;
  brands?: string[];
  pricePreset?: PricePreset;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  sortBy?: CatalogSortBy;
}

export function queryCatalog(products: Product[], params: CatalogFilterParams): Product[] {
  const q = (params.q ?? '').trim().toLowerCase();
  const category = (params.category ?? '').trim().toLowerCase();
  const subcategory = (params.subcategory ?? '').trim().toLowerCase();
  const brands = (params.brands ?? []).map((b) => b.trim().toLowerCase()).filter(Boolean);

  const filtered = products.filter((p) => {
    if (q) {
      const hay = `${p.name} ${p.brandName} ${p.categoryName} ${p.subcategory} ${p.sku}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    if (category && category !== 'all') {
      if (p.categoryId.toLowerCase() !== category) return false;
    }

    if (subcategory) {
      if (p.subcategory.toLowerCase() !== subcategory) return false;
    }

    if (brands.length > 0) {
      if (!brands.includes(p.brandId.toLowerCase())) return false;
    }

    const effPrice = getEffectivePrice(p);
    if (params.pricePreset === 'under-50' && effPrice >= 50000) return false;
    if (params.pricePreset === '50-to-150' && (effPrice < 50000 || effPrice > 150000)) return false;
    if (params.pricePreset === 'above-150' && effPrice <= 150000) return false;
    if (params.pricePreset === 'custom') {
      if (params.minPrice !== undefined && effPrice < params.minPrice) return false;
      if (params.maxPrice !== undefined && effPrice > params.maxPrice) return false;
    }

    if (params.minRating !== undefined && params.minRating > 0) {
      if (p.ratingDemo < params.minRating) return false;
    }

    if (params.inStockOnly && getProductTotalStock(p) <= 0) {
      return false;
    }

    return true;
  });

  const sorted = [...filtered];
  switch (params.sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
      break;
    case 'price-desc':
      sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
      break;
    case 'popular':
      sorted.sort((a, b) => {
        const diffReview = b.reviewCountDemo - a.reviewCountDemo;
        if (diffReview !== 0) return diffReview;
        return b.ratingDemo - a.ratingDemo;
      });
      break;
    case 'latest':
    default:
      sorted.sort((a, b) => {
        const rank = (s: Product['status']) =>
          s === 'new-arrival' ? 0 : s === 'trending' ? 1 : s === 'best-seller' ? 2 : 3;
        return rank(a.status) - rank(b.status);
      });
      break;
  }

  return sorted;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export function paginateItems<T>(items: T[], page: number, perPage: number): PaginatedResult<T> {
  const safePerPage = Math.max(1, perPage);
  const totalPages = Math.max(1, Math.ceil(items.length / safePerPage));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * safePerPage;
  return {
    items: items.slice(start, start + safePerPage),
    page: safePage,
    totalPages,
    totalItems: items.length,
  };
}

