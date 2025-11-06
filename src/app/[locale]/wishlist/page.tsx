'use client'

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext"
import { RetrievedItem } from "@/types/cart";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { CiTrash } from "react-icons/ci";
import { useWishList } from "@/hooks/useWishList";
import { useTranslations } from "next-intl";

const wishList = () => {
    const t = useTranslations('WishlistPage');
    const { isAuthenticated } = useUser();
    const [wishListItems, setWishListItems] = useState<RetrievedItem[] | null>(null);
    const { getWishList, removeFromWishlist, addToWishList } = useWishList();

    const getSortedCart = () => {
        getWishList().then(wishlist => {
            const sortedItems = (wishlist || []).sort((a, b) => a.id - b.id);
            setWishListItems(sortedItems);
        })
    }

    useEffect(() => {
        if (isAuthenticated !== undefined) {
            getSortedCart();
        }
    }, [isAuthenticated]);

    return (
        <main className="flex flex-col items-center p-6 bg-white min-h-screen w-full text-black ">
            <Header />
            <h1 className="text-2xl mb-4 mt-[90px] max-w-4x">{t('title')}</h1>
            {wishListItems === null ? (
                <p>{t('loading')}</p>
            ) : wishListItems.length === 0 ? (
                <p>{t('empty')}</p>
            ) : (
                <ul className="space-y-4 max-w-[1080px] lg:min-w-[968px] w-full">
                    {wishListItems.map((item) => (
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
                            <button
                                className="ml-4 text-red-600 text-2xl hover:text-red-800 cursor-pointer"
                                onClick={() => removeFromWishlist(item.product.id).then(() => getSortedCart())}
                            >
                                <CiTrash />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </main >
    );
}

export default wishList;
