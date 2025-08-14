import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const getCategory = createAsyncThunk('/category/getCategory', async({page = 1, limit = 8, search = ''}, {rejectWithValue})=>{
    try{
        const response = await instance.get(`/admin/category?page=${page}&limit=${limit}&search=${search}`);
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data);
    }
})

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
        currentPage: 1,
        totalPages: 1,
        totalCategory: 0,
        errorByAction: {},
        loadingByAction: {}
    },
    reducers: {
        clearCategoryErrors: (state) => {
            state.errorByAction.addCategory = null;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    },
    extraReducers: (builder)=>{
        builder
            //get category
            .addCase(getCategory.pending, state=>{
                state.loadingByAction.getCategory = true;
                state.errorByAction.getCategory =  null;
            })
            .addCase(getCategory.fulfilled, (state, action)=>{
                state.loadingByAction.getCategory = false;
                state.errorByAction.getCategory = null;
                state.category = action.payload.category
                state.currentPage = action.payload.currentPage;
                state.totalCategory = action.payload.totalCategory;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getCategory.rejected, (state, action)=>{
                state.loadingByAction.getCategory = false;
                state.errorByAction.getCategory = action.payload;
            })
            //add category
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
export const {setCurrentPage} = categorySlice.actions;
export default categorySlice.reducer;