import { Product } from "./product";

export interface Option {
    id: number, 
    value: string, 
}

export interface Attribute {
    id: number, 
    name: string, 
    type: string,
    options: Option[],
    products?: Product[]
}

export interface Variant {
    id: number, 
    productId: number,
    sku: string,
    price: number,
    stock: number
}
