import CheckoutWizard from '@/components/CheckoutWizard'
import Layout from '@/components/Layout'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Store } from '@/utils/Store'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'

export default function PaymentScreen() {

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
    const router = useRouter()

    const { state, dispatch } = useContext(Store)
    const { cart } = state
    const { shippingAddress, paymentMethod } = cart

    const submitHandler = (e) => {
        e.preventDefault();
        if (!selectedPaymentMethod) {
            return toast.error('Payment method is required');
        }
        dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                paymentMethod: selectedPaymentMethod,
            })
        );
        router.push('/placeorder');
    };

        useEffect(() => {
            if (!shippingAddress.address) {
                return router.push('/shipping')
            }
            setSelectedPaymentMethod(paymentMethod || '')
        }, [paymentMethod, shippingAddress.address, router])

        return (
            <Layout title="Payment Screen">
                <CheckoutWizard activeStep={2} />
                <form
                    className="w-full max-w-lg"
                    onSubmit={submitHandler}
                >
                    <h1 className="text-3xl font-bold mb-5">Payment Method</h1>
                    {
                        ['PayPal', 'Stripe', 'Cash'].map((payment) => (
                            <div key={payment} className="flex items-center mb-5">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    id={payment}
                                    checked={selectedPaymentMethod === payment}
                                    onChange={() => setSelectedPaymentMethod(payment)}
                                    required
                                />
                                <label htmlFor={payment} className="ml-3 text-lg">
                                    {payment}
                                </label>
                            </div>
                        ))
                    }
                    <div className="flex justify-between">
                        <button
                            type="button"
                            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2"
                            onClick={() => router.push('/shipping')}
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </Layout>
        )
    }