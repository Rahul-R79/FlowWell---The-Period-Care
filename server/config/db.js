import mongoose from "mongoose";

export const ConnectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongoDB connected successfully');
    }catch(err){
        console.error('mongoDB connection error', err.message);
        process.exit(1);
    }
}