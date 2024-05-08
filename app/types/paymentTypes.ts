// src/types/paymentTypes.ts

export interface OrderRequest {
  amount: string;
  sessionId: string;
  expertId: string;
  currency: string;
}

export interface OrderResponse {
  order: {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    offer_id: null | string;
    status: string;
    attempts: number;
    notes: any[];
    created_at: number;
  };
  razorpayConfig: {
    key: string;
    name: string;
    prefill: {
      contact: string;
      email: string;
    };
    external: {
      wallets: string[];
    };
  };
}

export interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}
