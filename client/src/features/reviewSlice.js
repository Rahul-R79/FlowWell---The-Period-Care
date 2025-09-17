import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const addReview = createAsyncThunk(
    "/user/addReview",
    async ({ formData, orderId, productId, userId }, { rejectWithValue }) => {
        try {
            const response = await instance.post("/user/add-reviews", {
                ...formData,
                orderId,
                productId,
                userId,
            });
            return response.data.review;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const getReviewsByProduct = createAsyncThunk(
    "/user/getReviewsByProduct",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await instance.get(`/user/reviews/${productId}`);
            return response.data.reviews;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getAllReviews = createAsyncThunk(
    "/user/getAllReviews",
    async (_, { rejectWithValue }) => {
        try {
            const response = await instance.get("/user/reviews");
            return response.data.reviews;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const userReviewSlice = createSlice({
    name: "review",
    initialState: {
        review: [],
        productReviews: [],
        errorByAction: {},
        loadingByAction: {},
    },

    reducers: {
        clearErrors: (state) => {
            state.errorByAction = {};
        },
    },

    extraReducers: (builder) => {
        builder
            //add review
            .addCase(addReview.pending, (state) => {
                state.loadingByAction.addReview = true;
                state.errorByAction.addReview = null;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.loadingByAction.addReview = false;
                state.errorByAction.addReview = null;
                state.review.push(action.payload);
            })
            .addCase(addReview.rejected, (state, action) => {
                state.loadingByAction.addReview = false;
                state.errorByAction.addReview = action.payload;
            })

            //get product review
            .addCase(getReviewsByProduct.pending, (state) => {
                state.loadingByAction.getReviewsByProduct = true;
                state.errorByAction.getReviewsByProduct = null;
            })
            .addCase(getReviewsByProduct.fulfilled, (state, action) => {
                state.loadingByAction.getReviewsByProduct = false;
                state.errorByAction.getReviewsByProduct = null;
                state.productReviews = action.payload;
            })
            .addCase(getReviewsByProduct.rejected, (state, action) => {
                state.loadingByAction.getReviewsByProduct = false;
                state.errorByAction.getReviewsByProduct = action.payload;
            })

            //get all reviews
            .addCase(getAllReviews.pending, (state) => {
                state.loadingByAction.getAllReviews = true;
                state.errorByAction.getAllReviews = null;
            })
            .addCase(getAllReviews.fulfilled, (state, action) => {
                state.loadingByAction.getAllReviews = false;
                state.errorByAction.getAllReviews = null;
                state.review = action.payload; 
            })
            .addCase(getAllReviews.rejected, (state, action) => {
                state.loadingByAction.getAllReviews = false;
                state.errorByAction.getAllReviews = action.payload;
            });
    },
});

export const { clearErrors } = userReviewSlice.actions;
export default userReviewSlice.reducer;
