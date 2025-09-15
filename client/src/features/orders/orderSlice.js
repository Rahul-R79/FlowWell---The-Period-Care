import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export const createOrder = createAsyncThunk(
    "/order/createOrder",
    async ({ paymentMethod, shippingAddressId, appliedCouponId  }, { rejectWithValue }) => {
        try {
            const response = await instance.post("/user/payment", {
                paymentMethod,
                shippingAddressId,
                appliedCouponId 
            });
            return response.data.order;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getOrders = createAsyncThunk(
    "/order/getOrders",
    async ({ page = 1, limit = 3 }, { rejectWithValue }) => {
        try {
            const response = await instance.get(
                `/user/orders?page=${page}&limit=${limit}`
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getOrderItem = createAsyncThunk(
    "/order/getOrderItem",
    async ({ orderId, productId }, { rejectWithValue }) => {
        try {
            const response = await instance.get(
                `/user/order/detail/${orderId}/${productId}`
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const cancelOrder = createAsyncThunk(
    "/order/cancelOrder",
    async ({ orderId, productId, reason }, { rejectWithValue }) => {
        try {
            const response = await instance.patch(
                `/user/order/cancel/${orderId}/${productId}`,
                { reason }
            );
            return response.data.order;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const returnOrder = createAsyncThunk(
    "/order/returnOrder",
    async ({ orderId, productId, reason }, { rejectWithValue }) => {
        try {
            const response = await instance.patch(
                `/user/order/return/${orderId}/${productId}`,
                { reason }
            );
            return response.data.order;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const payWithWallet = createAsyncThunk(
    "/user/payWithWallet",
    async ({ walletAmount, shippingAddressId, orderData }, { rejectWithValue }) => {
        try {
            const response = await instance.post("/user/wallet-payment", {
                walletAmount,
                shippingAddressId,
                orderData,
            });
            return response.data.order;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        order: null,
        orderItem: null,
        currentPage: 1,
        totalPages: 1,
        totalOrder: 0,
        loadingByAction: {},
        errorByAction: {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //create order
            .addCase(createOrder.pending, (state) => {
                state.loadingByAction.createOrder = true;
                state.errorByAction.createOrder = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loadingByAction.createOrder = false;
                state.errorByAction.createOrder = null;
                state.order = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loadingByAction.createOrder = false;
                state.errorByAction.createOrder = action.payload;
            })

            //get order
            .addCase(getOrders.pending, (state) => {
                state.loadingByAction.getOrders = true;
                state.errorByAction.getOrders = null;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loadingByAction.getOrders = false;
                state.errorByAction.getOrders = null;
                state.orders = action.payload.orders;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
                state.totalOrder = action.payload.totalOrder;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loadingByAction.getOrders = false;
                state.errorByAction.getOrders = action.payload;
            })

            //get orderItem
            .addCase(getOrderItem.pending, (state) => {
                state.loadingByAction.getOrderItem = true;
                state.errorByAction.getOrderItem = null;
            })
            .addCase(getOrderItem.fulfilled, (state, action) => {
                state.loadingByAction.getOrderItem = false;
                state.errorByAction.getOrderItem = null;
                state.orderItem = action.payload;
            })
            .addCase(getOrderItem.rejected, (state, acion) => {
                state.loadingByAction.getOrderItem = false;
                state.errorByAction.getOrderItem = acion.payload;
            })
            //cancel order
            .addCase(cancelOrder.pending, (state) => {
                state.loadingByAction.cancelOrder = true;
                state.errorByAction.cancelOrder = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loadingByAction.cancelOrder = false;
                state.errorByAction.cancelOrder = null;
                const updatedOrder = action.payload;
                if (state.order && state.order._id === updatedOrder._id) {
                    state.order = updatedOrder;
                }
                const index = state.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                );
                if (index !== -1) state.orders[index] = updatedOrder;
            })
            .addCase(cancelOrder.rejected, (state, acion) => {
                state.loadingByAction.cancelOrder = false;
                state.errorByAction.cancelOrder = acion.payload;
            })
            // return order
            .addCase(returnOrder.pending, (state) => {
                state.loadingByAction.returnOrder = true;
                state.errorByAction.returnOrder = null;
            })
            .addCase(returnOrder.fulfilled, (state, action) => {
                state.loadingByAction.returnOrder = false;
                state.errorByAction.returnOrder = null;
                const updatedOrder = action.payload;
                if (state.order && state.order._id === updatedOrder._id) {
                    state.order = updatedOrder;
                }
                const index = state.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                );
                if (index !== -1) state.orders[index] = updatedOrder;
            })
            .addCase(returnOrder.rejected, (state, acion) => {
                state.loadingByAction.returnOrder = false;
                state.errorByAction.returnOrder = acion.payload;
            })
            //pay with wallet
            .addCase(payWithWallet.pending, (state) => {
                state.loadingByAction.payWithWallet = true;
                state.errorByAction.payWithWallet = null;
            })
            .addCase(payWithWallet.fulfilled, (state, action) => {
                state.loadingByAction.payWithWallet = false;
                state.errorByAction.payWithWallet = null;
                state.order = action.payload; 
            })
            .addCase(payWithWallet.rejected, (state, action) => {
                state.loadingByAction.payWithWallet = false;
                state.errorByAction.payWithWallet = action.payload;
            });
    },
});

export default orderSlice.reducer;
