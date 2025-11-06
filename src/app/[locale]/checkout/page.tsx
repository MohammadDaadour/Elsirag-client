'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/context/UserContext';
import { RetrievedItem } from '@/types/cart';
import Image from 'next/image';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/useOrder'; // Import the hook and type
import { Order } from '@/types/order';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function CheckoutPage() {
  const t = useTranslations('CheckoutPage');
  const { isAuthenticated, user } = useUser();
  const { getCart, clearCart } = useCart();
  const { placeOrder } = useOrder(); // Use the hook
  const router = useRouter();
  const [cartItems, setCartItems] = useState<RetrievedItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deliveryNeeded, setDeliveryNeeded] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [notes, setNotes] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      country: 'Egypt',
      building: '',
      floor: '',
      apartment: '',
      postalCode: '',
      state: ''
    }
  });

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.error('Please log in to proceed to checkout');
      router.push('/sign-in');
    } else if (isAuthenticated) {
      getCart().then(cart => {
        if (cart.items && cart.items.length > 0) {
          setCartItems(cart.items);
        } else {
          toast.error('Your cart is empty');
          router.push('/cart');
        }
      });
    }
  }, [isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setShippingInfo(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setShippingInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    const orderItems = cartItems.map(item => ({
      name: item.product.name,
      description: item.product.description || '',
      amount_cents: Math.round(item.product.price * 100),
      quantity: item.quantity
    }));

    const orderData: Order = {
      deliveryNeeded,
      shipping: deliveryNeeded ? shippingInfo : undefined,
      paymentMethod,
      notes: notes || undefined,
      items: orderItems,
      currency: 'EGP',
    };

    const success = await placeOrder(orderData);

    if (success) {
      try {
        sessionStorage.setItem('orderConfirmationData', JSON.stringify(orderData));
        router.push('/order-confirmation');
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }

    setIsSubmitting(false);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ).toFixed(2);
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return (
      <main className="flex flex-col items-center p-6 bg-white min-h-screen w-full text-black">
        <Header />
        <p>{t('loading')}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center p-6 bg-white min-h-screen w-full text-black">
      <Header />
      <h1 className="text-2xl mb-4 mt-[90px] max-w-4x">{t('title')}</h1>
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">{t('contactInfo')}</h2>
            <div className="mb-4">
              <p className="font-medium">{user?.username}</p>
              <p className="text-gray-600">{user?.email}</p>
            </div>

            {/* <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="deliveryNeeded"
                checked={deliveryNeeded}
                onChange={(e) => setDeliveryNeeded(e.target.checked)}
                className="mr-2 h-5 w-5"
              />
              <label htmlFor="deliveryNeeded" className="font-medium">
                I need delivery
              </label>
            </div> */}

            {deliveryNeeded && (
              <>
                <h2 className="text-xl font-semibold mb-4">{t('shippingInfo')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('firstName')}</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('lastName')}</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('phoneNumber')}</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={shippingInfo.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('country')}</label>
                    <input
                      type="text"
                      name="address.country"
                      value={shippingInfo.address.country}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">{t('streetAddress')}</label>
                  <input
                    type="text"
                    name="address.street"
                    value={shippingInfo.address.street}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('city')}</label>
                    <input
                      type="text"
                      name="address.city"
                      value={shippingInfo.address.city}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('state')}</label>
                    <input
                      type="text"
                      name="address.state"
                      value={shippingInfo.address.state}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('postalCode')}</label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={shippingInfo.address.postalCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('building')}</label>
                    <input
                      type="text"
                      name="address.building"
                      value={shippingInfo.address.building}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('floor')}</label>
                    <input
                      type="text"
                      name="address.floor"
                      value={shippingInfo.address.floor}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('apartment')}</label>
                    <input
                      type="text"
                      name="address.apartment"
                      value={shippingInfo.address.apartment}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </>
            )}

            <h2 className="text-xl font-semibold mb-4 mt-6">{t('paymentMethod')}</h2>
            <div className="space-y-3 mb-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="CASH"
                  checked={paymentMethod === 'CASH'}
                  onChange={() => setPaymentMethod('CASH')}
                  className="mr-2 h-5 w-5"
                />
                <label htmlFor="cash" className="font-medium">
                  {t('cashOnDelivery')}
                </label>
              </div>
              {/* <div className="flex items-center">
                <input
                  type="radio"
                  id="creditCard"
                  name="paymentMethod"
                  value="CREDIT_CARD"
                  checked={paymentMethod === 'CREDIT_CARD'}
                  onChange={() => setPaymentMethod('CREDIT_CARD')}
                  className="mr-2 h-5 w-5"
                />
                <label htmlFor="creditCard" className="font-medium">
                  Credit Card
                </label>
              </div> */}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t('orderNotes')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded-md min-h-[100px]"
                placeholder="Special instructions, delivery preferences, etc."
              />
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-[400px]">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md sticky top-4">
            <h2 className="text-xl font-semibold mb-4">{t('orderSummary')}</h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b">
                  {item.product?.images?.[0]?.url ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      height={80}
                      width={80}
                      className="rounded-lg border border-stone-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-gray-600">{t('quantity')} {item.quantity}</p>
                  </div>
                  <p className="font-medium">EGP {(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between mb-2">
                <span>{t('subtotal')}</span>
                <span>EGP {calculateTotal()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>{t('shipping')}</span>
                <span>{deliveryNeeded ? 'EGP 50.00' : 'Free'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4 pt-2 border-t">
                <span>{t('total')}</span>
                <span>EGP {(parseFloat(calculateTotal()) + (deliveryNeeded ? 50 : 0)).toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className={`w-full mt-6 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-medium py-4 px-6 rounded-xl shadow-lg hover:shadow-rose-300/50 transition-all transform hover:-translate-y-1 cursor-pointer ${isSubmitting ? 'opacity-70' : ''
                  }`}
              >
                {isSubmitting ? t('processing') : t('placeOrder')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}