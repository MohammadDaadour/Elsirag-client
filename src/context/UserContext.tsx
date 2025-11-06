'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { User, UserContextType } from '@/types/user';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/auth/me');
            setUser(data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = async () => {
        await axios.post('/auth/logout');
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                loading,
                isAuthenticated: !!user,
                logout,
                refetchUser: fetchUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within UserProvider');
    return context;
};
