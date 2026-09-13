'use client';

import Header from '@/components/Header';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

/**
 * All copy comes from the messages files so it can be replaced without editing
 * this component. Anything still reading PLACEHOLDER has not been written yet.
 */
export default function AboutPage() {
    const t = useTranslations('AboutPage');

    const sections = [
        { title: t('storyTitle'), body: t('storyBody') },
        { title: t('manufacturingTitle'), body: t('manufacturingBody') },
        { title: t('whyTitle'), body: t('whyBody') },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 sm:pt-[90px] pt-[110px] px-4 pb-16">
            <Header />

            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
                <p className="text-lg text-gray-600 leading-relaxed mb-12">{t('intro')}</p>

                <div className="flex flex-col gap-10">
                    {sections.map((section) => (
                        <section key={section.title}>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>
                            <p className="text-gray-600 leading-relaxed">{section.body}</p>
                        </section>
                    ))}
                </div>

                <div className="mt-14 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('ctaTitle')}</h2>
                    <p className="text-gray-600 mb-6">{t('ctaBody')}</p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/catalogue"
                            className="px-6 py-3 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                        >
                            {t('ctaCatalogue')}
                        </Link>
                        <Link
                            href="/contact"
                            className="px-6 py-3 rounded-xl border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                        >
                            {t('ctaContact')}
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
