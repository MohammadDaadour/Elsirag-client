'use client';
import { useState, useEffect, useCallback } from 'react';
import HoverMenu from './HoverMenu';
import { CiSearch, CiCircleAlert } from 'react-icons/ci';
import { VscArrowRight } from "react-icons/vsc";
import { Product } from '@/types/product';
import axios from '@/lib/axios';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export const SearchHandler = () => {
    const router = useRouter();
    const t = useTranslations('Search')
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const fetchResults = useCallback(async (term: string) => {
        if (!term.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.get('/products/search', {
                params: {
                    q: (term.trim()),
                    //   page: 1,                           
                    //   limit: 5,
                    //   sortBy: 'relevance',               
                    //   sortOrder: 'DESC'  
                }
            });
            setResults(data.data);
        } catch (err) {
            setError('Failed to fetch results');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleViewAll = () => {
        if (searchTerm.trim()) {
            router.push(`/search?q=${(searchTerm.trim())}`);
        }
    };

    useEffect(() => {
        if (debouncedSearchTerm) {
            fetchResults(debouncedSearchTerm);
        } else {
            setResults([]);
        }
    }, [debouncedSearchTerm, fetchResults]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            handleViewAll();
        }
    };

    return (
        <HoverMenu
            title={<CiSearch className='text-4xl text-gray-600 sm:text-2xl cursor-pointer lg:flex hidden' />}
        >
            <div className="bg-white shadow-lg border border-gray-300 p-4 absolute min-w-[300px] left-0 z-50 overflow-hidden">
                <div className="p-3 border-b">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('placeholder')}
                        className="w-full p-2 outline-none border focus:ring-1 focus:ring-stone-500 text-black"
                        autoFocus
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">{t('searching')}</div>
                    ) : error ? (
                        <div className="p-4 flex items-center text-red-500">
                            <CiCircleAlert className="mr-2" />
                            {error}
                        </div>
                    ) : results.length > 0 ? (
                        <ul>
                            <li className="border-t">
                                <button
                                    onClick={handleViewAll}
                                    className="w-full p-3 text-left bg-stone-600 hover:text-stone-600 duration-200  text-white hover:bg-gray-50 flex items-center justify-between cursor-pointer"
                                >
                                    <span>{t('viewAllResults')} "{searchTerm}"</span>
                                    <VscArrowRight />
                                </button>
                            </li>
                            {results.map((product) => (
                                <li key={product.id} className="border-b last:border-b-0">
                                    <Link
                                        href={`/product/${product.id}`}
                                        className="block p-3 hover:bg-gray-50 transition-colors flex gap-2"
                                    >
                                        {product.images?.[0]?.url ? (
                                            <div>
                                                <Image
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    width={60}
                                                    height={30}
                                                    className=""
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-300">
                                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium text-stone-800">{product.name}</div>
                                            <div className="text-sm text-gray-600 truncate">
                                                {product.description}
                                            </div>
                                            <div className="text-sm font-semibold text-blue-600">
                                                ${product.price}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : debouncedSearchTerm ? (
                        <div className="p-4 text-center text-gray-500">
                           {t('noResults')} "{debouncedSearchTerm}"
                        </div>
                    ) : null}
                </div>
            </div>
        </HoverMenu>
    );
}


export const SearchHandlerMob = () => {
    const t = useTranslations('Search');
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const fetchResults = useCallback(async (term: string) => {
        if (!term.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.get('/products/search', {
                params: {
                    q: encodeURIComponent(term.trim()),
                }
            });
            setResults(data.data);
        } catch (err) {
            setError('Failed to fetch results');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleViewAll = () => {
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    useEffect(() => {
        if (debouncedSearchTerm) {
            fetchResults(debouncedSearchTerm);
        } else {
            setResults([]);
        }
    }, [debouncedSearchTerm, fetchResults]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            handleViewAll();
        }
    };

    return (
            <div className="bg-white p-4 w-full left-0 z-50 overflow-hidden">
                <div className="p-3 border-b">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('placeholder')}
                        className="w-full p-2 outline-none border focus:ring-1 focus:ring-stone-500 text-black"
                        autoFocus
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">{t('searching')}</div>
                    ) : error ? (
                        <div className="p-4 flex items-center text-red-500">
                            <CiCircleAlert className="mr-2" />
                            {error}
                        </div>
                    ) : results.length > 0 ? (
                        <ul>
                            <li className="border-t">
                                <button
                                    onClick={handleViewAll}
                                    className="w-full p-3 text-left bg-stone-600 hover:text-stone-600 duration-200  text-white hover:bg-gray-50 flex items-center justify-between cursor-pointer"
                                >
                                    <span>{t('viewAllResults')} "{searchTerm}"</span>
                                    <VscArrowRight />
                                </button>
                            </li>
                            {results.map((product) => (
                                <li key={product.id} className="border-b last:border-b-0">
                                    <Link
                                        href={`/product/${product.id}`}
                                        className="block p-3 hover:bg-gray-50 transition-colors flex gap-2"
                                    >
                                        {product.images?.[0]?.url ? (
                                            <div>
                                                <Image
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    width={60}
                                                    height={30}
                                                    className=""
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-300">
                                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium text-stone-800">{product.name}</div>
                                            <div className="text-sm text-gray-600 truncate">
                                                {product.description}
                                            </div>
                                            <div className="text-sm font-semibold text-blue-600">
                                                ${product.price}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : debouncedSearchTerm ? (
                        <div className="p-4 text-center text-gray-500">
                     {t('noResults')} "{debouncedSearchTerm}"
                        </div>
                    ) : null}
                </div>
            </div>
    );
}