import mongoose from 'mongoose';

const connection = {};

async function dbConnect() {
    if (connection.isConnected) {
        return;
    }
    
    if (mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;
        if (connection.isConnected === 1) {
            return;
        }
        await mongoose.disconnect();

        const db = await mongoose.connect(process.env.MONGODB_URI);
        connection.isConnected = db.connections[0].readyState;
    }
}

async function dbDisconnect() {
    if (connection.isConnected) {
        await mongoose.disconnect();
        connection.isConnected = false;
    } else {
        console.log('Not connected to database');
    }
}


const db = { dbConnect, dbDisconnect };

export default db;