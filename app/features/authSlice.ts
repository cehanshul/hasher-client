// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService, {
  SendCodeResponse,
  VerifyCodeResponse,
} from "../services/authService";
import { RootState } from "../store/store";

interface AuthState {
  userId: string | null;
  token: string | null;
  status: string | null;
  error: string | null;
}

const initialState: AuthState = {
  userId: null,
  token: null,
  status: null,
  error: null,
};

export const sendCode = createAsyncThunk<
  SendCodeResponse,
  { phone: string },
  { rejectValue: string }
>("auth/sendCode", async ({ phone }, { rejectWithValue }) => {
  try {
    const response = await authService.sendCode(phone);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as any).response.data.message);
  }
});

export const verifyCode = createAsyncThunk<
  VerifyCodeResponse,
  { phone: string; code: string },
  { rejectValue: string }
>("auth/verifyCode", async ({ phone, code }, { rejectWithValue }) => {
  try {
    const response = await authService.verifyCode(phone, code);
    return response.data;
  } catch (error) {
    return rejectWithValue((error as any).response.data.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.userId = null;
      state.token = null;
      state.status = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendCode.pending, (state) => {
        state.error = null;
      })
      .addCase(sendCode.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(sendCode.fulfilled, (state) => {
        state.error = null;
      })

      .addCase(verifyCode.pending, (state) => {
        state.error = null;
      })

      .addCase(
        verifyCode.fulfilled,
        (state, action: PayloadAction<VerifyCodeResponse>) => {
          state.userId = action.payload.data._id;
          state.token = action.payload.data.token;
          state.status = action.payload.data.status;
          state.error = null;
        }
      )
      .addCase(verifyCode.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export const selectAuthState = (state: RootState) => state.auth;
export default authSlice.reducer;
