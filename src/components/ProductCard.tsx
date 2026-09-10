'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product, displayPrice } from '@/types/product';
import { useTranslations, useLocale } from 'next-intl';
import { pickLocale } from '@/lib/localized';

export default function ProductCard({ product }: { product: Product }) {
    const t = useTranslations('ProductCard');
    const locale = useLocale();
    const name = pickLocale(locale, product.name, product.nameAr);
    const categoryName = pickLocale(locale, product.category?.name ?? '', product.category?.nameAr);

    const { amount, from } = displayPrice(product);

    const formatPrice = (price: number | string) => {
        return new Intl.NumberFormat('en-EG', {
            style: 'currency',
            currency: 'EGP',
        }).format(Number(price ?? 0));
    };

    return (
        <div>
            <div className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-rose-100">
                <div className="relative overflow-hidden">
                    <Link href={`/product/${product.id}`}>
                        <div className="aspect-square bg-gray-50 relative">
                            {product.images?.[0]?.url ? (
                                <Image
                                    src={product.images[0].url}
                                    alt={name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </Link>

                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                        <span className="text-xs font-medium text-gray-700">
                            {categoryName}
                        </span>
                    </div>
                </div>

                <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-rose-600 transition-colors">
                            {name}
                        </h3>
                    </Link>

                    <div className="flex items-center justify-between flex-wrap">
                        <div>
                            <span className="text-lg font-bold text-gray-900">
                                {from ? `${t('from')} ` : ''}{formatPrice(amount)}
                            </span>
                            <span className="block text-xs text-gray-500 mt-1">
                                {t('wholesalePrice')}
                            </span>
                        </div>

                        <Link
                            href={`/product/${product.id}`}
                            className="px-4 py-2 my-2 text-sm font-medium text-rose-600 hover:text-white hover:bg-rose-600 rounded-full border border-rose-600 transition-colors"
                        >
                            {t('view')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
