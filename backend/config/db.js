const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Main_Blog';
        const uriSource = process.env.MONGO_URI ? 'env:MONGO_URI' : 'fallback';
        const uriType = uri.startsWith('mongodb+srv://') ? 'Atlas (mongodb+srv)' : 'MongoDB (mongodb://)';
        console.log(`Connecting to ${uriType} using ${uriSource}...`);
        await mongoose.connect(uri);
        console.log(`Connected to MongoDB (db: ${mongoose.connection.name})`);
    } catch (err) {
        console.error('Could not connect to MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
