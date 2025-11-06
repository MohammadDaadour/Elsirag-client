'use client';

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { CiEdit, CiTrash } from "react-icons/ci";
import { showConfirm, CreateAttributeForm } from '../components/Forms';
import { UpdateProductForm } from '../components/Forms';
import { Attribute, Option } from '@/types/variants';

function page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [attributes, setAttributes] = useState<Attribute[] | []>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editType, setEditType] = useState<string>('');


  const getAttributes = async () => {
    try {
      const { data } = await axios.get('/products/attributes');
      setAttributes(data);

      console.log("Attributes: ", data)
    } catch (err) {
      toast.error("cannot get attributes.")
    } finally {
      setLoading(false);
    }
  };

  const createVariant = async (VariantData: {
    name: string,
    type: string,
    options: string[]
  }) => {
    try {
      const { status } = await axios.post('/products/attributes', VariantData);
      setName('');
      setType('');
      setOptions([]);
      setShowForm(false);
      toast.success('Variant created successfully!');
      await getAttributes();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create variant.');
    }
  };

  const handleCreation = (e: React.FormEvent) => {
    e.preventDefault();

    const VariantData = {
      name,
      type,
      options: options
    };

    if (options.length > 0) {
      createVariant(VariantData);
    }
    else {
      toast.error("you have to add options to the attribute.")
    }
  };

  const handleUpdateProduct = async (updatedData: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    newImages: File[];
    imagesToDelete: string[];
  }) => {

  };

  const handleDeletion = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`/products/${id}`)
      toast.success('Product deleted');
      await getAttributes();
    } catch (err) {
      console.error('delete error: ', err);
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAttributes();
  }, []);

  return (
    <div className='p-6 text-stone-700'>
      <div className='flex items-center bg-white p-4 shadow-md'>
        <p className=''>Attributes</p>
        <button
          onClick={() => { setShowForm(prev => !prev); }}
          className="transition-colors duration-200 cursor-pointer bg-stone-800 text-white mx-8 px-4 py-2 rounded-md hover:bg-white hover:text-black border border-black"
        >
          {showForm ? 'Cancel' : 'Add new attribute'}
        </button>
      </div>
      {showForm &&
        <>
          <CreateAttributeForm
            handleCreation={handleCreation}
            name={name}
            setName={setName}
            type={type}
            setType={setType}
            options={options}
            setOptions={setOptions}
          />
        </>
      }
      <div className='w-full flex mt-4 border-separate border-spacing-y-3'>
        <div className='w-full flex'>
          {loading ? (
            <div className="">
              <div>
                <ClipLoader className='m-32' size={35} color="#f63b9cff" />
              </div>
            </div>
          ) : (
             attributes.length > 0 ? (
              attributes.map((attribute: any) => (
                <React.Fragment key={attribute.id}>
                  <div className="w-full my-4 flex flex-wrap gap-2">
                    <div className="bg-white border rounded-xl shadow-md p-5 hover:shadow-lg transition min-w-[400px] hover:translate-y-2 cursor-pointer">
                      {/* العنوان */}
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {attribute.name}
                        </h2>
                        <span className="text-sm text-gray-500 italic">
                          {attribute.type || "—"}
                        </span>
                      </div>

                      {/* Options */}
                      {attribute.options && attribute.options.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {attribute.options.map((option: any) => (
                            <span
                              key={option.id}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-sm"
                            >
                              {option.value}
                            </span>
                          ))}
                        </div>
                      )}
                      <button className='bg-black my-4 p-2 rounded-md transition-colors duration-200 cursor-pointer bg-stone-800 text-white hover:bg-white hover:text-black border border-black'>View Details</button>
                    </div>
                  </div>

                  {/* وضع التعديل */}
                  {editingProductId === attribute.id && (
                    <tr>
                      <td colSpan={3} className="bg-stone-50 p-4 rounded-md">
                        {/* هنا ممكن تحط فورم أو أي UI للتعديل */}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No Attributes found.
                </td>
              </tr>
            )
          )}
        </div>
      </div>
    </div >
  )
}

export default page



{/* <div className="flex items-center gap-3 text-2xl text-stone-700">
                          <CiEdit
                            onClick={() => {
                              setEditingProductId(attribute.id);
                              setEditName(attribute.name);
                              setEditType(attribute.type || '');
                            }}
                            className="cursor-pointer mx-2 hover:text-green-600 transition-colors"
                          />
                          <CiTrash
                            onClick={() => showConfirm({ id: attribute.id, handleDeletion, message: "Are you sure you want to delete this product permanently" })}
                            className="cursor-pointer mx-2 hover:text-red-600 transition-colors"
                          />
                        </div> */}