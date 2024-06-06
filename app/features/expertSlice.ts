import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
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
  analytics?: any;
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
  // lastMinuteBooking: number;
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
  // lastMinuteBooking: number;
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
  analytics: undefined,
  loading: false,
  error: null,
};

export const updateExpert = createAsyncThunk<
  void,
  { userId: string; updatedDetails: Partial<ExpertDetails> }
>(
  "expert/updateExpert",
  async ({ userId, updatedDetails }, { rejectWithValue }) => {
    try {
      await api.put(`/api/users/experts/${userId}`, updatedDetails);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchExpertData = createAsyncThunk(
  "expert/fetchExpertData",
  async (username: string) => {
    const response = await api.get(`/api/users/username/${username}`);
    console.log(`data from API: ${JSON.stringify(response.data)}`);
    return response.data.data as APIResponse;
  }
);

export const fetchExpertAnalytics = createAsyncThunk(
  "expert/fetchExpertAnalytics",
  async (expertId: string) => {
    const response = await api.get(`/reviews/expert/${expertId}`);
    return response.data;
  }
);

export const fetchExpertReviews = createAsyncThunk(
  "expert/fetchExpertReviews",
  async (expertId: string) => {
    const response = await api.get(`/reviews/reviewee/${expertId}/10/0`);
    return response.data;
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
              : null;
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
      })
      .addCase(fetchExpertAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpertAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchExpertAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch expert analytics.";
      })
      .addCase(fetchExpertReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpertReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchExpertReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch expert reviews.";
      });
  },
});

export default expertSlice.reducer;
