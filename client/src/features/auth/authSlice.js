import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import instance from "../../utils/axios"

export const signupUser = createAsyncThunk('auth/signupUser', async(formData, {rejectWithValue})=>{
    try{
        const response = await instance.post('/auth/signup', formData);
        return response.data.user;
    }catch(err){
        return rejectWithValue(err.response.data.errors);
    }
});
export const signinUser = createAsyncThunk('auth/signinUser', async(formData, {rejectWithValue})=>{
    try{
        const response = await instance.post('/auth/signin', formData);
        return response.data.user;
    }catch(err){
        return rejectWithValue(err.response.data.errors);
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        errorByAction: {}
    },
    reducers: {},
    extraReducers: builder => {
        builder
        //signUp
        .addCase(signupUser.pending, state=>{
            state.loading = true;
            state.errorByAction.signupUser = null;
        })
        .addCase(signupUser.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(signupUser.rejected, (state, action)=>{
            state.loading = false;
            state.errorByAction.signupUser = action.payload;
        })

        //signIn
        .addCase(signinUser.pending, state =>{
            state.loading = true;
            state.errorByAction.signinUser = null;
        })
        .addCase(signinUser.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(signinUser.rejected, (state, action)=>{
            state.loading = false;
            state.errorByAction.signinUser = action.payload;
        })
    }
})

export default authSlice.reducer;