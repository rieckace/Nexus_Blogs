const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Main_Blog';
        await mongoose.connect(uri);
        console.log(`Connected to MongoDB (db: ${mongoose.connection.name})`);
    } catch (err) {
        console.error('Could not connect to MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
