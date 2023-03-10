import Layout from '@/components/Layout'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { getError } from '@/utils/error'
import { toast } from 'react-toastify'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function LoginScreen() {

    const { data: session } = useSession()
    const router = useRouter()
    const { redirect } = router.query

    useEffect(() => {
        if (session?.user) {
            router.push(redirect || '/')
        }
    }, [session, redirect, router])
            

    const { register, handleSubmit, getValues, formState: { errors } } = useForm()

    const submitHandler = async ({ name, email, password }) => { 
        try {

            await axios.post('/api/auth/signup', {
                name,
                email,
                password,
            });

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
        <Layout title="Create Account">
            <form className="mx-auto max-w-screen-md" onSubmit={handleSubmit(submitHandler)}>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <h2 className="px-4 pt-3 pb-2 text-lg font-bold text-gray-900">
                        Create an account
                    </h2>
                    <div className="w-full px-3 mb-2 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input className="input-box"
                            id="name"
                            type="text"
                            placeholder="Name"
                            autoFocus
                            {...register('name', {
                                required: 'Please enter name',
                                minLength: { value: 2, message: 'Name should have at least 2 characters' }
                            })} />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                    </div>
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
                        < div className="w-full px-3 mb-2 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input className="input-box"
                                id="confirmPassword"
                                type="password"
                                placeholder="******************"
                                autoFocus
                                {...register('confirmPassword', {
                                    required: 'Please enter confirm password',
                                    validate: value => value === getValues('password'),
                                    minLength: { value: 6, message: 'Password should have at least 6 characters' }
                                })} />
                            {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword.message}</p>}
                        </div>
                    <div className="w-full px-3 mb-2 md:mb-0">
                        <button className="primary-button">
                            Register
                        </button>
                    </div>
                </div>
                <p className="text-left">
                    Already have an account?{' '}
                    <Link href={`/login?redirect=${redirect || '/'}`}>
                        Login
                    </Link>
                </p>
            </form>
        </Layout>
    )
}
