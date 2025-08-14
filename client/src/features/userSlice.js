import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../utils/axios";


export const getAllUsers = createAsyncThunk('/users/getAllUsers', async({page = 1, limit = 10, search = ""}, {rejectWithValue})=>{
    try{
        const response = await instance.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    }catch(err){
        return rejectWithValue(err.response.data);
    }  
});

export const deleteUsers = createAsyncThunk('/users/deleteUsers', async(userId, {rejectWithValue})=>{
    try{
        const response = await instance.delete(`admin/users/${userId}`);
        return {userId, message: response.data};
    }catch(err){
        return rejectWithValue(err.response.data);
    }
});

export const blockUser = createAsyncThunk('/users/blockUser', async(userId, {rejectWithValue})=>{
    try{
        const response = await instance.put(`admin/users/block/${userId}`);
        return response.data.user
    }catch(err){
        return rejectWithValue(err.response.data);
    }
});

export const unblockUser = createAsyncThunk('/users/unblockUser', async(userId, {rejectWithValue})=>{
    try{
        const response = await instance.put(`admin/users/unblock/${userId}`);
        return response.data.user
    }catch(err){
        return rejectWithValue(err.response.data);
    }
})

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        loadingByAction: {},
        errorByAction: {},
    },
    reducers: {
        setCurrentPage: (state, action)=>{
            state.currentPage = action.payload;
        }
    }, 
    extraReducers: (builder)=>{
        builder
        //get all users
        .addCase(getAllUsers.pending, state=>{
            state.loadingByAction.getAllUsers = true;
            state.errorByAction.getAllUsers = null;
        })
        .addCase(getAllUsers.fulfilled, (state, action)=>{
            state.loadingByAction.getAllUsers = false;
            state.users = action.payload.users;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            state.totalUsers = action.payload.totalUsers;
            state.errorByAction.getAllUsers = null;
        })
        .addCase(getAllUsers.rejected, (state, action)=>{
            state.loadingByAction.getAllUsers = false;
            state.errorByAction.getAllUsers = action.payload;
        })
        //delete all users
        .addCase(deleteUsers.pending, state=>{
            state.loadingByAction.deleteUsers = true;
            state.errorByAction.deleteUsers = null;
        })
        .addCase(deleteUsers.fulfilled, (state, action)=>{
            state.loadingByAction.deleteUsers = false;
            state.errorByAction.deleteUsers = null;
            state.users = state.users.filter(user => user._id !== action.payload.userId);
        })
        .addCase(deleteUsers.rejected, (state, action)=>{
            state.loadingByAction.deleteUsers = false;
            state.errorByAction.deleteUsers = action.payload;
        })
        //block users
        .addCase(blockUser.pending, state=>{
            state.loadingByAction.blockUser = true;
            state.errorByAction.blockUser = null;
        })
        .addCase(blockUser.fulfilled, (state, action)=>{
            state.loadingByAction.blockUser = false;
            const index = state.users.findIndex(user => user._id === action.payload._id);
            if(index !== -1) state.users[index] = action.payload;
            state.errorByAction.blockUser = null;
        })
        .addCase(blockUser.rejected, (state, action)=>{
            state.loadingByAction.blockUser = false;
            state.errorByAction.blockUser = action.payload;
        })
        //unblock users
        .addCase(unblockUser.pending, state=>{
            state.loadingByAction.unblockUser = true;
            state.errorByAction.unblockUser = null;
        })
        .addCase(unblockUser.fulfilled, (state, action)=>{
            state.loadingByAction.unblockUser = false;
            const index = state.users.findIndex(user => user._id === action.payload._id);
            if(index !== -1) state.users[index] = action.payload;
            state.errorByAction.unblockUser = null;
        })
        .addCase(unblockUser.rejected, (state, action)=>{
            state.loadingByAction.unblockUser = false;
            state.errorByAction.unblockUser = action.payload;
        })
    }
})

export const {setCurrentPage} = userSlice.actions;
export default userSlice.reducer;