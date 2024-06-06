import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUser, updateUser } from "../../services/userService";
import { RootState } from "../../store/store";
import api from "../../utils/api";

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
  // lastMinuteBooking: number;
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
  expertDetails?: ExpertDetail;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  updateError: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
};

export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (
    { userId, token }: { userId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchUser(userId, token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserByUsername = createAsyncThunk<User, string>(
  "user/fetchUserByUsername",
  async (username: string) => {
    const response = await api.get(`/api/users/username/${username}`);
    return response.data.data as User;
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (
    {
      userId,
      userData,
      token,
    }: { userId: string; userData: any; token: string },
    { rejectWithValue }
  ) => {
    try {
      const updatedUser = await updateUser(userId, userData, token);
      return updatedUser;
    } catch (error: any) {
      console.error("Error in thunk:", error.message);
      return rejectWithValue(error.message || "Failed to update user profile");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.updating = false;
      state.updateError = null;
      localStorage.removeItem("userData");
    },
  },
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
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.updating = false;
          state.user = action.payload;
          state.updateError = null;
        }
      )
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updating = false;
        state.updateError =
          (action.payload as string) || "Failed to update user profile.";
      });
  },
});

export const { setUser, logout } = userSlice.actions;
export const selectUserState = (state: RootState) => state.user;

export default userSlice.reducer;
