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
import { ClipLoader } from 'react-spinners';
import { showConfirm } from '../components/Forms';

export default function allOrders() {
    const { isAuthenticated } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
    const { getAllOrders, updateOrderStatus } = useOrder();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGetOrders = async () => {
        try {
            setLoading(true);
            const res = await getAllOrders(page);
            console.log(res);
            setOrders(res.data);
            setTotalPages(res.meta.totalPages);
        } catch (error) {
            // toast.error('Failed to load orders');
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated !== undefined) {
            handleGetOrders();
        }
    }, [isAuthenticated, page]);

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

    if (loading) {
        return <ClipLoader className='m-32' size={35} color="#f63b9cff" />;
    }

    return (
        <main className="flex flex-col items-center p-6 bg-white min-h-screen w-full text-black">
            <h1 className="text-2xl mb-6 mt-[90px] max-w-4xl w-full text-left">All Orders</h1>
            {orders === null ? (
                <p className="text-gray-500">Loading orders...</p>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg mb-4">No orders yet.</p>
                    <Link href="/" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="max-w-4xl w-full">
                    {orders.map((order) => (
                        <div key={order.id} className="border border-gray-300 rounded-lg mb-4 overflow-hidden shadow-sm">
                            <div
                                className="flex justify-between items-center p-4 bg-gray-50"
                            >
                                <div className="font-medium">Order #{order.id}</div>
                                <select
                                    value={order.status}
                                    onChange={(e) => {
                                        const newStatus = e.target.value;

                                        showConfirm({
                                            id: order.id!,
                                            message: `Change status to ${newStatus}?`,
                                            handleDeletion: async () => {
                                                const updated = await updateOrderStatus(order.id!, newStatus);
                                                if (updated) {
                                                    toast.success('Status updated!');
                                                    setOrders(prev =>
                                                        prev.map((o) =>
                                                            o.id === order.id ? { ...o, status: newStatus as Order['status'] } : o
                                                        )
                                                    );
                                                } else {
                                                    toast.error('Failed to update status');
                                                }
                                            },
                                        });
                                    }}
                                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="CONFIRMED">CONFIRMED</option>
                                    <option value="SHIPPED">SHIPPED</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                    <option value="CANCELED">CANCELED</option>
                                </select>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <button className='cursor-pointer' onClick={() => toggleOrderDetails(order.id!)}>
                                        {expandedOrder === order.id ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                                    </button>
                                </div>
                            </div>
                            {expandedOrder === order.id && (
                                <div className="p-4 border-t border-gray-200">
                                    {order.shipping && (
                                        <div className="mb-4">
                                            <h3 className="font-semibold mb-2">Shipping Information</h3>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Name:</p>
                                                    <p>{order.shipping.firstName} {order.shipping.lastName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Phone:</p>
                                                    <p>{order.shipping.phoneNumber}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-gray-600">Address:</p>
                                                    <p>
                                                        {order.shipping.address.street}, {order.shipping.address.city}, {order.shipping.address.country}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mb-4">
                                        <h3 className="font-semibold mb-2">Items</h3>
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
                                                        <p className="text-sm">Qty: {item.quantity}</p>
                                                        <p>Shipping: 50 {order.currency}</p>
                                                    </div>
                                                </li>
                                            ))}
                                            <li className='text-right border-t'>
                                                <p>total: </p>
                                                <p> {order.total && ((order.total + 5000)/ 100).toFixed(2)} {order.currency} </p>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Payment Method:</p>
                                            <p>{order.paymentMethod}</p>
                                        </div>
                                        {order.notes && (
                                            <div>
                                                <p className="text-gray-600">Notes:</p>
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
            <div className="mt-4 flex gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className={`px-4 py-2 rounded ${page === 1
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800 cursor-pointer'
                        }`}
                >
                    Prev
                </button>

                <span className="px-2 py-1 text-sm">
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className={`px-4 py-2 rounded ${page >= totalPages
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800 cursor-pointer'
                        }`}
                >
                    Next
                </button>
            </div>
        </main>
    );
}