import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();  // Ensure environment variables are loaded

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://george97dj:mUNtNcFWVIC5G410@cluster0.ky11r.mongodb.net/sale_db", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectDB;
