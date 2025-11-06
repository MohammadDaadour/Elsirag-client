'use client'
import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import axios from '@/lib/axios';

function page() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await axios.get('/auth/me');
        console.log(data)
        setUser(data);
      } catch (err) {
        console.error('Error fetching user', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <div className='flex'>
      <p></p>
    </div>
  )
}

export default page;