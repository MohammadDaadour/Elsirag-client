'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Product } from '@/types/product';
import axios from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import { CiSearch, CiCircleAlert } from 'react-icons/ci';
import Header from '@/components/Header';
import { useTranslations } from 'next-intl';
import { ClipLoader } from 'react-spinners';

export default function CategoryPage() {
  const t = useTranslations("categoryPage")
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategoryProducts = useCallback(async (categoryId: string, term: string = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const [categoryResponse, productsResponse] = await Promise.all([
        axios.get(`/categories/${categoryId}`),
        axios.get(`/products/category/${categoryId}`, {
          params: { 
            search: term,
            limit: 20 
          }
        })
      ]);
      
      setCategoryName(categoryResponse.data.name);
      setProducts(productsResponse.data.data || []);
    } catch (err) {
      setError('Failed to fetch category products. Please try again.');
      console.error('Category page error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const categoryId = params.id as string;
    const term = searchParams.get('search') || '';
    setSearchTerm(term);
    
    if (categoryId) {
      fetchCategoryProducts(categoryId, term);
    }
  }, [params.categoryId, searchParams, fetchCategoryProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/category/${params.id}?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="container mx-auto p-8 mt-[70px] bg-white min-h-screen min-w-screen">
      <Header />
      
      <div className="max-w-3xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative flex-grow">
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="ml-2 mx-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            {t('searchButton')}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <CiCircleAlert className="text-4xl mx-auto mb-2" />
          <p>{error}</p>
        </div>
      ) : products.length > 0 ? (
        <div>
          <h1 className="text-2xl text-black mb-6">
            {searchTerm ? (
              <>
                {t('resultsWithSearch')} "{searchTerm}"
              </>
            ) : (
              <>
                {products.length} {t('resultsWithoutSearch')} "{categoryName}"
              </>
            )}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : searchTerm ? (
        <div className="text-center py-12">
          <p className="text-xl">{t('noResultsSearch')} "{searchTerm}"</p>
          <p className="text-gray-500 mt-2">{t('tryDifferent')}</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl">{t('noProducts')}</p>
        </div>
      )}
    </div>
  );
}