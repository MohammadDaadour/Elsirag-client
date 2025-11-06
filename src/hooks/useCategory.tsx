'use client';

import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export const useCategory = () => {
    const t = useTranslations('category');
    const getAllCategories = async () => {
        try {
            const { data } = await axios.get('/categories');
            return { data };
        } catch (err: any) {
            toast.error(t('load_failed'));
            throw err;
        }
    };

    return { getAllCategories };
};
