import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbURL = process.env.MONGODB_URL;

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

export default connectDB;
