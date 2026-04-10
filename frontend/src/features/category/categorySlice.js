import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get all categories
export const getAllCategories = createAsyncThunk('category/getAllCategories', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/categories');
        return data.categories;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred');
    }
});

// Create a new category
export const createCategory = createAsyncThunk('category/createCategory', async (categoryData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post('/api/v1/admin/category/create', categoryData, config);
        return data.category;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred');
    }
});

// Update a category
export const updateCategory = createAsyncThunk('category/updateCategory', async ({ id, categoryData }, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.put(`/api/v1/admin/category/${id}`, categoryData, config);
        return data.category;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred');
    }
});

// Delete a category
export const deleteCategory = createAsyncThunk('category/deleteCategory', async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/category/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred');
    }
});

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all categories
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create a new category
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update a category
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex((category) => category._id === action.payload._id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete a category
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter((category) => category._id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearErrors } = categorySlice.actions;
export default categorySlice.reducer;
