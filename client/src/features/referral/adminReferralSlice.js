//admin referral slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export const getAllReferrals = createAsyncThunk(
    "/admin/getAllReferrals",
    async (_, { rejectWithValue }) => {
        try {
            const response = await instance.get("/admin/referrals");
            return response.data.referrals;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const adminReferralSlice = createSlice({
    name: "adminReferral",
    initialState: {
        referrals: [],
        errorByAction: {},
        loadingByAction: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get all referrals
            .addCase(getAllReferrals.pending, (state) => {
                state.loadingByAction.getAllReferrals = true;
                state.errorByAction.getAllReferrals = null;
            })
            .addCase(getAllReferrals.fulfilled, (state, action) => {
                state.loadingByAction.getAllReferrals = false;
                state.errorByAction.getAllReferrals = null;
                state.referrals = action.payload;
            })
            .addCase(getAllReferrals.rejected, (state, action) => {
                state.loadingByAction.getAllReferrals = false;
                state.errorByAction.getAllReferrals = action.payload;
            });
    },
});

export default adminReferralSlice.reducer;
