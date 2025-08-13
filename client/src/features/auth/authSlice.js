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
        const response = await instance.post('/auth/otp-verify', {email, otp});
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
   
});

export const getCurrentUser = createAsyncThunk('/auth/getCurrentUser', async(_, {rejectWithValue})=>{
    try{
        const response = await instance.get('/auth/userauthme');
        return response.data.user;
    }catch(err){
        return rejectWithValue(err.response.data.errors)
    }
})

export const logoutUser = createAsyncThunk('/auth/logoutUser', async(_, {rejectWithValue})=>{
    try{
        await instance.post('/auth/logout');
        return true;
    }catch(err){
        return rejectWithValue(err.response.data);
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loadingByAction: {},
        errorByAction: {},
        forgotPasswordEmaiVerify: false,
    },
    reducers: {
        clearErrors: (state)=>{
            state.errorByAction = {};
        }
    },
    extraReducers: builder => {
        builder
        //signUp
        .addCase(signupUser.pending, state=>{
            state.loadingByAction.signupUser = true;
            state.errorByAction.signupUser = null;
        })
        .addCase(signupUser.fulfilled, state=>{
            state.loadingByAction.signupUser = false;
            state.errorByAction.signupUser = null;
        })
        .addCase(signupUser.rejected, (state, action)=>{
            state.loadingByAction.signupUser = false;
            state.errorByAction.signupUser = action.payload;
        })
        //verifyOTp
        .addCase(verifyOTP.pending, state=>{
            state.loadingByAction.verifyOTP = true;
            state.errorByAction.verifyOTP = null;
        })
        .addCase(verifyOTP.fulfilled, state=>{
            state.loadingByAction.verifyOTP = false;
            state.errorByAction.verifyOTP = null;
        })
        .addCase(verifyOTP.rejected, (state, action)=>{
            state.loadingByAction.verifyOTP = false;
            state.errorByAction.verifyOTP = action.payload;
        })
        //resendOTP
        .addCase(resendOTP.pending, state=>{
            state.loadingByAction.resendOTP = true;
            state.errorByAction.resendOTP = null;
        })
        .addCase(resendOTP.fulfilled, state=>{
            state.loadingByAction.resendOTP = false;
            state.errorByAction.resendOTP = null;
        })
        .addCase(resendOTP.rejected, (state, action)=>{
            state.loadingByAction.resendOTP = false;
            state.errorByAction.resendOTP = action.payload;
        })
        //signIn
        .addCase(signinUser.pending, state =>{
            state.loadingByAction.signinUser = true;
            state.errorByAction.signinUser = null;
        })
        .addCase(signinUser.fulfilled, (state, action)=>{
            state.loadingByAction.signinUser = false;
            state.user = action.payload;
            state.errorByAction.signinUser = null;
        })
        .addCase(signinUser.rejected, (state, action)=>{
            state.loadingByAction.signinUser = false;
            state.errorByAction.signinUser = action.payload;
        })
        //resetpassword
        .addCase(forgotPassword.pending, state=>{
            state.loadingByAction.forgotPassword = true;
            state.errorByAction.forgotPassword = null;
        })
        .addCase(forgotPassword.fulfilled, state=>{
            state.loadingByAction.forgotPassword = false;
            state.errorByAction.forgotPassword = null;
        })
        .addCase(forgotPassword.rejected, (state, action)=>{
            state.loadingByAction.forgotPassword = false;
            state.errorByAction.forgotPassword = action.payload;
        })
        //verifyForgotOtp
        .addCase(verifyForgotOTP.pending, state=>{
            state.loadingByAction.verifyForgotOTP = true;
            state.errorByAction.verifyForgotOTP = null;
        })
        .addCase(verifyForgotOTP.fulfilled, state=>{
            state.loadingByAction.verifyForgotOTP = false;
            state.errorByAction.verifyForgotOTP = null;
            state.forgotPasswordEmaiVerify = true;
        })
        .addCase(verifyForgotOTP.rejected, (state, action)=>{
            state.loadingByAction.verifyForgotOTP = false;
            state.errorByAction.verifyForgotOTP = action.payload;
        })
        //resendFotgotOtp
        .addCase(resendForgotOTP.pending, state=>{
            state.loadingByAction.resendForgotOTP = true;
            state.errorByAction.resendForgotOTP = null;
        })
        .addCase(resendForgotOTP.fulfilled, state=>{
            state.loadingByAction.resendForgotOTP = false;
            state.errorByAction.resendForgotOTP = null;
        })
        .addCase(resendForgotOTP.rejected, (state, action)=>{
            state.loadingByAction.resendForgotOTP = false;
            state.errorByAction.resendForgotOTP = action.payload;
        })
        //resetForgotPassword
        .addCase(resetForgotPassword.pending, state=>{
            state.loadingByAction.resetForgotPassword = true;
            state.errorByAction.resetForgotPassword = null;
        })
        .addCase(resetForgotPassword.fulfilled, state=>{
            state.loadingByAction.resetForgotPassword = false;
            state.errorByAction.resetForgotPassword = null;
            state.forgotPasswordEmaiVerify = false;
        })
        .addCase(resetForgotPassword.rejected, (state, action)=>{
            state.loadingByAction.resetForgotPassword = false;
            state.errorByAction.resetForgotPassword = action.payload;
        })
        //getcurrentuser
        .addCase(getCurrentUser.pending, state=>{
            state.loadingByAction.getCurrentUser = true;
            state.errorByAction.getCurrentUser = null;
        })
        .addCase(getCurrentUser.fulfilled, (state, action)=>{
            state.loadingByAction.getCurrentUser = false;
            state.user = action.payload;
            state.errorByAction.getCurrentUser = null;
        })
        .addCase(getCurrentUser.rejected, (state, action)=>{
            state.loadingByAction.getCurrentUser = false;
            state.errorByAction.getCurrentUser = action.payload;
            state.user = null;
        })
        //logout user
        .addCase(logoutUser.pending, state=>{
            state.loadingByAction.logoutUser = true;
            state.errorByAction.logoutUser = null;
        })
        .addCase(logoutUser.fulfilled, state=>{
            state.loadingByAction.logoutUser = false;
            state.errorByAction.logoutUser = null;
            state.user = null;
            state.forgotPasswordEmaiVerify = false;
        })
        .addCase(logoutUser.rejected, (state, action)=>{
            state.loadingByAction.logoutUser = false;
            state.errorByAction.logoutUser = action.payload
        })
    }
})

export const {clearErrors} = authSlice.actions;
export default authSlice.reducer;