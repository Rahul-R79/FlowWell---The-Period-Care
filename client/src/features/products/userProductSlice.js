import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/axios";

export const getUserProducts = createAsyncThunk(
    "/user/getUserProducts",
    async (filters = {}, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await instance.get(
                `/user/products?${queryParams}`
            );
            return { filters, ...response.data };
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const getUserProductById = createAsyncThunk(
    "/user/getUserProductById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await instance.get(`/user/product/${id}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const initialState = {
    products: [],
    productDetail: null,
    similarProducts: [],
    newArrivals: [],
    menstrualKits: [],
    homepageSections: {
        newArrivals: [],
        periodKits: [],
    },
    filters: {
        page: 1,
        limit: 9,
        sortBy: "newArrivals",
        size: "",
        price: "",
        categoryName: "",
        offer: "",
    },
    errorByAction: {},
    loadingByAction: {},
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
};

const userProductSlice = createSlice({
    name: "userProducts",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload, page: 1 };
        },
        setCurrentPage: (state, action) => {
            state.filters.page = action.payload;
            state.currentPage = action.payload;
        },
        clearProducts: (state) => {
            state.products = [];
            state.currentPage = 1;
            state.totalPages = 1;
            state.totalProducts = 0;
            state.errorByAction.getUserProducts = null;
            state.filters = { ...initialState.filters };
        },
    },
    extraReducers: (builder) => {
        builder
            //getProducts
            .addCase(getUserProducts.pending, (state) => {
                state.loadingByAction.getUserProducts = true;
                state.errorByAction.getUserProducts = null;
            })
            .addCase(getUserProducts.fulfilled, (state, action) => {
                state.loadingByAction.getUserProducts = false;
                state.errorByAction.getUserProducts = null;

                const { filters, products: fetchedProducts } = action.payload;
                // Store in homepageSections
                if (filters.sortBy === "newArrivals" && filters.limit === 4) {
                    state.homepageSections.newArrivals = fetchedProducts;
                } else if (
                    filters.categoryName === "Period Kits" &&
                    filters.limit === 4
                ) {
                    state.homepageSections.periodKits = fetchedProducts;
                } else {
                    // normal product listing
                    state.products = fetchedProducts;
                    state.currentPage = action.payload.currentPage;
                    state.totalPages = action.payload.totalPages;
                    state.totalProducts = action.payload.totalProducts;
                }
            })
            .addCase(getUserProducts.rejected, (state, action) => {
                state.loadingByAction.getUserProducts = false;
                state.errorByAction.getUserProducts = action.payload;
            })

            //getProductDetail
            .addCase(getUserProductById.pending, (state) => {
                state.loadingByAction.getUserProductById = true;
                state.errorByAction.getUserProductById = null;
            })
            .addCase(getUserProductById.fulfilled, (state, action) => {
                state.loadingByAction.getUserProductById = false;
                state.errorByAction.getUserProductById = null;
                state.productDetail = action.payload.product;
                state.similarProducts = action.payload.similarProduct;
            })
            .addCase(getUserProductById.rejected, (state, action) => {
                state.loadingByAction.getUserProductById = false;
                state.errorByAction.getUserProductById = action.payload;
            });
    },
});

export const { clearProducts, setCurrentPage, setFilters } =
    userProductSlice.actions;
export default userProductSlice.reducer;
