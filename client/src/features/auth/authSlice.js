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

export const resendOTP = createAsyncThunk('auth/resendOTP', async({email}, {rejectWithValue})=>{
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
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async({email}, {rejectWithValue})=>{
    try{
        const response = await instance.post('auth/forgot-password', {email});
        return response.data;
    }catch(err){
        return rejectWithValue(err.response.data.errors);
    };
});

export const verifyForgotOTP = createAsyncThunk('auth/verifyForgotOtp', async({email, otp}, {rejectWithValue})=>{
    try{
        const response = await instance.post('auth/forgot-verify', {email, otp});
        return response.data;
    }catch(err){
        return rejectWithValue(err.response.data.errors);
    };
});

export const resendForgotOTP = createAsyncThunk('auth/resendForgotOTP', async({email}, {rejectWithValue})=>{
    try{
        const response = await instance.post('auth/forgot-resend', {email});
        return response.data
    }catch(err){
        return rejectWithValue(err.response.data.errors);
    }
});

export const resetForgotPassword = createAsyncThunk('auth/resetForgotPassword', async({email, formData}, {rejectWithValue})=>{
    try{
        const response = await instance.post('auth/reset-forgot-password', {email, ...formData});
        return response.data;
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
        .addCase(signupUser.fulfilled, state=>{
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
        //resetpassword
        .addCase(forgotPassword.pending, state=>{
            state.loading = true;
            state.errorByAction.forgotPassword = null;
        })
        .addCase(forgotPassword.fulfilled, state=>{
            state.loading = false;
            state.errorByAction.forgotPassword = null;
        })
        .addCase(forgotPassword.rejected, (state, action)=>{
            state.loading = false;
            state.errorByAction.forgotPassword = action.payload;
        })
        //verifyForgotOtp
        .addCase(verifyForgotOTP.pending, state=>{
            state.loading = true;
            state.errorByAction.verifyForgotOTP = null;
        })
        .addCase(verifyForgotOTP.fulfilled, state=>{
            state.loading = false;
            state.errorByAction.verifyForgotOTP = null;
        })
        .addCase(verifyForgotOTP.rejected, (state, action)=>{
            state.loading = false;
            state.errorByAction.verifyForgotOTP = action.payload;
        })
        //resendFotgotOtp
        .addCase(resendForgotOTP.pending, state=>{
            state.loading = true;
            state.errorByAction.resendForgotOTP = null;
        })
        .addCase(resendForgotOTP.fulfilled, state=>{
            state.loading = false;
            state.errorByAction.resendForgotOTP = null;
        })
        .addCase(resendForgotOTP.rejected, (state, action)=>{
            state.loading = false;
            state.errorByAction.resendForgotOTP = action.payload;
        })
        //resetForgotPassword
        .addCase(resetForgotPassword.pending, state=>{
            state.loading = true;
            state.errorByAction.resetForgotPassword = null;
        })
        .addCase(resetForgotPassword.fulfilled, state=>{
            state.loading = false;
            state.errorByAction.resetForgotPassword = null;
        })
        .addCase(resetForgotPassword.rejected, (state, action)=>{
            state.loading = false;
            state.errorByAction.resetForgotPassword = action.payload;
        })
    }
})

export default authSlice.reducer;