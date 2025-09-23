//admin product slice
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export const getProduct = createAsyncThunk(
    "/products/getProduct",
    async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
        try {
            const response = await instance.get(
                `/admin/products?page=${page}&limit=${limit}&search=${search}`
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const addProduct = createAsyncThunk(
    "/products/addProduct",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await instance.post(
                "/admin/products/add",
                formData
            );
            return response.data.product;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const productToggleStatus = createAsyncThunk(
    "/products/productToggleStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await instance.patch(
                `/admin/products/status/${id}`
            );
            return response.data.product;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getProductById = createAsyncThunk(
    "/products/getProductById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await instance.get(`/admin/products/${id}`);
            return response.data.product;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateProduct = createAsyncThunk(
    "/products/updateProduct",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await instance.patch(
                `/admin/products/${id}`,
                formData
            );
            return response.data.product;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        currentProduct: null,
        errorByAction: {},
        loadingByAction: {},
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
    },
    reducers: {
        clearAddProductError: (state) => {
            state.errorByAction.addProduct = null;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        clearEditProductError: (state) => {
            state.errorByAction.updateProduct = null;
        },
    },
    extraReducers: (builder) => {
        builder
            //add products
            .addCase(addProduct.pending, (state) => {
                state.loadingByAction.addProduct = true;
                state.errorByAction.addProduct = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loadingByAction.addProduct = false;
                state.products.push(action.payload);
                state.errorByAction.addProduct = null;
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loadingByAction.addProduct = false;
                state.errorByAction.addProduct = action.payload;
            })

            //get products
            .addCase(getProduct.pending, (state) => {
                state.loadingByAction.getProduct = true;
                state.errorByAction.getProduct = null;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loadingByAction.getProduct = false;
                state.errorByAction.getProduct = null;
                state.products = action.payload.products;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
                state.totalProducts = action.payload.totalProducts;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loadingByAction.getProduct = false;
                state.errorByAction.getProduct = action.payload;
            })

            //change status
            .addCase(productToggleStatus.pending, (state) => {
                state.loadingByAction.productToggleStatus = true;
                state.errorByAction.productToggleStatus = null;
            })
            .addCase(productToggleStatus.fulfilled, (state, action) => {
                state.loadingByAction.productToggleStatus = false;
                state.errorByAction.productToggleStatus = null;
                const index = state.products.findIndex(
                    (product) => product._id === action.payload._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(productToggleStatus.rejected, (state, action) => {
                state.loadingByAction.productToggleStatus = false;
                state.errorByAction.productToggleStatus = action.payload;
            })

            //getproductbyId
            .addCase(getProductById.pending, (state) => {
                state.loadingByAction.getProductById = true;
                state.errorByAction.getProductById = null;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.loadingByAction.getProductById = false;
                state.errorByAction.getProductById = null;
                state.currentProduct = action.payload;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.loadingByAction.getProductById = false;
                state.errorByAction.getProductById = action.payload;
            })

            //updateProduct
            .addCase(updateProduct.pending, (state) => {
                state.loadingByAction.updateProduct = true;
                state.errorByAction.updateProduct = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loadingByAction.updateProduct = false;
                state.errorByAction.updateProduct = null;

                const index = state.products.findIndex(
                    (product) => product._id === action.payload._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
                state.currentProduct = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loadingByAction.updateProduct = false;
                state.errorByAction.updateProduct = action.payload;
            });
    },
});

export const { clearAddProductError, setCurrentPage, clearEditProductError } =
    adminProductSlice.actions;
export default adminProductSlice.reducer;
