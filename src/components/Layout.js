import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useContext } from 'react'
import { Store } from '@/utils/Store'
import { useEffect } from 'react'

export default function Layout({ title, children }) {
    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const [cartItemCount, setCartItemCount] = React.useState(0);

    useEffect(() => {
        setCartItemCount(cart.cartItems.reduce((a, c) => a + Number(c.quantity), 0))
    }, [ cart.cartItems ])
    


    return (
        <>
            <Head>
                <title>{title ? title + ' ecommerce':'ecommerce'}</title>
                <meta name="description" content="Ecommerce website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='flex flex-col min-h-screen justify-between'>
                <header>
                    <nav className='flex h-12 justify-between shadow-md items-center px-4'>
                        <Link href='/' className='text-lg font-bold'>
                            Home
                        </Link>
                        <div>
                            <Link href='/cart' className='text-lg font-bold p-2'>
                                Cart
                                {cartItemCount > 0 && (
                                    <span className='ml-1 rounded-full bg-red-400 px-2 py-1 text-xs font-bold text-white'>
                                        { cartItemCount }
                                    </span>
                                    )}
                            </Link>
                            <Link href='/login' className='text-lg font-bold p-2'>
                                Login
                            </Link>
                        </div>
                            
                    </nav>
                </header>

                <main className='container m-auto mt-4 px-4'>
                    {children}
                </main>

                <footer className='flex justify-center items-center h-10 shadow-inner'>
                    <p className='text-sm text-gray-500'>© {new Date().getFullYear()} Ecommerce</p>
                </footer>
            </div>
        </>
    )
}
