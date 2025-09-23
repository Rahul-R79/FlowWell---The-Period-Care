//admin auth slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export const adminSignin = createAsyncThunk(
    "auth/signinAdmin",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await instance.post("/auth/adminsignin", formData);
            return response.data.admin;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const getCurrentAdmin = createAsyncThunk(
    "auth/getCurrentAdmin",
    async (_, { rejectWithValue }) => {
        try {
            const response = await instance.get("/auth/adminauthme");
            return response.data.admin;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const adminLogout = createAsyncThunk(
    "auth/adminLogout",
    async (_, { rejectWithValue }) => {
        try {
            await instance.post("/auth/adminlogout");
            return true;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState: {
        admin: null,
        loadingByAction: {},
        errorByAction: {},
    },
    reducers: {
        clearErrors: (state) => {
            state.errorByAction = {};
        },
    },
    extraReducers: (builder) => {
        builder
            //admin signin
            .addCase(adminSignin.pending, (state) => {
                state.loadingByAction.adminSignin = true;
                state.errorByAction.adminSignin = null;
            })
            .addCase(adminSignin.fulfilled, (state, action) => {
                state.loadingByAction.adminSignin = false;
                state.admin = action.payload;
                state.errorByAction.adminSignin = null;
            })
            .addCase(adminSignin.rejected, (state, action) => {
                state.loadingByAction.adminSignin = false;
                state.errorByAction.adminSignin = action.payload;
            })
            //get current admin
            .addCase(getCurrentAdmin.pending, (state) => {
                state.loadingByAction.getCurrentAdmin = true;
                state.errorByAction.getCurrentAdmin = null;
            })
            .addCase(getCurrentAdmin.fulfilled, (state, action) => {
                state.loadingByAction.getCurrentAdmin = false;
                state.admin = action.payload;
                state.errorByAction.getCurrentAdmin = null;
            })
            .addCase(getCurrentAdmin.rejected, (state, action) => {
                state.loadingByAction.getCurrentAdmin = false;
                state.errorByAction.getCurrentAdmin = action.payload;
                state.admin = null;
            })
            //admin logout
            .addCase(adminLogout.pending, (state) => {
                state.loadingByAction.adminLogout = true;
                state.errorByAction.adminLogout = null;
            })
            .addCase(adminLogout.fulfilled, (state) => {
                state.loadingByAction.adminLogout = false;
                state.errorByAction.adminLogout = null;
                state.admin = null;
            })
            .addCase(adminLogout.rejected, (state, action) => {
                state.loadingByAction.adminLogout = false;
                state.errorByAction.adminLogout = action.payload;
            });
    },
});

export const { clearErrors } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
