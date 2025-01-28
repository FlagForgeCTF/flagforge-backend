const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbURL = process.env.MONGO_URL;

if (!dbURL) {
    throw new Error('MONGO_URL is not defined in the .env file');
}

const connectDB = async () => {
    try {
        await mongoose.connect(dbURL);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
