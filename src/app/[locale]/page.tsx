'use client';

import Header from '@/components/Header';
import Slogan from '@/components/Slogan';
import FeaturedProducts from '@/components/FeatruredProducts';
import CategoryTiles from '@/components/CategoryTiles';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { PiWhatsappLogoThin } from 'react-icons/pi';
import { buildWhatsAppUrl, whatsappMessages } from '@/lib/whatsapp';

export default function Homepage() {
  const t = useTranslations('HomePage');

  return (
    <div>
      <div className='flex-1 flex-col font-poppins'>
        <div className="fixed top-0 left-0 w-full z-20">
          <Header />
        </div>
        <Slogan />
      </div>

      <section className="w-full p-16 mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h2 className="text-3xl text-gray-900 mb-4 sm:mb-0">{t('categoriesTitle')}</h2>
            <Link
              href="/catalogue"
              className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
            >
              {t('categoriesLink')}
            </Link>
          </div>

          <CategoryTiles />
        </div>
      </section>

      <FeaturedProducts />

      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('aboutTitle')}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{t('aboutBody')}</p>
        </div>
      </section>

      <section className="px-4 py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('contactTitle')}</h2>
          <p className="text-gray-600 mb-8">{t('contactBody')}</p>
          <a
            href={buildWhatsAppUrl(whatsappMessages.stocking())}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#1fba59] text-white font-medium shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <PiWhatsappLogoThin className="text-2xl" />
            {t('contactAction')}
          </a>
        </div>
      </section>
    </div>
  );
}
