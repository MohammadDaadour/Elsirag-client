'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { CiShoppingCart, CiHeart } from 'react-icons/ci';
import { useCart } from '@/hooks/useCart';
import { useWishList } from '@/hooks/useWishList';
import { RetrievedItem } from '@/types/cart';
import { useTranslations } from 'next-intl';


export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    const t = useTranslations('ProductCard');
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const { addToWishList, getWishList, removeFromWishlist } = useWishList();

    useEffect(() => {
        if (product?.id) {
            checkWishlistStatus(product.id);
        }
    }, [product?.id]);

    const checkWishlistStatus = async (productId: number) => {
        setWishlistLoading(true);
        try {
            const wishlist = await getWishList();
            const inWishlist = wishlist.some((item: RetrievedItem) => item.product.id === productId);
            setIsInWishlist(inWishlist);
        } catch (error) {
            console.error("Failed to check wishlist status", error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const toggleWishlist = async (productId: number) => {
        if (wishlistLoading || !product) return;

        setWishlistLoading(true);
        try {
            if (isInWishlist) {
                await removeFromWishlist(product.id);
                setIsInWishlist(false);
            } else {
                await addToWishList({ productId: product.id });
                const wishlist = await getWishList();
                const inWishlist = wishlist.some((item: RetrievedItem) => item.product.id === productId);
                setIsInWishlist(inWishlist);
            }
        } catch (error) {
            console.error("Failed to update wishlist", error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-EG', {
            style: 'currency',
            currency: 'EGP',
        }).format(price);
    };

    const dummyId = Date.now();

    return (
        <div>
            <div className={`group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-rose-100 `}>
                <div className="relative overflow-hidden">
                    <Link href={`/product/${product.id}`}>
                        <div className="aspect-square bg-gray-50 relative">
                            {product.images?.[0]?.url ? (
                                <Image
                                    src={product.images[0].url}
                                    alt={product.name}
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

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full px-4">
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(
                                    { productId: product.id, quantity: 1 },
                                    { id: dummyId, product: product, quantity: 1 }
                                );
                            }}
                            className="flex items-center justify-center bg-rose-600 text-white py-2 rounded-lg cursor-pointer hover:bg-rose-700 transition-colors shadow-md"
                        >
                            <CiShoppingCart className="text-xl mr-2" />
                            <span>{t('addToCart')}</span>
                        </div>
                    </div>

                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                        <span className="text-xs font-medium text-gray-700">
                            {product.category.name}
                        </span>
                    </div>
                </div>

                <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-rose-600 transition-colors">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="flex items-center justify-between flex-wrap">
                        <div>
                            <span className="text-lg font-bold text-gray-900">
                                {formatPrice(product.price)}
                            </span>
                            <span className="block text-xs text-gray-500 mt-1">
                                {product.stock > 0 ? `${product.stock} ${t('available')}` : t('outOfStock')}
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

                <button
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        } ${isInWishlist
                            ? 'bg-rose-100 text-rose-500 hover:bg-rose-200'
                            : 'bg-white hover:bg-rose-50 text-gray-600'
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                    }}
                    disabled={wishlistLoading}
                >
                    {isInWishlist ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    ) : (
                        <CiHeart className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
}