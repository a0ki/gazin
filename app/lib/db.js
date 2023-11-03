const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

global.mongoose = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
    if (global.mongoose.conn) {
        return global.mongoose.conn;
    }

    if (!global.mongoose.promise) {
        const opts = {
            bufferCommands: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        global.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
    }
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
}

module.exports = dbConnect;