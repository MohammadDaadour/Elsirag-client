'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { IoAnalytics } from 'react-icons/io5';
import { PiUsersThreeThin, PiNotebookThin, PiTreeViewThin } from 'react-icons/pi';
import { CiBoxList, CiBoxes } from 'react-icons/ci';
import Link from 'next/link';

const links = [
  // { href: '/admin/dashboard', label: 'Analytics', icon: <IoAnalytics className='text-2xl' /> },
  { href: '/admin/dashboard/users', label: 'Users', icon: <PiUsersThreeThin className='text-2xl' /> },
  { href: '/admin/dashboard/categories', label: 'Categories', icon: <CiBoxList className='text-2xl' /> },
  { href: '/admin/dashboard/products', label: 'Products', icon: <PiNotebookThin className='text-2xl' /> },
  { href: '/admin/dashboard/variants', label: 'Variants', icon: <PiTreeViewThin className='text-2xl' /> },
  { href: '/admin/dashboard/orders', label: 'Orders', icon: <CiBoxes className='text-2xl' /> },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <div className='bg-white fixed flex flex-col w-[300px] text-stone-700 pt-[120px] shadow-md h-screen'>
      <h1 className='text-3xl px-16'>Dashboard</h1>
      <ul className='flex flex-col mt-8'>
        {links.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-16 transition-colors p-4 ${isActive
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-200 duration-200'
                  }`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
