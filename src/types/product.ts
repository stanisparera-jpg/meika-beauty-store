export type MainCategoryId =
  | 'face-makeup'
  | 'lip-makeup'
  | 'eye-makeup'
  | 'skincare'
  | 'beauty-essentials';

export type MainCategoryLabel =
  | 'Face Makeup'
  | 'Lip Makeup'
  | 'Eye Makeup'
  | 'Skincare'
  | 'Beauty Essentials';

export type ProductStatus = 'best-seller' | 'new-arrival' | 'trending' | 'regular';

export interface ProductVariant {
  id: string;
  label: string;
  skuSuffix: string;
  stock: number;
  colorHex?: string;
  priceOverride?: number;
  previewImage?: string;
}

export interface ProductReviewDemo {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  verifiedVariant?: string;
  dateLabel: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brandId: string;
  brandName: string;
  categoryId: MainCategoryId;
  categoryName: MainCategoryLabel;
  subcategory: string;
  description: string;
  howToUse: string;
  sizeLabel: string;
  price: number;
  discountPrice?: number;
  primaryImage: string;
  galleryImages: string[];
  ratingDemo: number;
  reviewCountDemo: number;
  reviewsDemo: ProductReviewDemo[];
  hasShades: boolean;
  variants: ProductVariant[];
  status: ProductStatus;
  isRecommended?: boolean;
}

