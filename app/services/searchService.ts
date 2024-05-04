// services/searchService.ts

import axios from "axios";
import api from "../utils/api";

export const searchUsers = async (
  keyword: string,
  page: number = 0,
  limit: number = 10
) => {
  try {
    const response = await api.get(
      `api/users/search/${keyword}/${page}/${limit}`
    );
    return response.data; // This should match the JSON structure you posted.
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    return [];
  }
};
