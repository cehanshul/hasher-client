// types.ts

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

export interface UserData {
  _id: string;
  name: string;
  profilePicture: string;
}

export interface ExpertDetails {
  _id: string;
  userId: UserData;
  expertiseAreas: string[];
  socialMedia: string[];
  profession: string;
  pricePerMinute: number;
  isAvailable: boolean;
  availabilitySlots: any[];
  blockedDates: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ExpertProfile {
  _id: string;
  userId: string;
  expertiseAreas: string[];
  socialMedia: string[];
  profession: string;
  pricePerMinute: number;
  isAvailable: boolean;
  availabilitySlots: any[];
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

export interface APIResponse {
  expert: ExpertProfile;
  reviews: Review[];
  totalReviews: number;
  averageRating: string | null;
  totalMeetings: number;
}

export interface ExpertData {
  expertProfile: ExpertProfile;
  expertUser: {
    _id: string;
    name: string;
    profilePicture: string;
    bio: string;
    isVerified: boolean;
  };
  reviews: Review[];
  totalReviews: number;
  averageRating: number | null;
  totalMeetings: number;
  loading: boolean;
  error: string | null;
}
