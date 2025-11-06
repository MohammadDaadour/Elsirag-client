'use client';

import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Header from './components/Header';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import ClipLoader from "react-spinners/ClipLoader";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { data } = await axios.get('/auth/me');
                setUser(data);

                if (data?.role !== 'admin') {
                    router.replace('/');
                }
                else {
                    setLoading(false);
                }

            } catch (error) {
                console.error('Error checking user:', error);
                router.replace('/');
            }
        };

        checkAdmin();
    }, [router]);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <ClipLoader color="#f63b9cff" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header toggleNav={() => setIsNavOpen(prev => !prev)} isNavOpen={isNavOpen} />
            <div className="flex flex-1">
                {(isNavOpen || isLargeScreen) && <NavBar />}
                <main className={`flex-1 bg-gray-100 mt-[80px] lg:ml-[300px] overflow-auto transition-all`}>
                    {children}
                </main>
            </div>
        </div>
    );

}
