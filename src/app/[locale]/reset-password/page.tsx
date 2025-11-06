"use client";

import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ResetPasswordPage() {
  const t = useTranslations('ResetPassword')
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      toast.error(t('invalidLink'));
      router.push('/forgot-password');
    }
  }, [token, email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error(t('passwordsNotMatch'));
    }
    if (newPassword.length < 6) {
      return toast.error(t('passwordTooShort'));
    }

    setLoading(true);
    try {
      await axios.post('/auth/reset-password', {
        token: `${token}&email=${email}`,
        newPassword,
      });

      toast.success('Password reset successfully! You can now log in.');
      router.push('/login');
    } catch (err: any) {
      const message = err.response?.data?.message || t('resetFailed');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">{t('title')}</h2>
        <p className="text-sm text-gray-600 text-center">
          {t('subtitle')} <strong>{decodeURIComponent(email)}</strong>
        </p>

        <div className="space-y-1">
          <label htmlFor="newPassword" className="block text-sm text-gray-600">{t('newPassword')}</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-stone-700 transition-all ${loading ? 'opacity-50' : ''}`}
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-sm text-gray-600">{t('confirmPassword')}</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-stone-700 transition-all ${loading ? 'opacity-50' : ''}`}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-3 text-white bg-black border border-black transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
        >
          {loading ? t('resetting') : t('resetButton')}
        </button>

        <div className="text-center">
          <Link href="/login" className="text-sm text-stone-600 hover:text-rose-600">
            {t('backToLogin')}
          </Link>
        </div>
      </form>
    </div>
  );
}