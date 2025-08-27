import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const createOrder = createAsyncThunk('/order/createOrder', async({paymentMethod, shippingAddressId}, {rejectWithValue})=>{
    try{
        const response = await instance.post('/user/payment', {paymentMethod, shippingAddressId});
        return response.data.order;
    }catch(err){
        return rejectWithValue(err.response.data);
    }
});

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        order: null,
        loadingByAction: {},
        errorByAction: {},
    },
    reducers: {},
    extraReducers: (builder)=>{
        builder
        //create order
        .addCase(createOrder.pending, state=>{
            state.loadingByAction.createOrder = true;
            state.errorByAction.createOrder = null;
        })
        .addCase(createOrder.fulfilled, (state, action)=>{
            state.loadingByAction.createOrder = false;
            state.errorByAction.createOrder = null;
            state.order = action.payload;
        })
        .addCase(createOrder.rejected, (state, action)=>{
            state.loadingByAction.createOrder = false;
            state.errorByAction.createOrder = action.payload;
        })
    }
})

export default orderSlice.reducer;