import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async (retries = 5, delay = 5000) => {
    while (retries > 0) {
        try {
            const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
                dbName: DB_NAME,
                maxPoolSize: 100,
                minPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
            return connectionInstance;
        } catch (error) {
            console.error(`MONGODB connection FAILED (${retries} retries left): `, error.message);
            retries -= 1;
            if (retries === 0) {
                console.error("FATAL: Could not connect to MongoDB after multiple attempts.");
                process.exit(1);
            }
            await new Promise((res) => setTimeout(res, delay));
        }
    }
}

export default connectDB;
