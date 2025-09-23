// connect mongoDB
import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        alert('mongoDB connection failed');
        process.exit(1);
    }
};
