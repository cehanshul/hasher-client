// src/features/bookings/bookingsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BookingRequest, BookingResponse } from "../types/bookingsTypes";
import api from "../utils/api";
export const bookSession = createAsyncThunk(
  "bookings/book",
  async (bookingData: BookingRequest, { rejectWithValue }) => {
    console.log(`date before creating booking ${JSON.stringify(bookingData)}`);
    try {
      const response = await api.post<BookingResponse>(
        "/api/bookings/book",
        bookingData
      );
      console.log(`booking data response ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error: any) {
      console.log(`error while creating booking ${error}`);

      return rejectWithValue(error.response.data);
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    booking: null as BookingResponse | null,
    loading: false,
    error: null as any,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(bookSession.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(bookSession.fulfilled, (state, action) => {
      state.loading = false;
      state.booking = action.payload;
    });
    builder.addCase(bookSession.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default bookingsSlice.reducer;
