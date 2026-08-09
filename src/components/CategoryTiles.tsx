'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from '@/lib/axios';
import { Category } from '@/types/category';
import { useTranslations } from 'next-intl';
import { ClipLoader } from 'react-spinners';
import { CiGrid41 } from 'react-icons/ci';

/**
 * Category tiles for the catalogue index and the homepage. Shared so the two
 * cannot drift apart visually.
 */
export default function CategoryTiles({ showAllTile = false }: { showAllTile?: boolean }) {
    const t = useTranslations('CataloguePage');
    const [categories, setCategories] = useState<Category[] | null>(null);

    useEffect(() => {
        axios.get('/categories')
            .then(({ data }) => setCategories(data))
            .catch(() => setCategories([]));
    }, []);

    if (categories === null) {
        return (
            <div className="flex justify-center py-24">
                <ClipLoader size={35} color="#e11d48" />
            </div>
        );
    }

    if (categories.length === 0) {
        return <p className="py-12 text-center text-gray-500">{t('noCategories')}</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`/catalogue/${category.id}`}
                    className="group relative block overflow-hidden rounded-2xl shadow-lg bg-white border border-gray-100 hover:border-rose-200 transition-all"
                >
                    <div className="relative aspect-[4/3] bg-gray-100">
                        {category.image?.url ? (
                            <Image
                                src={category.image.url}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-300">
                                <CiGrid41 className="w-16 h-16" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 inset-x-0 p-5">
                            <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                            {category.description && (
                                <p className="text-sm text-white/80 line-clamp-1 mt-1">
                                    {category.description}
                                </p>
                            )}
                        </div>
                    </div>
                </Link>
            ))}

            {showAllTile && (
                <Link
                    href="/catalogue/all"
                    className="group flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-gray-300 hover:border-rose-400 bg-white/60 p-8 min-h-[200px] transition-colors"
                >
                    <CiGrid41 className="w-12 h-12 text-gray-400 group-hover:text-rose-500 transition-colors" />
                    <h3 className="mt-3 text-lg font-semibold text-gray-900">{t('allProducts')}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t('allProductsDescription')}</p>
                </Link>
            )}
        </div>
    );
}
