import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const addToWishlist = createAsyncThunk('/wishlist/addToWishlist', async({productId, selectedSize}, {rejectWithValue})=>{
    try{
        const response = await instance.post('/user/wishlist/add', {productId, selectedSize});
        return response.data.wishlist;
    }catch(err){
        return rejectWithValue(err.response.data);
    }
});

export const getWishlist = createAsyncThunk('/wishlist/getWishlist', async({page = 1, limit = 3}, {rejectWithValue})=>{
    try{
        const response = await instance.get(`/user/wishlist?page=${page}&limit=${limit}`);
        return response.data;
    }catch(err){
        return rejectWithValue(err.response.data);
    }
});

export const removeFromWishlist = createAsyncThunk('/wishlist/removeFromWishlist', async({productId, page = 1, limit = 3}, {rejectWithValue})=>{
    try{
        const response = await instance.delete(`/user/wishlist/${productId}?page=${page}&limit=${limit}`);
        return response.data;
    }catch(err){
        return rejectWithValue(err.response.data);
    }
})

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        wishlist: {},
        loadingByAction: {},
        errorByAction: {},
        currentPage: 1,
        totalPages: 1,
        totalWishlist: 0
    },
    reducers: {},
    extraReducers: (builder)=>{
        builder
        //add to wishlist
        .addCase(addToWishlist.pending, state=>{
            state.loadingByAction.addToWishlist = true;
            state.errorByAction.addToWishlist = null;
        })
        .addCase(addToWishlist.fulfilled, (state, action)=>{
            state.loadingByAction.addToWishlist = false;
            state.errorByAction.addToWishlist = null;
            state.wishlist = action.payload;
            state.totalWishlist = action.payload.totalWishlist;
        })
        .addCase(addToWishlist.rejected, (state, action)=>{
            state.loadingByAction.addToWishlist = false;
            state.errorByAction.addToWishlist = action.payload;
        })

        //get wishlist 
        .addCase(getWishlist.pending, state=>{
            state.loadingByAction.getWishlist = true;
            state.errorByAction.getWishlist = null;
        })
        .addCase(getWishlist.fulfilled, (state, action)=>{
            state.loadingByAction.getWishlist = false;
            state.errorByAction.getWishlist = null;
            state.wishlist = action.payload.wishlist;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalWishlist = action.payload.totalWishlist;
        })
        .addCase(getWishlist.rejected, (state, action)=>{
            state.loadingByAction.getWishlist = false;
            state.errorByAction.getWishlist = action.payload;
        })

        //delete from wishlist
        .addCase(removeFromWishlist.pending, state=>{
            state.loadingByAction.removeFromWishlist = true;
            state.errorByAction.removeFromWishlist = null;
        })
        .addCase(removeFromWishlist.fulfilled, (state, action)=>{
            state.loadingByAction.removeFromWishlist = false;
            state.errorByAction.removeFromWishlist = null;
            state.wishlist = action.payload.wishlist;
            state.totalWishlist = action.payload.totalWishlist;
        })
        .addCase(removeFromWishlist.rejected, (state, action)=>{
            state.loadingByAction.removeFromWishlist = false;
            state.errorByAction.removeFromWishlist = action.payload;
        })
    }
})

export default wishlistSlice.reducer;