// connect mongoDB
import logger from "./logger.js";
import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        logger.error('mongo connection failed' + err);
        process.exit(1);
    }
};
