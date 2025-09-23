//user address slice
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const addAddress = createAsyncThunk(
    "/address/addAddress",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await instance.post("/user/address/add", formData);
            return response.data.address;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const getAllAddresses = createAsyncThunk(
    "/address/getAllAddresses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await instance.get("/user/address");
            return response.data.addresses;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const getSingleAddress = createAsyncThunk(
    "/address/getSingleAddress",
    async (id, { rejectWithValue }) => {
        try {
            const response = await instance.get(`/user/address/${id}`);
            return response.data.address;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const editAddress = createAsyncThunk(
    "/address/editAddress",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await instance.patch(
                `/user/address/edit/${id}`,
                formData
            );
            return response.data.address;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const deleteAddress = createAsyncThunk(
    "/address/deleteAddress",
    async (id, { rejectWithValue }) => {
        try {
            const response = await instance.delete(
                `/user/address/delete/${id}`
            );
            return response.data.address;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const addressSlice = createSlice({
    name: "address",
    initialState: {
        addresses: [],
        singleAddress: null,
        selectedAddress: null,
        errorByAction: {},
        loadingByAction: {},
    },

    reducers: {
        clearAddressErrors: (state) => {
            state.errorByAction = {};
        },
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            //add address
            .addCase(addAddress.fulfilled, (state, action) => {
                state.addresses.push(action.payload);
                state.loadingByAction.addAddress = false;
                state.errorByAction.addAddress = null;

                if (!state.selectedAddress) {
                    state.selectedAddress = action.payload._id;
                }
            })

            //get all address
            .addCase(getAllAddresses.pending, (state) => {
                state.loadingByAction.getAllAddresses = true;
                state.errorByAction.getAllAddresses = null;
            })
            .addCase(getAllAddresses.fulfilled, (state, action) => {
                state.addresses = action.payload;
                state.loadingByAction.getAllAddresses = false;
                state.errorByAction.getAllAddresses = null;
                if (!state.selectedAddress && action.payload.length > 0) {
                    state.selectedAddress = action.payload[0]._id;
                }
            })
            .addCase(getAllAddresses.rejected, (state, action) => {
                state.loadingByAction.getAllAddresses = false;
                state.errorByAction.getAllAddresses = action.payload;
            })
            //get single address
            .addCase(getSingleAddress.pending, (state) => {
                state.loadingByAction.getSingleAddress = true;
                state.errorByAction.getSingleAddress = null;
            })
            .addCase(getSingleAddress.fulfilled, (state, action) => {
                state.loadingByAction.getSingleAddress = false;
                state.errorByAction.getSingleAddress = null;
                state.singleAddress = action.payload;
            })
            .addCase(getSingleAddress.rejected, (state, action) => {
                state.loadingByAction.getSingleAddress = false;
                state.errorByAction.getSingleAddress = action.payload;
            })
            //edit address
            .addCase(editAddress.pending, (state) => {
                state.loadingByAction.editAddress = true;
                state.errorByAction.editAddress = null;
            })
            .addCase(editAddress.fulfilled, (state, action) => {
                state.loadingByAction.editAddress = false;
                state.errorByAction.editAddress = null;
                const index = state.addresses.findIndex(
                    (address) => address._id === action.payload._id
                );
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
                state.singleAddress = action.payload;
            })
            .addCase(editAddress.rejected, (state, action) => {
                state.loadingByAction.editAddress = false;
                state.errorByAction.editAddress = action.payload;
            })
            //delete address
            .addCase(deleteAddress.pending, (state) => {
                state.errorByAction.deleteAddress = null;
                state.loadingByAction.deleteAddress = true;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.errorByAction.deleteAddress = null;
                state.loadingByAction.deleteAddress = false;
                state.addresses = state.addresses.filter(
                    (address) => address._id !== action.payload._id
                );

                if (state.selectedAddress === action.payload._id) {
                    state.selectedAddress =
                        state.addresses.length > 0
                            ? state.addresses[0]._id
                            : null;
                }
            })

            .addCase(deleteAddress.rejected, (state, action) => {
                state.loadingByAction.deleteAddress = false;
                state.errorByAction.deleteAddress = action.payload;
            });
    },
});

export const { clearAddressErrors, setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;
