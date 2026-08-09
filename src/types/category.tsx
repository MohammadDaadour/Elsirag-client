export interface Category {
    id: number,
    name: string,
    description?: string,
    image?: { url: string; public_id: string } | null,
}