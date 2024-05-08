// src/features/payments/paymentsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/api";
import {
  OrderRequest,
  OrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "../types/paymentTypes";

export const createOrder = createAsyncThunk(
  "payments/order",
  async (orderData: OrderRequest, { rejectWithValue }) => {
    try {
      console.log(`date before creating order  ${JSON.stringify(orderData)}`);

      const response = await api.post<OrderResponse>(
        "/api/payments/order",
        orderData
      );
      console.log(`order data ${JSON.stringify(response.data)}`);

      return response.data;
    } catch (error: any) {
      console.log(`error while creating order ${error}`);
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payments/verify",
  async (verificationData: VerifyPaymentRequest, { rejectWithValue }) => {
    try {
      console.log(
        `date before verification  ${JSON.stringify(verificationData)}`
      );

      const response = await api.post<VerifyPaymentResponse>(
        "/api/payments/verify",
        verificationData
      );
      console.log(`verification data  ${JSON.stringify(response.data)}`);

      return response.data;
    } catch (error: any) {
      console.log(`error while payment verification ${error}`);

      return rejectWithValue(error.response.data);
    }
  }
);
const paymentsSlice = createSlice({
  name: "payments",
  initialState: {
    order: null as OrderResponse | null,
    verification: null as VerifyPaymentResponse | null,
    loading: false,
    error: null as any,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(verifyPayment.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyPayment.fulfilled, (state, action) => {
      state.loading = false;
      state.verification = action.payload;
    });
    builder.addCase(verifyPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default paymentsSlice.reducer;
