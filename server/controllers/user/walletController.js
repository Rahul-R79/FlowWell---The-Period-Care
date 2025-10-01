import { razorpayInstance } from "../../config/razorpay.js";
import WalletTransaction from "../../models/WalletTransaction.js";
import Wallet from "../../models/Wallet.js";
import crypto from "crypto";

//add money to wallet
export const addMoneyToWallet = async (req, res) => {
    const { addAmount } = req.body;

    try {
        const amount = Number(addAmount);
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `wallet_topup_${Date.now()}`,
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            Orderamount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_API_KEY,
        });
    } catch (err) {
        res.status(500).json({ message: "internal server error" });
    }
};

//verify the wallet payment
export const verifyWalletPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        addedAmount,
    } = req.body;

    try {
        const hmac = crypto.createHmac(
            "sha256",
            process.env.RAZORPAY_API_SECRET
        );
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res
                .status(400)
                .json({ message: "wallet payment verification failed" });
        }

        let wallet = await Wallet.findOne({ userId: req.user.id });

        if (!wallet) {
            wallet = await Wallet.create({
                userId: req.user.id,
                balance: 0,
            });
        }

        const parsedAmount = Number(addedAmount);
        wallet.balance += parsedAmount;
        await wallet.save();

        await WalletTransaction.create({
            walletId: wallet._id,
            type: "credit",
            amount: parsedAmount,
            paymentMethod: "razorpay",
            transactionFor: "Wallet_topuped",
        });

        res.status(200).json({
            balance: wallet.balance,
        });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//get the total wallet amount
export const getWalletAmount = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user.id });

        if (!wallet) {
            return res.status(404).json({ message: "wallet not found" });
        }

        res.status(200).json({ balance: wallet.balance });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};

//get wallet transactions
export const getWalletTransactions = async (req, res) => {
    let { page = 1, limit = 5 } = req.query;
    try {
        const wallet = await Wallet.findOne({ userId: req.user.id });
        if (!wallet) {
            return res.status(404).json({ message: "wallet not found" });
        }

        page = parseInt(page);
        limit = parseInt(limit);

        const totalTransaction = await WalletTransaction.countDocuments({
            walletId: wallet._id,
        });
        const totalPages = Math.ceil(totalTransaction / limit);

        const walletTransaction = await WalletTransaction.find({
            walletId: wallet._id,
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            walletTransaction,
            totalTransaction,
            totalPages,
            currentPage: page,
        });
    } catch (err) {
        return res.status(500).json({ message: "internal server error" });
    }
};
