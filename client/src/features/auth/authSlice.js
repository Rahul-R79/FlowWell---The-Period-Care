import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import instance from "../../utils/axios"

export const signupUser = createAsyncThunk('auth/signupUser', async(formData, {rejectWithValue})=>{
    try{
        const response = await instance.post('/auth/signup', formData);
        return response.data;
    }catch(err){
        return rejectWithValue(err.response.data.errors);
    }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async({email, otp}, {rejectWithValue})=>{
    try{
        const response = await instance.post('auth/otp-verify', {email, otp});
        return response.data.user
    }catch(err){
        return rejectWithValue(err.response.data.errors);
    }
});

export const resendOTP = createAsyncThunk('auth/resendOTP', async(email, {rejectWithValue})=>{
    try{
        const response = await instance.post('/auth/otp-resend', {email});
        return response.data;
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
            state.errorByAction.signupUser = null;
        })
        .addCase(signupUser.rejected, (state, action)=>{
            state.loading = false;
            state.errorByAction.signupUser = action.payload;
        })
        //verifyOTp
        .addCase(verifyOTP.pending, state=>{
            state.loading = true;
            state.errorByAction.verifyOTP = null;
        })
        .addCase(verifyOTP.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload;
            state.errorByAction.verifyOTP = null;
        })
        .addCase(verifyOTP.rejected, (state, action)=>{
            state.loading = false;
            state.errorByAction.verifyOTP = action.payload;
        })
        //resendOTP
        .addCase(resendOTP.pending, state=>{
            state.loading = true;
            state.errorByAction.resendOTP = null;
        })
        .addCase(resendOTP.fulfilled, state=>{
            state.loading = false;
            state.errorByAction.resendOTP = null;
        })
        .addCase(resendOTP.rejected, (state, action)=>{
            state.loading = false;
            state.errorByAction.resendOTP = action.payload;
        })
        //signIn
        .addCase(signinUser.pending, state =>{
            state.loading = true;
            state.errorByAction.signinUser = null;
        })
        .addCase(signinUser.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload;
            state.errorByAction.signinUser = null;
        })
        .addCase(signinUser.rejected, (state, action)=>{
            state.loading = false;
            state.errorByAction.signinUser = action.payload;
        })
    }
})

export default authSlice.reducer;