export interface User {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'admin';
    emailVerified: boolean;
    cartId?: number;
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    refetchUser: () => Promise<void>;
}