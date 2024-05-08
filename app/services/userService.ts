import axios from "axios";
import api from "../utils/api";

export const updateUser = async (
  userId: string,
  userData: any,
  token: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await api.put(
      `api/users/update/${userId}`,
      userData,
      config
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Update failed due to server error"
      );
    }

    console.log("Update success:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error caught in updateUser:", error.message); // Ensure this is the correct error message
    throw new Error(error.message || "Error updating user");
  }
};
export const fetchUser = async (userId: string, token: string) => {
  console.log(`trying token ${token}`);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await api.get(`/api/users/find/${userId}`, config);
    // console.log(`response for fetching user ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.log(`response for fetching user ${JSON.stringify(error)}`);

    throw error;
  }
};
