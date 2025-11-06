'use client';

import { useUser } from '@/context/UserContext';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { RetrievedItem } from '@/types/cart';
import { useTranslations } from 'next-intl';

export const useWishList = () => {

    const { isAuthenticated, user } = useUser();

    const t = useTranslations('wishlist');

    const addToWishList = async (productId: { productId: number }) => {
        if (isAuthenticated && user) {
            try {
                await axios.post('/favourites', productId);
                toast.success(t('added'));
            } catch (err: any) {
                toast.error(t('add_failed'), err);
                throw err;
            }
        } else {
            toast.error(t('login_first'));
        }
    }

    const getWishList = async (): Promise<RetrievedItem[]> => {
        if (isAuthenticated && user) {
            try {
                const { data } = await axios.get('/favourites');
                return data;
            } catch {
                toast.error(t('get_failed'));
                return [];
            }
        } else {
            return [];
        }
    }

    const removeFromWishlist = async (productId: number) => {
        if (isAuthenticated && user) {
            try {
                await axios.delete(`/favourites/${productId}`);
                toast.success(t('removed'));
            } catch {
                toast.error(t('remove_failed'));
            }
        }
    };

    return {
        addToWishList,
        getWishList,
        removeFromWishlist
    }
}