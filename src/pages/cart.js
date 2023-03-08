import Layout from '@/components/Layout';
import { Store } from '@/utils/Store';
import React, { useContext } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axios from 'axios';

function CartScreen() {

    const { state, dispatch } = useContext(Store);
    const router = useRouter();

    const {
        cart: { cartItems },
    } = state;

    const updateCartHandler = async (item, qty) => {
        const quantity = Number(qty);
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (quantity > data.countInStock) {
            return toast.error('Sorry. Product is out of stock');
        }
        
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
        toast.success('Product added to cart');
    }

    const removeItemHandler = (item) => {
        dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    }

    return (
        <div>
            <Layout title="Shopping Cart">
                <h1 className='mb-4 text-xl'>Shopping Cart</h1>
                {
                    cartItems.length === 0 ? (
                        <div>Cart is empty. <Link href="/">Go Shopping</Link></div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {cartItems.map((item) => (
                                <div key={item.name} className="p-4 bg-white rounded shadow-md">
                                    <div className="flex items-center">
                                        <Image src={item.image} width={50} height={50} alt={item.name} />
                                        <Link className="ml-4 font-bold" href={`/product/${item.slug}`}>
                                            {item.name}
                                        </Link>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <div className="mr-4 font-bold">Qty:</div>
                                        <div>
                                            <select
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateCartHandler(item, e.target.value)
                                                }
                                            >
                                                {[...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <div className="mr-4 font-bold">Price:</div>
                                        <div className="font-bold">${item.price}</div>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <button
                                            type="button"
                                            onClick={() => removeItemHandler(item)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
                <div className='card p-5'>
                    <div className='flex justify-between'>
                        <h2 className='text-xl'>Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items): ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}</h2>
                        <button className='primary-button'
                            onClick={() => { router.push('login?redirect=/shipping') }} 
                            type='button'
                            disabled={cartItems.length === 0}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });