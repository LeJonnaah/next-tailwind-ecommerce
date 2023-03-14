import React, { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { getError } from '@/utils/error'
import axios from 'axios'
import Layout from '@/components/Layout'

export default function ProfileScreen() {

    const { data: session } = useSession()

    const {
        handleSubmit,
        register,
        getValues,
        setValue,
        formState: { errors },
    } = useForm()


    useEffect(() => {
        setValue('name', session.user.name)
        setValue('email', session.user.email)
    }, [session.user, setValue])

    const submitHandler = async ({ name, email, password }) => {
        try {
            await axios.put('/api/auth/profile', {
                name,
                email,
                password,
            });

            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            toast.success('Profile updated successfully')

            if (result.error) {
                toast.error(getError(result.error))
            }

        } catch (error) {
            toast.error(getError(error))
        }
    }

    return (
        <Layout title='Profile'>
            <form
                className='w-full max-w-lg'
                onSubmit={handleSubmit(submitHandler)}
            >
                <h1 className='text-2xl font-medium mb-5'>User Profile</h1>
                <div className='mb-4'>
                    <label
                        htmlFor='name'
                        className='block text-sm font-medium text-gray-700'
                    >
                        Name
                    </label>
                    <input
                        type='text'
                        id='name'
                        placeholder='Enter name'
                        className='mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                        {...register('name', {
                            required: 'Name is required',
                        })}
                    />
                    {errors.name && (
                        <p className='text-xs text-red-500'>{errors.name.message}</p>
                    )}
                </div>
                <div className='mb-4'>
                    <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-700'
                    >
                        Email address
                    </label>
                    <input
                        type='email'
                        id='email'
                        placeholder='Enter email'
                        className='mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                        {...register('email', {
                            required: 'Email is required',
                        })}
                    />
                    {errors.email && (
                        <p className='text-xs text-red-500'>{errors.email.message}</p>
                    )}
                </div>
                <div className='mb-4'>
                    <label
                        htmlFor='password'
                        className='block text-sm font-medium text-gray-700'
                    >
                        Password
                    </label>
                    <input
                        type='password'
                        id='password'
                        placeholder='Enter password'
                        className='mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                        {...register('password')}
                    />
                    {errors.password && (
                        <p className='text-xs text-red-500'>{errors.password.message}</p>
                    )}
                </div>
                <div className='mb-4'>
                    <label
                        htmlFor='confirmPassword'
                        className='block text-sm font-medium text-gray-700'
                    >
                        Confirm Password
                    </label>
                    <input
                        type='password'
                        id='confirmPassword'
                        placeholder='Confirm password'
                        className='mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                        {...register('confirmPassword', {
                            validate: (value) =>
                                value === getValues('password') || 'Passwords do not match',
                        })}
                    />
                    {errors.confirmPassword && (
                        <p className='text-xs text-red-500'>
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>
                <button
                    type='submit'
                    className='primary-button'
                >
                    Update
                </button>
            </form>
        </Layout>
    )
}

ProfileScreen.auth = true;