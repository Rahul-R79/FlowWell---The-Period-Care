import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export const getUserCoupons = createAsyncThunk(
    "/user/coupons",
    async (cartTotal, { rejectWithValue }) => {
        try {
            const response = await instance.get(
                `/user/coupon?cartTotal=${cartTotal}`
            );
            return response.data.coupons;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const applyCoupon = createAsyncThunk(
    "/user/applyCoupon",
    async ({couponCode, cartTotal}, { rejectWithValue }) => {
        try {
            const response = await instance.post(
                '/user/coupon/apply', {couponCode, cartTotal}
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const CouponSlice = createSlice({
    name: "coupon",
    initialState: {
        coupons: [],
        appliedCoupon: null,
        loadingByAction: {},
        errorByAction: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //get coupons
            .addCase(getUserCoupons.pending, (state) => {
                state.loadingByAction.getUserCoupons = true;
                state.errorByAction.getUserCoupons = null;
            })
            .addCase(getUserCoupons.fulfilled, (state, action) => {
                state.loadingByAction.getUserCoupons = false;
                state.errorByAction.getUserCoupons = null;
                state.coupons = action.payload;
            })
            .addCase(getUserCoupons.rejected, (state, action) => {
                state.loadingByAction.getUserCoupons = false;
                state.errorByAction.getUserCoupons = action.payload;
            })
            //apply coupons
            .addCase(applyCoupon.pending, (state) => {
                state.loadingByAction.applyCoupon = true;
                state.errorByAction.applyCoupon = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.loadingByAction.applyCoupon = false;
                state.errorByAction.applyCoupon = null;
                state.appliedCoupon = action.payload;
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.loadingByAction.applyCoupon = false;
                state.errorByAction.applyCoupon = action.payload;
            });
    },
});

export default CouponSlice.reducer;
