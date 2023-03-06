import Link from 'next/link'
import React from 'react'
import { useContext } from 'react'
import { Store } from '@/utils/Store'

export default function ProductItem({ product }) {

    const { state, dispatch } = useContext(Store);
    const { slug } = product;
    

    const addToCartHandler = () => {
        const existItem = state.cart.cartItems.find((x) => x.slug === slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        
        if (product.countInStock >= quantity) {
            dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        }

        if (quantity > product.countInStock) {
            window.alert('Sorry. Product is out of stock');
        }
    }

    return (
        <div className='card'>
            <Link href={`/product/${product.slug}`}>
                <img className='rounded shadow' src={product.image} alt={product.name} />
            </Link>
            <div className='flex flex-col items-center justify-center p-5'>
                <Link href={`/product/${product.slug}`}>
                    <h2 className='text-lg'>{product.name}</h2>
                </Link>
                <p className='mb-2'>{product.brand}</p>
                <p>${product.price}</p>
                <button className='primary-button' 
                    onClick={addToCartHandler}
                    type='button'>
                    Add to cart
                </button>
            </div>
        </div>
    )
}
