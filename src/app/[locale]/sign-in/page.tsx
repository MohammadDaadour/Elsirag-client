"use client";

import React, { useEffect, useState } from 'react';
import axios from "@/lib/axios";
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from 'react-icons/fa';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ClipLoader } from 'react-spinners';

export default function LoginPage() {
  const router = useRouter();

  const t = useTranslations('LoginPage');
  const tc = useTranslations('common');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      router.push('/');
    }
  }, []);

  const { refetchUser } = useUser();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);


  const getLocalCart = () => {
    if (typeof window !== 'undefined') {
      const localCart = localStorage.getItem('guestCart');
      if (!localCart) return [];

      try {
        const parsed = JSON.parse(localCart);
        return parsed.map((item: any) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));
      } catch (err) {
        console.error("Failed to parse guestCart:", err);
        return [];
      }
    }
    return [];
  };
  const clearLocalCart = () => {
    localStorage.removeItem('guestCart');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      toast.success(t('successLogin'));

      const localCart = getLocalCart();

      console.log("localCart: ", localCart);

      if (localCart.length > 0) {
        try {
          await axios.post("/cart/merge", localCart);
          clearLocalCart();
        } catch (mergeError) {
          console.error("Cart merge failed:", mergeError);
        }
      }

      localStorage.setItem('user_email', email);

      await refetchUser();
      setTimeout(() => {
        router.push("/");
      }, 1000);

    } catch (err: any) {
      const message = err.response?.data?.message || t('failedLogin');
      if (message.includes("Please verify your email before logging in.")) {
        localStorage.setItem("user_email", email);
        toast.error("Please verify your email. A new code has been sent.");
        router.push("/verify");
        return;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }

  const handleFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`;
  }

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

        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-stone-600 hover:text-rose-600">
            {t('forgotPassword')}
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-3 text-white bg-black border border-black transition-all duration-200 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}>
          {loading ? `${t('loggingIn')}` : `${t('login')}`}
        </button>

        <div>
          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm">{t('or')}</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          <button
            type="button"
            onClick={handleGoogle}
            className='flex cursor-pointer items-center border w-full p-2 justify-center mt-4'
          >
            <FcGoogle className='text-2xl mx-2' />
            <p>{t('google')}</p>
          </button>
        </div>
        <button
          type="button"
          onClick={handleFacebook}
          className='flex cursor-pointer items-center border w-full p-2 justify-center mt-4'
        >
          <FaFacebook className='text-2xl mx-2 text-blue-800' />
          <p>{t('facebook')}</p>
        </button>
        <Link className='hover:text-rose-600 text-stone-900' href="/register">
          {t('noAccount')}
        </Link>
      </form>
    </div>
  );
}
