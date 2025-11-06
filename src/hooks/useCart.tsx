'use client';

import { useUser } from '@/context/UserContext';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { CartItem, RetrievedItem } from '@/types/cart';
import { useTranslations } from 'next-intl';

export const useCart = () => {
    const { isAuthenticated, user } = useUser();
    const t = useTranslations('cart');

    const addToCart = async (item: CartItem, localItem: RetrievedItem) => {
        if (isAuthenticated && user) {
            try {
                await axios.post('/cart', item);
                toast.success(t('added'));
            } catch (err: any) {
                toast.error(t('add_failed'), err);
            }
        } else {
            try {
                const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                const existing = guestCart.find((i: any) => i.product.id === localItem.product.id);

                if (existing) existing.quantity += item.quantity;
                else guestCart.push(localItem);

                localStorage.setItem('guestCart', JSON.stringify(guestCart));
                toast.success(t('added'));
            } catch {
                toast.error(t('add_failed'));
            }
        }
    };

    const removeFromCart = async (itemId: number) => {
        if (isAuthenticated && user) {
            try {
                await axios.delete(`/cart-item/${itemId}`);
                toast.success(t('removed'));
            } catch {
                toast.error(t('remove_failed'));
            }
        } else {
            try {
                const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                const updated = guestCart.filter((item: any) => item.id !== itemId);
                localStorage.setItem('guestCart', JSON.stringify(updated));
                toast.success(t('removed'));
            } catch {
                toast.error(t('remove_failed'));
            }
        }
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        if (isAuthenticated && user) {
            try {
                await axios.patch(`/cart/item/${itemId}`, { quantity });
            } catch (err: any) {
                console.log('error: ', err)
            }
        } else {
            try {
                const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
                const updated = guestCart.map((item: any) =>
                    item.id === itemId ? { ...item, quantity } : item
                );
                localStorage.setItem('guestCart', JSON.stringify(updated));
            } catch {
                console.log("can't update quantity.")
            }
        }
    };

    const getCart = async (): Promise<{ items: RetrievedItem[] }> => {
        if (isAuthenticated && user) {
            try {
                const { data } = await axios.get('/cart');
                return data;
            } catch {
                toast.error(t('fetch_failed'));
                return { items: [] };
            }
        } else {
            try {
                const items: RetrievedItem[] = JSON.parse(localStorage.getItem('guestCart') || '[]');
                return { items };
            } catch {
                return { items: [] };
            }
        }
    };

    const clearCart = async () => {
        if (isAuthenticated && user) {
            try {
                await axios.delete('/cart/all');
                toast.success(t('cleared'));
            } catch {
                toast.error(t('clear_failed'));
            }
        } else {
            localStorage.removeItem('guestCart');
            toast.success(t('cleared'));
        }
    };

    return {
        addToCart,
        removeFromCart,
        updateQuantity,
        getCart,
        clearCart,
    };
};
