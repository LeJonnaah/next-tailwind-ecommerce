import React, { useReducer, useEffect } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import Layout from '@/components/Layout'
import Link from 'next/link'



const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, summary: action.payload };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            state;
    }
};

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
};

function AdminDashboardScreen() {

    const [ {loading, error, summary}, dispatch ] = useReducer(reducer, {
        loading: true,
        error: '',
        summary: { salesData: [], ordersData: [] },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get('/api/admin/dashboard');
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        };
        fetchData();
    }, []);

    const data = {
        labels: summary.salesData.map((x) => x._id),
        datasets: [
            {
                label: 'Sales',
                backgroundColor: '#f8b500',
                data: summary.salesData.map((x) => x.sales),
            },
        ],
    };


    return (
        <Layout title='Dashboard'>
            <div className='grid md:grid-cols-4 md:gap-5'>
                <div>
                    <ul>
                        <li>
                            <Link href='/admin/dashboard' className='font-bold'>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href='/admin/orders'>
                                Orders
                            </Link>
                        </li>
                        <li>
                            <Link href='/admin/products'>
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link href='/admin/users'>
                                Users
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className='md:col-span-3'>
                    <h1 className='text-2xl font-bold'>Dashboard</h1>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-4'>
                                <div className="card m-5 p-5">
                                    <p className="text-3xl">${summary.ordersPrice} </p>
                                    <p>Sales</p>
                                    <Link href='/admin/orders'> View Sales </Link>
                                </div>
                                <div className="card m-5 p-5">
                                    <p className="text-3xl">{summary.ordersCount} </p>
                                    <p>Orders</p>
                                    <Link href='/admin/orders'> View Orders </Link>
                                </div>
                                <div className="card m-5 p-5">
                                    <p className="text-3xl">{summary.usersCount} </p>
                                    <p>Users</p>
                                    <Link href='/admin/users'> View Users </Link>
                                </div>
                                <div className="card m-5 p-5">
                                    <p className="text-3xl">{summary.productsCount} </p>
                                    <p>Products</p>
                                    <Link href='/admin/products'> View Products </Link>
                                </div>
                            </div>
                            <div className='card m-5 p-5'>
                                <h2 className='text-xl font-bold'>Sales Report</h2>
                                <Bar 
                                    options={{
                                        legend: { display: true, position: 'right' },
                                    }}
                                    data={data}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default AdminDashboardScreen
