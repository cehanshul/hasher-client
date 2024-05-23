import axios from "axios";

export const fetchExpertData = async (username: string) => {
  try {
    const response = await axios.get(
      `http://192.168.1.3/api/users/${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch expert data:", error);
    throw error;
  }
};
