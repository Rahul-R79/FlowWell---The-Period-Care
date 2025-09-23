//user wallet slice
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const addMoneyToWallet = createAsyncThunk('/user/addMoneyToWallet', async({addAmount}, {rejectWithValue})=>{
    try{
        const response = await instance.post('/user/wallet/add', {addAmount});
        return response.data;
    }catch(err){
        return rejectWithValue(err.response.data);
    }
});

export const verifyWalletPayment = createAsyncThunk('/user/wallet/verifyWalletPayment', async({userId, razorpay_order_id, razorpay_payment_id, razorpay_signature, addedAmount}, {rejectWithValue})=>{
    try{
        const response = await instance.post('/user/wallet/add/verify', {userId, razorpay_order_id, razorpay_payment_id, razorpay_signature, addedAmount});
        return response.data.balance;
    }catch(err){
        return rejectWithValue(err.response.data);
    }
});

export const getWalletAmount = createAsyncThunk('/user/getWalletAmount', async(_, {rejectWithValue})=>{
    try{
        const response = await instance.get('/user/wallet');
        return response.data.balance;
    }catch(err){
        return rejectWithValue(err.response.data);
    }
});

export const getWalletTransactions = createAsyncThunk('/user/getWalletTransactions', async({page = 1, limit = 5}, {rejectWithValue})=>{
    try{
        const response = await instance.get(`/user/wallet/transaction?page=${page}&limit=${limit}`);
        return response.data;
    }catch(err){
        return rejectWithValue(err.response.data);
    }
});

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        balance: 0,
        transactions: [],
        orderId: null,
        loadingByAction: {},
        errorByAction: {},
        currentPage : 1,
        totalPages : 1,
        totalTransaction: 0
    },
    reducers: {},
    extraReducers: (builder)=>{
        builder
        //add to wallet
        .addCase(addMoneyToWallet.pending, state=>{
            state.loadingByAction.addMoneyToWallet = true;
            state.errorByAction.addMoneyToWallet = null;
        })
        .addCase(addMoneyToWallet.fulfilled, (state, action)=>{
            state.loadingByAction.addMoneyToWallet = false;
            state.errorByAction.addMoneyToWallet = null;
            state.orderId = action.payload.orderId;
        })
        .addCase(addMoneyToWallet.rejected, (state, action)=>{
            state.loadingByAction.addMoneyToWallet = false;
            state.errorByAction.addMoneyToWallet = action.payload;
        })

        //verify transaction
        .addCase(verifyWalletPayment.pending, state=>{
            state.loadingByAction.verifyWalletPayment = true;
            state.errorByAction.verifyWalletPayment = null;
        })
        .addCase(verifyWalletPayment.fulfilled, (state, action)=>{
            state.loadingByAction.verifyWalletPayment = false;
            state.errorByAction.verifyWalletPayment = null;
            state.balance = action.payload;
        })
        .addCase(verifyWalletPayment.rejected, (state, action)=>{
            state.loadingByAction.verifyWalletPayment = false;
            state.errorByAction.verifyWalletPayment = action.payload;
        })

        //get wallet amount
        .addCase(getWalletAmount.pending, state=>{
            state.loadingByAction.getWalletAmount = true;
            state.errorByAction.getWalletAmount = null;
        })
        .addCase(getWalletAmount.fulfilled, (state, action)=>{
            state.loadingByAction.getWalletAmount = false;
            state.errorByAction.getWalletAmount = null;
            state.balance = action.payload;
        })
        .addCase(getWalletAmount.rejected, (state, action)=>{
            state.loadingByAction.getWalletAmount = false;
            state.errorByAction.getWalletAmount = action.payload;
        })

        //get wallet transatcions
        .addCase(getWalletTransactions.pending, state=>{
            state.loadingByAction.getWalletTransactions = true;
            state.errorByAction.getWalletTransactions = null;
        })
        .addCase(getWalletTransactions.fulfilled, (state, action)=>{
            state.loadingByAction.getWalletTransactions = false;
            state.errorByAction.getWalletTransactions = null;
            state.transactions = action.payload.walletTransaction;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalTransaction = action.payload.totalTransaction;
        })
        .addCase(getWalletTransactions.rejected, (state, action)=>{
            state.loadingByAction.getWalletTransactions = false;
            state.errorByAction.getWalletTransactions = action.payload;
        })
    }
})

export default walletSlice.reducer;