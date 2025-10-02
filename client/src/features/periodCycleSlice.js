//user period slice
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../utils/axios";

export const saveCycleInfo = createAsyncThunk(
    "/user/saveCycleInfo",
    async ({ lastPeriodDate, cycleLength }, { rejectWithValue }) => {
        try {
            const response = await instance.post("/user/create-cycle", {
                lastPeriodDate,
                cycleLength,
            });
            return response.data.cycle;
        } catch (err) {
            return rejectWithValue(err.response.data.errors);
        }
    }
);

export const getCycleInfo = createAsyncThunk(
    "/user/getCycleInfo",
    async (_, { rejectWithValue }) => {
        try {
            const response = await instance.get("/user/cycle");
            return response.data.cycle;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const periodCycleSlice = createSlice({
    name: "cycle",
    initialState: {
        cycle: null,
        loadingByAction: {},
        errorByAction: {},
    },
    reducers: {
        clearCycleErrors: (state) => {
            state.errorByAction = {};
        },
    },
    extraReducers: (builder) => {
        builder
            // save cycle
            .addCase(saveCycleInfo.pending, (state) => {
                state.loadingByAction.saveCycleInfo = true;
                state.errorByAction.saveCycleInfo = null;
            })
            .addCase(saveCycleInfo.fulfilled, (state, action) => {
                state.loadingByAction.saveCycleInfo = false;
                state.cycle = action.payload;
                state.errorByAction.saveCycleInfo = null;
            })
            .addCase(saveCycleInfo.rejected, (state, action) => {
                state.loadingByAction.saveCycleInfo = false;
                state.errorByAction.saveCycleInfo = action.payload;
            })
            //get cycle
            .addCase(getCycleInfo.pending, (state) => {
                state.loadingByAction.getCycleInfo = true;
                state.errorByAction.getCycleInfo = null;
            })
            .addCase(getCycleInfo.fulfilled, (state, action) => {
                state.loadingByAction.getCycleInfo = false;
                state.cycle = action.payload;
                state.errorByAction.getCycleInfo = null;
            })
            .addCase(getCycleInfo.rejected, (state, action) => {
                state.loadingByAction.getCycleInfo = false;
                state.errorByAction.getCycleInfo = action.payload;
            });
    },
});

export const { clearCycleErrors } = periodCycleSlice.actions;
export default periodCycleSlice.reducer;
