//referral schema
import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true
    },
    generatedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    usages: [{
        usedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        usedAt: {
            type: Date,
            default: Date.now
        }
    }], 
    isClaimed: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

export default mongoose.model('Referral', referralSchema);