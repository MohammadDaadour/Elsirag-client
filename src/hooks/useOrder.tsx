'use client';

import { useUser } from '@/context/UserContext';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { Order } from '@/types/order';
import { useTranslations } from 'next-intl';

export const useOrder = () => {
    const { isAuthenticated, user } = useUser();
    const t = useTranslations('order');

    const placeOrder = async (order: Order) => {
        if (!isAuthenticated || !user) {
            toast.error(t('must_login'));
            return false;
        }

        try {
            await axios.post('/orders', order);
            toast.success(t('placed'));
            return true;
        } catch (err: any) {
            toast.error(t('place_failed'));
            console.error(err);
            return false;
        }
    }

    const getMyOrders = async (): Promise<Order[]> => {
        if (isAuthenticated) {
            try {
                const { data } = await axios.get<Order[]>('/orders/mine');
                return data;
            } catch (err: any) {
                toast.error(t('get_failed'));
                console.error(err);
                return [];
            }
        }
        return [];
    }

    const getAllOrders = async (page: number) => {
        if (isAuthenticated && user?.role === 'admin') {
            try {
                const { data } = await axios.get('orders', {
                    params: { page, limit: 10 },
                })
                return data;
            }
            catch (err: any) {
                toast.error(t('place_failed'), err);
                return [];
            }
        }
    }

    const cancelOrder = async (orderId: number) => {
        if (isAuthenticated) {
            try {

                const { data } = await axios.patch(`orders/${orderId}/cancel`);
                toast.success(t('cancelled'))
                return data;
            }
            catch (err: any) {
                console.log(err);
            }
        }
        else {

        }
    }

    const updateOrderStatus = async (orderId: number, status: string) => {
        if (isAuthenticated && user?.role === 'admin') {
            try {
                const { data } = await axios.patch(`orders/${orderId}/status`, { status });
                toast.success(t('status_updated'));
                return data;
            } catch (err: any) {
                console.error(err);
                toast.error(t('status_failed'));
            }
        } else {
            toast.error(t('unauthorized'));
        }
    };

    return {
        placeOrder,
        getAllOrders,
        getMyOrders,
        cancelOrder,
        updateOrderStatus
    }
}