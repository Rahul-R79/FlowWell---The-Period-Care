import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const addProduct = createAsyncThunk('/products/addProduct', async(formData, {rejectWithValue})=>{
    try{
        const response = await instance.post('/admin/products/add', formData);
        return response.data.product;
    }catch(err){
        return rejectWithValue(err.response.data.errors);
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        errorByAction: {},
        loadingByAction: {},
    },
    reducers: {
        clearAddProductError: (state) => {
            state.errorByAction.addProduct = null;
        }
    },
    extraReducers: (builder)=>{
        builder
        //add products
        .addCase(addProduct.pending, state=>{
            state.loadingByAction.addProduct = true;
            state.errorByAction.addProduct = null;
        })
        .addCase(addProduct.fulfilled, (state, action)=>{
            state.loadingByAction.addProduct = false;
            state.products.push(action.payload);
            state.errorByAction.addProduct = null;
        })
        .addCase(addProduct.rejected, (state, action)=>{
            state.loadingByAction.addProduct = false;
            state.errorByAction.addProduct = action.payload;
        })
    }
})

export const {clearAddProductError} = productSlice.actions;
export default productSlice.reducer;