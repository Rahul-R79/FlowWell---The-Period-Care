import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export const addBanner = createAsyncThunk(
    "/admin/addBanner",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await instance.post("/admin/banner/add", formData);
            return response.data.banner;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const getBanners = createAsyncThunk(
    "/admin/getBanners",
    async ({ page = 1, limit = 4, search = "" }, { rejectWithValue }) => {
        try {
            const response = await instance.get(
                `/admin/banner?page=${page}&limit=${limit}&search=${search}`
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getSingleBanner = createAsyncThunk(
    "/admin/getSingleBanner",
    async (id, { rejectWithValue }) => {
        try {
            const response = await instance.get(`/admin/banner/${id}`);
            return response.data.banner;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const editBanner = createAsyncThunk(
    "/admin/editBanner",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await instance.patch(
                `/admin/banner/${id}`,
                formData
            );
            return response.data.banner;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const deleteBanner = createAsyncThunk(
    "/admin/deleteBanner",
    async (id, { rejectWithValue }) => {
        try {
            const response = await instance.delete(`/admin/banner/${id}`);
            return response.data.banner;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const bannerStatus = createAsyncThunk(
    "/admin/bannerStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await instance.patch(`/admin/banner/status/${id}`);
            return response.data.banner;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const bannerSlice = createSlice({
    name: "adminBanner",
    initialState: {
        banner: [],
        currentBanner: null,
        errorByAction: {},
        loadingByAction: {},
        currentPage: 1,
        totalPages: 1,
        totalBanners: 0,
    },

    reducers: {
        clearBannerErrors: (state) => {
            state.errorByAction = {};
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            //add banner
            .addCase(addBanner.pending, (state) => {
                state.loadingByAction.addBanner = true;
                state.errorByAction.addBanner = null;
            })
            .addCase(addBanner.fulfilled, (state, action) => {
                state.banner.push(action.payload);
                state.loadingByAction.addBanner = false;
                state.errorByAction.addBanner = null;
            })
            .addCase(addBanner.rejected, (state, action) => {
                state.loadingByAction.addBanner = false;
                state.errorByAction.addBanner = action.payload;
            })
            //get banners
            .addCase(getBanners.pending, (state) => {
                state.loadingByAction.getBanners = true;
                state.errorByAction.getBanners = null;
            })
            .addCase(getBanners.fulfilled, (state, action) => {
                state.loadingByAction.getBanners = false;
                state.errorByAction.getBanners = null;
                state.banner = action.payload.banner;
                state.currentPage = action.payload.currentPage;
                state.totalBanners = action.payload.totalBanners;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getBanners.rejected, (state, action) => {
                state.loadingByAction.getBanners = false;
                state.errorByAction.getBanners = action.payload;
            })
            //get single banner
            .addCase(getSingleBanner.pending, (state) => {
                state.loadingByAction.getSingleBanner = true;
                state.errorByAction.getSingleBanner = null;
            })
            .addCase(getSingleBanner.fulfilled, (state, action) => {
                state.loadingByAction.getSingleBanner = false;
                state.errorByAction.getSingleBanner = null;
                state.currentBanner = action.payload;
            })
            .addCase(getSingleBanner.rejected, (state, action) => {
                state.loadingByAction.getSingleBanner = false;
                state.errorByAction.getSingleBanner = action.payload;
            })
            //edit coupon
            .addCase(editBanner.pending, (state) => {
                state.loadingByAction.editBanner = true;
                state.errorByAction.editBanner = null;
            })
            .addCase(editBanner.fulfilled, (state, action) => {
                state.loadingByAction.editBanner = false;
                state.errorByAction.editBanner = null;
                const index = state.banner.findIndex(
                    (banner) => banner._id === action.payload._id
                );
                if (index !== -1) {
                    state.banner[index] = action.payload;
                }
                state.currentBanner = action.payload;
            })
            .addCase(editBanner.rejected, (state, action) => {
                state.loadingByAction.editBanner = false;
                state.errorByAction.editBanner = action.payload;
            })
            //delete banner
            .addCase(deleteBanner.pending, (state) => {
                state.loadingByAction.deleteBanner = true;
                state.errorByAction.deleteBanner = null;
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.loadingByAction.deleteBanner = false;
                state.errorByAction.deleteBanner = null;
                state.banner = state.banner.filter(
                    (b) => b._id !== action.payload._id
                );
            })
            .addCase(deleteBanner.rejected, (state, action) => {
                state.loadingByAction.deleteBanner = false;
                state.errorByAction.deleteBanner = action.payload;
            })
            //change banner status
            .addCase(bannerStatus.pending, (state) => {
                state.loadingByAction.bannerStatus = true;
                state.errorByAction.bannerStatus = null;
            })
            .addCase(bannerStatus.fulfilled, (state, action) => {
                state.loadingByAction.bannerStatus = false;
                state.errorByAction.bannerStatus = null;
                const updateBanner = action.payload;
                state.banner = state.banner.map((b) =>
                    b._id === updateBanner._id
                        ? updateBanner
                        : { ...b, isActive: false }
                );
                state.currentBanner = updateBanner;
            })
            .addCase(bannerStatus.rejected, (state, action) => {
                state.loadingByAction.bannerStatus = false;
                state.errorByAction.bannerStatus = action.payload;
            });
    },
});

export const { clearBannerErrors, setCurrentPage } = bannerSlice.actions;
export default bannerSlice.reducer;
