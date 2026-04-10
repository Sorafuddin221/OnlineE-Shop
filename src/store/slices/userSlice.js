import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../services/api";

const isClient = typeof window !== "undefined";

export const register = createAsyncThunk("user/register", async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/register", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Registration failed");
  }
});

export const login = createAsyncThunk("user/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/login", { email, password });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Login failed");
  }
});

export const loadUser = createAsyncThunk("user/loadUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/profile");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to load user");
  }
});

export const logout = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    await API.post("/logout");
    return null;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Logout failed");
  }
});

export const toggleWishlist = createAsyncThunk("user/toggleWishlist", async (productId, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/wishlist", { productId });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Wishlist update failed");
  }
});

export const getWishlist = createAsyncThunk("user/getWishlist", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/wishlist");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to load wishlist");
  }
});

export const updateProfile = createAsyncThunk("user/updateProfile", async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.put("/profile", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Profile update failed");
  }
});

export const updatePassword = createAsyncThunk("user/updatePassword", async (passwords, { rejectWithValue }) => {
  try {
    const { data } = await API.put("/password/update", passwords);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Password update failed");
  }
});

export const forgotPassword = createAsyncThunk("user/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/password/forgot", { email });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Forgot password request failed");
  }
});

export const resetPassword = createAsyncThunk("user/resetPassword", async ({ token, passwords }, { rejectWithValue }) => {
  try {
    const { data } = await API.put(`/password/reset/${token}`, passwords);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Password reset failed");
  }
});

const initialState = {
  user: null,
  wishlist: [],
  loading: false,
  error: null,
  success: false,
  isUpdated: false,
  isAuthenticated: false,
  message: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    hydrate: (state) => {
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        const auth = localStorage.getItem("isAuthenticated");
        if (user) state.user = JSON.parse(user);
        if (auth) state.isAuthenticated = auth === "true";
      }
    },
    clearErrors: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    updateProfileReset: (state) => {
      state.isUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        if (isClient) {
          localStorage.setItem("user", JSON.stringify(state.user));
          localStorage.setItem("isAuthenticated", "true");
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        if (isClient) {
          localStorage.setItem("user", JSON.stringify(state.user));
          localStorage.setItem("isAuthenticated", "true");
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        if (isClient) {
          localStorage.setItem("user", JSON.stringify(state.user));
          localStorage.setItem("isAuthenticated", "true");
        }
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        if (isClient) {
          localStorage.removeItem("user");
          localStorage.removeItem("isAuthenticated");
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        if (isClient) {
          localStorage.removeItem("user");
          localStorage.removeItem("isAuthenticated");
        }
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.success = true;
      })
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload.wishlist;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload.success;
        state.user = action.payload.user;
        if (isClient) {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Profile update failed";
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdated = action.payload.success;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Password update failed";
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Forgot password failed";
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Password reset failed";
      });
  },
});

export const { hydrate, clearErrors, clearSuccess, updateProfileReset } = userSlice.actions;
export default userSlice.reducer;
