import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const addToCart = createAsyncThunk('/cart/addToCart', async({productId, quantity, selectedSize}, {rejectWithValue})=>{
    try{
        const response = await instance.post('/user/cart/add', {productId, quantity, selectedSize});
        return response.data.cart;
    }catch(err){
        return rejectWithValue(err.response.data);
    }
});

export const getCart = createAsyncThunk('/cart/getCart', async(_, {rejectWithValue})=>{
    try{
        const response = await instance.get('/user/cart');
        return response.data.cart;
    }catch(err){
        return rejectWithValue(err.response.data);
    }
});

export const removeFromCart = createAsyncThunk('/cart/removeFromCart', async({productId, selectedSize}, {rejectWithValue})=>{
    try{
        const response = await instance.delete(`/user/cart/${productId}/${selectedSize}`);
        return response.data.cart;
    }catch(err){
        return rejectWithValue(err.response.data);
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: {},
        loadingByAction: {},
        errorByAction: {},
    },
    reducers: {},
    extraReducers: (builder)=>{
        builder
        //add to cart
        .addCase(addToCart.pending, state=>{
            state.loadingByAction.addToCart = true;
            state.errorByAction.addToCart = null;
        })
        .addCase(addToCart.fulfilled, (state, action)=>{
            state.loadingByAction.addToCart = false;
            state.errorByAction.addToCart = null;
            state.cart = action.payload;
        })
        .addCase(addToCart.rejected, (state, action)=>{
            state.loadingByAction.addToCart = false;
            state.errorByAction.addToCart = action.payload;
        })

        //get cart
        .addCase(getCart.pending, state=>{
            state.loadingByAction.getCart = true;
            state.errorByAction.getCart = null;
        })
        .addCase(getCart.fulfilled, (state, action)=>{
            state.loadingByAction.getCart = false;
            state.errorByAction.getCart = null;
            state.cart = action.payload;
        })
        .addCase(getCart.rejected, (state, action)=>{
            state.loadingByAction.getCart = false;
            state.errorByAction.getCart = action.payload;
        })

        //remove from cart
        .addCase(removeFromCart.pending, state=>{
            state.loadingByAction.removeFromCart = true;
            state.errorByAction.removeFromCart = null;
        })
        .addCase(removeFromCart.fulfilled, (state, action)=>{
            state.loadingByAction.removeFromCart = false;
            state.errorByAction.removeFromCart = null;
            state.cart = action.payload;
        })
        .addCase(removeFromCart.rejected, (state, action)=>{
            state.loadingByAction.removeFromCart = false;
            state.errorByAction.removeFromCart = action.payload;
        })
    }
})

export default cartSlice.reducer;