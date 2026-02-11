const mongoose = require('mongoose');

const db = process.env.MONGO_URL; // Make sure this matches your .env variable name

if (!db) {
    console.error('MongoDB connection string is missing. Please check your .env file');
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = { connectDB };