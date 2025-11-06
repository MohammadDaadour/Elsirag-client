'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import elsirag_logo from '../assets/elsirag_logo.png';
import { CiShoppingCart, CiHeart, CiSearch, CiGlobe, CiUser, CiFacebook } from "react-icons/ci";
import { PiTelegramLogoThin, PiWhatsappLogoThin } from "react-icons/pi";
import Link from 'next/link';
import { GetUser, GetUserInfo } from './GetUser';
import { SearchHandler, SearchHandlerMob } from './SearchHandler';
import HoverMenu from './HoverMenu';
import { useUser } from '@/context/UserContext';
import { CategoryList, CategoryListContent } from './CategoryList';
import { ContactList } from './ContactList';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function Header() {
    const t = useTranslations('Header')
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();
    const { loading, user, isAuthenticated } = useUser();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }

    const closeNav = () => {
        setIsNavOpen(false);
        setIsCategoryOpen(false);
        setIsContactOpen(false);
    }

    const toggleCategory = () => {
        setIsCategoryOpen(!isCategoryOpen);
        setIsContactOpen(false); // Close contact when opening category
    }

    const toggleContact = () => {
        setIsContactOpen(!isContactOpen);
        setIsCategoryOpen(false); // Close category when opening contact
    }

    const switchLocale = (newLocale: 'en' | 'ar') => {
    if (newLocale === currentLocale) return;

    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
    router.refresh();
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
                        <CategoryList />
                        <ContactList />
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
                                <GetUser />
                                <SearchHandler />
                                <Link className='hover:text-black cursor-pointer p-6 px-3' href={'/cart'}>
                                    <CiShoppingCart className='text-3xl text-gray-600 sm:text-2xl' />
                                </Link>
                                {isAuthenticated &&
                                    <Link className='hover:text-black cursor-pointer p-6 px-3' href={'/wishlist'}>
                                        <CiHeart className='text-4xl text-gray-600 sm:text-2xl' />
                                    </Link>
                                }
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

                            <Link className='lg:hidden hover:text-black cursor-pointer p-6 px-3' href={'/cart'}>
                                <CiShoppingCart className='text-3xl text-gray-600' />
                            </Link>
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

                        <div className=" border-b border-gray-200">
                            <div className="flex items-center justify-center text-black">
                                <GetUserInfo />
                            </div>
                        </div>

                        <div className="mb-8 pb-6 border-b border-gray-200">
                            {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h3> */}
                            <div className="space-y-4">
                                <Link href={'/'} onClick={closeNav}>
                                    <div className='text-gray-600 hover:text-black cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors'>
                                        {t('home')}
                                    </div>
                                </Link>

                                <div>
                                    <button
                                        onClick={toggleCategory}
                                        className='w-full text-left text-gray-600 hover:text-black cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between'
                                    >
                                        <span>{t('categories')}</span>
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isCategoryOpen && (
                                        <CategoryListContent />
                                    )}
                                </div>
                                <div>
                                    <button
                                        onClick={toggleContact}
                                        className='w-full text-left text-gray-600 hover:text-black cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between'
                                    >
                                        <span>{t('contact')}</span>
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${isContactOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    {isContactOpen && (
                                        <div className="text-gray-700 bg-white min-w-[300px] left-0 z-50">
                                            <div>
                                                <ul className="space-y-1 text-sm">
                                                    <a href="https://api.whatsapp.com/send/?phone=201208959772&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                                                        <li className='flex items-center px-8 py-2 hover:bg-gray-200 duration-300 z-50'>    <PiWhatsappLogoThin className='text-gray-600 text-4xl sm:text-3xl mx-2' /> {t('whatsapp')}</li>
                                                    </a>
                                                    <a href="https://www.facebook.com/@alserajnotebook/" target="_blank" rel="noopener noreferrer">
                                                        <li className='flex items-center px-8 py-2 hover:bg-gray-200 duration-300 z-50'> <CiFacebook className='text-4xl text-gray-600 sm:text-3xl mx-2' /> {t('facebook')}</li>
                                                    </a>
                                                    <a href="https://t.me/elsraj_factory" target="_blank" rel="noopener noreferrer">
                                                        <li className='flex items-center px-8 py-2 pb-4 hover:bg-gray-200 duration-300 z-50'>  <PiTelegramLogoThin className='text-4xl text-gray-600 sm:text-3xl mx-2' />{t('telegram')}</li>
                                                    </a>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3> */}
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    className='flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                                    href={'/cart'}
                                    onClick={closeNav}
                                >
                                    <CiShoppingCart className='text-4xl text-gray-600 mb-2' />
                                    <span className="text-sm text-gray-600">{t('cart')}</span>
                                </Link>

                                {isAuthenticated && (
                                    <Link
                                        className='flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                                        href={'/wishlist'}
                                        onClick={closeNav}
                                    >
                                        <CiHeart className='text-4xl text-gray-600 mb-2' />
                                        <span className="text-sm text-gray-600">{t('wishlist')}</span>
                                    </Link>
                                )}

                                {/* <div className='flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer'>
                                    <CiGlobe className='text-4xl text-gray-600 mb-2' />
                                    <span className="text-sm text-gray-600">{t('language')}</span>
                                </div> */}
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