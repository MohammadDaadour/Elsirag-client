export interface Category {
    id: number,
    name: string,
    description?: string,
    nameAr?: string | null,
    descriptionAr?: string | null,
    image?: { url: string; public_id: string } | null,
}