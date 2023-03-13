import db from '@/utils/db'
import User from 'models/User'
import { getSession } from 'next-auth/react'
import bcrypt from 'bcryptjs'

async function handler (req, res) {

    if (req.method !== 'PUT') {
        res.status(409).send({ message: 'Method not allowed' })
        return
    }

    const session = await getSession({ req })

    if (!session) {
        res.status(401).send({ message: 'Unauthorized' })
        return
    }

    const { user } = session

    const { name, email, password } = req.body

    if (
        !name ||
        !email ||
        !password
    ) {
        res.status(422).send({ message: 'Invalid data' })
        return
    }

    await db.connect()

    const toUpdateUser = await User.findById(user._id)
    toUpdateUser.name = name
    toUpdateUser.email = email

    if (password) {
        toUpdateUser.password = bcrypt.hashSync(password)
    }

    await toUpdateUser.save()
    await db.disconnect()

    res.status(200).send({ message: 'Profile updated successfully' })
}

export default handler