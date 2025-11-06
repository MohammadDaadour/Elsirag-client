'use client';

import Header from '@/components/Header';
import Slogan from '@/components/Slogan';
import FeaturedProducts from '@/components/FeatruredProducts';

export default function Homepage() {
  return (
    <div>
      <div className='flex-1 flex-col font-poppins'>
        <div className="fixed top-0 left-0 w-full z-20">
          <Header />
        </div>
        <Slogan />
      </div>
      <FeaturedProducts />
    </div>
  );
}
