'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import axios from '@/lib/axios';
import RelatedProducts from '@/components/RelatedProducts';
import { useTranslations } from 'next-intl';
import { PiWhatsappLogoThin } from 'react-icons/pi';
import { buildWhatsAppUrl, whatsappMessages } from '@/lib/whatsapp';
import { Product } from '@/types/product';

export default function ProductPage() {
    const { id } = useParams();
    const t = useTranslations('ProductPage');
    const [product, setProduct] = useState<Product | null>(null);
    const [currentImg, setCurrentImg] = useState('');

    useEffect(() => {
        async function fetchProduct() {
            const { data } = await axios(`/products/${id}`);
            setProduct(data);
            setCurrentImg(data.images?.[0]?.url);
        }

        if (id) fetchProduct();
    }, [id]);

    if (!product) {
        return (
            <div className="text-center flex justify-center items-center w-screen h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        );
    }

    const specs = product.specs ?? [];
    const priceOptions = product.priceOptions ?? [];

    const enquiryUrl = () => buildWhatsAppUrl(whatsappMessages.product(product.name));

    const formatPrice = (price: number | string) => Number(price ?? 0).toFixed(2);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 sm:pt-[90px] pt-[110px] px-4 pb-12">
            <Header />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 bg-white rounded-3xl shadow-2xl shadow-rose-100/50 border border-gray-100">
                <div className="relative group">
                    <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
                        <img
                            src={currentImg || '/placeholder.png'}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    <div className="flex gap-3 mt-6 overflow-x-auto py-2 pl-1">
                        {product.images?.map((img: any, index: number) => (
                            <div
                                key={index}
                                onClick={() => setCurrentImg(img.url)}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${currentImg === img.url ? 'border-rose-500 scale-105' : 'border-transparent hover:border-gray-300'}`}
                            >
                                <img src={img.url} alt={`thumb-${index}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-rose-600 bg-rose-50 rounded-full mb-4">
                            {product.category?.name || t('featured')}
                        </span>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>

                        {product.packSize ? (
                            <p className="mt-4 inline-block px-3 py-1 text-sm font-medium text-stone-700 bg-stone-100 rounded-full">
                                {t('perCarton', { count: product.packSize })}
                            </p>
                        ) : null}
                    </div>

                    {priceOptions.length > 0 ? (
                        <div className="mb-8">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs uppercase tracking-wide text-gray-500 border-b">
                                        <th className="py-2 font-medium">{t('optionColumn')}</th>
                                        <th className="py-2 font-medium text-right">{t('priceColumn')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {priceOptions.map((option, index) => (
                                        <tr key={index} className="border-b last:border-b-0">
                                            <td className="py-3 font-medium text-gray-900">{option.label}</td>
                                            <td className="py-3 text-rose-600 font-semibold whitespace-nowrap text-right">
                                                {formatPrice(option.price)} {t('currency')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="mb-8 flex items-baseline gap-3">
                            <p className="text-3xl font-bold text-rose-600">
                                {formatPrice(product.price)} {t('currency')}
                            </p>
                            <span className="text-sm text-gray-500">{t('wholesalePrice')}</span>
                        </div>
                    )}

                    {specs.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                {t('specifications')}
                            </h2>
                            <dl className="divide-y divide-gray-100 border-t border-gray-100">
                                {specs.map((spec, index) => (
                                    <div key={index} className="flex justify-between gap-4 py-2.5">
                                        <dt className="text-gray-500">{spec.label}</dt>
                                        <dd className="text-gray-900 font-medium text-right">{spec.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    <a
                        href={enquiryUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1fba59] text-white font-medium py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                        <PiWhatsappLogoThin className="text-2xl" />
                        {t('askOnWhatsApp')}
                    </a>
                </div>

                <RelatedProducts product={product} />
            </div>
        </div>
    );
}
