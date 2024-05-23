// redux/expertSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../utils/api";

export interface Review {
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

export interface ExpertState {
  expertProfile?: ExpertProfile;
  expertUser?: {
    _id: string;
    name: string;
    profilePicture: string;
    bio: string;
    isVerified: boolean;
  };
  profession: string;
  reviews: Review[];
  totalReviews: number;
  averageRating: string | null;
  totalMeetings: number;
  loading: boolean;
  error: string | null;
}

export interface AvailabilitySlot {
  day: string;
  isAvailable: boolean;
  slots: {
    startTime: string;
    endTime: string;
    _id: string;
  }[];
  _id: string;
}
export interface ExpertProfile {
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
  dob: string;
  gender: string;
  name: string;
  username: string;
  bio: string;
  isVerified: boolean;
  profilePicture: string;
  expertId: ExpertDetails;
  wallet: string;
  fcmToken: string | null;
}

export interface ExpertDetails {
  _id: string;
  userId: UserData;
  expertiseAreas: string[];
  socialMedia: string[];
  profession: string;
  pricePerMinute: number;
  isAvailable: boolean;
  availabilitySlots: AvailabilitySlot[];
  blockedDates: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UserData {
  _id: string;
  name: string;
  profilePicture: string;
}

export interface APIResponse {
  expert: ExpertProfile;
  reviews: Review[];
  totalReviews: number;
  averageRating: string | null;
  totalMeetings: number;
}

const initialState: ExpertState = {
  expertProfile: undefined,
  expertUser: undefined,
  profession: "",
  reviews: [],
  totalReviews: 0,
  averageRating: null,
  totalMeetings: 0,
  loading: false,
  error: null,
};

export const fetchExpertData = createAsyncThunk(
  "expert/fetchExpertData",
  async (username: string) => {
    const response = await api.get(`/api/users/${username}`);
    console.log(`data from API: ${JSON.stringify(response.data)}`);
    return response.data.data as APIResponse;
  }
);

const expertSlice = createSlice({
  name: "expert",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpertData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExpertData.fulfilled,
        (state, action: PayloadAction<APIResponse>) => {
          state.loading = false;
          state.expertProfile = action.payload.expert;
          state.reviews = action.payload.reviews;
          state.totalReviews = action.payload.totalReviews;
          state.averageRating =
            action.payload.averageRating !== null
              ? action.payload.averageRating.toString()
              : null; // Convert to string or set to null
          state.totalMeetings = action.payload.totalMeetings;
          state.expertUser = {
            _id: action.payload.expert._id,
            name: action.payload.expert.name,
            profilePicture: action.payload.expert.profilePicture,
            bio: action.payload.expert.bio,
            isVerified: action.payload.expert.isVerified,
          };
        }
      )
      .addCase(fetchExpertData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch expert data.";
      });
  },
});

export default expertSlice.reducer;
