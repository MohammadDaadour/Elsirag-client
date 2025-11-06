"use client";

import React, { useState, useEffect } from 'react';
import axios from "@/lib/axios";
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function VerifyCodeForm() {
  const t = useTranslations('verify');
  const router = useRouter();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error(t('no_email_found'));
      router.push("/register");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading || !email) return;

    setLoading(true);

    try {
      const response = await axios.post("/auth/verify-code", {
        email,
        code
      });

      toast.success(t('success_verify'));

      setTimeout(() => {
        router.push("/sign-in");
      }, 1000);

    } catch (err: any) {
      const message = err.response?.data?.message || t('fail_verify');
      toast.error(message);
    } finally {
      setLoading(false);
    }

  };

  const resendCode = async () => {
    if (!email || resending) return;

    setResending(true);
    try {
      await axios.post("/auth/request-verification", {
        email,
      });
      toast.success(t('success_resend'));
    } catch (err: any) {
      const message = err.response?.data?.message || t('fail_resend');
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 text-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">{t('title')}</h2>

        <div className="space-y-1">
          <label htmlFor="code" className="block text-sm text-gray-600">
            {t('label_code')}
          </label>
          <input
            id="code"
            type="text"
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black transition-all text-center tracking-widest text-lg"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-3 text-white bg-black hover:bg-white hover:text-black hover:ring hover:ring-black transition-all duration-200 cursor-pointer"
        >
          {t('button_verify')}
        </button>
        <div className="text-center text-sm text-gray-500">
          {t('resend_prompt')}
          <button
            type="button"
            className="ml-1 text-blue-500 hover:underline disabled:text-gray-400 cursor-pointer"
            onClick={resendCode}
            disabled={resending}
          >
            {resending ? t('resending') : t('button_resend')}
          </button>
        </div>
      </form>
    </div>
  );
}
