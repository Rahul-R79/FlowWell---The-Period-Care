import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const addCategory = createAsyncThunk('/category/addCategory', async(formData, {rejectWithValue})=>{
    try{
        const response = await instance.post('admin/category/add', formData);
        return response.data.category;
    }catch(err){
        return rejectWithValue(err.response.data.errors);
    }
});

const categorySlice = createSlice({
    name: "category",
    initialState: {
        category: [],
        errorByAction: {},
        loadingByAction: {}
    },
    reducers: {
        clearCategoryErrors: (state) => {
            state.errorByAction.addCategory = null;
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(addCategory.pending, state=>{
                state.loadingByAction.addCategory = true;
                state.errorByAction.addCategory = null;
            })
            .addCase(addCategory.fulfilled, (state, action)=>{
                state.loadingByAction.addCategory = false;
                state.category.push(action.payload);
                state.errorByAction.addCategory = null;
            })
            .addCase(addCategory.rejected, (state, action)=>{
                state.loadingByAction.addCategory = false;
                state.errorByAction.addCategory = action.payload;
            })
    }
})

export const {clearCategoryErrors} = categorySlice.actions;
export default categorySlice.reducer;