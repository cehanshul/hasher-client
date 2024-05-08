// redux/expertSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../utils/api";

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
  expertProfile?: {
    _id: string;
    userId: string;
    expertiseAreas: string[];
    socialMedia: string[];
    profession: string;
    pricePerMinute: number;
    isAvailable: boolean;
    availabilitySlots: AvailabilitySlot[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  expertUser?: {
    _id: string;
    name: string;
    profilePicture: string;
    bio: string;
  };
  expertName?: string;
  reviews: Review[];
  totalReviews: number;
  averageRating: string;
  totalMeetings: number;
  loading: boolean;
  error: string | null;
}

interface AvailabilitySlot {
  day: string;
  isAvailable: boolean;
  slots: {
    startTime: string;
    endTime: string;
    _id: string;
  }[];
  _id: string;
}

const initialState: ExpertState = {
  reviews: [],
  totalReviews: 0,
  averageRating: "0",
  totalMeetings: 0,
  loading: false,
  error: null,
};
interface ExpertState {
  expertProfile?: {
    _id: string;
    userId: string;
    expertiseAreas: string[];
    socialMedia: string[];
    profession: string;
    pricePerMinute: number;
    isAvailable: boolean;
    availabilitySlots: AvailabilitySlot[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  expertName?: string;
  reviews: Review[];
  totalReviews: number;
  averageRating: string;
  totalMeetings: number;
  loading: boolean;
  error: string | null;
}

export const fetchExpertAnalytics = createAsyncThunk(
  "expert/fetchExpertAnalytics",
  async (expertId: string) => {
    const response = await api.get(`/reviews/expert/${expertId}`);
    console.log(
      `data from fetch expert stats ${JSON.stringify(response.data)}`
    );
    return response.data;
  }
);

export const fetchExpertByUsername = createAsyncThunk(
  "expert/fetchExpertByUsername",
  async (username: string) => {
    const response = await api.get(`/api/users/username/${username}`);
    return response.data.data;
  }
);

const expertSlice = createSlice({
  name: "expert",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchExpertAnalytics actions
      .addCase(fetchExpertAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExpertAnalytics.fulfilled,
        (state, action: PayloadAction<ExpertState>) => {
          console.log("Analytics Data:", action.payload);
          state.loading = false;
          state.reviews = action.payload.reviews;
          state.totalReviews = action.payload.totalReviews;
          state.averageRating = action.payload.averageRating;
          state.totalMeetings = action.payload.totalMeetings;
        }
      )
      .addCase(fetchExpertAnalytics.rejected, (state, action) => {
        console.log("Analytics failed:", action.payload);
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch expert analytics.";
      })
      // Handle fetchExpertbyUsername actions
      .addCase(fetchExpertByUsername.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpertByUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.expertProfile = action.payload.expertId;
        state.expertName = action.payload.name;
        state.expertUser = {
          _id: action.payload._id,
          name: action.payload.name,
          profilePicture: action.payload.profilePicture,
          bio: action.payload.bio,
        };
      })
      .addCase(fetchExpertByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch expert details.";
      });
  },
});

export default expertSlice.reducer;
