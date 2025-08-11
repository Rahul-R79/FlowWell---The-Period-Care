import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowerCase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true});

export default mongoose.model('Admin', adminSchema);