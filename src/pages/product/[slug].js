import Layout from '@/components/Layout'
import React from 'react'
import data from '@/utils/data'
import { useRouter } from 'next/router'
import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import { Store } from '@/utils/Store';

export default function ProductScreen() {

    const { state, dispatch } = useContext(Store);
    const router = useRouter();

    const { query } = useRouter();
    const { slug } = query;
    const product = data.products.find((a) => a.slug === slug);
    if (!product) {
        return <div>Product Not Found</div>
    }

    const addToCartHandler = () => {
        const existItem = state.cart.cartItems.find((x) => x.slug === slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        
        if (product.countInStock >= quantity) {
            dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        router.push('/cart');
        }

        if (quantity > product.countInStock) {
            window.alert('Sorry. Product is out of stock');
        }
    }

    return (
        <Layout title={product.name}>
            <div className="py-2">
                <Link href="/">Back to products</Link>
            </div>
            <div className="grid md:grid-cols-4 md:gap-3">
                <div className="md:col-span-2">
                    <Image src={product.image} width={640} height={640} alt={product.name} />
                </div>
                <div>
                    <ul>
                        <li>
                            <h1 className='text-lg'>{product.name}</h1>
                        </li>
                        <li>
                            Category: {product.category}
                        </li>
                        <li>
                            Brand: {product.brand}
                        </li>
                        <li>
                            Rating: {product.rating} Stars ({product.numReviews} Reviews)
                        </li>
                        <li>
                            Description:
                            <p>{product.description}</p>
                        </li>
                    </ul>
                </div>
                <div>
                    <div className="card p-5">
                        <div className='mb-2 flex justify-between'>
                            <div>Price:</div>
                            <div className='text-xl font-bold'>${product.price}</div>
                        </div>
                        <div className='mb-2 flex justify-between'>
                            <div>Status:</div>
                            <div className='text-xl font-bold'>{product.countInStock > 0 ? 'In Stock' : 'Unavailable'}</div>
                        </div>
                        <button className='primary-button w-full' onClick={addToCartHandler}>Add to cart</button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}