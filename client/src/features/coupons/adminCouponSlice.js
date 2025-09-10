import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export const adminCreateCoupon = createAsyncThunk(
    "adminCoupons/createCoupon",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await instance.post("admin/coupon/add", formData);
            return response.data.coupon;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const getCoupons = createAsyncThunk(
    "/admin/coupons",
    async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
        try {
            const response = await instance.get(
                `/admin/coupon?page=${page}&limit=${limit}&search=${search}`
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getSingleCoupon = createAsyncThunk(
    "/admin/getSingleCoupon",
    async (id, { rejectWithValue }) => {
        try {
            const response = await instance.get(`/admin/coupon/${id}`);
            return response.data.coupon;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const editCoupon = createAsyncThunk(
    "/admin/editCoupon",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await instance.patch(
                `/admin/coupon/${id}`,
                formData
            );
            return response.data.coupon;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const changeCouponStatus = createAsyncThunk(
    "/admin/changeStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await instance.patch(`admin/coupon/status/${id}`);
            return response.data.coupon;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const adminCouponSlice = createSlice({
    name: "adminCoupon",
    initialState: {
        coupons: [],
        currentCoupon: null,
        loadingByAction: {},
        errorByAction: {},
        currentPage: 1,
        totalPages: 1,
        totalCoupons: 0,
    },
    reducers: {
        clearCouponErrors: (state) => {
            state.errorByAction = {};
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            //add coupons
            .addCase(adminCreateCoupon.pending, (state) => {
                state.loadingByAction.adminCreateCoupon = true;
                state.errorByAction.adminCreateCoupon = null;
            })
            .addCase(adminCreateCoupon.fulfilled, (state, action) => {
                state.loadingByAction.adminCreateCoupon = false;
                state.errorByAction.adminCreateCoupon = null;
                state.coupons.push(action.payload);
            })
            .addCase(adminCreateCoupon.rejected, (state, action) => {
                state.loadingByAction.adminCreateCoupon = false;
                state.errorByAction.adminCreateCoupon = action.payload;
            })
            //get coupons
            .addCase(getCoupons.pending, (state) => {
                state.loadingByAction.getCoupons = true;
                state.errorByAction.getCoupons = null;
            })
            .addCase(getCoupons.fulfilled, (state, action) => {
                state.loadingByAction.getCoupons = false;
                state.errorByAction.getCoupons = null;
                state.coupons = action.payload.coupons;
                state.currentPage = action.payload.currentPage;
                state.totalCoupons = action.payload.totalCoupons;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getCoupons.rejected, (state, action) => {
                state.loadingByAction.getCoupons = false;
                state.errorByAction.getCoupons = action.payload;
            })
            //get single coupon
            .addCase(getSingleCoupon.pending, (state) => {
                state.loadingByAction.getSingleCoupon = true;
                state.errorByAction.getSingleCoupon = null;
            })
            .addCase(getSingleCoupon.fulfilled, (state, action) => {
                state.loadingByAction.getSingleCoupon = false;
                state.errorByAction.getSingleCoupon = null;
                state.currentCoupon = action.payload;
            })
            .addCase(getSingleCoupon.rejected, (state, action) => {
                state.loadingByAction.getSingleCoupon = false;
                state.errorByAction.getSingleCoupon = action.payload;
            })
            //edit coupon
            .addCase(editCoupon.pending, (state) => {
                state.loadingByAction.editCoupon = true;
                state.errorByAction.editCoupon = null;
            })
            .addCase(editCoupon.fulfilled, (state, action) => {
                state.loadingByAction.editCoupon = false;
                state.errorByAction.editCoupon = null;
                const index = state.coupons.findIndex(
                    (coupon) => coupon._id === action.payload._id
                );
                if (index !== -1) {
                    state.coupons[index] = action.payload;
                }
                state.currentCoupon = action.payload;
            })
            .addCase(editCoupon.rejected, (state, action) => {
                state.loadingByAction.editCoupon = false;
                state.errorByAction.editCoupon = action.payload;
            })
            //change status
            .addCase(changeCouponStatus.pending, (state) => {
                state.loadingByAction.changeCouponStatus = true;
                state.errorByAction.changeCouponStatus = null;
            })
            .addCase(changeCouponStatus.fulfilled, (state, action) => {
                state.loadingByAction.changeCouponStatus = false;
                state.errorByAction.changeCouponStatus = null;
                const index = state.coupons.findIndex(
                    (coupon) => coupon._id === action.payload._id
                );
                if (index !== -1) {
                    state.coupons[index] = action.payload;
                }
            })
            .addCase(changeCouponStatus.rejected, (state, action) => {
                state.loadingByAction.changeCouponStatus = false;
                state.errorByAction.changeCouponStatus = action.payload;
            });
    },
});

export const { clearCouponErrors, setCurrentPage } = adminCouponSlice.actions;
export default adminCouponSlice.reducer;
