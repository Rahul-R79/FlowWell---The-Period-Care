//admin category slice
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const getCategory = createAsyncThunk(
    "/category/getCategory",
    async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
        try {
            const response = await instance.get(
                `/admin/category?page=${page}&limit=${limit}&search=${search}`
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const addCategory = createAsyncThunk(
    "/category/addCategory",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await instance.post(
                "admin/category/add",
                formData
            );
            return response.data.category;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const getSingleCategory = createAsyncThunk(
    "/category/getSingleCategory",
    async (id, { rejectWithValue }) => {
        try {
            const response = await instance.get(`/admin/category/${id}`);
            return response.data.category;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const editCategory = createAsyncThunk(
    "/category/editCategory",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await instance.patch(
                `/admin/category/${id}`,
                formData
            );
            return response.data.category;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const changeStatus = createAsyncThunk(
    "/category/changeStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await instance.patch(
                `admin/category/status/${id}`
            );
            return response.data.category;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const categorySlice = createSlice({
    name: "category",
    initialState: {
        category: [],
        currentPage: 1,
        totalPages: 1,
        totalCategory: 0,
        currentCategory: null,
        errorByAction: {},
        loadingByAction: {},
    },
    reducers: {
        clearCategoryErrors: (state) => {
            state.errorByAction = {};
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            //get category
            .addCase(getCategory.pending, (state) => {
                state.loadingByAction.getCategory = true;
                state.errorByAction.getCategory = null;
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.loadingByAction.getCategory = false;
                state.errorByAction.getCategory = null;
                state.category = action.payload.category;
                state.currentPage = action.payload.currentPage;
                state.totalCategory = action.payload.totalCategory;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.loadingByAction.getCategory = false;
                state.errorByAction.getCategory = action.payload;
            })
            //add category
            .addCase(addCategory.pending, (state) => {
                state.loadingByAction.addCategory = true;
                state.errorByAction.addCategory = null;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loadingByAction.addCategory = false;
                state.category.push(action.payload);
                state.errorByAction.addCategory = null;
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loadingByAction.addCategory = false;
                state.errorByAction.addCategory = action.payload;
            })
            //get single category
            .addCase(getSingleCategory.pending, (state) => {
                state.loadingByAction.getSingleCategory = true;
                state.errorByAction.getSingleCategory = null;
            })
            .addCase(getSingleCategory.fulfilled, (state, action) => {
                state.loadingByAction.getSingleCategory = false;
                state.errorByAction.getSingleCategory = null;
                state.currentCategory = action.payload;
            })
            .addCase(getSingleCategory.rejected, (state, action) => {
                state.loadingByAction.getSingleCategory = false;
                state.errorByAction.getSingleCategory = action.payload;
            })
            //edit category
            .addCase(editCategory.pending, (state) => {
                state.loadingByAction.editCategory = true;
                state.errorByAction.editCategory = null;
            })
            .addCase(editCategory.fulfilled, (state, action) => {
                state.loadingByAction.editCategory = false;
                state.errorByAction.editCategory = null;
                const index = state.category.findIndex(
                    (category) => category._id === action.payload._id
                );
                if (index !== -1) {
                    state.category[index] = action.payload;
                }
                state.currentCategory = action.payload;
            })
            .addCase(editCategory.rejected, (state, action) => {
                state.loadingByAction.editCategory = false;
                state.errorByAction.editCategory = action.payload;
            })
            //change status
            .addCase(changeStatus.pending, (state) => {
                state.loadingByAction.changeStatus = true;
                state.errorByAction.changeStatus = null;
            })
            .addCase(changeStatus.fulfilled, (state, action) => {
                state.loadingByAction.changeStatus = false;
                state.errorByAction.changeStatus = null;
                const index = state.category.findIndex(
                    (category) => category._id === action.payload._id
                );
                if (index !== -1) {
                    state.category[index] = action.payload;
                }
            })
            .addCase(changeStatus.rejected, (state, action) => {
                state.loadingByAction.changeStatus = false;
                state.errorByAction.changeStatus = action.payload;
            });
    },
});

export const { setCurrentPage, clearCategoryErrors } = categorySlice.actions;
export default categorySlice.reducer;
