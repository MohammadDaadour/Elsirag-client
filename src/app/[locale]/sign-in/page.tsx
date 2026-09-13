"use client";

import React, { useState } from 'react';
import axios from "@/lib/axios";
import { useRouter } from '@/i18n/navigation';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { useTranslations } from 'next-intl';

/**
 * Staff login for the admin dashboard. The catalogue has no customer accounts,
 * so there is no registration, social login or password reset here.
 */
export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('LoginPage');
  const { refetchUser } = useUser();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      await axios.post("/auth/login", { email, password });
      toast.success(t('successLogin'));

      await refetchUser();
      router.push("/admin/dashboard/products");
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('failedLogin'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">{t('login')}</h2>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm text-gray-600">{t('email')}</label>
          <input
            id="email"
            type="email"
            disabled={loading}
            className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-stone-700 transition-all ${loading ? 'opacity-50' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='example@email.com'
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm text-gray-600">{t('password')}</label>
          <input
            id="password"
            type="password"
            disabled={loading}
            className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-stone-700 transition-all ${loading ? 'opacity-50' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-3 text-white bg-black border border-black transition-all duration-200 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}>
          {loading ? `${t('loggingIn')}` : `${t('login')}`}
        </button>
      </form>
    </div>
  );
}
