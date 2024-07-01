import axios from "axios";

export const fetchExpertData = async (username: string) => {
  try {
    const response = await axios.get(
      `https://api.hasher.lol/api/users/${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch expert data:", error);
    throw error;
  }
};
