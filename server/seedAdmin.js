import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        await Admin.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword
        });

        mongoose.connection.close();
    }catch(err){
        console.log('Error creating admin', err);
        mongoose.connection.close();
        process.exit(1);
    }
}

createAdmin();