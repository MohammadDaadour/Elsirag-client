'use client'
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import axios from '@/lib/axios';
import ProductCard from "./ProductCard";
import { useLocale } from "next-intl";

export default function RelatedProducts({ product }: { product: Product }) {
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const locale = useLocale();

    const title = locale === 'ar' ? 'ربما يعجبك أيضًا' : 'You May Also Like';

    useEffect(() => {
        if (product?.id) {
            axios.get(`/products/${product.id}/related?limit=4`)
                .then(({ data }) => setRelatedProducts(data))
                .catch(console.error);
        }
    }, [product?.id]);

    const uniqueProducts = relatedProducts.filter(
        (product, index, self) =>
            index === self.findIndex((p) => p.id === product.id)
    );

    return (
        <>
            {uniqueProducts.length > 0 && (
                <section className="mt-16">
                    <h3 className="text-xl text-black mb-6">{title}</h3>
                    <div className="flex gap-4">
                        {uniqueProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}