// features/searchSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SearchResult } from "../widgets/Navbar";
import { searchUsers } from "../services/searchService";
import { RootState } from "../store/store";

interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: "",
  results: [],
  isLoading: false,
  error: null,
};

import { AxiosError } from "axios";

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (query: string, { rejectWithValue }) => {
    try {
      return await searchUsers(query);
    } catch (err: unknown) {
      // Assert the error type to AxiosError
      const error = err as AxiosError;
      if (error.response) {
        console.error("Axios error:", error.response.data);
        return rejectWithValue(error.response.data);
      } else {
        console.error("Unexpected error:", error);
        throw err;
      }
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.results = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export const { setQuery, clearResults } = searchSlice.actions;

// Selectors
export const selectQuery = (state: RootState) => state.search.query;
export const selectResults = (state: RootState) => state.search.results;
export const selectIsLoading = (state: RootState) => state.search.isLoading;
export const selectError = (state: RootState) => state.search.error;

export default searchSlice.reducer;
