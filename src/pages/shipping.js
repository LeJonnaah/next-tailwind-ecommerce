import Layout from '@/components/Layout'
import React from 'react'
import CheckoutWizard from '@/components/CheckoutWizard'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { Store } from '@/utils/Store'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function ShippingScreen() {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm()

    const router = useRouter()
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const { shippingAddress } = cart;

    useEffect(() => {
        setValue('fullName', shippingAddress.fullName);
        setValue('address', shippingAddress.address);
        setValue('city', shippingAddress.city);
        setValue('postalCode', shippingAddress.postalCode);
        setValue('country', shippingAddress.country);
        setValue('phone', shippingAddress.phone);
    }, [setValue, shippingAddress]);

    const submitHandler = ( {fullName, address, city, postalCode, country, phone} ) => { 
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {fullName, address, city, postalCode, country, phone}
        })
        Cookies.set('cart', JSON.stringify({
            ...cart,
            shippingAddress: {fullName, address, city, postalCode, country, phone}
        }))
        router.push('/payment')
    }

    return (
        <Layout title="Shipping Address">
            <CheckoutWizard activeStep={1} />
            <div className="form-container">
                <form
                    className='w-full max-screen-md'
                    onSubmit={handleSubmit(submitHandler)}
                >
                    <h1 className="text-3xl font-bold mb-5">Shipping Address</h1>
                    <div className='mb-4'>
                        <label htmlFor="fullName">Full name</label>
                        <input
                            type="text"
                            id="fullName"
                            placeholder="Enter full name"
                            className='w-full border border-gray-300 p-2 rounded-md'
                            {...register('fullName', { required: 'Please enter full name' })}
                        />
                        {errors.fullName && <p className='text-red-500'>{errors.fullName.message}</p>}
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            placeholder="Enter address"
                            className='w-full border border-gray-300 p-2 rounded-md'
                            {...register('address', { required: 'Please enter address', minLength: { value: 5, message: 'Address is too short' }})}
                        />
                        {errors.address && <p className='text-red-500'>{errors.address.message}</p>}
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            placeholder="Enter city"
                            className='w-full border border-gray-300 p-2 rounded-md'
                            {...register('city', { required: 'Please enter city' })}
                        />
                        {errors.city && <p className='text-red-500'>{errors.city.message}</p>}
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="postalCode">Postal Code</label>
                        <input
                            type="text"
                            id="postalCode"
                            placeholder="Enter postal code"
                            className='w-full border border-gray-300 p-2 rounded-md'
                            {...register('postalCode', { required: 'Please enter postal code' })}
                        />
                        {errors.postalCode && <p className='text-red-500'>{errors.postalCode.message}</p>}
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="country">Country</label>
                        <input
                            type="text"
                            id="country"
                            placeholder="Enter country"
                            className='w-full border border-gray-300 p-2 rounded-md'
                            {...register('country', { required: 'Please enter country' })}
                        />
                        {errors.country && <p className='text-red-500'>{errors.country.message}</p>}
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            placeholder="Enter phone"
                            className='w-full border border-gray-300 p-2 rounded-md'
                            {...register('phone', { required: 'Please enter phone' })}
                        />
                        {errors.phone && <p className='text-red-500'>{errors.phone.message}</p>}
                    </div>
                    <div className='mb-4 flex justify-between'>
                        <button
                            type="submit"
                            className='primary-button'
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    )
}

ShippingScreen.auth = true