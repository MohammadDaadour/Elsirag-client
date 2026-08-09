'use client';

import Header from '@/components/Header';
import CategoryTiles from '@/components/CategoryTiles';
import { useTranslations } from 'next-intl';

/** Entry point to the catalogue: one tile per category, plus an all-products tile. */
export default function CataloguePage() {
    const t = useTranslations('CataloguePage');

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 sm:pt-[90px] pt-[110px] px-4 pb-16">
            <Header />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
                    <p className="text-gray-600">{t('subtitle')}</p>
                </div>

                <CategoryTiles showAllTile />
            </div>
        </main>
    );
}
