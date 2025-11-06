import { Product } from "./product"

export interface CartItem {
    productId: number,
    quantity: number,
}

export interface RetrievedItem {
    id: number,
    product: Product,
    quantity: number,
}