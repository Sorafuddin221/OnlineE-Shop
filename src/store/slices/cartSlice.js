import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../services/api";

const isClient = typeof window !== "undefined";

export const addItemsToCart = createAsyncThunk("cart/addItemsToCart", async ({ id, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/product/${id}`);
    const priceToUse = data.product.offeredPrice && data.product.offeredPrice > 0 ? data.product.offeredPrice : data.product.price;
    return {
      product: data.product._id,
      name: data.product.name,
      price: priceToUse,
      image: data.product.image[0].url,
      stock: data.product.stock,
      quantity,
    };
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to add item to cart");
  }
});

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  success: false,
  message: null,
  shippingInfo: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrate: (state) => {
      if (typeof window !== "undefined") {
        const cartItems = localStorage.getItem("cartItems");
        const shippingInfo = localStorage.getItem("shippingInfo");
        if (cartItems) state.cartItems = JSON.parse(cartItems);
        if (shippingInfo) state.shippingInfo = JSON.parse(shippingInfo);
      }
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.product !== action.payload);
      if (typeof window !== "undefined") localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      if (typeof window !== "undefined") localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },
    clearCart: (state) => {
      state.cartItems = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("shippingInfo");
      }
    },
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemsToCart.fulfilled, (state, action) => {
        const item = action.payload;
        const existingItem = state.cartItems.find((i) => i.product === item.product);
        if (existingItem) {
          existingItem.quantity += item.quantity; // Fix: Increment quantity instead of replacing
          state.message = `Updated ${item.name} quantity in the cart`;
        } else {
          state.cartItems.push(item);
          state.message = `${item.name} is added to cart successfully`;
        }
        state.loading = false;
        state.success = true;
        if (typeof window !== "undefined") localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(addItemsToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add item to cart";
      });
  },
});

export const { hydrate, removeItemFromCart, saveShippingInfo, clearCart, clearErrors, clearMessage } = cartSlice.actions;
export default cartSlice.reducer;
