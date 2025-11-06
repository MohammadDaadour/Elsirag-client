import { PiTelegramLogoThin, PiWhatsappLogoThin } from "react-icons/pi";
import { CiFacebook } from "react-icons/ci";
import HoverMenu from "./HoverMenu";
import { useTranslations } from "next-intl";

export const ContactList = () => {
    const t = useTranslations('Header');
    return (
        <HoverMenu title={t('contactWithUs')}>
            <div className=" bg-white shadow-lg border border-gray-300 absolute min-w-[300px] left-0 z-50">
                <div>
                    <h4 className="text-xs text-gray-500 uppercase mb-2 py-2 pt-4  px-8">{t('socialLinks')}</h4>
                    <ul className="space-y-1 text-sm">
                        <a href="https://api.whatsapp.com/send/?phone=201208959772&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                            <li className='flex items-center px-8 py-2 hover:bg-gray-200 duration-300 z-50'>    <PiWhatsappLogoThin className='text-gray-600 text-4xl sm:text-3xl mx-2' /> {t('whatsapp')}</li>
                        </a>
                        <a href="https://www.facebook.com/@alserajnotebook/" target="_blank" rel="noopener noreferrer">
                            <li className='flex items-center px-8 py-2 hover:bg-gray-200 duration-300 z-50'> <CiFacebook className='text-4xl text-gray-600 sm:text-3xl mx-2' /> {t('facebook')}</li>
                        </a>
                        <a href="https://t.me/elsraj_factory" target="_blank" rel="noopener noreferrer">
                            <li className='flex items-center px-8 py-2 pb-4 hover:bg-gray-200 duration-300 z-50'>  <PiTelegramLogoThin className='text-4xl text-gray-600 sm:text-3xl mx-2' />{t('telegram')}</li>
                        </a>
                    </ul>
                </div>
            </div>
        </HoverMenu>
    )
}