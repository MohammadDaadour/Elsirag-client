"use client";

import React, { useState } from 'react';
import axios from "@/lib/axios"
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('RegisterPage')
  const router = useRouter()
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConf, setPasswordConf] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    if (password !== passwordConf) {
      toast.error(t('passwordsMismatch'));
      return;
    }

    try {
      const response = await axios.post("/auth/register", {
        username,
        email,
        password,
      });

      toast.success(t('registeredSuccess'));
      localStorage.setItem('user_email', email);

      setTimeout(() => {
        router.push('/verify')
      }, 1000)

    } catch (err: any) {
      const message = Array.isArray(err.response?.data?.message)
        ? err.response.data.message[0]
        : err.response?.data?.message || t('registrationFailed');
      toast.error(message);
    }
    finally {
      setLoading(false);
    }
  };

  const handleGoogle = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = 'http://localhost:3200/auth/google';
  }

  const handleFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = 'http://localhost:3200/auth/facebook';
  }


  return (
    <div className="flex flex-column items-center justify-center min-h-screen bg-gray-50 px-4 text-black">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">{t('title')}</h2>
        <div className="space-y-1">
          <label htmlFor="username" className="block text-sm text-gray-600">{t('username')}</label>
          <input
            id="username"
            type="text"
            disabled={loading}
            className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-stone-700 transition-all ${loading ? 'opacity-50' : ''}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm text-gray-600">{t('email')}</label>
          <input
            id="email"
            type="email"
            disabled={loading}
            className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-stone-700 transition-all ${loading ? 'opacity-50' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
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

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-sm text-gray-600">{t('confirmPassword')}</label>
          <input
            id="confirmPassword"
            type="password"
            disabled={loading}
            className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-stone-700 transition-all ${loading ? 'opacity-50' : ''}`}
            value={passwordConf}
            onChange={(e) => setPasswordConf(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-3 text-white bg-black border border-black transition-all duration-200 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
        >
          {t('register')}
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">or</span>
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
        <button
          type="button"
          onClick={handleFacebook}
          className='flex cursor-pointer items-center border w-full p-2 justify-center mt-4'
        >
          <FaFacebook className='text-2xl mx-2 text-blue-800' />
          <p>{t('facebook')}</p>
        </button>
        <Link className='hover:text-rose-600 text-stone-900' href="/sign-in">
          {t('alreadyHaveAccount')}
        </Link>
      </form>
    </div>
  );
}
