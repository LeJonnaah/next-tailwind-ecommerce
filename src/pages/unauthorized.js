import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import React from 'react'

export default function Unauthorized() {

    const router = useRouter()
    const { message } = router.query

    return (
        <Layout title="Unauthorized page">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-5">Unauthorized page</h1>
                {message && <h2 className="text-2xl font-bold mb-5">{message}</h2>}
            </div>
        </Layout>
    )
}