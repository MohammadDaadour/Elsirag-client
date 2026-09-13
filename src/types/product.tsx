export interface Img {
  url: string,
  publicId: string
}

/** A row in a product's spec table, e.g. { label: "Size", value: "A5" }. */
export interface ProductSpec {
  label: string;
  value: string;
}

/** A sheet-count and its wholesale price, e.g. { label: "60 sheets", price: 45 }. */
export interface ProductPriceOption {
  label: string;
  labelAr?: string | null;
  price: number | string;
}

/**
 * What a card should show: the cheapest sheet-count option when a product has
 * them, otherwise its single price. `from` tells the caller to prefix the
 * figure, since the other options cost more.
 */
export function displayPrice(product: {
  price?: number | string;
  priceOptions?: ProductPriceOption[] | null;
}): { amount: number | null; from: boolean } {
  const options = (product?.priceOptions ?? [])
    .map(o => Number(o.price))
    .filter(n => Number.isFinite(n));

  if (options.length > 0) {
    return { amount: Math.min(...options), from: options.length > 1 };
  }

  // No sheet-count prices and no base price: the card shows "price on request".
  const base = Number(product?.price);
  return { amount: product?.price != null && Number.isFinite(base) ? base : null, from: false };
}

export interface Product {
  id: number;
  name: string;
  description: string;
  nameAr?: string | null;
  descriptionAr?: string | null;
  price: number;
  stock: number;
  images: Img[];
  isActive: boolean;
  category: {
    id: number;
    name: string;
    nameAr?: string | null;
  };
  packSize?: number | null;
  specs?: ProductSpec[] | null;
  priceOptions?: ProductPriceOption[] | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductQueryDto {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
}

export interface FeaturedProductsProps {
  initialLimit?: number;
}