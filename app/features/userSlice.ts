// redux/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AvailabilitySlot {
  _id: string;
  startTime: string;
  endTime: string;
}

interface AvailabilityDay {
  day: string;
  isAvailable: boolean;
  slots: AvailabilitySlot[];
  _id: string;
}

interface BlockedDate {
  date: string;
  _id: string;
}

interface ExpertDetail {
  _id: string;
  userId: string;
  expertiseAreas: string[];
  socialMedia: string[];
  profession: string;
  pricePerMinute: number;
  isAvailable: boolean;
  availabilitySlots: AvailabilityDay[];
  blockedDates: BlockedDate[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Wallet {
  _id: string;
  ownerId: string;
  balance: number;
  bankDetailId: string;
  isBankAdded: boolean;
  __v: number;
}

interface User {
  _id: string;
  phone: string;
  isExpert: boolean;
  isVerified: boolean;
  bio: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  dob: string;
  gender: string;
  name: string;
  username: string;
  expertId: ExpertDetail;
  wallet: Wallet;
  profilePicture: string;
  fcmToken: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (username: string) => {
    const response = await axios.get(
      `https://api.hasher.lol/api/users/username/${username}`
    );
    console.log(`data from fetch user ${JSON.stringify(response.data)}`);
    return response.data.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserDetails.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user details.";
      });
  },
});

export default userSlice.reducer;
