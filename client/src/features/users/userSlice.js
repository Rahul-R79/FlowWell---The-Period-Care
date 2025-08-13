import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";


export const getAllUsers = createAsyncThunk('/users/getAllUsers', async(_, {rejectWithValue})=>{
    try{
        const response = await instance.get('/admin/users');
        return response.data;
    }catch(err){
        return rejectWithValue(err.response.data);
    }  
});

export const deleteUsers = createAsyncThunk('/users/deleteUsers', async(userId, {rejectWithValue})=>{
    try{
        const response = await instance.delete(`admin/users/${userId}`);
        return {userId, message: response.data}
    }catch(err){
        return rejectWithValue(err.response.data);
    }
})

const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loadingByAction: {},
        errorByAction: {},
    },
    reducers: {}, 
    extraReducers: (builder)=>{
        builder
        //get all users
        .addCase(getAllUsers.pending, state=>{
            state.loadingByAction.getAllUsers = true;
            state.errorByAction.getAllUsers = null;
        })
        .addCase(getAllUsers.fulfilled, (state, action)=>{
            state.loadingByAction.getAllUsers = false;
            state.users = action.payload;
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
    }
})

export default userSlice.reducer;