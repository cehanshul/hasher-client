// authService.ts
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;

export interface SendCodeResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    phone: string;
    isExpert: boolean;
    isVerified: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    dob: string;
    gender: string;
    name: string;
    username: string;
    bio: string;
    profilePicture: string;
    expertId: string;
    wallet: string;
    fcmToken: string;
    token: string;
  };
}

const sendCode = async (phone: string): Promise<{ data: SendCodeResponse }> => {
  const response = await axios.post<SendCodeResponse>(`${API_URL}/send-code`, {
    phone,
  });
  return response;
};

const verifyCode = async (
  phone: string,
  code: string
): Promise<{ data: VerifyCodeResponse }> => {
  const response = await axios.post<VerifyCodeResponse>(
    `${API_URL}/verify-code`,
    { phone, code }
  );
  return response;
};

const authService = {
  sendCode,
  verifyCode,
};

export default authService;
