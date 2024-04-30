// redux/expertSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Review {
  _id: string;
  comment: string;
  rating: number;
  createdAt: string;
  reviewer: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  session: {
    startTime: string;
    endTime: string;
  };
}

interface ExpertState {
  reviews: Review[];
  totalReviews: number;
  averageRating: string;
  totalMeetings: number;
  loading: boolean;
  error: string | null;
}

const initialState: ExpertState = {
  reviews: [],
  totalReviews: 0,
  averageRating: "0",
  totalMeetings: 0,
  loading: false,
  error: null,
};

export const fetchExpertAnalytics = createAsyncThunk(
  "expert/fetchExpertAnalytics",
  async (expertId: string) => {
    const response = await axios.get(
      `https://api.hasher.lol/reviews/expert/${expertId}`
    );
    console.log(
      `data from fetch expert stats ${JSON.stringify(response.data)}`
    );

    return response.data;
  }
);

const expertSlice = createSlice({
  name: "expert",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpertAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExpertAnalytics.fulfilled,
        (state, action: PayloadAction<ExpertState>) => {
          state.loading = false;
          state.reviews = action.payload.reviews;
          state.totalReviews = action.payload.totalReviews;
          state.averageRating = action.payload.averageRating;
          state.totalMeetings = action.payload.totalMeetings;
        }
      )
      .addCase(fetchExpertAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch expert analytics.";
      });
  },
});

export default expertSlice.reducer;
