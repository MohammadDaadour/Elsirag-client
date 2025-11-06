import React from 'react'
import Image from 'next/image';
import elsirag_logo from '../../../../../assets/elsirag_logo.png'
import { PiShieldThin, PiListThin } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from 'next/link';

interface HeaderProps {
    toggleNav: () => void;
    isNavOpen: boolean;
}

function Header({ toggleNav, isNavOpen }: HeaderProps) {
    return (
        <div className="w-full bg-white z-20 flex items-center h-[80px] fixed shadow-md justify-center items-center text-stone-700">
            <div className='flex justify-between w-[90%] px-8'>
                <div className='flex items-center'>
                    <Link href={'/'}>
                    <Image
                        className="w-18"
                        src={elsirag_logo}
                        alt="logo"
                        width={96}
                        height={96}
                        priority
                    />
                    </Link>
                    <button
                        className="lg:hidden p-2 relative z-50 group"
                        onClick={toggleNav}
                        aria-label="Toggle Menu"
                    >
                        <div className="space-y-1.5">
                            <span
                                className={`block w-6 h-0.5 bg-stone-700 transition-transform duration-300 ease-in-out 
                ${isNavOpen ? 'transform rotate-45 translate-y-1.5' : ''}`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-stone-700 transition-opacity duration-300 ease-in-out 
                ${isNavOpen ? 'opacity-0' : ''}`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-stone-700 transition-transform duration-300 ease-in-out 
                ${isNavOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}
                            ></span>
                        </div>
                    </button>
                </div>
                <div className='flex items-center'>
                    <PiShieldThin className='text-5xl' />
                    <p>Admin</p>
                </div>
            </div>
        </div>
    )
}

export default Header