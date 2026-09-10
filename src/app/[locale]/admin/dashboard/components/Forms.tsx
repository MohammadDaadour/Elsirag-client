"use client"
import { useState, useRef, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import toast from 'react-hot-toast';
import { Product, Img } from '@/types/product';
import { Category } from '@/types/category';
import { ProductSpec, ProductPriceOption } from '@/types/product';
import TradeFieldsEditor from './TradeFieldsEditor';
import axios from 'axios';

interface CreateCategoryProps {
    handleCreation: (e: React.FormEvent) => void;
    name: string;
    setName: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    nameAr: string;
    setNameAr: (value: string) => void;
    descriptionAr: string;
    setDescriptionAr: (value: string) => void;
    image: File | null;
    setImage: (value: File | null) => void;
}

interface UpdateCategoryProps {
    cat: {
        id: number,
        name: string,
        description: string,
        nameAr?: string | null,
        descriptionAr?: string | null,
        image?: { url: string; public_id: string } | null
    };
    handleUpdate: (e: React.FormEvent, id: number) => void;
    editName: string;
    setEditName: (value: string) => void;
    editDescription: string;
    setEditDescription: (value: string) => void;
    editNameAr: string;
    setEditNameAr: (value: string) => void;
    editDescriptionAr: string;
    setEditDescriptionAr: (value: string) => void;
    editImage: File | null;
    setEditImage: (value: File | null) => void;
    setEditingCategoryId: (id: number | null) => void;
}

/** Shared picker for a category's tile image, with a preview of the choice. */
function CategoryImagePicker({
    file,
    setFile,
    currentUrl,
}: {
    file: File | null;
    setFile: (value: File | null) => void;
    currentUrl?: string | null;
}) {
    const previewUrl = file ? URL.createObjectURL(file) : currentUrl;

    return (
        <div>
            <label className="block mb-1 text-sm font-medium">Tile image</label>
            <div className="flex items-center gap-4">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Category tile preview"
                        className="w-24 h-20 object-cover rounded-md border"
                    />
                ) : (
                    <div className="w-24 h-20 rounded-md border border-dashed flex items-center justify-center text-xs text-gray-400">
                        None
                    </div>
                )}
                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="text-sm"
                    />
                    {file && (
                        <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="block mt-2 text-xs text-red-500 hover:text-red-700 cursor-pointer"
                        >
                            Clear selection
                        </button>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        Shown on the catalogue index. Leave empty to keep the current image.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function CreateCategoryForm({
    handleCreation,
    name,
    setName,
    description,
    setDescription,
    nameAr,
    setNameAr,
    descriptionAr,
    setDescriptionAr,
    image,
    setImage,
}: CreateCategoryProps) {
    return (
        <div className="mt-6 p-6 bg-white rounded-md shadow-lg animate-fade-in-down">
            <h3 className="text-lg font-medium mb-4">Create New Category</h3>
            <form onSubmit={handleCreation} className="flex flex-col gap-4 max-w-md">
                <div>
                    <label className="block mb-1 text-sm font-medium">Category Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800"
                        placeholder="e.g. Electronics"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">Description (optional)</label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800 resize-none"
                        placeholder="Write a short description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div dir="rtl">
                    <label className="block mb-1 text-sm font-medium">الاسم بالعربية</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800"
                        placeholder="مثال: كشاكيل"
                        value={nameAr}
                        onChange={(e) => setNameAr(e.target.value)}
                    />
                </div>

                <div dir="rtl">
                    <label className="block mb-1 text-sm font-medium">الوصف بالعربية (اختياري)</label>
                    <textarea
                        rows={2}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800 resize-none"
                        value={descriptionAr}
                        onChange={(e) => setDescriptionAr(e.target.value)}
                    ></textarea>
                </div>

                <CategoryImagePicker file={image} setFile={setImage} />

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-stone-800 text-white px-6 py-2 rounded-md hover:bg-stone-700 transition-colors cursor-pointer"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}

export function UpdateCategoryForm(
    {
        cat,
        handleUpdate,
        editName,
        setEditName,
        editDescription,
        setEditDescription,
        editNameAr,
        setEditNameAr,
        editDescriptionAr,
        setEditDescriptionAr,
        editImage,
        setEditImage,
        setEditingCategoryId,
    }: UpdateCategoryProps) {
    return (<form
        onSubmit={(e) => handleUpdate(e, cat.id)}
        className="p-4 flex flex-col gap-3"
    >
        <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="px-4 py-2 border rounded"
            placeholder="Updated name"
            required
        />
        <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="px-4 py-2 border rounded"
            rows={3}
            placeholder="Updated description"
        />
        <input
            type="text"
            dir="rtl"
            value={editNameAr}
            onChange={(e) => setEditNameAr(e.target.value)}
            className="px-4 py-2 border rounded"
            placeholder="الاسم بالعربية"
        />
        <textarea
            dir="rtl"
            value={editDescriptionAr}
            onChange={(e) => setEditDescriptionAr(e.target.value)}
            className="px-4 py-2 border rounded"
            rows={2}
            placeholder="الوصف بالعربية"
        />

        <CategoryImagePicker
            file={editImage}
            setFile={setEditImage}
            currentUrl={cat.image?.url}
        />

        <div className="flex justify-end gap-2">
            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
            >
                Save
            </button>
            <button
                type="button"
                onClick={() => setEditingCategoryId(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
            >
                Cancel
            </button>
        </div>
    </form>)
}

// interface Category {
//     name: string,
//     id: number,
// }

interface CreateProductProps {
    handleCreation: (e: React.FormEvent) => void;
    name: string;
    setName: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    nameAr: string;
    setNameAr: (value: string) => void;
    descriptionAr: string;
    setDescriptionAr: (value: string) => void;
    price: string;
    setPrice: (value: string) => void;
    categories: Category[];
    selectedCategory: Category;
    setSelectedCategory: (category: Category | null) => void;
    images: File[];
    setImages: (images: File[]) => void;
    isCreating: boolean;
}

export function CreateProductForm({
    handleCreation,
    name,
    setName,
    description,
    setDescription,
    nameAr,
    setNameAr,
    descriptionAr,
    setDescriptionAr,
    price,
    setPrice,
    categories,
    selectedCategory,
    setSelectedCategory,
    images,
    setImages,
    isCreating
}: CreateProductProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImages = Array.from(files).filter(newFile => {
                return !images.some(
                    existingFile =>
                        existingFile.name === newFile.name &&
                        existingFile.size === newFile.size
                );
            });

            if (newImages.length === 0) {
                toast.error('Some images were not added because they were already selected');
                return;
            }

            if (newImages.length < files.length) {
                toast.error(`${files.length - newImages.length} duplicate image(s) were not added`);
            }

            setImages([...images, ...newImages]);

            const newPreviews = newImages.map(file => URL.createObjectURL(file));
            setImagePreviews([...imagePreviews, ...newPreviews]);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };


    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !description || !price || !categories) {
            alert('Please fill in all required fields');
            return;
        }

        if (!images || images.length === 0) {
            alert('Please select at least one image');
            return;
        }

        handleCreation(e);
    };

    return (
        <div className="mt-6 p-6 bg-white rounded-md shadow-lg animate-fade-in-down">
            <h3 className="text-lg font-medium mb-4">Create New Product</h3>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 max-w-md">
                <div>
                    <label className="block mb-1 text-sm font-medium">Product Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800"
                        placeholder="e.g. Nike Shoes"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Description</label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800 resize-none"
                        placeholder="Product description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 p-4 rounded-md bg-stone-50 border" dir="rtl">
                    <p className="text-xs text-gray-500">يظهر على الموقع العربي. إذا تُرك فارغاً يظهر النص الإنجليزي.</p>
                    <div>
                        <label className="block mb-1 text-sm font-medium">الاسم بالعربية</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800"
                            value={nameAr}
                            onChange={(e) => setNameAr(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">الوصف بالعربية</label>
                        <textarea
                            rows={2}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800 resize-none"
                            value={descriptionAr}
                            onChange={(e) => setDescriptionAr(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block mb-1 text-sm font-medium">Price ($)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800"
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Category</label>
                    <select
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800"
                        value={selectedCategory?.id || ''}
                        onChange={(e) => {
                            const categoryId = Number(e.target.value);
                            const category = categories.find(cat => cat.id === categoryId);
                            setSelectedCategory(category || null);
                        }}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {selectedCategory && (
                        <div className="mt-1 text-sm text-gray-600">
                            Selected: {selectedCategory.name}
                        </div>
                    )}
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Images *</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        required={images.length === 0}
                    />
                    {imagePreviews.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isCreating}
                        className={`transition-colors duration-200 bg-stone-800 text-white px-4 py-2 rounded-md border border-black ${isCreating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black'
                            }`}
                    >
                        {isCreating ? 'Creating...' : 'save'}
                    </button>
                </div>
            </form>
        </div>
    );
}

interface UpdateProductProps {
    product: {
        id: number;
        name: string;
        description: string;
        nameAr?: string | null;
        descriptionAr?: string | null;
        price: number;
        category?: { id: number; name: string };
        packSize?: number | null;
        specs?: ProductSpec[] | null;
        priceOptions?: ProductPriceOption[] | null;
    };
    categories: { id: number; name: string }[];
    onUpdate: (updatedData: {
        id: number;
        name: string;
        description: string;
        nameAr: string;
        descriptionAr: string;
        price: number;
        categoryId: number;
        packSize: number | null;
        specs: ProductSpec[];
        priceOptions: { label: string; labelAr: string; price: number }[];
    }) => Promise<void>;
    onCancel: () => void;
    isUpdating?: boolean;
}

export function UpdateProductForm({
    product,
    categories,
    onUpdate,
    onCancel,
    isUpdating
}: UpdateProductProps) {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [nameAr, setNameAr] = useState(product.nameAr ?? '');
    const [descriptionAr, setDescriptionAr] = useState(product.descriptionAr ?? '');
    const [price, setPrice] = useState(product.price.toString());
    const [selectedCategory, setSelectedCategory] = useState(
        product.category?.id || ""
    );
    const [packSize, setPackSize] = useState(
        product.packSize != null ? String(product.packSize) : ""
    );
    const [specs, setSpecs] = useState<ProductSpec[]>(product.specs ?? []);
    const [priceOptions, setPriceOptions] = useState<ProductPriceOption[]>(
        product.priceOptions ?? []
    );

    useEffect(() => {
        if (categories.length > 0 && product.category?.id) {
            setSelectedCategory(product.category.id);
        }
    }, [categories, product.category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Drop blank rows rather than saving empty labels.
        const cleanSpecs = specs.filter(s => s.label.trim() !== '');
        const cleanOptions = priceOptions
            .filter(o => o.label.trim() !== '' && String(o.price).trim() !== '')
            .map(o => ({ label: o.label.trim(), labelAr: (o.labelAr ?? '').trim(), price: Number(o.price) }));

        if (cleanOptions.some(o => Number.isNaN(o.price))) {
            toast.error('Every sheet-count option needs a valid price.');
            return;
        }

        onUpdate({
            id: product.id,
            name,
            description,
            nameAr: nameAr.trim(),
            descriptionAr: descriptionAr.trim(),
            price: parseFloat(price),
            categoryId: Number(selectedCategory),
            packSize: packSize.trim() === '' ? null : Number(packSize),
            specs: cleanSpecs,
            priceOptions: cleanOptions,
        });
    };

    return (
        <div className="mt-6 p-6 bg-white rounded-md shadow-lg animate-fade-in-down">
            <h3 className="text-lg font-medium mb-4">Update Product</h3>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 max-w-md"
            >
                <div>
                    <label className="block mb-1 text-sm font-medium">Product Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800"
                        placeholder="Enter product name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">Description</label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800 resize-none"
                        placeholder="Write a short description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 gap-4 p-4 rounded-md bg-stone-50 border" dir="rtl">
                    <p className="text-xs text-gray-500">يظهر على الموقع العربي. إذا تُرك فارغاً يظهر النص الإنجليزي.</p>
                    <div>
                        <label className="block mb-1 text-sm font-medium">الاسم بالعربية</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800"
                            value={nameAr}
                            onChange={(e) => setNameAr(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">الوصف بالعربية</label>
                        <textarea
                            rows={2}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800 resize-none"
                            value={descriptionAr}
                            onChange={(e) => setDescriptionAr(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Price</label>
                        <input
                            type="number"
                            min="0"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <TradeFieldsEditor
                    packSize={packSize}
                    setPackSize={setPackSize}
                    specs={specs}
                    setSpecs={setSpecs}
                    priceOptions={priceOptions}
                    setPriceOptions={setPriceOptions}
                    disabled={isUpdating}
                />

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border rounded-md hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-stone-800 text-white px-6 py-2 rounded-md hover:bg-stone-700 transition-colors"
                        disabled={isUpdating}
                    >
                        {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

interface ProductImage {
    url: string;
    public_id: string;
}

interface UpdateProductImagesProps {
    productId: number;
    existingImages: ProductImage[];
    onUpdateImages: (
        id: number,
        newFiles: File[],
        removePublicIds: string[]
    ) => Promise<void>;
    onCancel: () => void;
    isUpdating?: boolean;
}

export function UpdateProductImagesForm({
    productId,
    existingImages,
    onUpdateImages,
    onCancel,
    isUpdating
}: UpdateProductImagesProps) {
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [removeList, setRemoveList] = useState<string[]>([]);

    const toggleRemove = (publicId: string) => {
        setRemoveList(prev =>
            prev.includes(publicId)
                ? prev.filter(id => id !== publicId)
                : [...prev, publicId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onUpdateImages(productId, newFiles, removeList);
    };

    return (
        <div className="mt-6 p-6 bg-white rounded-md shadow-lg animate-fade-in-down">
            <h3 className="text-lg font-medium mb-4">Update Product Images</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
                {/* Existing Images */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Current Images</label>
                    <div className="grid grid-cols-3 gap-3">
                        {existingImages.map(img => (
                            <div key={img.public_id} className="relative">
                                <img
                                    src={img.url}
                                    alt=""
                                    className={`w-full h-24 object-cover rounded-md border ${removeList.includes(img.public_id)
                                            ? "opacity-50 border-red-500"
                                            : "border-gray-200"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleRemove(img.public_id)}
                                    className={`absolute top-1 right-1 text-xs px-2 py-1 rounded ${removeList.includes(img.public_id)
                                            ? "bg-red-600 text-white"
                                            : "bg-gray-100"
                                        }`}
                                >
                                    {removeList.includes(img.public_id) ? "Undo" : "Remove"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upload New Images */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Add New Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => setNewFiles(Array.from(e.target.files || []))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border rounded-md hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-stone-800 text-white px-6 py-2 rounded-md hover:bg-stone-700 transition-colors"
                    >
                        {isUpdating ? "Updating..." : "Save Images"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export const showConfirm = ({ id, handleDeletion, message }: { id: number, handleDeletion: (id: number) => void, message: string }) => {
    confirmAlert({
        title: 'Confirmation',
        message: message,
        buttons: [
            {
                label: 'Yes',
                onClick: () => handleDeletion(id),
            },
            {
                label: 'No',
                onClick: () => { }
            }
        ]
    });
};
