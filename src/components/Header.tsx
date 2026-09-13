'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import elsirag_logo from '../assets/elsirag_logo.png';
import { CiSearch, CiGlobe, CiUser } from "react-icons/ci";
import Link from 'next/link';
import AdminMenu from './AdminMenu';
import { SearchHandler, SearchHandlerMob } from './SearchHandler';
import HoverMenu from './HoverMenu';
import { useUser } from '@/context/UserContext';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export default function Header() {
    const t = useTranslations('Header')
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();
    const { loading, user, isAuthenticated } = useUser();
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }

    const closeNav = () => {
        setIsNavOpen(false);
    }

    // next-intl's router knows the prefix rules (Arabic is unprefixed, English
    // is /en) and sets the locale cookie, so the switch sticks.
    const switchLocale = (newLocale: 'en' | 'ar') => {
        if (newLocale === currentLocale) return;
        router.replace(pathname, { locale: newLocale });
    };

    if (loading) {
        return (
            <header className="p-4 bg-gray-100 border-b border-gray-200 w-full animate-pulse flex items-center justify-between">
                <div className="h-8 w-24 bg-gray-300 rounded" />
                <div className="h-8 w-8 bg-gray-300 rounded-full" />
            </header>
        );
    }

    return (
        <>
            <div className="fixed top-0 left-0 w-full bg-white z-20 shadow-md">
                <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4">
                    <div className='w-[33%] lg:flex hidden justify-end list-none text-gray-600'>
                        <Link href={'/'}>
                            <div className='hover:text-black cursor-pointer p-6 px-3'>{t('home')}</div>
                        </Link>
                        <Link href={'/catalogue'}>
                            <div className='hover:text-black cursor-pointer p-6 px-3'>{t('catalogue')}</div>
                        </Link>
                        <Link href={'/contact'}>
                            <div className='hover:text-black cursor-pointer p-6 px-3'>{t('contact')}</div>
                        </Link>
                    </div>
                    <button
                        className="lg:hidden p-2 relative z-50 group w-[33%]"
                        onClick={toggleNav}
                        aria-label="Toggle Menu"
                    >
                        <div className="space-y-1.5">
                            <span
                                className={`block w-6 h-0.5 bg-stone-700 transition-transform duration-300 ease-in-out 
                    ${isNavOpen ? 'transform rotate-45 translate-y-1.5' : ''}`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-stone-700 transition-opacity duration-300 ease-in-out 
                    ${isNavOpen ? 'opacity-0' : ''}`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-stone-700 transition-transform duration-300 ease-in-out 
                    ${isNavOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}
                            ></span>
                        </div>
                    </button>
                    <Link href={'/'} className='flex justify-center w-[33%]'>
                        <Image
                            className="w-18"
                            src={elsirag_logo}
                            alt="logo"
                            width={96}
                            height={96}
                            priority
                        />
                    </Link>
                    <div className='flex lg:justify-center justify-end w-[33%]'>
                        <div className='flex items-center'>
                            <div className='lg:flex hidden'>
                                <SearchHandler />
                                <AdminMenu />
                                <HoverMenu title={<CiGlobe className="text-4xl text-gray-600 sm:text-2xl" />}>
                                    <div className="bg-white shadow-lg border border-gray-300 absolute min-w-[200px] left-0 z-50  overflow-hidden">
                                        <button
                                            onClick={() => switchLocale('en')}
                                            className={`w-full px-6 py-4 text-left text-gray-500 hover:bg-gray-100 flex items-center gap-3 transition cursor-pointer ${currentLocale === 'en' ? 'bg-rose-50 font-bold text-rose-600' : ''
                                                }`}
                                        >
                                            English
                                            {currentLocale === 'en' && <span className="ml-auto">✓</span>}
                                        </button>
                                        <button
                                            onClick={() => switchLocale('ar')}
                                            className={`w-full px-6 py-4 text-left text-gray-500 hover:bg-gray-100 flex items-center gap-3 transition border-t border-gray-200 cursor-pointer ${currentLocale === 'ar' ? 'bg-rose-50 font-semibold text-rose-500' : ''
                                                }`}
                                        >
                                            العربية
                                            {currentLocale === 'ar' && <span className="ml-auto">✓</span>}
                                        </button>
                                    </div>
                                </HoverMenu>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className={`lg:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <button
                            onClick={closeNav}
                            className="p-2 text-gray-600 hover:text-black"
                            aria-label="Close Menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <Link href={'/'}>
                            <Image
                                className="w-16"
                                src={elsirag_logo}
                                alt="logo"
                                width={64}
                                height={64}
                                priority
                            />
                        </Link>
                    </div>


                    <div className="flex-1 overflow-y-auto p-6">
                        <div className=" border-b border-gray-200">
                            <div className="flex items-center justify-center">
                                <SearchHandlerMob />
                            </div>
                        </div>

                        <div className="flex items-center justify-center text-black">
                            <AdminMenu onNavigate={closeNav} />
                        </div>

                        <div className="mb-8 pb-6 border-b border-gray-200">
                            {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h3> */}
                            <div className="space-y-4">
                                <Link href={'/'} onClick={closeNav}>
                                    <div className='text-gray-600 hover:text-black cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors'>
                                        {t('home')}
                                    </div>
                                </Link>

                                <Link href={'/catalogue'} onClick={closeNav}>
                                    <div className='text-gray-600 hover:text-black cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors'>
                                        {t('catalogue')}
                                    </div>
                                </Link>

                                <Link href={'/contact'} onClick={closeNav}>
                                    <div className='text-gray-600 hover:text-black cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors'>
                                        {t('contact')}
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="mb-8">
                            {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3> */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className='flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer'>
                                        <button
                                            onClick={() => switchLocale('en')}
                                            className={`w-full px-6 py-4 text-left text-gray-500 hover:bg-gray-100 flex items-center gap-3 transition cursor-pointer ${currentLocale === 'en' ? 'bg-rose-50 font-bold text-rose-600' : ''
                                                }`}
                                        >
                                            English
                                            {currentLocale === 'en' && <span className="ml-auto">✓</span>}
                                        </button>
                                        <button
                                            onClick={() => switchLocale('ar')}
                                            className={`w-full px-6 py-4 text-left text-gray-500 hover:bg-gray-100 flex items-center gap-3 transition border-t border-gray-200 cursor-pointer ${currentLocale === 'ar' ? 'bg-rose-50 font-semibold text-rose-500' : ''
                                                }`}
                                        >
                                            العربية
                                            {currentLocale === 'ar' && <span className="ml-auto">✓</span>}
                                        </button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isNavOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={closeNav}
                />
            )}
        </>
    );
}