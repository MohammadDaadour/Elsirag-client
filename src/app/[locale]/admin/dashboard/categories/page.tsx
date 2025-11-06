'use client';

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios';
import { CreateCategoryForm, UpdateCategoryForm } from '../components/Forms';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { CiEdit, CiTrash } from "react-icons/ci";
import { showConfirm } from '../components/Forms';

function page() {
    const [loading, setLoading] = useState<boolean>(true);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showFormTwo, setShowFormTwo] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [categories, setCategories] = useState<any>([]);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [editName, setEditName] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');

    const getCategories = async () => {
        try {
            const { data } = await axios.get('/categories');
            setCategories(data);
        } catch (err) {
            console.log('error: ', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreation = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { status } = await axios.post('/categories', { name, description });
            toast.success('Category created successfully!');
            setName('');
            setDescription('');
            setShowForm(false);
            await getCategories();
        } catch (err) {
            console.log('error: ', err);
            toast.error('Failed to create category.');
        }
    };

    const handleUpdate = async (e: React.FormEvent, id: number) => {
        e.preventDefault();
        try {
            await axios.patch(`/categories/${id}`, {
                name: editName,
                description: editDescription,
            });
            toast.success('Category updated');
            setEditingCategoryId(null);
            await getCategories();
        } catch (err) {
            console.error('Update error:', err);
            toast.error('Failed to update');
        }
    }

    const handleDeletion = async (id: number) => {
        try {
            setLoading(true);
            await axios.delete(`/categories/${id}`)
            toast.success('Category deleted');
            await getCategories();
        } catch (err) {
            console.error('delete error: ', err);
            toast.error('Failed to delete');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div className='p-6 text-stone-700'>
            <div className='flex items-center bg-white p-4 shadow-md'>
                <p className=''>Categories</p>
                <button
                    onClick={() => setShowForm(prev => !prev)}
                    className="transition-colors duration-200 cursor-pointer bg-stone-800 text-white mx-8 px-4 py-2 rounded-md hover:bg-white hover:text-black border border-black"
                >
                    {showForm ? 'Cancel' : 'Add New Category'}
                </button>
            </div>
            {showForm && (
                <CreateCategoryForm
                    name={name}
                    setName={setName}
                    description={description}
                    setDescription={setDescription}
                    handleCreation={handleCreation}
                />
            )}

            <div>
                <table className='w-full table-auto mt-4 border-separate border-spacing-y-3'>
                    <thead>
                        <tr className='text-left bg-white w-full shadow-sm'>
                            <th className='p-4'>Name</th>
                            <th>Description</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody className='w-full'>
                        {categories.map((cat: any) => (
                            <React.Fragment key={cat.id}>
                                <tr className="bg-white border w-full shadow-sm">
                                    <td className='p-4'>{cat.name}</td>
                                    <td>{cat.description || '. . . . . . . . .'}</td>
                                    <td>
                                        <div className="flex items-center gap-3 text-2xl text-stone-700">
                                            <CiEdit
                                                onClick={() => {
                                                    setEditingCategoryId(cat.id);
                                                    setEditName(cat.name);
                                                    setEditDescription(cat.description || '');
                                                }}
                                                className="cursor-pointer mx-2 hover:text-green-600 transition-colors"
                                            />
                                            <CiTrash
                                                onClick={() => showConfirm({ id: cat.id, handleDeletion, message: 'Are you sure you want to delete this category, all the products related to this category will have no category related to it.' })}
                                                className="cursor-pointer mx-2 hover:text-red-600 transition-colors"
                                            />

                                        </div>
                                    </td>
                                </tr>
                                {editingCategoryId === cat.id && (
                                    <tr>
                                        <td colSpan={3} className="bg-stone-50">
                                            <UpdateCategoryForm
                                                cat={cat}
                                                editName={editName}
                                                setEditName={setEditName}
                                                editDescription={editDescription}
                                                setEditDescription={setEditDescription}
                                                setEditingCategoryId={setEditingCategoryId}
                                                handleUpdate={(e) => handleUpdate(e, cat.id)}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default page