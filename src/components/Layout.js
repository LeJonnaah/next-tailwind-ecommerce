import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useContext } from 'react'
import { Store } from '@/utils/Store'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { useSession, signOut } from 'next-auth/react'
import 'react-toastify/dist/ReactToastify.css'
import { Menu } from '@headlessui/react'
import DropdownLink from './DropdownLink'
import Cookies from 'js-cookie'

export default function Layout({ title, children }) {

    const { state, dispatch } = useContext(Store);
    const { cart } = state;
    const [cartItemCount, setCartItemCount] = React.useState(0);
    const { status, data: session } = useSession();

    useEffect(() => {
        setCartItemCount(cart.cartItems.reduce((a, c) => a + Number(c.quantity), 0))
    }, [cart.cartItems])

    const logoutClickHandler = () => {
        Cookies.remove('cart');
        dispatch({ type: 'CART_RESET' });
        signOut({ callbackUrl: '/login' })
    }

    return (
        <>
            <Head>
                <title>{title ? title + ' ecommerce' : 'ecommerce'}</title>
                <meta name="description" content="Ecommerce website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ToastContainer position='bottom-center' limit={1} />

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
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {status === 'loading' ? (
                                'Loading'
                            ) : session?.user ? (
                                <Menu as="div" className="relative inline-block text-left">
                                    <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
                                        {session.user.name}
                                    </Menu.Button>
                                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <Menu.Item>
                                            <DropdownLink className='dropdown-link' href='/profile'>
                                                Profile
                                            </DropdownLink>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <DropdownLink className='dropdown-link' href='/order-history'>
                                                Order History
                                            </DropdownLink>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Link className='dropdown-link' href='#' onClick={logoutClickHandler}>
                                                Logout
                                            </Link>
                                        </Menu.Item>|
                                        {session.user.isAdmin && (
                                            <Menu.Item>
                                                <DropdownLink className='dropdown-link' href='/admin/dashboard'>
                                                    Dashboard
                                                </DropdownLink>
                                            </Menu.Item>
                                        )}
                                    </Menu.Items>
                                </Menu>

                            ) : (
                                <Link href='/login' className='text-lg font-bold p-2'>
                                    Login
                                </Link>
                            )}
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
