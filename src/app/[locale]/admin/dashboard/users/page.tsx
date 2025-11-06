'use client';

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { CiEdit, CiTrash } from "react-icons/ci";
import { showConfirm, CreateProductForm } from '../components/Forms';
import { UpdateProductForm } from '../components/Forms';
import { useUser } from '@/context/UserContext';

function page() {
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<any>([]);

    const { isAuthenticated, user } = useUser();

    const getAllUsers = async () => {
        if (isAuthenticated && user?.role == 'admin') {
            try {
                const { data } = await axios.get('/user');
                setUsers(data)
                return true;
            } catch (err: any) {
                console.error(err);
                return false;
            }
        }
    }

    useEffect(() => {
        getAllUsers();
    },
        [])

        const handleDeletion= () => {
            console.log('deleted');
        }

    return (
        <div className='p-6 text-stone-700'>
            <div className='flex items-center bg-white p-4 shadow-md'>
                <p className=''>users</p>
            </div>
            <div>
                <table className='w-full table-auto mt-4 border-separate border-spacing-y-3'>
                    <thead>
                        <tr className='text-left bg-white w-full shadow-sm'>
                            <th className='p-4'>id</th>
                            <th className='p-4'>username</th>
                            <th>email</th>
                            
                        </tr>
                    </thead>
                    <tbody className='w-full'>
                        {users.map((user: any) => (
                                <tr key={user.id} className="bg-white border w-full shadow-sm">
                                    <td className='p-4'>{user.id}</td>
                                    <td className='p-4'>{user.username}</td>
                                    <td>{user.email || '. . . . . . . . .'}</td>
                                    {/* <td>
                                        <div className="flex items-center gap-3 text-2xl text-stone-700">
                                            <CiTrash
                                                onClick={() => showConfirm({ id: user.id, handleDeletion, message: 'Are you sure you want to delete this user?, this operation cannot be undone' })}
                                                className="cursor-pointer mx-2 hover:text-red-600 transition-colors"
                                            />
                                        </div>
                                    </td> */}
                                </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default page;