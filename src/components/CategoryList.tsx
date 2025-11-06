'use client'

import { ReactElement, useState, useEffect } from 'react';
import { useCategory } from '@/hooks/useCategory';
import { Category } from '@/types/category';
import Link from 'next/link';
import HoverMenu from './HoverMenu';
import { useTranslations } from 'next-intl';

export const CategoryList = () => {
    const t = useTranslations('Header');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);

    const { getAllCategories } = useCategory();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategories(res?.data || []);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <HoverMenu title={t('categories')} >
            <div className="bg-white shadow-lg border border-gray-300 absolute min-w-[300px] left-0 z-50">
                <div>
                    <h4 className="text-xs text-gray-500 uppercase mb-2 py-2 pt-4 px-8">{t('categories')}</h4>
                    {loading ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto pb-2"></div>
                    ) : (
                        categories.length > 0 ? (
                            <ul className={`text-sm pb-2 ${categories.length > 4
                                ? `grid grid-cols-${Math.ceil(categories.length / 4)} gap-x-4`
                                : 'block'
                                }`}>
                                {categories.map((cat) => (
                                    <Link className='' key={cat.id} href={`/category/${cat.id}`}>
                                        <li className='px-8 py-2 hover:bg-gray-200 duration-300'>{cat.name}</li>
                                    </Link>
                                ))}
                            </ul>
                        ) : (
                            <ul className="text-sm pb-2">
                                <li className="px-8 py-2 text-gray-400 italic">No categories found</li>
                            </ul>
                        )
                    )}
                </div>
            </div>
        </HoverMenu>
    );
}

export const CategoryListContent = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);

    const { getAllCategories } = useCategory();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategories(res?.data || []);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
            <div className="bg-white min-w-[300px] left-0 z-50 text-gray-700">
                <div>
                    {loading ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto pb-2"></div>
                    ) : (
                        categories.length > 0 ? (
                            <ul className={`text-sm pb-2 ${categories.length > 4
                                ? `grid grid-cols-${Math.ceil(categories.length / 4)} gap-x-4`
                                : 'block'
                                }`}>
                                {categories.map((cat) => (
                                    <Link className='' key={cat.id} href={`/category/${cat.id}`}>
                                        <li className='px-8 py-2 hover:bg-gray-200 duration-300'>{cat.name}</li>
                                    </Link>
                                ))}
                            </ul>
                        ) : (
                            <ul className="text-sm pb-2">
                                <li className="px-8 py-2 text-gray-400 italic">No categories found</li>
                            </ul>
                        )
                    )}
                </div>
            </div>
    );
}