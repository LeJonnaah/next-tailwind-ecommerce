import Layout from '@/components/Layout'
import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import { Store } from '@/utils/Store';
import Product from 'models/Product';
import db from '@/utils/db';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProductScreen(props) {

    const { product } = props;
    const { state, dispatch } = useContext(Store);
    const router = useRouter();

    if (!product) {
        return <Layout title='Product Not Found'>Product Not Found</Layout>
    }

    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        
        if (product.countInStock >= quantity) {
            dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        router.push('/cart');
        }

        if (quantity > data.countInStock) {
            toast.error('Sorry. Product is out of stock');
            return;
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

export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;

    await db.connect();
    const product = await Product.findOne( {slug} ).lean();
    await db.disconnect();
    return {
        props: {
            product: product ? db.convertDocToObj(product) : null,
        },
    };
}