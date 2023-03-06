import Layout from '@/components/Layout'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { getError } from '@/utils/error'
import { toast } from 'react-toastify'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function LoginScreen() {

    const { data: session } = useSession()
    const router = useRouter()
    const { redirect } = router.query

    useEffect(() => {
        if (session?.user) {
            router.push(redirect || '/')
        }
    }, [session, redirect, router])
            

    const { register, handleSubmit, formState: { errors } } = useForm()

    const submitHandler = async ({ email, password }) => { 
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
                });
                if (result.error) {
                    toast.error(result.error)
                }
        } catch (error) {
            toast.error(getError(error))
        }
    }


    return (
        <Layout title="Login">
            <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitHandler)}>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <h2 className="px-4 pt-3 pb-2 text-lg font-bold text-gray-900">
                        Sign in to your account
                    </h2>
                    <div className="w-full px-3 mb-2 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                            Email address
                        </label>
                        <input className="input-box"
                            id="email"
                            type="email"
                            placeholder="Email"
                            {...register('email', {
                                required: 'Please enter email',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                }
                            })} />
                        {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                    </div>
                    <div className="w-full px-3 mb-2 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="input-box"
                            id="password"
                            type="password"
                            placeholder="******************"
                            autoFocus
                            {...register('password', {
                                required: 'Please enter password',
                                minLength: { value: 6, message: 'Password should have at least 6 characters' }
                            })} />
                        {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                    </div>
                    <div className="w-full px-3 mb-2 md:mb-0">
                        <button className="primary-button">
                            Sign In
                        </button>
                    </div>
                </div>
                <div className='mb-4'>
                    Don&apos;t have an account?
                    <Link href='/register'> Register</Link>
                </div>
            </form>
        </Layout>
    )
}
