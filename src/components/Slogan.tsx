import bg from '../assets/bg_blur.jpg';
import notebooks from '../assets/notebooks-removebg-preview.png';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Slogan() {

    const t = useTranslations('slogan');

    const handleScroll = () => {
        const section = document.getElementById("products");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className='flex flex-wrap justify-center bg-white sm:h-screen'>
            <div className='flex justify-center items-center'>
                <img className='xl:mt-0 mt-[100px] max-w-[350px] sm:max-w-[600px] ' src={notebooks.src} alt="" />
            </div>
            <div
                className="p-8 flex flex-col items-center justify-center bg-cover bg-center relative"
            >
                <h1 className='text-4xl font-light text-center text-black sm:text-6xl font-semibold'>
                    {t('title')} <br /> {t('title_2')}
                    <p className='text-lg mt-4 sm:mt-8'> {t('description')} <br /> {t('description_2')}</p>
                </h1>
                <button
                    onClick={handleScroll}
                    className="group relative inline-flex items-center overflow-hidden border border-gray-800 px-10 py-3 mt-8 text-sm font-medium text-gray-800 transition-all duration-300 hover:text-white cursor-pointer">
                    <span className="absolute left-0 top-0 h-full w-full transform scale-x-0 bg-gray-800 transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left z-0"></span>
                    <span className="relative z-10 transition-transform duration-300">
                        {t('button')}
                    </span>
                </button>
            </div>
        </div>
    )
}



