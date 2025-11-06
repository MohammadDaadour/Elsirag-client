// app/order-confirmation/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CiDeliveryTruck } from 'react-icons/ci';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { Order } from '@/types/order';
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function OrderConfirmationPage() {
    const router = useRouter();
    const t = useTranslations('orderConfirmPage');
    const { user } = useUser();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const calculateDeliveryDate = () => {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        return deliveryDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    function formatCurrency(amount: number, currency: string): string {
        return new Intl.NumberFormat('en-EG', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    const [estimatedDelivery] = useState(calculateDeliveryDate());

    // Retrieve order data from session storage
    useEffect(() => {
        const storedOrder = sessionStorage.getItem('orderConfirmationData');

        if (storedOrder) {
            try {
                const parsedOrder: Order = JSON.parse(storedOrder);
                setOrder(parsedOrder);
            } catch (error) {
                console.error('Failed to parse order data:', error);
            }
        } else {
            // Redirect to home if no order data found
            // toast.error('Order Not Found');
            
            // router.push('/');
        }

        setIsLoading(false);

        return () => {
            sessionStorage.removeItem('orderConfirmationData');
        };
    }, []);

    // Calculate order totals
    const calculateOrderTotals = () => {
        if (!order) return { subtotal: 0, shipping: 0, total: 0 };

        const subtotal = order.items.reduce(
            (sum, item) => sum + (item.amount_cents / 100) * item.quantity,
            0
        );

        const shipping = order.deliveryNeeded ? 50 : 0;
        const total = subtotal + shipping;

        return { subtotal, shipping, total };
    };

    const { subtotal, shipping, total } = calculateOrderTotals();

    if (isLoading) {
        return (
            <main className="flex flex-col items-center p-6 bg-white min-h-screen w-full text-black">
                <Header />
                <div className="mt-32 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-rose-500 mb-4"></div>
                    <p className="text-xl">{t('loading_order')}</p>
                </div>
            </main>
        );
    }

    if (!order) {
        return (
            <main className="flex flex-col items-center p-6 bg-white min-h-screen w-full text-black">
                <Header />
                <div className="mt-32 flex flex-col items-center">
                    <div className="bg-rose-50 p-6 rounded-full mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-center mb-4">{t('order_not_found')}</h1>
                    <p className="text-gray-600 text-center max-w-md mb-8">
                        {t('order_not_found_desc')}
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="/"
                            className="bg-white border border-rose-600 text-rose-600 hover:bg-rose-50 font-medium py-3 px-8 rounded-xl shadow-sm transition-colors"
                        >
                            {t('back_to_home')}
                        </Link>
                        <Link
                            href="/orders"
                            className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-medium py-3 px-8 rounded-xl shadow-lg hover:shadow-rose-300/50 transition-all"
                        >
                            {t('view_orders')}
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center p-6 bg-white min-h-screen w-full text-black">
            <Header />

            <div className="max-w-4xl w-full mt-20">
                <div className="flex flex-col items-center mb-12">
                    <div className="bg-rose-50 p-6 rounded-full mb-6">
                        <HiOutlineCheckCircle className="text-rose-500 text-6xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-center mb-4">{t('order_confirmed')}</h1>
                    <p className="text-gray-600 text-center max-w-md">
                        {user && t('thank_you', { username: user.username })}
                    </p>
                    <div className="mt-6 bg-rose-50 py-2 px-6 rounded-full">
                        {/* <p className="font-medium text-rose-700">{t('order_id')} {order.id || 'ORD-12345678'}</p> */}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-rose-100 p-3 rounded-lg">
                                <CiDeliveryTruck className="text-rose-600 text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{t('delivery_information')}</h2>
                                <p className="text-gray-600">{t('estimated_delivery')}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* <div className="flex justify-between">
                                <span className="text-gray-600">{t('delivery_method')}</span>
                                <span className="font-medium">
                                    {order.deliveryNeeded ? 'Standard Shipping' : 'Pickup'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Estimated Arrival</span>
                                <span className="font-medium">{estimatedDelivery}</span>
                            </div> */}

                            {order.deliveryNeeded && order.shipping && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping Address</span>
                                    <div className="font-medium text-right max-w-[200px]">
                                        <p>{order.shipping.firstName} {order.shipping.lastName}</p>
                                        <p>{order.shipping.phoneNumber}</p>
                                        <p>{order.shipping.address.street}</p>
                                        <p>
                                            {order.shipping.address.city}, {order.shipping.address.state || order.shipping.address.country}
                                        </p>
                                        {order.shipping.address.building && (
                                            <p>Building: {order.shipping.address.building}</p>
                                        )}
                                        {order.shipping.address.floor && (
                                            <p>Floor: {order.shipping.address.floor}</p>
                                        )}
                                        {order.shipping.address.apartment && (
                                            <p>Apartment: {order.shipping.address.apartment}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
                        {/* <div className="flex items-center gap-3 mb-6">
                            <div className="bg-rose-100 p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Payment Summary</h2>
                                <p className="text-gray-600">Payment method</p>
                            </div>
                        </div> */}

                        <div className="space-y-4">
                            {/* <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-medium">
                                    {order.paymentMethod === 'CASH' ? 'Cash on Delivery' : 'Credit Card'}
                                </span>
                            </div> */}
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t('subtotal')}</span>
                                <span className="font-medium">{formatCurrency(subtotal, 'EGP')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">{t('shipping')}</span>
                                <span className="font-medium">
                                    {order.deliveryNeeded ? formatCurrency(shipping, 'EGP') : 'Free'}
                                </span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-gray-200">
                                <span className="text-lg font-bold">{t('total')}</span>
                                <span className="text-lg font-bold">{formatCurrency(total, 'EGP')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 text-center">{t('order_items')}</h2>
                    <div className="bg-gray-50 rounded-xl p-6">
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-center py-4 ${index < order.items.length - 1 ? 'border-b border-gray-200' : ''}`}
                            >
                                <div className="bg-gray-100 rounded-lg w-16 h-16 flex items-center justify-center">
                                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{item.description || 'No description'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{formatCurrency(item.amount_cents / 100, 'EGP')} × {item.quantity}</p>
                                    <p className="font-bold mt-1">
                                        {formatCurrency((item.amount_cents / 100) * item.quantity, 'EGP')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mb-16">
                    <h2 className="text-2xl font-bold mb-6">{t('whats_next')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="bg-rose-50 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <span className="text-rose-600 font-bold">1</span>
                            </div>
                            <h3 className="font-semibold mb-2">{t('order_processing')}</h3>
                            <p className="text-gray-600 text-sm">
                                {t('order_processing_desc')}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="bg-rose-50 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <span className="text-rose-600 font-bold">2</span>
                            </div>
                            <h3 className="font-semibold mb-2">{t('shipping_step')}</h3>
                            <p className="text-gray-600 text-sm">
                                {t('shipping_step_desc')}
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="bg-rose-50 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <span className="text-rose-600 font-bold">3</span>
                            </div>
                            <h3 className="font-semibold mb-2">{t('delivery_step')}</h3>
                            <p className="text-gray-600 text-sm">
                                {t('delivery_step_desc')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                    <Link
                        href="/"
                        className="bg-white border border-rose-600 text-rose-600 hover:bg-rose-50 font-medium py-3 px-8 rounded-xl shadow-sm transition-colors text-center"
                    >
                        {t('continue_shopping')}
                    </Link>
                    <Link
                        href="/orders"
                        className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-medium py-3 px-8 rounded-xl shadow-lg hover:shadow-rose-300/50 transition-all text-center"
                    >
                        {t('view_order_details')}
                    </Link>
                </div>

                <div className="bg-gray-50 rounded-xl p-8 mb-8">
                    {/* <h2 className="text-xl font-bold mb-4 text-center">Need Help?</h2>
                    <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto">
                        If you have any questions about your order, our customer service team is happy to help.
                    </p> */}
                    {/* <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <div className="flex flex-col items-center">
                            <div className="bg-rose-100 p-3 rounded-full mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="font-medium">support@example.com</p>
                            <p className="text-gray-600 text-sm">Email Support</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-rose-100 p-3 rounded-full mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <p className="font-medium">+20 123 456 7890</p>
                            <p className="text-gray-600 text-sm">Phone Support</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-rose-100 p-3 rounded-full mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <p className="font-medium">Live Chat</p>
                            <p className="text-gray-600 text-sm">24/7 Support</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </main>
    );
}