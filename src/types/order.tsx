export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

export interface Order {
    id?: number;
    status: OrderStatus; // Use the union type here
    deliveryNeeded: boolean;
    shipping?: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        address: {
            street: string;
            city: string;
            country: string;
            building?: string;
            floor?: string;
            apartment?: string;
            postalCode?: string;
            state?: string;
        };
    };
    paymentMethod?: string;
    notes?: string;
    items: {
        name: string;
        description?: string;
        amount_cents: number;
        quantity: number;
    }[];
    total?: number;
    currency: string;
}