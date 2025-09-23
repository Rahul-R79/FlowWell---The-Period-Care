//admin dashboard slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const getDashboard = createAsyncThunk(
    "/admin/getDashboard",
    async (params, { rejectWithValue }) => {
        try {
            const response = await instance.get("/admin/dashboard", {
                params,
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const adminDashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        data: {
            totalOrders: 0,
            activeOrders: 0,
            completedOrders: 0,
            returnedOrders: 0,
            totalRevenue: 0,
            refundRevenue: 0,
            totalProducts: 0,
            totalCustomers: 0,
            salesTrend: [],
            topSelling: [],
        },
        errorByAction: {},
        loadingByAction: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get dashboard
            .addCase(getDashboard.pending, (state) => {
                state.loadingByAction.getDashboard = true;
                state.errorByAction.getDashboard = null;
            })
            .addCase(getDashboard.fulfilled, (state, action) => {
                state.loadingByAction.getDashboard = false;
                state.errorByAction.getDashboard = null;
                state.data = action.payload;
            })
            .addCase(getDashboard.rejected, (state, action) => {
                state.loadingByAction.getDashboard = false;
                state.errorByAction.getDashboard = action.payload;
            });
    },
});

export default adminDashboardSlice.reducer;
