import bcrypt from 'bcryptjs';

const data = {

    users: [
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true,
        },
        {
            name: 'John Doe',
            email: 'user@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: false,
        },
    ],

    products: [
        {
            name: 'Nike Slim Shirt',
            slug: 'nike-slim-shirt',
            category: 'Shirts',
            image: '/images/shirt1.jpg',
            price: 120,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 10,
            countInStock: 6,
            description: 'high quality product'
        },
        {
            name: 'Adidas Fit Shirt',
            slug: 'adidas-fit-shirt',
            category: 'Shirts',
            image: '/images/shirt2.jpg',
            price: 100,
            brand: 'Adidas',
            rating: 4.0,
            numReviews: 10,
            countInStock: 6,
            description: 'high quality product'
        },
        {
            name: 'Lacoste Free Shirt',
            slug: 'lacoste-free-shirt',
            category: 'Shirts',
            image: '/images/shirt3.jpg',
            price: 220,
            brand: 'Lacoste',
            rating: 4.8,
            numReviews: 17,
            countInStock: 6,
            description: 'high quality product'
        }
    ]
}

export default data;