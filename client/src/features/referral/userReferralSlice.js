import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export const getReferralCode = createAsyncThunk(
    "/user/getReferralCode",
    async (_, { rejectWithValue }) => {
        try {
            const response = await instance.get("/user/referral");
            return response.data.referral;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const userReferralSlice = createSlice({
    name: "userReferral",
    initialState: {
        referral: null,
        errorByAction: {},
        loadingByAction: {},
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            //get referralcode
            .addCase(getReferralCode.pending, (state) => {
                state.loadingByAction.getReferralCode = true;
                state.errorByAction.getReferralCode = null;
            })
            .addCase(getReferralCode.fulfilled, (state, action) => {
                state.loadingByAction.getReferralCode = false;
                state.errorByAction.getReferralCode = null;
                state.referral = action.payload;
            })
            .addCase(getReferralCode.rejected, (state, action) => {
                state.loadingByAction.getReferralCode = false;
                state.errorByAction.getReferralCode = action.payload;
            });
    },
});

export default userReferralSlice.reducer;
