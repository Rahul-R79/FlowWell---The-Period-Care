//user profile slice
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const updateProfile = createAsyncThunk(
    "/profile/updateProfile",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await instance.patch(
                "/user/profile/edit",
                formData
            );

            return response.data.user;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        user: null,
        loadingByAction: {},
        errorByAction: {},
    },
    reducers: {
        resetProfileState: (state) => {
            state.user = null;
            state.loadingByAction = {};
            state.errorByAction = {};
        },
    },
    extraReducers: (builder) => {
        builder
            // Update profile
            .addCase(updateProfile.pending, (state) => {
                state.loadingByAction.updateProfile = true;
                state.errorByAction.updateProfile = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loadingByAction.updateProfile = false;
                state.user = action.payload;
                state.errorByAction.updateProfile = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loadingByAction.updateProfile = false;
                state.errorByAction.updateProfile = action.payload;
            });
    },
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
