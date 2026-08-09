'use client';

import Header from '@/components/Header';
import { useTranslations } from 'next-intl';
import { PiWhatsappLogoThin, PiTelegramLogoThin, PiPhoneThin, PiMapPinThin, PiClockThin } from 'react-icons/pi';
import { CiFacebook } from 'react-icons/ci';
import { buildWhatsAppUrl, whatsappMessages } from '@/lib/whatsapp';

const FACEBOOK_URL = 'https://www.facebook.com/@alserajnotebook/';
const TELEGRAM_URL = 'https://t.me/elsraj_factory';

export default function ContactPage() {
    const t = useTranslations('ContactPage');

    const details = [
        { icon: <PiPhoneThin className="text-2xl" />, title: t('phoneTitle'), value: t('phoneValue') },
        { icon: <PiMapPinThin className="text-2xl" />, title: t('addressTitle'), value: t('addressValue') },
        { icon: <PiClockThin className="text-2xl" />, title: t('hoursTitle'), value: t('hoursValue') },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 sm:pt-[90px] pt-[110px] px-4 pb-16">
            <Header />

            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
                <p className="text-lg text-gray-600 mb-10">{t('subtitle')}</p>

                <a
                    href={buildWhatsAppUrl(whatsappMessages.general())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-6 mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-[#25D366] transition-colors group"
                >
                    <span className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shrink-0">
                        <PiWhatsappLogoThin className="text-3xl" />
                    </span>
                    <span className="flex-1">
                        <span className="block font-semibold text-gray-900">{t('whatsappTitle')}</span>
                        <span className="block text-gray-600 text-sm">{t('whatsappBody')}</span>
                    </span>
                    <span className="text-sm font-medium text-[#25D366] group-hover:underline whitespace-nowrap">
                        {t('whatsappAction')}
                    </span>
                </a>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {details.map((detail) => (
                        <div key={detail.title} className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <span className="text-rose-600">{detail.icon}</span>
                            <h2 className="mt-3 text-sm font-semibold text-gray-900">{detail.title}</h2>
                            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{detail.value}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                        {t('socialTitle')}
                    </h2>
                    <div className="flex gap-3">
                        <a
                            href={FACEBOOK_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-gray-200 hover:border-rose-300 text-gray-700 transition-colors"
                        >
                            <CiFacebook className="text-2xl" />
                            {t('facebook')}
                        </a>
                        <a
                            href={TELEGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border border-gray-200 hover:border-rose-300 text-gray-700 transition-colors"
                        >
                            <PiTelegramLogoThin className="text-2xl" />
                            {t('telegram')}
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
