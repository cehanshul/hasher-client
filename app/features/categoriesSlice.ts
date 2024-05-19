// redux/categoriesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../utils/api";

export interface Category {
  _id: string;
  name: string;
  imageUrl: string;
  experts: Expert[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Expert {
  _id: string;
  userId: {
    _id: string;
    isVerified: boolean;
    name: string;
    username: string;
    profilePicture?: string;
  };
  profession: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await api.get<Category[]>("/categories/");
    return response.data;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default categoriesSlice.reducer;
