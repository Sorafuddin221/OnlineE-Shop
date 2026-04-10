import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../services/api";

export const getProductDetails = createAsyncThunk("product/getProductDetails", async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/product/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch product");
  }
});

export const createReview = createAsyncThunk("product/createReview", async (reviewData, { rejectWithValue }) => {
  try {
    const { data } = await API.put("/review", reviewData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to submit review");
  }
});

const initialState = {
  product: null,
  loading: false,
  error: null,
  success: false,
  message: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch product";
      })
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Review submitted successfully";
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to submit review";
      });
  },
});

export const { clearErrors, clearSuccess } = productSlice.actions;
export default productSlice.reducer;
