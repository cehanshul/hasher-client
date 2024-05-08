// src/types/bookingsTypes.ts

export interface BookingRequest {
  userId: string;
  expertId: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  ratePerMinute: number;
  totalCost: number;
  confirmationStatus: string;
}

export interface BookingResponse {
  userId: string;
  expertId: string;
  startTime: string;
  endTime: string;
  ratePerMinute: number;
  totalCost: number;
  sessionType: string;
  confirmationStatus: string;
  paymentStatus: string;
  callId: string;
  isActive: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
