import Order from 'models/Order'
import db from '@/utils/db'
import { getSession } from 'next-auth/react'

const handler = async (req, res) => {
    const session = await getSession({ req })
    if (!session || (session && !session.user.isAdmin)) {
        return res.status(401).send('signin required');
    }

    if (req.method === 'GET') {
        await db.connect()
        const orders = await Order.find({}).populate('user', 'name')
        await db.disconnect()
        res.send(orders)
    } else {
        res.status(405).send(`Method ${req.method} not allowed`)
    }
}

export default handler