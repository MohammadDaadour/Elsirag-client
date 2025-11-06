'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import axios from '@/lib/axios';
import { CiHeart, CiShoppingCart } from 'react-icons/ci';
import { AiFillHeart } from 'react-icons/ai';
import { useWishList } from '@/hooks/useWishList';
import { RetrievedItem } from '@/types/cart';
import RelatedProducts from '@/components/RelatedProducts';
import { useCart } from '@/hooks/useCart';
import { useTranslations } from 'next-intl';

export default function ProductPage() {
    const { id } = useParams();
    const t = useTranslations('ProductPage')
    const [product, setProduct] = useState<any>(null);
    const [currentImg, setCurrentImg] = useState('');
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const { addToWishList, getWishList, removeFromWishlist } = useWishList();

    const { addToCart } = useCart();
    const dummyId = Date.now();

    useEffect(() => {
        async function fetchProduct() {
            const { data } = await axios(`/products/${id}`);
            setProduct(data);
            setCurrentImg(data.images?.[0]?.url);
        }

        if (id) fetchProduct();
    }, [id]);

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

    const handleChangeImg = (url: string) => {
        setCurrentImg(url);
    }

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

    if (!product) {
        return (
            <div className="text-center flex justify-center items-center  w-screen h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        );
    }

    return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 sm:pt-[90px] pt-[110px] px-4">
        <Header />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 bg-white rounded-3xl shadow-2xl shadow-rose-100/50 border border-gray-100 transform transition-all hover:shadow-2xl hover:shadow-rose-200/60">
            <div className="relative group">
                <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
                    <img
                        src={currentImg || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 hover:float"
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                        }}
                        disabled={wishlistLoading}
                        className={`absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-md bg-white/80 shadow-md cursor-pointer transition-all ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                    >
                        {isInWishlist ? (
                            <AiFillHeart className='text-3xl text-rose-500 animate-pulse' />
                        ) : (
                            <CiHeart className='text-3xl text-gray-700 hover:text-rose-500 transition-colors' />
                        )}
                    </button>
                </div>

                <div className="flex gap-3 mt-6 overflow-x-auto py-2 pl-1">
                    {product.images?.map((img: any, index: number) => (
                        <div
                            key={index}
                            onClick={() => handleChangeImg(img.url)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${currentImg === img.url ? 'border-rose-500 scale-105' : 'border-transparent hover:border-gray-300'}`}
                        >
                            <img
                                src={img.url}
                                alt={`thumb-${index}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col justify-center">
                <div className="mb-6">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-rose-600 bg-rose-50 rounded-full mb-4">
                        {product.category?.name || t('featured')}
                    </span>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        {product.description}
                    </p>
                </div>

                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <p className="text-3xl font-bold text-rose-600">{product.price} {t('currency')} </p>
                        {product.stock > 0 ? (
                            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                {product.stock} {t('inStock')}
                            </span>
                        ) : (
                            <span className="px-2 py-1 text-xs font-medium text-rose-800 bg-rose-100 rounded-full">
                               {t('outOfStock')}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(
                                    { productId: product.id, quantity: 1 },
                                    { id: dummyId, product: product, quantity: 1 }
                                );
                            }}
                            disabled={product.stock === 0}
                            className={`flex-1 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-medium py-4 px-6 rounded-xl shadow-lg
                                ${product.stock === 0 ? 'opacity-50 cursor-not-allowed': "hover:shadow-rose-300/50 transition-all transform hover:-translate-y-1 cursor-pointer"}`}>
                            {t('addToCart')}
                        </button>

                        {/* <button className="flex items-center justify-center gap-2 flex-1 border-2 border-gray-200 hover:border-rose-300 text-gray-700 font-medium py-4 px-6 rounded-xl transition-colors cursor-pointer">
                            <CiShoppingCart className="text-xl" />
                            {t('buyNow')}
                        </button> */}
                    </div>
                </div>
            </div>
            <RelatedProducts product={product} />
        </div>
    </div>
}





{/* <div className="border-t border-gray-100 pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-gray-600">Free shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-gray-600">30-day returns</span>
          </div>
        </div>
      </div> */}