//admin banner slice
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";


export const getUserBanner = createAsyncThunk(
    "/user/getUserBanner",
    async (_, { rejectWithValue }) => {
        try {
            const response = await instance.get(
                '/user/banner'
            );
            return response.data.banner;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


const userBannerSlice = createSlice({
    name: "userBanner",
    initialState: {
        currentBanner: [],
        errorByAction: {},
        loadingByAction: {}
    },

    reducers: {
    },

    extraReducers: (builder) => {
        builder            
            //get user banner
            .addCase(getUserBanner.pending, (state) => {
                state.loadingByAction.getUserBanner = true;
                state.errorByAction.getUserBanner = null;
            })
            .addCase(getUserBanner.fulfilled, (state, action) => {
                state.loadingByAction.getUserBanner = false;
                state.errorByAction.getUserBanner = null;
                state.currentBanner = action.payload;
            })
            .addCase(getUserBanner.rejected, (state, action) => {
                state.loadingByAction.getUserBanner = false;
                state.errorByAction.getUserBanner = action.payload;
            })
    },
});

export default userBannerSlice.reducer;
