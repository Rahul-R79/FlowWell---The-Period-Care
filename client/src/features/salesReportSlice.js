//admin sales report slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const getSalesReport = createAsyncThunk(
    "/admin/getSalesReport",
    async (params, { rejectWithValue }) => {
        try {
            const response = await instance.get("/admin/sales-report", {
                params,
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const adminSalesReportSlice = createSlice({
    name: "salesReport",
    initialState: {
        report: {
            totalOrders: 0,
            totalRevenue: 0,
            totalProducts: 0,
            totalCustomers: 0,
            cancelOrders: 0,
            refundedOrders: 0,
            returnedOrders: 0,
        },
        errorByAction: {},
        loadingByAction: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get salesReport
            .addCase(getSalesReport.pending, (state) => {
                state.loadingByAction.getSalesReport = true;
                state.errorByAction.getSalesReport = null;
            })
            .addCase(getSalesReport.fulfilled, (state, action) => {
                state.loadingByAction.getSalesReport = false;
                state.errorByAction.getSalesReport = null;
                state.report = action.payload;
            })
            .addCase(getSalesReport.rejected, (state, action) => {
                state.loadingByAction.getSalesReport = false;
                state.errorByAction.getSalesReport = action.payload;
            });
    },
});

export default adminSalesReportSlice.reducer;
