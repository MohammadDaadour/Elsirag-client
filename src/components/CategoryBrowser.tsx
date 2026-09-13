'use client';

import { useCallback, useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import axios from '@/lib/axios';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { useTranslations, useLocale } from 'next-intl';
import { pickLocale } from '@/lib/localized';
import { ClipLoader } from 'react-spinners';
import { CiSearch, CiGrid41 } from 'react-icons/ci';
import { useDebounce } from '@/hooks/useDebounce';

const PAGE_SIZE = 12;

/**
 * Product grid for one category, or for everything when `categoryId` is null.
 * The category list is a sidebar on desktop and a scrolling row of chips on
 * mobile, so switching category is always one tap away.
 */
export default function CategoryBrowser({ categoryId }: { categoryId: number | null }) {
    const t = useTranslations('CataloguePage');
    const locale = useLocale();

    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 350);

    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/categories')
            .then(({ data }) => setCategories(data))
            .catch(() => setCategories([]));
    }, []);

    // Clear the search when moving between categories.
    useEffect(() => { setSearchTerm(''); }, [categoryId]);

    const fetchProducts = useCallback(async (targetPage: number, replace: boolean) => {
        setLoading(true);
        try {
            const { data } = await axios.get('/products', {
                params: {
                    page: targetPage,
                    limit: PAGE_SIZE,
                    ...(categoryId ? { categoryId } : {}),
                    ...(debouncedSearch ? { search: debouncedSearch } : {}),
                },
            });

            const items: Product[] = data.data ?? [];
            setProducts(prev => (replace ? items : [...prev, ...items]));
            setTotal(data.meta?.totalItems ?? items.length);
        } catch {
            if (replace) setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [categoryId, debouncedSearch]);

    useEffect(() => {
        setPage(1);
        fetchProducts(1, true);
    }, [fetchProducts]);

    const loadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchProducts(next, false);
    };

    const current = categories.find(c => c.id === categoryId) ?? null;
    const heading = current ? pickLocale(locale, current.name, current.nameAr) : t('allProducts');
    const currentDescription = current ? pickLocale(locale, current.description ?? '', current.descriptionAr) : '';

    const navItems = [
        { id: null as number | null, name: t('allProducts'), href: '/catalogue/all' },
        ...categories.map(c => ({ id: c.id as number | null, name: pickLocale(locale, c.name, c.nameAr), href: `/catalogue/${c.id}` })),
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 sm:pt-[90px] pt-[110px] px-4 pb-16">
            <Header />

            <div className="max-w-7xl mx-auto">
                <Link
                    href="/catalogue"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-rose-600 transition-colors mb-4"
                >
                    <CiGrid41 className="text-lg" />
                    {t('backToCatalogue')}
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-1">{heading}</h1>
                {currentDescription && <p className="text-gray-600 mb-6">{currentDescription}</p>}

                {/* Mobile: horizontally scrolling chips */}
                <div className="lg:hidden -mx-4 px-4 mb-6 overflow-x-auto">
                    <div className="flex gap-2 w-max pb-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 text-sm rounded-full border whitespace-nowrap transition-colors ${item.id === categoryId
                                    ? 'bg-rose-600 border-rose-600 text-white'
                                    : 'bg-white border-gray-200 text-gray-700'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Desktop: sidebar */}
                    <aside className="hidden lg:block w-56 shrink-0">
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">
                            {t('browseCategories')}
                        </h2>
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${item.id === categoryId
                                        ? 'bg-rose-600 text-white font-medium'
                                        : 'text-gray-700 hover:bg-white hover:text-rose-600'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    <div className="flex-1 min-w-0">
                        <div className="relative mb-6 max-w-md">
                            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('searchPlaceholder')}
                                className="w-full ps-10 pe-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 text-gray-900"
                            />
                        </div>

                        {loading && products.length === 0 ? (
                            <div className="flex justify-center py-24">
                                <ClipLoader size={35} color="#e11d48" />
                            </div>
                        ) : products.length === 0 ? (
                            <p className="py-24 text-center text-gray-500">{t('noResults')}</p>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                <div className="mt-10 flex flex-col items-center gap-3">
                                    <p className="text-sm text-gray-500">
                                        {t('showing', { shown: products.length, total })}
                                    </p>
                                    {products.length < total && (
                                        <button
                                            type="button"
                                            onClick={loadMore}
                                            disabled={loading}
                                            className="px-6 py-3 rounded-xl border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            {loading ? t('loading') : t('loadMore')}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
