import React, { ReactElement, useState, useEffect } from 'react';
import { CiUser } from 'react-icons/ci';
import axios from "@/lib/axios";
import HoverMenu from './HoverMenu';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { useTranslations } from 'next-intl';

export const GetUser = () => {
    const t = useTranslations('Header');
    const { user, isAuthenticated, logout, loading } = useUser();

    const handleSignOut = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
        } catch (err: any) {
            toast.error("Failed to log out");
        }
    };

    return (
        <HoverMenu title={<CiUser className='text-4xl text-gray-600 sm:text-2xl lg:flex hidden' />}>
            <div className="bg-white shadow-lg border border-gray-300 absolute p-8 min-w-[300px] left-0 z-50 flex flex-column items-center">
                {
                    user ? <div>
                        <p className='text-black'> {user.username}</p>
                        {
                            user.role === 'admin' ?
                                <div>
                                    <p className='text-stone-600'>(admin account)</p>
                                    <Link href="/admin/dashboard/users">
                                        <button className='text-white p-4 border w-[300px] bg-stone-600 cursor-pointer
                                    hover:text-stone-600 hover:bg-white duration-200 my-4'> {t('dashboard')} </button>
                                    </Link>

                                </div> : null
                        }
                        <Link href={'/orders'}>
                            <button className='text-white p-4 border w-[300px] bg-stone-600 cursor-pointer
                                    hover:text-stone-600 hover:bg-white duration-200 my-4'>
                                {t('myOrders')}
                            </button></Link>
                        <button onClick={handleSignOut} className='text-white p-2 border w-[100px] bg-stone-600 cursor-pointer hover:text-stone-600 hover:bg-white duration-200'>{t('signOut')}</button>
                    </div> :
                        <div>
                            {
                                loading ? 'Loading....' :
                                    <div>
                                        <Link href="/sign-in">
                                            <button className='text-white p-4 border w-[300px] bg-stone-600 cursor-pointer hover:text-stone-600 hover:bg-white duration-200'>{t('signIn')}</button>
                                        </Link>
                                        <Link href="register">
                                            <button className='text-stone-500 p-4 border mt-4 w-[300px] cursor-pointer hover:text-white hover:bg-stone-600 duration-200'>{t('createAccount')}</button>
                                        </Link>
                                    </div>
                            }
                        </div>
                }
            </div>
        </HoverMenu>
    )
}

export const GetUserInfo = () => {
    const t = useTranslations('Header');
    const { user, isAuthenticated, logout, loading } = useUser();
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
        } catch (err: any) {
            toast.error("Failed to log out");
        }
    };

    const toggleUserInfo = () => {
        setIsInfoOpen(!isInfoOpen);
    }

    return (
        <div className="bg-white w-full left-0 z-50 flex flex-col py-4 items-center">
            {
                user ? <div className='w-full'>
                    <button
                        onClick={toggleUserInfo}
                        className='w-full text-left text-gray-600 hover:text-black cursor-pointer py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between'
                    >
                        <div>
                            <p className='text-black'> {user.username}</p>
                            {user.role === 'admin' && <p className='text-stone-600'>(admin account)</p>}
                        </div>
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isInfoOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isInfoOpen &&
                        <div className='flex flex-col'>
                            {
                                user.role === 'admin' ?
                                    <div>
                                        <Link href="/admin/dashboard">
                                            <button className='text-white p-4 border w-[300px] bg-stone-600 cursor-pointer
                                    hover:text-stone-600 hover:bg-white duration-200 my-4 mb-0'> Dashboard </button>
                                        </Link>
                                    </div> : null
                            }
                            <Link href={'/orders'}>
                                <button className='text-white p-4 border w-[300px] bg-stone-600 cursor-pointer
                                    hover:text-stone-600 hover:bg-white duration-200 my-4'>
                                    {t('myOrders')}
                                </button></Link>
                            <button onClick={handleSignOut} className='text-white p-2 border w-[100px] bg-stone-600 cursor-pointer hover:text-stone-600 hover:bg-white duration-200'>{t('signOut')}</button>
                        </div>
                    }
                </div> :
                    <div>
                        {
                            loading ? 'Loading....' :
                                <div>
                                    <Link href="/sign-in">
                                        <button className='text-white p-4 border w-[300px] bg-stone-600 cursor-pointer hover:text-stone-600 hover:bg-white duration-200'>{t('signIn')}</button>
                                    </Link>
                                    {/* <Link href="register">
                                            <button className='text-stone-500 p-4 border mt-4 w-[300px] cursor-pointer hover:text-white hover:bg-stone-600 duration-200'>Create Account</button>
                                        </Link> */}
                                </div>
                        }
                    </div>
            }
        </div>
    )
}