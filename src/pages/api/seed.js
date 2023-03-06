import db from '../../utils/db';
import data from '../../utils/data';
import User from 'models/User';

const handler = async (req, res) => {

    const { dbConnect, dbDisconnect } = db;
    await dbConnect();
    await User.deleteMany();
    await User.insertMany(data.users);
    await dbDisconnect();
    res.send({ message: 'Seed was executed successfully' });
}

export default handler;