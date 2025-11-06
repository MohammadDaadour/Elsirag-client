'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import axios from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import { CiSearch, CiCircleAlert } from 'react-icons/ci';
import Header from '@/components/Header';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const term = searchParams.get('q') || '';
    setSearchTerm(term);
    if (term.trim().length >= 2) {
      fetchResults(term);
    } else {
      setLoading(false);
      setResults([]);
    }
  }, [searchParams]);

  const fetchResults = async (term: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.get('/products/search', {
        params: { 
          q: term,
          limit: Number(20) 
        }
      });
      setResults(data.data || []);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 mt-[70px] bg-white min-h-screen min-w-screen">
        <Header />
      <div className="max-w-3xl mx-auto mb-8">
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Searching for products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <CiCircleAlert className="text-4xl mx-auto mb-2" />
          <p>{error}</p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <h1 className="text-2xl text-black mb-6">
            {results.length} results for "{searchTerm}"
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : searchTerm ? (
        <div className="text-center py-12">
          <p className="text-xl">No results found for "{searchTerm}"</p>
          <p className="text-gray-500 mt-2">Try different keywords or check your spelling</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl">Enter a search term to find products</p>
        </div>
      )}
    </div>
  );
}