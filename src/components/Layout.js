import React, { useState } from 'react'
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
import { useRouter } from 'next/router'


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

    const [query, setQuery] = useState('');

    const router = useRouter();
    const submitHandler = (e) => {
        e.preventDefault();
        router.push(`/search?query=${query}`);
    };

    return (
        <>
            <Head>
                <title>{title ? title + ' ecommerce' : 'ecommerce'}</title>
                <meta name="description" content="Ecommerce website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ToastContainer position='bottom-center' limit={1} />

            <div className="flex min-h-screen flex-col justify-between ">
                <header>
                    <nav className="flex h-12 items-center px-4 justify-between shadow-md">
                        <Link href="/" className="text-lg font-bold">ecommerce</Link>
                        <form
                            onSubmit={submitHandler}
                            className="mx-auto  hidden w-full justify-center md:flex"
                        >
                            <input
                                onChange={(e) => setQuery(e.target.value)}
                                type="text"
                                className="rounded-tr-none rounded-br-none p-1 text-sm   focus:ring-0"
                                placeholder="Search products"
                            />
                            <button
                                className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
                                type="submit"
                                id="button-addon2"
                            >
                            </button>
                        </form>
                        <div>
                            <Link href="/cart" className="p-2">
                                Cart
                                {cartItemCount > 0 && (
                                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {status === 'loading' ? (
                                'Loading'
                            ) : session?.user ? (
                                <Menu as="div" className="relative inline-block">
                                    <Menu.Button className="text-blue-600">
                                        {session.user.name}
                                    </Menu.Button>
                                    <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                                        <Menu.Item>
                                            <DropdownLink className="dropdown-link" href="/profile">
                                                Profile
                                            </DropdownLink>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <DropdownLink
                                                className="dropdown-link"
                                                href="/order-history"
                                            >
                                                Order History
                                            </DropdownLink>
                                        </Menu.Item>
                                        {session.user.isAdmin && (
                                            <Menu.Item>
                                                <DropdownLink
                                                    className="dropdown-link"
                                                    href="/admin/dashboard"
                                                >
                                                    Admin Dashboard
                                                </DropdownLink>
                                            </Menu.Item>
                                        )}
                                        <Menu.Item>
                                            <a
                                                className="dropdown-link"
                                                href="#"
                                                onClick={logoutClickHandler}
                                            >
                                                Logout
                                            </a>
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            ) : (
                                <Link href="/login" className="p-2">Login</Link>
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
