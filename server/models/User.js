import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: function() { return !this.googleId; },
        trim: true,
    },
    phone: {
        type: String
    },
    googleId: { 
        type: String, 
        sparse: true
    },
    avatar: {
        type: String 
    },
    isBlocked: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

export default mongoose.model('User', userSchema);