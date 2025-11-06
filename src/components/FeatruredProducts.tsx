'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from '@/lib/axios';
import { Img, FeaturedProductsProps, Product, PaginatedResponse, ProductQueryDto } from '@/types/product';
import ProductCard from './ProductCard';
import { useTranslations } from 'next-intl';

export default function FeaturedProducts({
  initialLimit = 12
}: FeaturedProductsProps) {
  const t = useTranslations('FeaturedProducts');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async (query: ProductQueryDto = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: query.page || currentPage,
        limit: query.limit || initialLimit,
        ...(query.sortBy && { sortBy: query.sortBy }),
        ...(query.sortOrder && { sortOrder: query.sortOrder }),
        ...(query.minPrice && { minPrice: query.minPrice }),
        ...(query.maxPrice && { maxPrice: query.maxPrice }),
      };

      const response = await axios.get('/products/featured', { params });
      const data: PaginatedResponse<Product> = response.data;

      setProducts(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [currentPage, initialLimit]);

  useEffect(() => {
    fetchProducts({
      sortBy,
      sortOrder,
      minPrice: priceRange.min > 0 ? priceRange.min : undefined,
      maxPrice: priceRange.max < 1000 ? priceRange.max : undefined,
    });
  }, [fetchProducts, sortBy, sortOrder, priceRange]);

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('-');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as 'ASC' | 'DESC');
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts({ page });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
    }).format(price);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{t('error_loading_products')} {error}</p>
        <button
          onClick={() => fetchProducts()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          {t('try_again')}
        </button>
      </div>
    );
  }

  return (
    <div id='products' className=" w-full p-16 mx-auto px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h2 className="text-3xl text-gray-900 mb-4 sm:mb-0">
          {t('featured_products')}
        </h2>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: initialLimit }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-2/3 mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200 "
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_products_found')}</h3>
          <p className="text-gray-500">{t('try_adjusting_filters')}</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center mt-12">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('previous')}
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (page > totalPages) return null;

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg border ${page === currentPage
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('next')}
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}