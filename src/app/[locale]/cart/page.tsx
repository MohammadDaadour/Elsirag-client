'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/context/UserContext';
import { RetrievedItem } from '@/types/cart';
import Image from 'next/image';
import Header from '@/components/Header';
import { CiTrash } from 'react-icons/ci';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function CartPage() {
    const t = useTranslations('CartPage')
    const { isAuthenticated } = useUser();
    const [cartItems, setCartItems] = useState<RetrievedItem[] | null>(null);
    const { getCart, removeFromCart, updateQuantity } = useCart();
    const router = useRouter();

    const getSortedCart = () => {
        getCart().then(cart => {
            const sortedItems = (cart.items || []).sort((a, b) => a.id - b.id);
            setCartItems(sortedItems);
        }
        )
    }

    useEffect(() => {
        if (isAuthenticated !== undefined) {
            getSortedCart();
        }
    }, [isAuthenticated]);

    const handleProceedToCheckout = () => {
        if (isAuthenticated) {
            router.push('/checkout');
        }
        else {
            toast.error('Login first please.');
            router.push('/sign-in');
        }
    }

    return (
        <main className="flex flex-col items-center p-6 bg-white min-h-screen w-full text-black ">
            <Header />
            <h1 className="text-2xl mb-4 mt-[90px] max-w-4x">{t('title')}</h1>
            {cartItems === null ? (
                <p>{t('loading')}</p>
            ) : cartItems.length === 0 ? (
                <p>{t('empty')}</p>
            ) : (
                <>
                    <ul className="space-y-4 max-w-[1080px] lg:min-w-[968px] w-full">
                        {cartItems.map((item) => (
                            <li className="flex items-center gap-4 pb-4 bg-gray-100 p-4 rounded-xl" key={item?.id}>
                                <Link href={`/product/${item.product?.id}`}>
                                    {item.product?.images?.[0]?.url ? (
                                        <Image
                                            src={item.product?.images[0].url}
                                            alt={item.product?.name}
                                            height={150}
                                            width={150}
                                            className="rounded-lg border border-stone-200 sm:w-[150px]  w-[100px]"
                                        />
                                    ) : (
                                        <div className="w-[60px] h-[60px] bg-gray-100 flex items-center justify-center text-gray-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </Link>
                                <Link className='flex-1' href={`/product/${item.product?.id}`}>
                                    <div className="">
                                        <p className="font-medium">{item.product?.name}</p>
                                    </div>
                                </Link>
                                <div className='flex items-center'>
                                    <p onClick={() => updateQuantity(item.id, item.quantity + 1).then(() => {
                                        getSortedCart()
                                    })
                                    } className={`p-1 px-3 rounded-lg border border-stone-500 shadow-md cursor-pointer ${item.product?.stock <= item.quantity ? 'pointer-events-none opacity-50' : ''}`}>+</p>
                                    <p className='px-3 py-1 text-lg'>
                                        {item.quantity}
                                    </p>
                                    <p onClick={() => updateQuantity(item.id, item.quantity - 1).then(() => {
                                        getSortedCart()
                                    })} className={`p-1 px-3 rounded-lg border border-stone-500 shadow-md cursor-pointer ${item.quantity === 0 ? 'pointer-events-none opacity-50' : ''}`}>-</p>
                                </div>
                                <button
                                    className="ml-4 text-red-600 text-2xl hover:text-red-800 cursor-pointer"
                                    onClick={() => removeFromCart(item.id).then(() => getSortedCart())}
                                >
                                    <CiTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleProceedToCheckout}
                        className='bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-rose-300/50 transition-all transform hover:-translate-y-1 cursor-pointer my-4'>
                        {t('proceedToCheckout')}
                    </button>
                </>
            )}
        </main >
    );
}
