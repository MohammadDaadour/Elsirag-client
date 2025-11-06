import { Attribute } from "./variants";

export interface Img {
  url: string,
  publicId: string
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: Img[];
  isActive: boolean;
  category: {
    id: number;
    name: string;
  };
  attributes: Attribute[]
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