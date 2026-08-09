'use client';

import { useParams } from 'next/navigation';
import CategoryBrowser from '@/components/CategoryBrowser';

export default function CategoryPage() {
    const { id } = useParams();
    const categoryId = Number(id);

    return <CategoryBrowser categoryId={Number.isFinite(categoryId) ? categoryId : null} />;
}
