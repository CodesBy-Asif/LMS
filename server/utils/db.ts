import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI).then((data:any) => {
            console.log(`MongoDB connected with server: ${data.connection.host}`);
        });
    } catch (error: any) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
