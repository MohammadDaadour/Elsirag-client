'use client';

import { useEffect, useState } from 'react';
import { useOrder } from '@/hooks/useOrder';
import { useUser } from '@/context/UserContext';
import { Order } from '@/types/order';
import Header from '@/components/Header';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { showConfirm } from '@/app/[locale]/admin/dashboard/components/Forms';
import { useTranslations } from 'next-intl';

type OrderWithStatus = Order & {
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
};

export default function CartPage() {
    const t = useTranslations('OrdersPage');
    const { isAuthenticated } = useUser();
    const [orders, setOrders] = useState<OrderWithStatus[] | null>(null);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
    const { getMyOrders, cancelOrder } = useOrder();
    const router = useRouter();

    const handleGetOrders = async () => {
        try {
            const myOrders = await getMyOrders() as OrderWithStatus[];
            setOrders(myOrders);
        } catch (error) {
            toast.error('Failed to load orders');
            console.error(error);
        }
    };

    const handleCancelOrder = async (orderId: number) => {
        try {
            await cancelOrder(orderId);
            toast.success(`Order #${orderId} canceled successfully`);

            setOrders((prev) =>
                prev
                    ? prev.map((order) =>
                        order.id === orderId
                            ? { ...order, status: 'CANCELED' }
                            : order
                    )
                    : null
            );
        } catch (error) {
            toast.error('Failed to cancel the order');
            console.error(error);
        }
    }

    useEffect(() => {
        if (isAuthenticated !== undefined) {
            handleGetOrders();
        }
    }, [isAuthenticated]);

    const toggleOrderDetails = (orderId: number) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <main className="flex flex-col items-center p-6 bg-white min-h-screen w-full text-black">
            <Header />
            <h1 className="text-2xl mb-6 mt-[90px] max-w-4xl w-full text-left">{t('title')}</h1>
            {orders === null ? (
                <p className="text-gray-500">{t('loading')}</p>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg mb-4">{t('noOrders')}</p>
                    <Link href="/" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                        {t('continueShopping')}
                    </Link>
                </div>
            ) : (
                <div className="max-w-4xl w-full">
                    {orders.map((order) => (
                        <div key={order.id} className="border border-gray-300 rounded-lg mb-4 overflow-hidden shadow-sm">
                            <div
                                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
                                onClick={() => toggleOrderDetails(order.id!)}
                            >
                                <div className="font-medium">{t('order')} #{order.id}</div>
                                <div className="flex items-center gap-4">
                                    {
                                        (order.status === 'PENDING' || order.status === 'CONFIRMED') &&
                                        <button
                                            className='text-sm text-red-600 cursor-pointer hover:underline'
                                            onClick={() => {
                                                if (order.id !== undefined) {
                                                    showConfirm({
                                                        id: order.id,
                                                        handleDeletion: handleCancelOrder,
                                                        message: t('cancelConfirm'),
                                                    });
                                                } else {
                                                    console.error('Order ID is undefined!');
                                                }
                                            }}
                                        >
                                            {t('cancel')}
                                        </button>
                                    }
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {t(`statuses.${order.status}`)}
                                    </span>
                                    <button>
                                        {expandedOrder === order.id ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                                    </button>
                                </div>
                            </div>

                            {expandedOrder === order.id && (
                                <div className="p-4 border-t border-gray-200">
                                    {order.shipping && (
                                        <div className="mb-4">
                                            <h3 className="font-semibold mb-2">{t('shippingInfo')}</h3>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-gray-600">{t('name')}</p>
                                                    <p>{order.shipping.firstName} {order.shipping.lastName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">{t('phone')}</p>
                                                    <p>{order.shipping.phoneNumber}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-gray-600">{t('address')}</p>
                                                    <p>
                                                        {order.shipping.address.street}, {order.shipping.address.city}, {order.shipping.address.country}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <h3 className="font-semibold mb-2">{t('items')}</h3>
                                        <ul className="">
                                            {order.items.map((item, index) => (
                                                <li key={index} className="py-2 flex justify-between">
                                                    <div>
                                                        <p>{item.name}</p>
                                                        {item.description && (
                                                            <p className="text-sm text-gray-500">{item.description}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p>{(item.amount_cents / 100).toFixed(2)} {order.currency}</p>
                                                        <p className="text-sm">{t('quantity')} {item.quantity}</p>
                                                        <p>{t('shippingCost')} 50 {order.currency}</p>
                                                    </div>
                                                </li>
                                            ))}
                                            <li className='text-right border-t'>
                                                <p>{t('total')} </p>
                                                <p> {order.total && ((order.total + 5000) / 100).toFixed(2)} {order.currency} </p>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">{t('paymentMethod')}</p>
                                            <p>{order.paymentMethod}</p>
                                        </div>
                                        {order.notes && (
                                            <div>
                                                <p className="text-gray-600">{t('notes')}</p>
                                                <p>{order.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}