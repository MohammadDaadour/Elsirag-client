'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { useTranslations } from 'next-intl';

/**
 * Admin-only affordance. The catalogue has no customer accounts, so this
 * renders nothing for visitors and only appears once an admin is signed in,
 * giving them a way back to the dashboard.
 */
export default function AdminMenu({ onNavigate }: { onNavigate?: () => void }) {
    const t = useTranslations('Header');
    const { user, logout } = useUser();

    if (user?.role !== 'admin') return null;

    const handleSignOut = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
        } catch {
            toast.error('Failed to log out');
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Link
                href="/admin/dashboard/products"
                onClick={onNavigate}
                className="px-3 py-2 text-sm text-stone-600 hover:text-black transition-colors"
            >
                {t('dashboard')}
            </Link>
            <button
                onClick={handleSignOut}
                className="px-3 py-2 text-sm text-stone-500 hover:text-black transition-colors cursor-pointer"
            >
                {t('signOut')}
            </button>
        </div>
    );
}
