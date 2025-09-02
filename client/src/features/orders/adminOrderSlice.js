import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export const adminGetOrders = createAsyncThunk(
    "adminOrders/getOrders",
    async (
        { page = 1, limit = 10, search = "", filterStatus = "", date = ""},
        { rejectWithValue }
    ) => {
        try {
            const response = await instance.get(
                `/admin/orders?page=${page}&limit=${limit}&search=${search}&filterStatus=${filterStatus}&date=${date}`
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const adminGetOrderDetail = createAsyncThunk(
    "adminOrders/getOrderDetail",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await instance.get(
                `/admin/order/detail/${orderId}`
            );
            return response.data.order;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const adminUpdateOrderStatus = createAsyncThunk(
    "adminOrders/updateOrderStatus",
    async ({ orderId, productId, newStatus }, { rejectWithValue }) => {
        try {
            const response = await instance.patch(
                `/admin/order/${orderId}/product`,
                { productId, newStatus }
            );
            return response.data.order;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const adminOrderSlice = createSlice({
    name: "adminOrder",
    initialState: {
        orders: [],
        orderDetail: null,
        currentPage: 1,
        totalPages: 1,
        totalOrder: 0,
        loadingByAction: {},
        errorByAction: {},
    },
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            //get orders
            .addCase(adminGetOrders.pending, (state) => {
                state.loadingByAction.adminGetOrders = true;
                state.errorByAction.adminGetOrders = null;
            })
            .addCase(adminGetOrders.fulfilled, (state, action) => {
                state.loadingByAction.adminGetOrders = false;
                state.errorByAction.adminGetOrders = null;
                state.orders = action.payload.orders;
                state.totalPages = action.payload.totalPages;
                state.totalOrder = action.payload.totalOrder;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(adminGetOrders.rejected, (state, action) => {
                state.loadingByAction.adminGetOrders = false;
                state.errorByAction.adminGetOrders = action.payload;
            })
            //get admin order detail
            .addCase(adminGetOrderDetail.pending, (state) => {
                state.loadingByAction.adminGetOrderDetail = true;
                state.errorByAction.adminGetOrderDetail = null;
            })
            .addCase(adminGetOrderDetail.fulfilled, (state, action) => {
                state.loadingByAction.adminGetOrderDetail = false;
                state.errorByAction.adminGetOrderDetail = null;
                state.orderDetail = action.payload;
            })
            .addCase(adminGetOrderDetail.rejected, (state, action) => {
                state.loadingByAction.adminGetOrderDetail = false;
                state.errorByAction.adminGetOrderDetail = action.payload;
            })
            // change order status
            .addCase(adminUpdateOrderStatus.pending, (state) => {
                state.loadingByAction.adminUpdateOrderStatus = true;
                state.errorByAction.adminUpdateOrderStatus = null;
            })
            .addCase(adminUpdateOrderStatus.fulfilled, (state, action) => {
                state.loadingByAction.adminUpdateOrderStatus = false;
                state.errorByAction.adminUpdateOrderStatus = null;
                state.orderDetail = action.payload;
            })
            .addCase(adminUpdateOrderStatus.rejected, (state, action) => {
                state.loadingByAction.adminUpdateOrderStatus = false;
                state.errorByAction.adminUpdateOrderStatus = action.payload;
            })
    },
});

export const { setCurrentPage } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
