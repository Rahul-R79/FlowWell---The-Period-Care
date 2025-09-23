//wallet history schema
import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    type: { 
        type: String, 
        enum: ["credit", "debit"], 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    paymentMethod: {
        type: String,
        enum: ["razorpay", "gpay", "card", "wallet"],
        required: true,
    },
    transactionFor: {   
        type: String,
        enum: ["Wallet_topuped", "Refund Completed", "Product Purchased"],
        required: true
    },
}, {timestamps: true});

export default mongoose.model('WalletTransaction', walletTransactionSchema);