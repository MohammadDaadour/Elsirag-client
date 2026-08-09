'use client';

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { CiTrash } from "react-icons/ci";
import { showConfirm } from '../components/Forms';
import { useUser } from '@/context/UserContext';

function page() {
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<any>([]);

    const { isAuthenticated, user } = useUser();

    const getAllUsers = async () => {
        if (isAuthenticated && user?.role == 'admin') {
            try {
                const { data } = await axios.get('/user');
                setUsers(data);
            } catch (err: any) {
                console.error(err);
                toast.error('Failed to load users');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllUsers();
    }, [isAuthenticated, user?.role]);

    const handleDeletion = async (id: number) => {
        try {
            setLoading(true);
            await axios.delete(`/user/${id}`);
            toast.success('User deleted');
            await getAllUsers();
        } catch (err: any) {
            console.error('delete error: ', err);
            toast.error(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='p-6 text-stone-700'>
            <div className='flex items-center bg-white p-4 shadow-md'>
                <p className=''>Users</p>
            </div>
            <div>
                <table className='w-full table-auto mt-4 border-separate border-spacing-y-3'>
                    <thead>
                        <tr className='text-left bg-white w-full shadow-sm'>
                            <th className='p-4'>id</th>
                            <th className='p-4'>username</th>
                            <th>email</th>
                            <th>role</th>
                            <th>Operations</th>
                        </tr>
                    </thead>
                    <tbody className='w-full'>
                        {loading ? (
                            <tr>
                                <td colSpan={5}>
                                    <ClipLoader className='m-32' size={35} color="#f63b9cff" />
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">No users found.</td>
                            </tr>
                        ) : (
                            users.map((row: any) => {
                                // Deleting yourself would lock you out: registration was removed
                                // with the shop, so a new admin can only be made in the database.
                                const isSelf = row.id === user?.id;

                                return (
                                    <tr key={row.id} className="bg-white border w-full shadow-sm">
                                        <td className='p-4'>{row.id}</td>
                                        <td className='p-4'>{row.username}</td>
                                        <td>{row.email || '. . . . . . . . .'}</td>
                                        <td>{row.role}</td>
                                        <td>
                                            <div className="flex items-center gap-3 text-2xl text-stone-700">
                                                {isSelf ? (
                                                    <span className="text-xs text-gray-400">
                                                        This is you
                                                    </span>
                                                ) : (
                                                    <CiTrash
                                                        onClick={() => showConfirm({
                                                            id: row.id,
                                                            handleDeletion,
                                                            message: 'Are you sure you want to delete this user? This operation cannot be undone.',
                                                        })}
                                                        className="cursor-pointer mx-2 hover:text-red-600 transition-colors"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default page;
