'use client';

import React, { useState, useEffect, FormEvent } from 'react'
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { CiEdit, CiTrash, CiImageOn } from "react-icons/ci";
import { showConfirm, CreateProductForm, AssiningAttributeForm } from '../components/Forms';
import { UpdateProductForm, GenerateVariantsForm, UpdateProductImagesForm } from '../components/Forms';
import { PiTreeViewThin } from "react-icons/pi";
import { Product } from '@/types/product';
import { Attribute, Variant } from '@/types/variants';

function page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<any>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [images, setImages] = useState<File[]>([]);
  const [editingProductId, setEditingProductId] = useState<number>(0);
  const [editingProductImageId, setEditingProductImageId] = useState<number>(0);
  const [editName, setEditName] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');

  const [attributes, setAttributes] = useState<Attribute[] | null>(null);
  const [assiningAttribute, setAssigningAttribute] = useState<number>(0);

  const getProducts = async () => {
    try {
      const { data } = await axios.get('/products/admin');
      setProducts(data.data);

    } catch (err) {
      console.log('error: ', err);
    } finally {
      setLoading(false);
    }
  };

  const getAttributes = async () => {
    try {
      const { data } = await axios.get('/products/attributes');
      setAttributes(data);
    } catch (err) {
      console.log('error: ', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.get('categories');
      setCategories(data);
    } catch (err) {
      console.log('error: ', err);
    }
  }

  const createProduct = async (formData: FormData) => {
    try {
      const { status } = await axios.post('products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setSelectedCategory(null);
      setImages([]);
      setShowForm(false);
      toast.success('Product created successfully!');
      await getProducts();
    } catch (err: any) {
      console.log('error: ', err.response.data);
      toast.error('Failed to create Product.');
    }
  }

  const handleCreation = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price.toString());
      formData.append('stock', stock.toString());
      // Ensure selectedCategory is set
      if (!selectedCategory || !selectedCategory.id) {
        toast.error('Please select a valid category.');
        return;
      }

      formData.append('categoryId', selectedCategory.id.toString());

      images.forEach((image) => {
        formData.append('images', image);
      });

      await createProduct(formData);

    } catch (error: any) {
      toast.error(error.data);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (updatedData: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
  }) => {
    try {
      setLoading(true);

      // Update product basic info
      await axios.patch(`/products/${updatedData.id}`, {
        name: updatedData.name,
        description: updatedData.description,
        price: updatedData.price,
        stock: updatedData.stock,
        categoryId: updatedData.categoryId,
      });

      await getProducts();
      setEditingProductId(0);
      toast.success('Product updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProductImages = async (
    productId: number,
    newFiles: File[],
    removePublicIds: string[]
  ) => {
    try {
      setLoading(true);

      // Prepare FormData for images
      const formData = new FormData();
      newFiles.forEach(file => formData.append('images', file));
      removePublicIds.forEach(id => formData.append('remove', id));

      // Call backend endpoint
      await axios.patch(`/products/${productId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Refresh products list
      await getProducts();
      setEditingProductId(0);
      toast.success('Product images updated successfully!');
    } catch (err) {
      console.error('Update images error:', err);
      toast.error('Failed to update product images');
    } finally {
      setLoading(false);
    }
  };


  const handleDeletion = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`/products/${id}`)
      toast.success('Product deleted');
      await getProducts();
    } catch (err) {
      console.error('delete error: ', err);
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
    }
  }

  // If you handle images in the form, handle them here
  // if (updatedData.newImages && updatedData.newImages.length > 0 || 
  //     updatedData.imagesToDelete && updatedData.imagesToDelete.length > 0) {
  //   const formData = new FormData();
  //   updatedData.newImages?.forEach(file => formData.append('images', file));
  //   formData.append('remove', JSON.stringify(updatedData.imagesToDelete || []));

  //   await axios.patch(
  //     `/products/${updatedData.id}/images`,
  //     formData,
  //     { headers: { 'Content-Type': 'multipart/form-data' } }
  //   );
  // }

  const assignAttributes = async (productId: number, attributes: number[]): Promise<void> => {

    try {
      await axios.post(`/products/${productId}/attributes`, { attributes });
      toast.success("attributes assigned successfully!");
    }
    catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getProducts();
  }, []);



  return (
    <div className='p-6 text-stone-700'>
      <div className='flex items-center bg-white p-4 shadow-md'>
        <p className=''>Products</p>
        <button
          onClick={() => { setShowForm(prev => !prev); getCategories(); }}
          className="transition-colors duration-200 cursor-pointer bg-stone-800 text-white mx-8 px-4 py-2 rounded-md hover:bg-white hover:text-black border border-black"
        >
          {showForm ? 'Cancel' : 'Add new product'}
        </button>
      </div>
      {showForm &&
        <CreateProductForm
          handleCreation={handleCreation}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          price={price}
          setPrice={setPrice}
          stock={stock}
          setStock={setStock}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          images={images}
          setImages={setImages}
          categories={categories}
          isCreating={loading}
        />
      }
      <table className='w-full table-auto mt-4 border-separate border-spacing-y-3'>
        <thead>
          <tr className='text-left bg-white w-full shadow-sm'>
            <th className='p-4'>Name</th>
            <th>Description</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody className='w-full'>
          {loading ? (
            <tr className="">
              <td>
                <div>
                  <ClipLoader className='m-32' size={35} color="#f63b9cff" />
                </div>
              </td>
            </tr>
          ) : (
            products.length > 0 ? (
              products.map((pro: any) => (
                <React.Fragment key={pro.id}>
                  <tr className="bg-white border w-full shadow-sm">
                    <td className='p-4'>{pro.name}</td>
                    <td>{pro.description || '. . . . . . . . .'}</td>
                    <td>
                      <div className="flex items-center gap-3 text-2xl text-stone-700">
                        <CiEdit
                          onClick={() => {
                            setEditingProductId(pro.id);
                            setEditName(pro.name);
                            setEditDescription(pro.description || '');
                            getCategories();
                          }}
                          className="cursor-pointer mx-2 hover:text-green-600 transition-colors"
                        />
                        <CiImageOn
                          onClick={() => { setEditingProductImageId(pro.id) }}
                          className="cursor-pointer mx-2 hover:text-green-600 transition-colors"
                        />
                        <CiTrash
                          onClick={() => showConfirm({ id: pro.id, handleDeletion, message: "Are you sure you want to delete this product permanently" })}
                          className="cursor-pointer mx-2 hover:text-red-600 transition-colors"
                        />
                        <PiTreeViewThin
                          onClick={() => { setAssigningAttribute(pro.id); getAttributes(); }}
                          className="cursor-pointer mx-2 hover:text-rose-400 transition-colors"
                        />
                      </div>
                    </td>
                  </tr>
                  {editingProductId === pro.id && (
                    <tr>
                      <td colSpan={3} className="bg-stone-50">
                        <UpdateProductForm
                          product={pro}
                          categories={categories}
                          onUpdate={handleUpdateProduct}
                          isUpdating={loading}
                          onCancel={() => setEditingProductId(0)}
                        />
                      </td>
                    </tr>
                  )}
                  {editingProductImageId === pro.id && (
                    <tr>
                      <td colSpan={3} className="bg-stone-50">
                        <UpdateProductImagesForm
                          productId={pro.id}
                          existingImages={pro.images}
                          onUpdateImages={handleUpdateProductImages} // your axios PATCH handler
                          isUpdating={loading}
                          onCancel={() => setEditingProductImageId(0)}
                        />
                      </td>
                    </tr>
                  )}
                  {assiningAttribute === pro.id &&
                    <>
                      <tr>
                        <td colSpan={3} className="bg-stone-50">
                          <AssiningAttributeForm
                            attributes={attributes}
                            product={pro}
                            onAssign={async (assignData) => {
                              await assignAttributes(
                                assignData.productId,
                                assignData.selectedAttributes
                              );
                              setAssigningAttribute(0);
                            }}
                            onCancel={() => setAssigningAttribute(0)}
                          />
                        </td>
                      </tr>
                    </>
                  }
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div >
  )
}

export default page