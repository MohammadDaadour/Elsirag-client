"use client";

import React, { useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
  const t = useTranslations('ForgotPassword');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error(t('enterEmail'));

    setLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      toast.success(t('success'));
      setEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">{t('title')}</h2>
        <p className="text-sm text-gray-600 text-center">
          {t('subtitle')}
        </p>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm text-gray-600">{t('emailLabel')}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-stone-700 transition-all ${loading ? 'opacity-50' : ''}`}
            placeholder="example@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-3 text-white bg-black border border-black transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
        >
          {loading ? t('sending') : t('sendButton')}
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